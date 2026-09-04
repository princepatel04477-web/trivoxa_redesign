'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Form fields.
 *
 * Contract (P20 audits every route against it):
 *  · every input has a visible <label> associated by htmlFor/id;
 *  · errors are announced (role=alert + aria-describedby) AND written in
 *    words — never colour-only;
 *  · focus is a 2px bronze ring on all three surfaces;
 *  · disabled is faint ink + dashed hairline, never opacity alone.
 */

const CONTROL = cn(
  'surface-fg w-full rounded-control border bg-transparent px-4 py-3 text-body-md',
  'placeholder:surface-faint',
  'transition-[border-color,box-shadow] duration-fast ease-house',
  'hover:border-bronze/70',
  'focus-visible:outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40',
  'disabled:cursor-not-allowed disabled:border-dashed disabled:surface-faint',
  'aria-[invalid=true]:border-bronze',
);

export type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
};

export function FieldShell({ label, hint, error, required, className, children }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="surface-fg text-body-sm font-medium">
        {label}
        {required ? (
          <span aria-hidden className="text-bronze-ink">
            {' '}
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {hint && !error ? (
        <p id={hintId} className="surface-faint text-body-sm">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-body-sm font-medium text-bronze-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, required, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required} className={className}>
      {({ id, describedBy, invalid }) => (
        <input
          ref={ref}
          id={id}
          required={required}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(CONTROL, 'surface-hairline')}
          {...rest}
        />
      )}
    </FieldShell>
  );
});

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, className, required, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required} className={className}>
      {({ id, describedBy, invalid }) => (
        <select
          ref={ref}
          id={id}
          required={required}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(CONTROL, 'surface-hairline surface-bg select-chevron pr-10')}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
});

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, required, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required} className={className}>
      {({ id, describedBy, invalid }) => (
        <textarea
          ref={ref}
          id={id}
          required={required}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          rows={5}
          className={cn(CONTROL, 'surface-hairline min-h-32 resize-y')}
          {...rest}
        />
      )}
    </FieldShell>
  );
});
