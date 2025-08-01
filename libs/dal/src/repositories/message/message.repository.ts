import {
  ActorTypeEnum,
  ButtonTypeEnum,
  ChannelTypeEnum,
  MessageActionStatusEnum,
  MessagesStatusEnum,
} from '@novu/shared';
import { FilterQuery, Types } from 'mongoose';

import { DalException } from '../../shared';
import { EnforceEnvId } from '../../types/enforce';
import { BaseRepository } from '../base-repository';
import { FeedRepository } from '../feed';
import { MessageDBModel, MessageEntity } from './message.entity';
import { Message } from './message.schema';

type MessageQuery = FilterQuery<MessageDBModel>;

const MAX_PAYLOAD_QUERY_DEPTH = 3;

const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

const isValidKey = (key: string): boolean => {
  // Reject keys starting with '$' or '.' to prevent MongoDB operator injection.
  if (key.startsWith('$') || key.startsWith('.')) {
    return false;
  }

  // Reject known prototype pollution vectors.
  if (DANGEROUS_KEYS.includes(key)) {
    return false;
  }

  return true;
};

const getEntries = (obj: object, prefix = '', currentDepth = 0, maxDepth: number): [string, any][] =>
  Object.entries(obj).flatMap(([key, value]) => {
    // Sanitize the key before using it.
    if (!isValidKey(key)) {
      // Skip this entry if the key is invalid to prevent pollution or injection.
      return [];
    }

    const newKeySegment = prefix ? `${prefix}.${key}` : key;

    if (currentDepth < maxDepth && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return getEntries(value, newKeySegment, currentDepth + 1, maxDepth);
    } else {
      return [[newKeySegment, value]];
    }
  });

const getFlatObject = (obj: object) => {
  return Object.fromEntries(getEntries(obj, '', 0, MAX_PAYLOAD_QUERY_DEPTH));
};

export class MessageRepository extends BaseRepository<MessageDBModel, MessageEntity, EnforceEnvId> {
  private feedRepository = new FeedRepository();
  constructor() {
    super(Message, MessageEntity);
  }

  private async getFilterQueryForMessage(
    environmentId: string,
    subscriberId: string,
    channel: ChannelTypeEnum,
    query: {
      feedId?: string[];
      tags?: string[];
      seen?: boolean;
      read?: boolean;
      archived?: boolean;
      snoozed?: boolean;
      payload?: object;
      data?: Record<string, unknown>;
    } = {},
    createdAt?: {
      $gte: Date;
    }
  ): Promise<MessageQuery & EnforceEnvId> {
    let requestQuery: MessageQuery & EnforceEnvId = {
      _environmentId: environmentId,
      _subscriberId: subscriberId,
      channel,
    };

    if (query.feedId === null) {
      requestQuery._feedId = { $eq: null };
    }

    if (query.feedId) {
      const feeds = await this.feedRepository.find(
        {
          _environmentId: environmentId,
          identifier: {
            $in: query.feedId,
          },
        },
        '_id'
      );
      requestQuery._feedId = {
        $in: feeds.map((feed) => feed._id),
      };
    }

    if (query.seen != null) {
      requestQuery.seen = query.seen;
    } else {
      requestQuery.seen = { $in: [true, false] };
    }

    if (query.read != null) {
      requestQuery.read = query.read;
    } else {
      requestQuery.read = { $in: [true, false] };
    }

    if (query.tags && query.tags?.length > 0) {
      requestQuery.tags = { $in: query.tags };
    }

    if (query.archived != null) {
      requestQuery.archived = query.archived;
    } else {
      requestQuery.archived = { $in: [true, false] };
    }

    if (query.snoozed != null) {
      if (query.snoozed) {
        requestQuery.snoozedUntil = { $ne: null };
      } else {
        requestQuery.$or = [{ snoozedUntil: { $exists: false } }, { snoozedUntil: null }];
      }
    }

    if (createdAt != null) {
      requestQuery.createdAt = createdAt;
    }

    if (query.payload) {
      requestQuery = {
        ...getFlatObject({ payload: query.payload }),
        ...requestQuery,
      };
    }

    if (query.data) {
      requestQuery = {
        ...getFlatObject({ data: query.data }),
        ...requestQuery,
      };
    }

    return requestQuery;
  }

