/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectProps = {
  id?: string;
  name?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (e: SelectChangeEvent) => void;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  errorText?: string;
  helperText?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function Select({
  id,
  name,
  value,
  onChange,
  label,
  placeholder = '선택해주세요',
  options,
  errorText,
  helperText,
  className,
  required,
  disabled,
}: SelectProps) {
  const hasError = Boolean(errorText);
  const describedByIds: string[] = [];
  const helperId = id ? `${id}-help` : undefined;
  const errorId = id ? `${id}-error` : undefined;
  if (helperText && helperId) describedByIds.push(helperId);
  if (errorText && errorId) describedByIds.push(errorId);

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-text-strong"
        >
          {label}
          {required ? <span className="ml-1 text-[#EF4444]">*</span> : null}
        </label>
      ) : null}

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={
          describedByIds.length ? describedByIds.join(' ') : undefined
        }
        className={cx(
          'h-11 w-full rounded-control border bg-surface-0 px-3 text-sm text-text-strong shadow-soft outline-none transition',
          hasError ? 'border-[#EF4444]' : 'border-border-default',
          disabled
            ? 'opacity-50'
            : 'focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          className,
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {errorText ? (
        <p id={errorId} className="mt-1.5 text-sm text-[#EF4444]">
          {errorText}
        </p>
      ) : null}

      {!errorText && helperText ? (
        <p id={helperId} className="mt-1.5 text-sm text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
