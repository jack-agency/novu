import { StepResponseDto } from '@novu/shared';
import { RiErrorWarningLine, RiErrorWarningFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'motion/react';
import { countStepIssues, getFirstErrorMessage, getAllStepIssues } from '@/components/workflow-editor/step-utils';
import { cn } from '@/utils/ui';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/primitives/hover-card';

type StepIssuesPanelProps = {
  step: StepResponseDto;
  className?: string;
};

export function StepIssuesPanel({ step, className }: StepIssuesPanelProps) {
  const issueCount = countStepIssues(step.issues);

  // Get the first control error message
  const firstControlError = getFirstErrorMessage(step.issues || {}, 'controls');
  const firstIntegrationError = getFirstErrorMessage(step.issues || {}, 'integration');
  const firstError = firstControlError || firstIntegrationError;

  const displayText =
    issueCount === 1
      ? firstError?.message || 'Issue found'
      : `${firstError?.message || 'Issues found'} & ${issueCount - 1}+ errors`;

  // Get all issues for the detailed view
  const allIssues = getAllStepIssues(step.issues);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'flex min-h-[44px] items-center overflow-hidden border-t border-neutral-200 bg-white px-4 py-3',
          className
        )}
      >
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            {issueCount > 0 && (
              <div className="flex cursor-pointer items-center gap-2 transition-colors hover:text-red-700">
                <RiErrorWarningFill className="size-4 text-red-600" />
                <span className="text-paragraph-xs font-medium text-red-600">{displayText}</span>
              </div>
            )}
          </HoverCardTrigger>
          <HoverCardContent
            className="bg-bg-weak flex w-80 flex-col gap-1 border border-neutral-200 p-1"
            side="top"
            align="start"
            sideOffset={8}
          >
            <div className="flex items-center gap-2 pl-1.5">
              <RiErrorWarningLine className="size-4 text-red-600" />
              <span className="text-label-xs font-medium text-red-600">Action required</span>
            </div>
            <div className="bg-bg-white max-h-60 overflow-y-auto rounded-[6px] border border-neutral-100 p-2">
              <ul className="space-y-2">
                {allIssues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-red-600" />
                    <span className="text-label-xs text-text-sub font-medium leading-4">{issue.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </HoverCardContent>
        </HoverCard>
      </motion.div>
    </AnimatePresence>
  );
}
