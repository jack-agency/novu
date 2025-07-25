import type { ActionTypeEnum, NotificationFilter } from '../types';
import { Notification } from './notification';

export type ListNotificationsArgs = {
  tags?: string[];
  read?: boolean;
  data?: Record<string, unknown>;
  archived?: boolean;
  snoozed?: boolean;
  limit?: number;
  after?: string;
  offset?: number;
  useCache?: boolean;
};

export type ListNotificationsResponse = { notifications: Notification[]; hasMore: boolean; filter: NotificationFilter };

export type FilterCountArgs = {
  tags?: string[];
  data?: Record<string, unknown>;
  read?: boolean;
  archived?: boolean;
  snoozed?: boolean;
};

export type FiltersCountArgs = {
  filters: Array<{
    tags?: string[];
    read?: boolean;
    archived?: boolean;
    snoozed?: boolean;
    data?: Record<string, unknown>;
  }>;
};

export type CountArgs = undefined | FilterCountArgs | FiltersCountArgs;

export type FilterCountResponse = {
  count: number;
  filter: NotificationFilter;
};

export type FiltersCountResponse = {
  counts: Array<{
    count: number;
    filter: NotificationFilter;
  }>;
};

export type CountResponse = FilterCountResponse | FiltersCountResponse;

export type BaseArgs = {
  notificationId: string;
};

export type InstanceArgs = {
  notification: Notification;
};

export type ActionTypeArgs = { actionType: ActionTypeEnum };

export type ReadArgs = BaseArgs | InstanceArgs;
export type UnreadArgs = BaseArgs | InstanceArgs;
export type ArchivedArgs = BaseArgs | InstanceArgs;
export type UnarchivedArgs = BaseArgs | InstanceArgs;
export type SnoozeArgs = (BaseArgs | InstanceArgs) & {
  snoozeUntil: string;
};
export type UnsnoozeArgs = BaseArgs | InstanceArgs;
export type CompleteArgs = BaseArgs | InstanceArgs;
export type RevertArgs = BaseArgs | InstanceArgs;
