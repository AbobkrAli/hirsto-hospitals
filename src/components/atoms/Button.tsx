import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold font-subtitles rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r !bg-[#03045E] text-white hover:shadow-lg focus:ring-[#0077B6]/50',
    secondary: 'bg-[#90E0EF] text-[#1E3E72] hover:bg-[#90E0EF]/80 focus:ring-[#90E0EF]/50',
    outline: 'border border-[#90E0EF]/30 text-[#1E3E72] hover:bg-[#90E0EF]/10 focus:ring-[#90E0EF]/50',
    ghost: 'text-[#1E3E72] hover:bg-[#90E0EF]/20 focus:ring-[#90E0EF]/50',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-1',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-3',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizeClasses[size]}`} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={iconSizeClasses[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={iconSizeClasses[size]} />}
        </>
      )}
    </button>
  );
};

export default Button; 