import { BadRequestException, Injectable } from '@nestjs/common';
import { ControlValuesLevelEnum, ShortIsPrefixEnum, ResourceOriginEnum } from '@novu/shared';
import { ControlValuesRepository, NotificationStepEntity, NotificationTemplateEntity } from '@novu/dal';
import { GetWorkflowByIdsUseCase, Instrument, InstrumentUsecase } from '@novu/application-generic';

import { BuildStepDataCommand } from './build-step-data.command';
import { InvalidStepException } from '../../exceptions/invalid-step.exception';
import { BuildVariableSchemaUsecase } from '../build-variable-schema';
import { buildSlug } from '../../../shared/helpers/build-slug';
import { StepResponseDto } from '../../dtos';

@Injectable()
export class BuildStepDataUsecase {
  constructor(
    private getWorkflowByIdsUseCase: GetWorkflowByIdsUseCase,
    private controlValuesRepository: ControlValuesRepository,
    private buildAvailableVariableSchemaUsecase: BuildVariableSchemaUsecase
  ) {}

  @InstrumentUsecase()
  async execute(command: BuildStepDataCommand): Promise<StepResponseDto> {
    const workflow = await this.fetchWorkflow(command);

    const currentStep: NotificationStepEntity | undefined = await this.loadStepsFromDb(command, workflow);
    if (!currentStep || !currentStep._templateId || currentStep.stepId === undefined || !currentStep?.template?.type) {
      throw new InvalidStepException(command.stepIdOrInternalId);
    }
    const controlValues = await this.getControlValues(command, currentStep, workflow._id);
    const stepName = currentStep.name || 'MISSING STEP NAME - PLEASE UPDATE IMMEDIATELY';
    const variables = await this.buildAvailableVariableSchema(command, currentStep, workflow);

    const slug = buildSlug(stepName, ShortIsPrefixEnum.STEP, currentStep._templateId);

    return {
      controls: {
        dataSchema: currentStep.template?.controls?.schema,
        uiSchema: currentStep.template?.controls?.uiSchema,
        values: controlValues,
      },
      controlValues,
      variables,
      name: stepName,
      slug,
      _id: currentStep._templateId,
      stepId: currentStep.stepId || 'Missing Step Id',
      type: currentStep.template?.type,
      origin: workflow.origin || ResourceOriginEnum.EXTERNAL,
      workflowId: workflow.triggers[0].identifier,
      workflowDatabaseId: workflow._id,
      issues: currentStep.issues,
    } as StepResponseDto;
  }

  private async buildAvailableVariableSchema(
    command: BuildStepDataCommand,
    currentStep: NotificationStepEntity,
    workflow: NotificationTemplateEntity
  ) {
    return await this.buildAvailableVariableSchemaUsecase.execute({
      environmentId: command.user.environmentId,
      organizationId: command.user.organizationId,
      userId: command.user._id,
      stepInternalId: currentStep._templateId,
      workflow,
    });
  }

  @Instrument()
  private async fetchWorkflow(command: BuildStepDataCommand) {
    return await this.getWorkflowByIdsUseCase.execute({
      workflowIdOrInternalId: command.workflowIdOrInternalId,
      environmentId: command.user.environmentId,
      organizationId: command.user.organizationId,
    });
  }

  @Instrument()
  private async getControlValues(
    command: BuildStepDataCommand,
    currentStep: NotificationStepEntity,
    _workflowId: string
  ) {
    const controlValuesEntity = await this.controlValuesRepository.findOne({
      _environmentId: command.user.environmentId,
      _organizationId: command.user.organizationId,
      _workflowId,
      _stepId: currentStep._templateId,
      level: ControlValuesLevelEnum.STEP_CONTROLS,
    });

    return controlValuesEntity?.controls || {};
  }

  @Instrument()
  private async loadStepsFromDb(
    command: BuildStepDataCommand,
    workflow: NotificationTemplateEntity
  ): Promise<NotificationStepEntity | undefined> {
    const currentStep: NotificationStepEntity | undefined = workflow.steps.find(
      (stepItem) => stepItem._id === command.stepIdOrInternalId || stepItem.stepId === command.stepIdOrInternalId
    );

    if (!currentStep) {
      throw new BadRequestException({
        message: 'No step found',
        stepId: command.stepIdOrInternalId,
        workflowId: command.workflowIdOrInternalId,
      });
    }

    return currentStep;
  }
}
