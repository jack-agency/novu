import { Input } from '@/components/primitives/input';
import { SecretInput } from '@/components/primitives/secret-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { Textarea } from '@/components/primitives/textarea';
import { Switch } from '@/components/primitives/switch';
import { CredentialsKeyEnum, IProviderConfig } from '@novu/shared';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/primitives/form/form';

type IntegrationFormData = {
  name: string;
  identifier: string;
  credentials: Record<string, string>;
  active: boolean;
  check: boolean;
  primary: boolean;
  environmentId: string;
};

type CredentialsSectionProps = {
  provider?: IProviderConfig;
  control: Control<IntegrationFormData>;
  isReadOnly?: boolean;
};

const SECURE_CREDENTIALS = [
  CredentialsKeyEnum.ApiKey,
  CredentialsKeyEnum.ApiToken,
  CredentialsKeyEnum.SecretKey,
  CredentialsKeyEnum.Token,
  CredentialsKeyEnum.Password,
  CredentialsKeyEnum.ServiceAccount,
];

export function CredentialsSection({ provider, control, isReadOnly }: CredentialsSectionProps) {
  return (
    <div className="border-neutral-alpha-200 bg-background text-foreground-600 mx-0 mt-0 flex flex-col gap-2 rounded-lg border p-3">
      {provider?.credentials?.map((credential) => (
        <FormField
          key={credential.key}
          control={control}
          name={`credentials.${credential.key}`}
          rules={{
            required: credential.required ? `${credential.displayName} is required` : false,
            validate: credential.validation?.validate,
            pattern: credential.validation?.pattern
              ? {
                  value: credential.validation.pattern,
                  message: credential.validation.message || 'Invalid format',
                }
              : undefined,
          }}
          render={({ field, fieldState }) => (
            <FormItem className="mb-2">
              <FormLabel htmlFor={credential.key} optional={!credential.required}>
                {credential.displayName}
              </FormLabel>
              {credential.type === 'switch' ? (
                <div className="flex items-center justify-between gap-2">
                  <FormControl>
                    <Switch
                      id={credential.key}
                      checked={Boolean(field.value)}
                      onCheckedChange={field.onChange}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                </div>
              ) : credential.type === 'dropdown' && credential.dropdown ? (
                <FormControl>
                  <Select value={field.value || ''} onValueChange={field.onChange} disabled={isReadOnly}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${credential.displayName.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {credential.dropdown.map((option) => (
                        <SelectItem key={option.value || ''} value={option.value || ''}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              ) : credential.type === 'textarea' ? (
                <FormControl>
                  <Textarea
                    id={credential.key}
                    placeholder={`Enter ${credential.displayName.toLowerCase()}`}
                    value={field.value || ''}
                    onChange={field.onChange}
                    rows={7}
                    disabled={isReadOnly}
                  />
                </FormControl>
              ) : credential.type === 'secret' || SECURE_CREDENTIALS.includes(credential.key as CredentialsKeyEnum) ? (
                <FormControl>
                  <SecretInput
                    id={credential.key}
                    placeholder={`Enter ${credential.displayName.toLowerCase()}`}
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={isReadOnly}
                  />
                </FormControl>
              ) : (
                <FormControl>
                  <Input
                    size={'md'}
                    id={credential.key}
                    type="text"
                    placeholder={`Enter ${credential.displayName.toLowerCase()}`}
                    {...field}
                    hasError={!!fieldState.error}
                    disabled={isReadOnly}
                  />
                </FormControl>
              )}

              <FormMessage>{fieldState.error?.message || credential.description}</FormMessage>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
