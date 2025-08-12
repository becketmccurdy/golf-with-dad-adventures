import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseClasses = "rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-emerald-300",
    secondary: "bg-stone-200 text-stone-700 hover:bg-stone-300 active:bg-stone-400 disabled:bg-stone-100 disabled:text-stone-400",
    outline: "bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 active:bg-stone-100 disabled:bg-stone-50 disabled:text-stone-400"
  };
  
  const sizeClasses = "px-4 py-2 text-sm";
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${widthClass} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};