  /**
   * if aggregation is needed, make sure to filter with {deleted: { $ne: true }}.
   * todo: aggregate method should be implemented after all the soft deletes are removed task nv-5688
   */
  async aggregate(query: any[], options: { readPreference?: 'secondaryPreferred' | 'primary' } = {}): Promise<any> {
    throw new Error('Not implemented');
  }

  async findBySubscriberChannel(
    environmentId: string,
    subscriberId: string,
    channel: ChannelTypeEnum,
    query: { feedId?: string[]; seen?: boolean; read?: boolean; payload?: object } = {},
    options: { limit: number; skip?: number } = { limit: 10 }
  ) {
    const requestQuery = await this.getFilterQueryForMessage(environmentId, subscriberId, channel, query);

    const messages = await this.MongooseModel.find(requestQuery, '', {
      limit: options.limit,
      skip: options.skip,
      sort: '-createdAt',
    })
      .read('secondaryPreferred')
      .populate('template', '_id tags')
      .populate('subscriber', '_id firstName lastName avatar subscriberId')
      .populate('actorSubscriber', '_id firstName lastName avatar subscriberId');

    return this.mapEntities(messages);
  }

  async paginate(
    {
      environmentId,
      channel,
      subscriberId,
      tags,
      read,
      archived,
      snoozed,
      data,
    }: {
      environmentId: string;
      subscriberId: string;
      channel: ChannelTypeEnum;
      tags?: string[];
      read?: boolean;
      archived?: boolean;
      snoozed?: boolean;
      data?: Record<string, unknown>;
    },
    options: { limit: number; offset: number; after?: string }
  ) {
    let query: MessageQuery & EnforceEnvId = {
      _environmentId: environmentId,
      _subscriberId: subscriberId,
      channel,
    };

    if (tags && tags?.length > 0) {
      query.tags = { $in: tags };
    }

    if (typeof read === 'boolean') {
      query.read = read;
    } else {
      query.read = { $in: [true, false] };
    }

    if (typeof archived === 'boolean') {
      if (!archived) {
        query.$or = [{ archived: { $exists: false } }, { archived: false }];
      } else {
        query.archived = true;
      }
    } else {
      query.$or = [{ archived: { $exists: false } }, { archived: { $in: [true, false] } }];
    }

    if (typeof snoozed === 'boolean') {
      query.snoozedUntil = snoozed ? { $exists: true, $ne: null } : { $eq: null };
    }

    if (data) {
      const flatData = getFlatObject({ data });

      query = {
        ...flatData,
        ...query,
      };
    }

    return await this.cursorPagination({
      query,
      limit: options.limit,
      offset: options.offset,
      after: options.after,
      sort: { createdAt: -1, _id: -1 },
      paginateField: 'createdAt',
      enhanceQuery: (queryBuilder) =>
        queryBuilder
          .read('secondaryPreferred')
          .populate('subscriber', '_id firstName lastName avatar subscriberId')
          .populate('actorSubscriber', '_id firstName lastName avatar subscriberId')
          .populate({
            path: 'template',
            select: '_id name tags data critical triggers',
            options: {
              withDeleted: true,
            },
          }),
    });
  }

  async getCount(
    environmentId: string,
    subscriberId: string,
    channel: ChannelTypeEnum,
    query: {
      feedId?: string[];
      tags?: string[];
      seen?: boolean;
      read?: boolean;
      archived?: boolean;
      snoozed?: boolean;
      payload?: object;
      data?: Record<string, unknown>;
    } = {},
    options: { limit: number; skip?: number } = { limit: 100, skip: 0 },
    createdAt?: {
      $gte: Date;
    },
    readPreference: 'secondaryPreferred' | 'primary' = 'secondaryPreferred'
  ) {
    const requestQuery = await this.getFilterQueryForMessage(
      environmentId,
      subscriberId,
      channel,
      {
        feedId: query.feedId,
        seen: query.seen,
        tags: query.tags,
        read: query.read,
        archived: query.archived,
        payload: query.payload,
        snoozed: query.snoozed,
        data: query.data,
      },
      createdAt
    );

    return this.MongooseModel.countDocuments(requestQuery, options).read(readPreference);
  }

