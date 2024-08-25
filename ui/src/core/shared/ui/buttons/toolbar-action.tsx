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
}

export const ToolbarActionButton = (props: Props) => {
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
        default: ['bg-transparent text-accent'],
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
