import {forwardRef, TextareaHTMLAttributes} from 'react';
import { cn } from '@/shared/lib/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    label,
    error,
    className,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                className={cn(
                    'w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    'disabled:bg-gray-100 disabled:cursor-not-allowed resize-none',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
        </div>
    );
});
