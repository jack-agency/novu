import { OrganizationSwitcher as ClerkOrganizationSwitcher } from '@clerk/clerk-react';
import type { OrganizationSwitcherTheme } from '@clerk/types';
import { ROUTES } from '../../utils/routes';

const OrganizationSwitcherAppearance: OrganizationSwitcherTheme = {
  elements: {
    rootBox: 'w-full',
    organizationSwitcherTrigger:
      'group w-full py-0 [&>.cl-organizationPreview]:px-0 px-1.5 justify-start hover:bg-background before:border-neutral-alpha-100 focus-visible:ring-ring group relative flex cursor-pointer items-center gap-2 rounded-lg transition duration-300 ease-out before:absolute before:bottom-0 before:left-0 before:h-0 before:w-full before:border-b before:border-solid before:transition-all before:duration-300 before:ease-out before:content-[""] hover:shadow-sm hover:before:border-transparent focus-visible:outline-none focus-visible:ring-2 focus:bg-transparent focus:shadow-sm focus:bg-background focus:before:border-transparent',
    organizationSwitcherTriggerIcon:
      'opacity-0 ml-auto transition duration-300 ease-out group-hover:opacity-100 group-focus:opacity-100',
    organizationSwitcherPopoverActionButton__manageOrganization: {
      display: 'none',
    },
    organizationSwitcherPopoverInvitationActionsBox: 'p-0 pr-2',
    organizationSwitcherInvitationAcceptButton: '!text-[10px] !min-w-[90px] !w-[90px] px-0',
    organizationPreviewMainIdentifier: 'text-foreground-950 text-base',
    organizationPreviewAvatarContainer: 'size-6 rounded-full',
    organizationPreviewAvatarBox: 'rounded-full size-6',
    organizationPreview: 'py-1.5 px-2 gap-2',
    organizationSwitcherPopoverActionButton: 'py-1 px-2 -ml-1.5 text-sm gap-0',
    organizationSwitcherPopoverCard: 'w-64',
    organizationSwitcherPreviewButton: 'p-0 [&>svg]:mr-2 !border-0',
    organizationPreviewSecondaryIdentifier: 'hidden',
    organizationSwitcherPopoverActions:
      'py-0.5 [&_.cl-organizationPreviewMainIdentifier]:text-sm [&>div:nth-child(2)]:!border-0',
  },
};

export const OrganizationDropdown = () => {
  return (
    <ClerkOrganizationSwitcher
      hidePersonal
      skipInvitationScreen
      afterCreateOrganizationUrl={ROUTES.INBOX_USECASE}
      appearance={OrganizationSwitcherAppearance}
    />
  );
};
