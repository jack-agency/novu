/* eslint-disable local-rules/no-class-without-style */
import { createMemo, For, Show } from 'solid-js';
import { useInboxContext, useUnreadCounts } from '../../context';
import { cn, getTagsFromTab, useStyle } from '../../helpers';
import { useTabsDropdown } from '../../helpers/useTabsDropdown';
import { Check as DefaultCheck } from '../../icons';
import { ArrowDown as DefaultArrowDown } from '../../icons/ArrowDown';
import {
  BodyRenderer,
  NotificationActionClickHandler,
  NotificationClickHandler,
  NotificationRenderer,
  NotificationStatus,
  SubjectRenderer,
  Tab,
} from '../../types';
import { NotificationList } from '../Notification';
import { Button, Dropdown, Tabs } from '../primitives';
import { InboxDropdownTab, InboxTab as InboxTabComponent, InboxTabUnreadNotificationsCount } from './InboxTab';
import { IconRendererWrapper } from '../shared/IconRendererWrapper';

const tabsDropdownTriggerVariants = () =>
  `nt-relative after:nt-absolute after:nt-content-[''] after:nt-bottom-0 after:nt-left-0 ` +
  `after:nt-w-full after:nt-h-[2px] after:nt-border-b-2 nt-mb-[0.625rem]`;
type InboxTabsProps = {
  renderNotification?: NotificationRenderer;
  renderSubject?: SubjectRenderer;
  renderBody?: BodyRenderer;
  onNotificationClick?: NotificationClickHandler;
  onPrimaryActionClick?: NotificationActionClickHandler;
  onSecondaryActionClick?: NotificationActionClickHandler;
  tabs: Array<Tab>;
};
export const InboxTabs = (props: InboxTabsProps) => {
  const style = useStyle();
  const { activeTab, status, setActiveTab, filter } = useInboxContext();
  const { dropdownTabs, setTabsList, visibleTabs } = useTabsDropdown({ tabs: props.tabs });
  const dropdownTabsUnreadCounts = useUnreadCounts({
    filters: dropdownTabs().map((tab) => ({ tags: getTagsFromTab(tab), data: tab.filter?.data })),
  });

  const checkIconClass = style('moreTabs__dropdownItemRight__icon', 'nt-size-3', {
    iconKey: 'check',
  });
  const options = createMemo(() =>
    dropdownTabs().map((tab) => ({
      ...tab,
      rightIcon:
        tab.label === activeTab() ? (
          <IconRendererWrapper
            iconKey="check"
            class={checkIconClass}
            fallback={<DefaultCheck class={checkIconClass} />}
          />
        ) : undefined,
    }))
  );
  const dropdownTabsUnreadSum = createMemo(() =>
    dropdownTabsUnreadCounts().reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  );

  const isTabsDropdownActive = createMemo(() =>
    dropdownTabs()
      .map((tab) => tab.label)
      .includes(activeTab())
  );

  const moreTabsIconClass = style('moreTabs__icon', 'nt-size-5', {
    iconKey: 'arrowDown',
  });

  return (
    <Tabs.Root
      appearanceKey="notificationsTabs__tabsRoot"
      class="nt-flex nt-flex-col nt-flex-1 nt-min-h-0"
      value={activeTab()}
      onChange={setActiveTab}
    >
      <Show
        when={visibleTabs().length > 0}
        fallback={
          <Tabs.List
            ref={setTabsList}
            appearanceKey="notificationsTabs__tabsList"
            class="nt-bg-neutral-alpha-25 nt-px-4"
          >
            {props.tabs.map((tab) => (
              <InboxTabComponent {...tab} class="nt-invisible" />
            ))}
          </Tabs.List>
        }
      >
        <Tabs.List appearanceKey="notificationsTabs__tabsList" class="nt-bg-neutral-alpha-25 nt-px-4">
          <For each={visibleTabs()}>{(tab) => <InboxTabComponent {...tab} />}</For>
          <Show when={dropdownTabs().length > 0}>
            <Dropdown.Root>
              <Dropdown.Trigger
                appearanceKey="moreTabs__dropdownTrigger"
                asChild={(triggerProps) => (
                  <Button
                    variant="unstyled"
                    size="iconSm"
                    appearanceKey="moreTabs__button"
                    {...triggerProps}
                    class={cn(
                      tabsDropdownTriggerVariants(),
                      'nt-ml-auto',
                      isTabsDropdownActive()
                        ? 'after:nt-border-b-primary'
                        : 'after:nt-border-b-transparent nt-text-foreground-alpha-700'
                    )}
                  >
                    <IconRendererWrapper
                      iconKey="arrowDown"
                      class={moreTabsIconClass}
                      fallback={<DefaultArrowDown class={moreTabsIconClass} />}
                    />
                    <Show when={status() !== NotificationStatus.ARCHIVED && dropdownTabsUnreadSum()}>
                      <InboxTabUnreadNotificationsCount count={dropdownTabsUnreadSum()} />
                    </Show>
                  </Button>
                )}
              />
              <Dropdown.Content appearanceKey="moreTabs__dropdownContent">
                <For each={options()}>
                  {(option) => <InboxDropdownTab onClick={() => setActiveTab(option.label)} {...option} />}
                </For>
              </Dropdown.Content>
            </Dropdown.Root>
          </Show>
        </Tabs.List>
      </Show>

      {props.tabs.map((tab) => (
        <Tabs.Content
          value={tab.label}
          class={style(
            'notificationsTabs__tabsContent',
            cn(
              activeTab() === tab.label ? 'nt-block' : 'nt-hidden',
              'nt-overflow-auto nt-flex-1 nt-flex nt-flex-col nt-min-h-0'
            )
          )}
        >
          <NotificationList
            renderNotification={props.renderNotification}
            renderSubject={props.renderSubject}
            renderBody={props.renderBody}
            onNotificationClick={props.onNotificationClick}
            onPrimaryActionClick={props.onPrimaryActionClick}
            onSecondaryActionClick={props.onSecondaryActionClick}
            filter={{ ...filter(), tags: getTagsFromTab(tab), data: tab.filter?.data }}
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};
