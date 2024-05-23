import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props {
    name: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    type?: 'text' | 'password' | 'email' | 'number';
}

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ name, disabled, label, className, placeholder, type }, ref) => {
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
                        className={twMerge(className, 'flex flex-col gap-1 items-start w-full')}
                    >
                        <Label error={error} />
                        <input
                            ref={ref}
                            disabled={disabled}
                            placeholder={placeholder || label}
                            type={type}
                            className="w-full rounded-[6px] border border-borderPrimary p-3 text-sm font-medium"
                            onChange={(event) => onChange(event.target.value)}
                        />
                    </main>
                )}
            />
        );
    }
);

export function Label({ error }: { error: string | undefined }) {
    return <span className={twMerge('ml-1 text-base', error && 'text-danger')}>{error}</span>;
}
