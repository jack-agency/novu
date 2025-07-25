import type { ChannelTypeEnum, Redirect, IPreferenceChannels, PreferenceLevelEnum, CustomDataType } from '@novu/shared';

export type Subscriber = {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  subscriberId: string;
};

type Action = {
  label: string;
  isCompleted: boolean;
  redirect?: Redirect;
};

export type InboxNotification = {
  id: string;
  subject?: string;
  body: string;
  to: Subscriber;
  isRead: boolean;
  isArchived: boolean;
  isSnoozed: boolean;
  snoozedUntil?: string | null;
  deliveredAt?: string[];
  createdAt: string;
  readAt?: string | null;
  archivedAt?: string | null;
  avatar?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  channelType: ChannelTypeEnum;
  tags?: string[];
  data?: Record<string, unknown>;
  redirect?: Redirect;
  workflow?: Workflow;
};

export type NotificationFilter = {
  tags?: string[];
  read?: boolean;
  archived?: boolean;
  snoozed?: boolean;
  data?: string;
};

export type Workflow = {
  id: string;
  identifier: string;
  name: string;
  critical: boolean;
  tags?: string[];
  data?: CustomDataType;
};

export type InboxPreference = {
  level: PreferenceLevelEnum;
  enabled: boolean;
  channels: IPreferenceChannels;
  workflow?: Workflow;
};
