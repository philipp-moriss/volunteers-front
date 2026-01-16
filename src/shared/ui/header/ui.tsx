import { FC, ReactNode, HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils/cn';
import { IconButton } from '../icon-button';

interface HeaderProps extends HTMLAttributes<HTMLElement> {
    title?: string;
    leftAction?: ReactNode;
    rightActions?: ReactNode[];
    backButton?: boolean;
    onBack?: () => void;
}

export const Header: FC<HeaderProps> = ({
  title,
  leftAction,
  rightActions,
  backButton = false,
  onBack,
  className,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        'w-full bg-white border-b border-gray-200 px-4 pt-[9vh] pb-[5vh]',
        'flex items-center justify-between',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {backButton && (
          <IconButton
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
            variant="ghost"
            size="md"
            onClick={onBack}
            aria-label={t('common.back')}
          />
        )}
                {leftAction}
                {title && (
                    <h1 className="text-3xl font-sans font-normal text-primary truncate">{title}</h1>
                )}
            </div>
            {rightActions && rightActions.length > 0 && (
                <div className="flex items-center gap-2">
                    {rightActions.map((action, index) => (
                        <div key={index}>{action}</div>
                    ))}
                </div>
            )}
        </header>
    );
};
