
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    icon?: React.ReactElement;
}

export const Button: React.FC<ButtonProps> = ({
    isLoading = false,
    children,
    variant = 'primary',
    className = '',
    icon,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-bold py-2.5 px-5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-background disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transform hover:scale-105 active:scale-100';
    
    const variantClasses = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:ring-gray-500',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {/* Fix: Cast icon to React.ReactElement<any> to allow adding a className prop. */}
                    {icon && React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5 me-2' })}
                    {children}
                </>
            )}
        </button>
    );
};
