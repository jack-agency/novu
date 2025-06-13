import { WorkflowResponseDto, ISubscriberResponseDto, SubscriberDto } from '@novu/shared';

export type PayloadData = Record<string, unknown>;
export type PreviewSubscriberData = Partial<SubscriberDto>;
export type StepsData = Record<string, unknown>;

export type PreviewContextPanelProps = {
  workflow?: WorkflowResponseDto;
  value: string;
  onChange: (value: string) => Error | null;
  subscriberData?: Record<string, unknown>;
  currentStepId?: string;
};

export type ParsedData = {
  payload: PayloadData;
  subscriber: PreviewSubscriberData;
  steps: StepsData;
};

export type ValidationErrors = {
  payload: string | null;
  subscriber: string | null;
  steps: string | null;
};

export type AccordionSectionProps = {
  errors: ValidationErrors;
  localParsedData: ParsedData;
  workflow?: WorkflowResponseDto;
  onUpdate: (section: keyof ParsedData, data: PayloadData | PreviewSubscriberData | StepsData) => void;
};

export type PayloadSectionProps = AccordionSectionProps & {
  onClearPersisted?: () => void;
  hasDigestStep?: boolean;
};

export type StepResultsSectionProps = AccordionSectionProps & {
  currentStepId?: string;
};

export type SubscriberSectionProps = AccordionSectionProps & {
  onSubscriberSelect: (subscriber: ISubscriberResponseDto) => void;
  onClearPersisted?: () => void;
};
