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
  const baseClasses = "rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 relative overflow-hidden group";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800 disabled:from-emerald-300 disabled:to-emerald-300 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-stone-100 to-stone-200 text-stone-700 hover:from-stone-200 hover:to-stone-300 active:from-stone-300 active:to-stone-400 disabled:from-stone-100 disabled:to-stone-100 disabled:text-stone-400 border border-stone-200 hover:border-stone-300",
    outline: "bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 active:bg-emerald-100 disabled:bg-stone-50 disabled:text-stone-400 disabled:border-stone-200"
  };
  
  const sizeClasses = "px-6 py-3 text-sm";
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${widthClass} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && !isLoading && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};
