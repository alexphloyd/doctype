import { cva, type VariantProps } from 'class-variance-authority';
import { type ReactNode, type ButtonHTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends VariantProps<typeof styles> {
  content: ReactNode | string;
  className?: string;
  disabled?: boolean;
  debounce?: boolean;
  debounceTime?: number;
  onClick?: () => void;
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  ariaLabel?: string;
}

export const AppActionButton = (props: Props) => {
  const {
    content,
    className,
    type,
    size,
    disabled = false,
    onClick,
    htmlType = 'button',
    debounce = false,
    debounceTime = 300,
    ariaLabel,
  } = props;

  const [isDisabled, setDisabled] = useState(false);
  const handleClick = () => {
    if (!debounce) {
      return onClick?.();
    }

    if (!isDisabled) {
      onClick?.();
      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
      }, debounceTime);
    }
  };

  return (
    <button
      disabled={isDisabled}
      onClick={handleClick}
      type={htmlType}
      className={twMerge(styles({ type, size, disabled }), className)}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
};

const styles = cva(
  'cursor-pointer select-none w-full rounded-md whitespace-nowrap tracking-wider text-center font-sans flex items-center justify-center',
  {
    variants: {
      type: {
        default: ['bg-transparent text-accent'],
      },
      size: {
        md: ['h-[34px] text-base min-w-[38px]'],
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
