/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { cancel } from "../funcs/cancel.js";
import { retrieve } from "../funcs/retrieve.js";
import { trigger } from "../funcs/trigger.js";
import { triggerBroadcast } from "../funcs/triggerBroadcast.js";
import { triggerBulk } from "../funcs/triggerBulk.js";
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";
import { Environments } from "./environments.js";
import { Integrations } from "./integrations.js";
import { Layouts } from "./layouts.js";
import { Messages } from "./messages.js";
import { Notifications } from "./notifications.js";
import { Subscribers } from "./subscribers.js";
import { Topics } from "./topics.js";
import { Workflows } from "./workflows.js";

export class Novu extends ClientSDK {
  private _layouts?: Layouts;
  get layouts(): Layouts {
    return (this._layouts ??= new Layouts(this._options));
  }

  private _subscribers?: Subscribers;
  get subscribers(): Subscribers {
    return (this._subscribers ??= new Subscribers(this._options));
  }

  private _topics?: Topics;
  get topics(): Topics {
    return (this._topics ??= new Topics(this._options));
  }

  private _workflows?: Workflows;
  get workflows(): Workflows {
    return (this._workflows ??= new Workflows(this._options));
  }

  private _environments?: Environments;
  get environments(): Environments {
    return (this._environments ??= new Environments(this._options));
  }

  private _integrations?: Integrations;
  get integrations(): Integrations {
    return (this._integrations ??= new Integrations(this._options));
  }

  private _messages?: Messages;
  get messages(): Messages {
    return (this._messages ??= new Messages(this._options));
  }

  private _notifications?: Notifications;
  get notifications(): Notifications {
    return (this._notifications ??= new Notifications(this._options));
  }

  /**
   * Trigger event
   *
   * @remarks
   *
   *     Trigger event is the main (and only) way to send notifications to subscribers.
   *     The trigger identifier is used to match the particular workflow associated with it.
   *     Additional information can be passed according the body interface below.
   */
  async trigger(
    triggerEventRequestDto: components.TriggerEventRequestDto,
    idempotencyKey?: string | undefined,
    options?: RequestOptions,
  ): Promise<operations.EventsControllerTriggerResponse> {
    return unwrapAsync(trigger(
      this,
      triggerEventRequestDto,
      idempotencyKey,
      options,
    ));
  }

  /**
   * Cancel triggered event
   *
   * @remarks
   *
   *     Using a previously generated transactionId during the event trigger,
   *      will cancel any active or pending workflows. This is useful to cancel active digests, delays etc...
   */
  async cancel(
    transactionId: string,
    idempotencyKey?: string | undefined,
    options?: RequestOptions,
  ): Promise<operations.EventsControllerCancelResponse> {
    return unwrapAsync(cancel(
      this,
      transactionId,
      idempotencyKey,
      options,
    ));
  }

  /**
   * Broadcast event to all
   *
   * @remarks
   * Trigger a broadcast event to all existing subscribers, could be used to send announcements, etc.
   *       In the future could be used to trigger events to a subset of subscribers based on defined filters.
   */
  async triggerBroadcast(
    triggerEventToAllRequestDto: components.TriggerEventToAllRequestDto,
    idempotencyKey?: string | undefined,
    options?: RequestOptions,
  ): Promise<operations.EventsControllerBroadcastEventToAllResponse> {
    return unwrapAsync(triggerBroadcast(
      this,
      triggerEventToAllRequestDto,
      idempotencyKey,
      options,
    ));
  }

  /**
   * Bulk trigger event
   *
   * @remarks
   *
   *       Using this endpoint you can trigger multiple events at once, to avoid multiple calls to the API.
   *       The bulk API is limited to 100 events per request.
   */
  async triggerBulk(
    bulkTriggerEventDto: components.BulkTriggerEventDto,
    idempotencyKey?: string | undefined,
    options?: RequestOptions,
  ): Promise<operations.EventsControllerTriggerBulkResponse> {
    return unwrapAsync(triggerBulk(
      this,
      bulkTriggerEventDto,
      idempotencyKey,
      options,
    ));
  }

  /**
   * Retrieve workflow step
   *
   * @remarks
   * Retrieves data for a specific step in a workflow
   */
  async retrieve(
    request: operations.LogsControllerGetLogsRequest,
    options?: RequestOptions,
  ): Promise<operations.LogsControllerGetLogsResponseBody> {
    return unwrapAsync(retrieve(
      this,
      request,
      options,
    ));
  }
}
