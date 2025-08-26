import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'outline';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon: Icon,
  actions,
  variant = 'default',
  padding = 'md',
  className = '',
}) => {
  const baseClasses = 'backdrop-blur-xl rounded-2xl shadow-lg border';

  const variantClasses = {
    default: 'bg-white/80 border-[#90E0EF]/30',
    gradient: 'bg-gradient-to-r from-[#CAF0F8]/20 to-[#90E0EF]/20 border-[#90E0EF]/30',
    outline: 'bg-white/50 border-[#90E0EF]/50',
  };

  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}>
      {(title || subtitle || Icon || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#90E0EF]/50 flex items-center justify-center bg-[#0077B6]/10 flex-shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0077B6]" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <h2 className="text-lg sm:text-xl font-bold font-headlines text-[#1E3E72] truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-[#0077B6] font-paragraphs mt-1 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card; 