  private getReadSeenUpdateQuery(
    subscriberId: string,
    environmentId: string,
    markAs: MessagesStatusEnum
  ): Partial<MessageEntity> & EnforceEnvId {
    const updateQuery: Partial<MessageEntity> & EnforceEnvId = {
      _subscriberId: subscriberId,
      _environmentId: environmentId,
    };

    switch (markAs) {
      case MessagesStatusEnum.READ:
        return {
          ...updateQuery,
          read: false,
        };
      case MessagesStatusEnum.UNREAD:
        return {
          ...updateQuery,
          read: true,
        };
      case MessagesStatusEnum.SEEN:
        return {
          ...updateQuery,
          seen: false,
        };
      case MessagesStatusEnum.UNSEEN:
        return {
          ...updateQuery,
          seen: true,
        };
      default:
        return updateQuery;
    }
  }

  private getReadSeenUpdatePayload(markAs: MessagesStatusEnum): {
    read?: boolean;
    lastReadDate?: Date;
    seen?: boolean;
    lastSeenDate?: Date;
  } {
    const now = new Date();

    switch (markAs) {
      case MessagesStatusEnum.READ:
        return {
          read: true,
          lastReadDate: now,
          seen: true,
          lastSeenDate: now,
        };
      case MessagesStatusEnum.UNREAD:
        return {
          read: false,
          lastReadDate: now,
          seen: true,
          lastSeenDate: now,
        };
      case MessagesStatusEnum.SEEN:
        return {
          seen: true,
          lastSeenDate: now,
        };
      case MessagesStatusEnum.UNSEEN:
        return {
          seen: false,
          lastSeenDate: now,
        };
      default:
        return {};
    }
  }

  async markAllMessagesAs({
    subscriberId,
    environmentId,
    markAs,
    channel,
    feedIdentifiers,
  }: {
    subscriberId: string;
    environmentId: string;
    markAs: MessagesStatusEnum;
    channel?: ChannelTypeEnum;
    feedIdentifiers?: string[];
  }) {
    let feedQuery;

    if (feedIdentifiers) {
      const feeds = await this.feedRepository.find(
        {
          _environmentId: environmentId,
          identifier: {
            $in: feedIdentifiers,
          },
        },
        '_id'
      );

      feedQuery = {
        $in: feeds.map((feed) => feed._id),
      };
    }

    const updateQuery = this.getReadSeenUpdateQuery(subscriberId, environmentId, markAs);

    if (feedQuery != null) {
      updateQuery._feedId = feedQuery;
    }

    if (channel != null) {
      updateQuery.channel = channel;
    }

    const updatePayload = this.getReadSeenUpdatePayload(markAs);

    return await this.update(updateQuery, {
      $set: updatePayload,
    });
  }

  async updateFeedByMessageTemplateId(environmentId: string, messageId: string, feedId?: string | null) {
    return this.update(
      { _environmentId: environmentId, _messageTemplateId: messageId },
      {
        $set: {
          _feedId: feedId,
        },
      }
    );
  }

  async updateMessageStatus(
    environmentId: string,
    id: string,
    status: 'error' | 'sent' | 'warning',
    // eslint-disable-next-line
    providerPayload: any = {},
    errorId: string,
    errorText: string
  ) {
    return await this.update(
      {
        _environmentId: environmentId,
        _id: id,
      },
      {
        $set: {
          status,
          errorId,
          errorText,
          providerPayload,
        },
      }
    );
  }

  async changeMessagesStatus({
    environmentId,
    subscriberId,
    messageIds,
    markAs,
  }: {
    environmentId: string;
    subscriberId: string;
    messageIds: string[];
    markAs: MessagesStatusEnum;
  }) {
    const updatePayload = this.getReadSeenUpdatePayload(markAs);

    await this.update(
      {
        _environmentId: environmentId,
        _subscriberId: subscriberId,
        _id: {
          $in: messageIds.map((id) => {
            return new Types.ObjectId(id);
          }),
        },
      },
      {
        $set: updatePayload,
      }
    );
  }

