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
    const baseClasses = 'inline-flex items-center justify-center font-bold py-2.5 px-5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-background disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 active:scale-100 glow-effect';
    
    const variantClasses = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-dark focus:ring-primary shadow-primary/40',
        secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-dark-foreground dark:hover:bg-slate-600 focus:ring-slate-500 shadow-slate-500/20',
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
                    {icon && React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5 me-2' })}
                    {children}
                </>
            )}
        </button>
    );
};