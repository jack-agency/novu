import { FeatureFlagsKeysEnum, type UiSchema } from '@novu/shared';

import { getComponentByType } from '@/components/workflow-editor/steps/component-utils';
import { TabsSection } from '@/components/workflow-editor/steps/tabs-section';
import { useFeatureFlag } from '../../../../hooks/use-feature-flag';
import { cn } from '../../../../utils/ui';

type PushEditorProps = { uiSchema: UiSchema };

export const PushEditor = (props: PushEditorProps) => {
  const isV2TemplateEditorEnabled = useFeatureFlag(FeatureFlagsKeysEnum.IS_V2_TEMPLATE_EDITOR_ENABLED);
  const { uiSchema } = props;
  const { body, subject } = uiSchema?.properties ?? {};

  return (
    <div className="flex h-full flex-col">
      <TabsSection className={cn(isV2TemplateEditorEnabled ? 'p-0 pb-3' : '')}>
        {!isV2TemplateEditorEnabled && (
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <span>Push template editor</span>
          </div>
        )}
        <div
          className={cn(
            'rounded-12 flex flex-col gap-2 border border-neutral-100 p-2',
            isV2TemplateEditorEnabled ? 'bg-bg-weak' : ''
          )}
        >
          {getComponentByType({ component: subject.component })}
          {getComponentByType({ component: body.component })}
        </div>
      </TabsSection>
    </div>
  );
};