  /**
   * @deprecated
   */
  async changeStatus(
    environmentId: string,
    subscriberId: string,
    messageIds: string[],
    mark: { seen?: boolean; read?: boolean }
  ) {
    const requestQuery: FilterQuery<MessageEntity> = {};

    if (mark.seen != null) {
      requestQuery.seen = mark.seen;
      requestQuery.lastSeenDate = new Date();
    }

    if (mark.read != null) {
      requestQuery.read = mark.read;
      requestQuery.lastReadDate = new Date();
    }

    await this.update(
      {
        _environmentId: environmentId,
        _subscriberId: subscriberId,
        _id: {
          $in: messageIds.map((id) => {
            return new Types.ObjectId(id);
          }),
        },
      },
      {
        $set: requestQuery,
      }
    );
  }

  async updateMessagesStatusByIds({
    environmentId,
    subscriberId,
    ids,
    seen,
    read,
    archived,
    snoozedUntil,
  }: {
    environmentId: string;
    subscriberId: string;
    ids: string[];
    seen?: boolean;
    read?: boolean;
    archived?: boolean;
    snoozedUntil?: Date | null;
  }) {
    const query: MessageQuery & EnforceEnvId = {
      _environmentId: environmentId,
      _subscriberId: subscriberId,
      _id: {
        $in: ids.map((id) => {
          return new Types.ObjectId(id);
        }),
      },
    };

    await this.updateMessagesStatus({
      query,
      seen,
      read,
      archived,
      snoozedUntil,
    });
  }

  async updateMessagesFromToStatus({
    environmentId,
    subscriberId,
    from,
    to,
  }: {
    environmentId: string;
    subscriberId: string;
    from: {
      tags?: string[];
      data?: Record<string, unknown>;
      seen?: boolean;
      read?: boolean;
      archived?: boolean;
    };
    to: {
      seen?: boolean;
      read?: boolean;
      archived?: boolean;
    };
  }) {
    const isFromSeen = from.seen !== undefined;
    const isFromRead = from.read !== undefined;
    const isFromArchived = from.archived !== undefined;
    const flatData = from.data ? getFlatObject({ data: from.data }) : {};

    const query: MessageQuery & EnforceEnvId = {
      ...flatData,
      _environmentId: environmentId,
      _subscriberId: subscriberId,
      ...(from.tags && from.tags?.length > 0 && { tags: { $in: from.tags } }),
    };

    if (isFromArchived) {
      if (!from.archived) {
        query.$or = [{ archived: { $exists: false } }, { archived: false }];
      } else {
        query.archived = true;
      }
    } else if (isFromRead) {
      query.read = from.read;
    } else if (isFromSeen) {
      query.seen = from.seen;
    }

    await this.updateMessagesStatus({
      query,
      ...to,
    });
  }

  /**
   * Allows to update the status of queried messages at once.
   * The status can be updated to seen, unseen, read, unread, archived, unarchived, snoozed, unsnoozed.
   * Depending on the flag passed, the other flags will be updated accordingly.
   * For example:
   * seen -> { seen: true }
   * read -> { seen: true, read: true }
   * archived -> { seen: true, read: true, archived: true }
   * unseen -> { seen: false, read: false, archived: false }
   * unread -> { seen: true, read: false, archived: false }
   * unarchived -> { seen: true, read: true, archived: false }
   * snoozed -> { seen: true, archived: false, snoozedUntil: snoozedUntil }
   * unsnoozed -> { seen: true, archived: false, snoozedUntil: null }
   */
  private async updateMessagesStatus({
    query,
    seen,
    read,
    archived,
    snoozedUntil,
  }: {
    query: MessageQuery & EnforceEnvId;
    seen?: boolean;
    read?: boolean;
    archived?: boolean;
    snoozedUntil?: Date | null;
  }) {
    const isUpdatingSeen = seen !== undefined;
    const isUpdatingRead = read !== undefined;
    const isUpdatingArchived = archived !== undefined;
    const isUpdatingSnoozed = snoozedUntil !== undefined;

    let updatePayload: FilterQuery<MessageEntity> = {};
    if (isUpdatingArchived) {
      updatePayload = {
        seen: true,
        lastSeenDate: new Date(),
        read: true,
        lastReadDate: new Date(),
        archived,
        archivedAt: archived ? new Date() : null,
      };
    } else if (isUpdatingRead) {
      updatePayload = {
        seen: true,
        lastSeenDate: new Date(),
        read,
        lastReadDate: read ? new Date() : null,
        archived: !read ? false : undefined,
        archivedAt: !read ? null : undefined,
      };
    } else if (isUpdatingSeen) {
      updatePayload = {
        seen,
        lastSeenDate: seen ? new Date() : null,
        read: !seen ? false : undefined,
        lastReadDate: !seen ? null : undefined,
        archived: !seen ? false : undefined,
        archivedAt: !seen ? null : undefined,
      };
    } else if (isUpdatingSnoozed) {
      updatePayload = {
        snoozedUntil,
        seen: true,
        lastSeenDate: new Date(),
        archived: false,
        archivedAt: null,
      };
    }

    await this.update(query, {
      $set: updatePayload,
    });
  }

