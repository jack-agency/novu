import { Avatar, AvatarFallback, AvatarImage } from '@/components/primitives/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';
import { CreateSubscriberParameters } from '@/hooks/use-create-subscriber';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateUUID } from '@/utils/uuid';
import { SubscriberResponseDto } from '@novu/api/models/components';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { useForm } from 'react-hook-form';
import { RiCloseCircleLine, RiMailLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { CompactButton } from '../primitives/button-compact';
import { Editor } from '../primitives/editor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRoot } from '../primitives/form/form';
import { InlineToast } from '../primitives/inline-toast';
import { Input, InputRoot } from '../primitives/input';
import { PhoneInput } from '../primitives/phone-input';
import { Separator } from '../primitives/separator';
import { LocaleSelect } from '../primitives/locale-select';
import { CreateSubscriberFormSchema } from './schema';
import { TimezoneSelect } from './timezone-select';

const extensions = [loadLanguage('json')?.extension ?? []];
const basicSetup = { lineNumbers: true, defaultKeymap: true };
type CreateSubscriberFormProps = {
  createSubscriber: UseMutateAsyncFunction<SubscriberResponseDto, unknown, CreateSubscriberParameters, unknown>;
};

export const CreateSubscriberForm = (props: CreateSubscriberFormProps) => {
  const { createSubscriber } = props;
  const form = useForm<z.infer<typeof CreateSubscriberFormSchema>>({
    defaultValues: {
      data: '',
      subscriberId: generateUUID(),
      avatar: '',
      firstName: '',
      lastName: '',
      locale: '',
      phone: '',
      timezone: '',
      email: '',
    },
    resolver: zodResolver(CreateSubscriberFormSchema),
    shouldFocusError: false,
    mode: 'onBlur',
  });

  const onSubmit = async (formData: z.infer<typeof CreateSubscriberFormSchema>) => {
    const dirtyFields = form.formState.dirtyFields;

    const dirtyPayload = Object.keys(dirtyFields).reduce<Partial<typeof formData>>((acc, key) => {
      const typedKey = key as keyof typeof formData;

      if (typedKey === 'data') {
        const data = JSON.parse(JSON.stringify(formData.data));
        return { ...acc, data: data === '' ? {} : data };
      }

      return { ...acc, [typedKey]: formData[typedKey]?.trim() };
    }, {});

    form.reset({ ...formData, data: JSON.stringify(formData.data) });
    await createSubscriber({
      subscriber: { ...dirtyPayload, subscriberId: formData.subscriberId },
    });
  };

  const firstNameChar = form.getValues('firstName')?.charAt(0) || '';
  const lastNameChar = form.getValues('lastName')?.charAt(0) || '';

  return (
    <div className="flex h-full flex-col">
      <Form {...form}>
        <FormRoot
          id="create-subscriber-form"
          autoComplete="off"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col overflow-y-auto"
        >
          <div className="flex flex-col items-stretch gap-6 p-5">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Avatar className="size-[3.75rem] cursor-default">
                    <AvatarImage src={firstNameChar || lastNameChar ? '' : '/images/avatar.svg'} />
                    <AvatarFallback>
                      {firstNameChar || lastNameChar ? (
                        firstNameChar + lastNameChar
                      ) : (
                        <AvatarImage src="/images/avatar.svg" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent className="max-w-56">
                  Subscriber profile Image can only be updated via API
                </TooltipContent>
              </Tooltip>
              <div className="grid w-full grid-cols-2 gap-2.5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={'John'}
                          id={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          hasError={!!fieldState.error}
                          size="xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={'Doe'}
                          id={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          hasError={!!fieldState.error}
                          size="xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <FormField
                control={form.control}
                name="subscriberId"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <div className="flex">
                      <FormLabel className="gap-1">
                        SubscriberId <span className="text-primary">*</span>
                      </FormLabel>
                      <span className="ml-auto">
                        <Link
                          to="https://docs.novu.co/platform/concepts/subscribers"
                          className="text-xs font-medium text-neutral-600 hover:underline"
                          target="_blank"
                        >
                          How it works?
                        </Link>
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={field.name}
                        id={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        hasError={!!fieldState.error}
                        size="xs"
                        inlineTrailingNode={
                          <div className="flex items-center">
                            <CompactButton
                              icon={RiCloseCircleLine}
                              variant="ghost"
                              onClick={() => {
                                form.setValue('subscriberId', '', {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }}
                              type="button"
                            />
                          </div>
                        }
                      />
                    </FormControl>
                    <FormMessage>Must be unique and used to identify a subscriber</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-2.5">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="hello@novu.co"
                        id={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        hasError={!!fieldState.error}
                        leadingIcon={RiMailLine}
                        size="xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        placeholder="Enter phone number"
                        id={field.name}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-[1fr_3fr] gap-2.5">
              <FormField
                control={form.control}
                name="locale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locale</FormLabel>
                    <FormControl>
                      <LocaleSelect
                        value={field.value}
                        onChange={(val) => {
                          const finalValue = field.value === val ? '' : val;
                          field.onChange(finalValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem className="overflow-hidden">
                    <FormLabel>Timezone</FormLabel>
                    <FormControl>
                      <TimezoneSelect
                        value={field.value}
                        onChange={(val) => {
                          const finalValue = field.value === val ? '' : val;
                          field.onChange(finalValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel
                    tooltip={`Store additional user details as key-value pairs in the custom data field.
                     \nExample: {\n "address": "123 Main St",\n "nationality": "Canadian"\n}`}
                  >
                    Custom data (JSON)
                  </FormLabel>
                  <FormControl>
                    <InputRoot hasError={!!fieldState.error} className="h-36 p-1 py-2">
                      <Editor
                        lang="json"
                        className="overflow-auto"
                        extensions={extensions}
                        basicSetup={basicSetup}
                        placeholder="{}"
                        height="100%"
                        multiline
                        {...field}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          form.trigger(field.name);
                        }}
                      />
                    </InputRoot>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="p-5">
            <InlineToast
              description={
                <div className="flex flex-col gap-3">
                  <span className="text-xs text-neutral-600">
                    <strong>Tip:</strong> You can also Add subscriber via API, or create them on the fly when sending
                    notifications.
                  </span>
                  <Link
                    to="https://docs.novu.co/platform/concepts/subscribers#just-in-time"
                    className="text-xs font-medium text-neutral-600 underline"
                    target="_blank"
                  >
                    Learn more
                  </Link>
                </div>
              }
              variant="success"
              className="border-neutral-100 bg-neutral-50"
            />
          </div>
        </FormRoot>
      </Form>
    </div>
  );
};
