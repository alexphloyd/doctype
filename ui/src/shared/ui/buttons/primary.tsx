import { cva, type VariantProps } from 'class-variance-authority';
import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends VariantProps<typeof styles> {
    content: ReactNode | string;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const PrimaryButton = (props: Props) => {
    const {
        content,
        className,
        type,
        size,
        disabled = false,
        onClick,
        htmlType = 'button',
    } = props;

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={htmlType}
            className={twMerge(styles({ type, size, disabled }), className)}
        >
            {content}
        </button>
    );
};

const styles = cva(
    'select-none w-fit rounded-md whitespace-nowrap tracking-wider text-center font-sans cursor-pointer flex items-center justify-center',
    {
        variants: {
            type: {
                default: ['bg-accent text-white'],
                transparent: ['bg-backgroundPrimaryDarker/95 text-accent'],
            },
            size: {
                md: ['px-3 h-[34px] text-base'],
            },
            disabled: {
                true: [
                    'cursor-not-allowed',
                    'hover:bg-transparent',
                    'active:bg-transparent',
                    'active:outline-none',
                ],
            },
        },

        defaultVariants: {
            type: 'default',
            size: 'md',
        },
    }
);