  async updateActionStatus({
    environmentId,
    subscriberId,
    id,
    actionType,
    actionStatus,
  }: {
    environmentId: string;
    subscriberId: string;
    id: string;
    actionType: ButtonTypeEnum;
    actionStatus: MessageActionStatusEnum;
  }) {
    const message = await this.findOne({
      _id: id,
      _environmentId: environmentId,
      _subscriberId: subscriberId,
    });

    if (!message) {
      throw new DalException(`Could not find a message with id ${id}`);
    }

    const isUpdatingPrimaryCta = actionType === ButtonTypeEnum.PRIMARY;
    const isUpdatingSecondaryCta = actionType === ButtonTypeEnum.SECONDARY;
    const updatePayload: FilterQuery<MessageEntity> = !message.read
      ? {
          seen: true,
          lastSeenDate: new Date(),
          read: true,
          lastReadDate: new Date(),
        }
      : {};

    if (isUpdatingPrimaryCta) {
      updatePayload['cta.action.result.type'] = ButtonTypeEnum.PRIMARY;
      updatePayload['cta.action.status'] = actionStatus;
    }

    if (isUpdatingSecondaryCta) {
      updatePayload['cta.action.result.type'] = ButtonTypeEnum.SECONDARY;
      updatePayload['cta.action.status'] = actionStatus;
    }

    await this.update(
      {
        _environmentId: environmentId,
        _subscriberId: subscriberId,
        _id: id,
      },
      {
        $set: updatePayload,
      }
    );
  }

  async findMessageById(query: { _id: string; _environmentId: string }): Promise<MessageEntity | null> {
    const res = await this.MongooseModel.findOne({ _id: query._id, _environmentId: query._environmentId })
      .populate('subscriber')
      .populate({
        path: 'actorSubscriber',
        match: {
          'actor.type': ActorTypeEnum.USER,
          _actorId: { $exists: true },
        },
        select: '_id firstName lastName avatar subscriberId',
      });

    return this.mapEntity(res);
  }

  async findMessagesByTransactionId(
    query: {
      transactionId: string[];
      _environmentId: string;
    } & Partial<Omit<MessageEntity, 'transactionId'>>
  ) {
    const res = await this.MongooseModel.find({
      transactionId: {
        $in: query.transactionId,
      },
      _environmentId: query._environmentId,
    })
      .populate('subscriber')
      .populate({
        path: 'actorSubscriber',
        match: {
          'actor.type': ActorTypeEnum.USER,
          _actorId: { $exists: true },
        },
        select: '_id firstName lastName avatar subscriberId',
      });

    return this.mapEntities(res);
  }

  async getMessages(
    query: Partial<Omit<MessageEntity, 'transactionId'>> & {
      _environmentId: string;
      transactionId?: string[];
    },
    select = '',
    options?: {
      limit?: number;
      skip?: number;
      sort?: { [key: string]: number };
    }
  ) {
    const filterQuery: FilterQuery<MessageEntity> = { ...query };
    if (query.transactionId) {
      filterQuery.transactionId = { $in: query.transactionId };
    }
    const data = await this.MongooseModel.find(filterQuery, select, {
      sort: options?.sort,
      limit: options?.limit,
      skip: options?.skip,
    })
      .read('secondaryPreferred')
      .populate(
        'subscriber',
        '_id firstName lastName avatar subscriberId createdAt updatedAt _organizationId _environmentId deleted'
      )
      .populate(
        'actorSubscriber',
        '_id firstName lastName avatar subscriberId createdAt updatedAt _organizationId _environmentId deleted'
      );

    return this.mapEntities(data);
  }
}
