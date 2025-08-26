import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import Input from '../atoms/Input';
import type { InputProps } from '../atoms/Input';
import Select from '../atoms/Select';
import type { SelectProps } from '../atoms/Select';

type BaseFormFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: object;
  className?: string;
};

type InputFormFieldProps<T extends FieldValues> = BaseFormFieldProps<T> &
  Omit<InputProps, 'value' | 'onChange' | 'onBlur' | 'error'>;

type SelectFormFieldProps<T extends FieldValues> = BaseFormFieldProps<T> &
  Omit<SelectProps, 'value' | 'onChange' | 'onBlur' | 'error'>;

function InputFormField<T extends FieldValues>(props: InputFormFieldProps<T>) {
  const { name, control, rules, className, ...inputProps } = props;

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            {...inputProps}
            error={fieldState.error?.message}
            onChange={(value: string) => field.onChange(value)}
          />
        )}
      />
    </div>
  );
}

function SelectFormField<T extends FieldValues>(props: SelectFormFieldProps<T>) {
  const { name, control, rules, className, ...selectProps } = props;

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <Select
            {...field}
            {...selectProps}
            error={fieldState.error?.message}
            onChange={(value: string) => field.onChange(value)}
          />
        )}
      />
    </div>
  );
}

// Export both for convenience
export { InputFormField, SelectFormField };

// Keep the original FormField as InputFormField for backwards compatibility
const FormField = InputFormField;

export default FormField; 