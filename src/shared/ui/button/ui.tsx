import { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  const baseStyles = 'rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary-50 focus:ring-primary-500',
    text: 'text-primary bg-transparent hover:bg-primary-50 focus:ring-primary-500',
    white: 'border-2 border-primary text-primary bg-white hover:bg-primary-50 focus:ring-primary-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && <span>{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span>{icon}</span>}
      </span>
    </button>
  );
};
