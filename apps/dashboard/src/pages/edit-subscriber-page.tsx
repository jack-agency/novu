import { useSubscribersNavigate } from '@/components/subscribers/hooks/use-subscribers-navigate';
import { SubscriberDrawer } from '@/components/subscribers/subscriber-drawer';
import { useOnElementUnmount } from '@/hooks/use-on-element-unmount';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PermissionsEnum } from '@novu/shared';
import { useHasPermission } from '@/hooks/use-has-permission';

export function EditSubscriberPage() {
  const { subscriberId } = useParams<{ subscriberId: string }>();
  const [open, setOpen] = useState(true);
  const { navigateToSubscribersCurrentPage } = useSubscribersNavigate();
  const has = useHasPermission();

  const isReadOnly = !has({ permission: PermissionsEnum.SUBSCRIBER_WRITE });

  const { ref: unmountRef } = useOnElementUnmount({
    callback: () => {
      navigateToSubscribersCurrentPage();
    },
    condition: !open,
  });

  if (!subscriberId) {
    return null;
  }

  return (
    <SubscriberDrawer
      ref={unmountRef}
      subscriberId={subscriberId}
      open={open}
      onOpenChange={setOpen}
      readOnly={isReadOnly}
    />
  );
}
