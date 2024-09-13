import { TextInput, TextInputProps } from '@mantine/core';
import { type ReactNode, forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  leftSection?: ReactNode;
  size?: TextInputProps['size'];
  withErrorLabel?: boolean;
  autoFocus?: boolean;
  type?: 'text' | 'password' | 'email' | 'number';
}

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      disabled,
      label,
      className,
      placeholder,
      type,
      leftSection,
      size = 'md',
      withErrorLabel = true,
      autoFocus = false,
    },
    ref
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();
    const error = errors[name]?.message?.toString();

    return (
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { onChange } }) => (
          <main
            className={twMerge(
              className,
              'flex flex-col gap-1 items-start w-full border-danger'
            )}
          >
            {withErrorLabel && <ErrorLabel error={error} />}
            <TextInput
              autoFocus={autoFocus}
              ref={ref}
              disabled={disabled}
              placeholder={placeholder || label}
              type={type}
              size={size}
              leftSection={leftSection}
              classNames={{
                root: 'w-full',
                input: twMerge(
                  'bg-transparent',
                  error?.length && 'border-danger/60 focus:border-danger/60'
                ),
              }}
              onChange={(event) => onChange(event.target.value)}
            />
          </main>
        )}
      />
    );
  }
);

export function ErrorLabel({ error }: { error: string | undefined }) {
  return <span className={twMerge('ml-1 text-base', error && 'text-danger')}>{error}</span>;
}
