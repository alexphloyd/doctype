import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  content: ReactNode | string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const ActionButton = (props: Props) => {
  const { content, onClick, disabled, className, htmlType } = props;

  return (
    <button
      disabled={disabled}
      type={htmlType}
      onClick={onClick}
      className={twMerge('p-1', className)}
    >
      {content}
    </button>
  );
};
