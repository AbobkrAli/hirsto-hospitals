import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  icon?: LucideIcon;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  selectClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  onBlur,
  icon: Icon,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  className = '',
  selectClassName = '',
}) => {
  const baseSelectClasses = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 font-paragraphs transition-colors appearance-none bg-no-repeat bg-right';

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
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`
            ${baseSelectClasses}
            ${stateClasses}
            ${disabledClasses}
            ${selectClassName}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-500 font-paragraphs">{error}</p>
      )}
    </div>
  );
};

export default Select; 