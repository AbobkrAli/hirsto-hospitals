import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = 'text',
  icon: Icon,
  iconPosition = 'left',
  error,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
}) => {
  const baseInputClasses = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 font-paragraphs transition-colors';

  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50 bg-red-50/50'
    : 'border-[#90E0EF]/30 focus:border-[#0077B6] focus:ring-[#0077B6]/50 bg-white/50';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">
          {Icon && <Icon className="w-4 h-4 inline mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && iconPosition === 'left' && !label && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-[#0077B6]" />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${baseInputClasses}
            ${stateClasses}
            ${disabledClasses}
            ${Icon && iconPosition === 'left' && !label ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${inputClassName}
          `}
        />

        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-[#0077B6]" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 font-paragraphs">{error}</p>
      )}
    </div>
  );
};

export default Input; 