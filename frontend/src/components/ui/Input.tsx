/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import type { ReactNode } from 'react';

export type InputProps = {
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'search';
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  prefixIcon?: ReactNode;
  suffixButton?: ReactNode; // 예: clear 버튼
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function Input({
  id,
  name,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  label,
  helperText,
  errorText,
  prefixIcon,
  suffixButton,
  className,
  disabled,
  required,
  onChange,
  onBlur,
  onFocus,
}: InputProps) {
  const describedByIds: string[] = [];
  const helperId = id ? `${id}-help` : undefined;
  const errorId = id ? `${id}-error` : undefined;

  if (helperText && helperId) describedByIds.push(helperId);
  if (errorText && errorId) describedByIds.push(errorId);

  const hasError = Boolean(errorText);

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

      <div
        className={cx(
          'flex items-center gap-2 rounded-control border bg-surface-0 px-3 shadow-soft transition',
          hasError ? 'border-[#EF4444]' : 'border-border-default',
          disabled
            ? 'opacity-50'
            : 'focus-within:ring-2 focus-within:ring-brand-primary',
        )}
      >
        {prefixIcon ? (
          <span className="text-text-muted" aria-hidden="true">
            {prefixIcon}
          </span>
        ) : null}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            describedByIds.length ? describedByIds.join(' ') : undefined
          }
          className={cx(
            'h-11 w-full bg-transparent text-sm text-text-strong outline-none placeholder:text-text-muted',
            className,
          )}
        />

        {suffixButton ? <span className="shrink-0">{suffixButton}</span> : null}
      </div>

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
