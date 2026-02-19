import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none transform active:scale-95 duration-200';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        outline: 'border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400',
        ghost: 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50',
    };

    const sizes = {
        sm: 'h-10 px-4 text-xs tracking-widest uppercase',
        md: 'h-12 px-6 text-sm uppercase tracking-wider',
        lg: 'h-16 px-10 text-base uppercase tracking-[0.2em]',
        icon: 'h-10 w-10 p-0 rounded-full',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};
