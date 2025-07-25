import { captureException } from '@sentry/node';
import { MessageEntity, MessageRepository } from '@novu/dal';
import { CreateExecutionDetails } from '@novu/application-generic';
import { SendMessageCommand } from './send-message.command';

export type SendMessageResult = {
  status: 'success' | 'failed' | 'canceled';
  reason?: string;
};

export abstract class SendMessageType {
  protected constructor(
    protected messageRepository: MessageRepository,
    protected createExecutionDetails: CreateExecutionDetails
  ) {}

  public abstract execute(command: SendMessageCommand): Promise<SendMessageResult>;

  protected async sendErrorStatus(
    message: MessageEntity,
    status: 'error' | 'sent' | 'warning',
    errorId: string,
    errorMessageFallback: string,
    command: SendMessageCommand,
    error?: any
  ): Promise<void> {
    const errorString = this.stringifyError(error) || errorMessageFallback;

    await this.messageRepository.updateMessageStatus(
      command.environmentId,
      message._id,
      status,
      null,
      errorId,
      errorString
    );
  }

  private stringifyError(error: any): string {
    if (!error) return '';

    if (typeof error === 'string' || error instanceof String) {
      return error.toString();
    }
    if (Object.keys(error)?.length > 0) {
      return JSON.stringify(error);
    }

    return '';
  }
}
