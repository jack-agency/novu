import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Tabs, TabsTrigger, TabsList } from '@/components/primitives/tabs';
import { FormField } from '@/components/primitives/form/form';
import { RiCodeSSlashFill, RiDashboardLine } from 'react-icons/ri';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { isEmptyMailyJson } from './maily/maily-utils';

export const EmailEditorSelect = ({
  isLoading,
  saveForm,
}: {
  isLoading: boolean;
  saveForm?: (options?: { forceSubmit?: boolean; onSuccess?: () => void }) => Promise<void>;
}) => {
  const { control } = useFormContext();
  const [isSwitchingToHtml, setIsSwitchingToHtml] = useState(false);
  const [isSwitchingToBlock, setIsSwitchingToBlock] = useState(false);
  const body = useWatch({ name: 'body', control });

  return (
    <FormField
      control={control}
      name="editorType"
      render={({ field }) => {
        return (
          <>
            <Tabs
              defaultValue="editor"
              value={field.value ?? 'block'}
              onValueChange={(value) => {
                // allow freely switching if the body is empty string or maily json
                if (!body || body === '' || isEmptyMailyJson(body)) {
                  field.onChange(value);
                  return;
                }

                if (value === 'html') {
                  setIsSwitchingToHtml(true);
                  return;
                }

                setIsSwitchingToBlock(true);
              }}
              className="flex h-full flex-1 flex-col"
            >
              <TabsList className="w-min">
                <TabsTrigger value="block" className="gap-1.5" size="xs">
                  <RiDashboardLine className="size-3.5" />
                  <span>Block editor</span>
                </TabsTrigger>
                <TabsTrigger value="html" className="gap-1.5" size="xs">
                  <RiCodeSSlashFill className="size-3.5" />
                  <span>Code editor</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ConfirmationModal
              open={isSwitchingToHtml}
              onOpenChange={setIsSwitchingToHtml}
              onConfirm={async () => {
                field.onChange('html');
                saveForm?.({ onSuccess: () => setIsSwitchingToHtml(false) });
              }}
              title="Are you sure?"
              description="You’re switching to code editor. Once you do, you can’t go back to blocks unless you reset the template. Ready to get your hands dirty?"
              confirmButtonText="Proceed"
              isLoading={isLoading}
            />
            <ConfirmationModal
              open={isSwitchingToBlock}
              onOpenChange={setIsSwitchingToBlock}
              onConfirm={() => {
                field.onChange('block');
                saveForm?.({ onSuccess: () => setIsSwitchingToBlock(false) });
              }}
              title="Are you sure?"
              description="Switching to visual mode will reset your code. You’ll start fresh with blocks. Sure you want to do that?"
              confirmButtonText="Proceed"
              isLoading={isLoading}
            />
          </>
        );
      }}
    />
  );
};
