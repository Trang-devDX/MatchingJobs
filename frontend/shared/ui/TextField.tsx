import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { controlClass } from './control'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: ReactNode
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <label className="block text-sm font-medium" htmlFor={fieldId}>
      <span>{label}</span>
      <input
        ref={ref}
        id={fieldId}
        className={cn(controlClass, 'mt-1', className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <span className="mt-1 block text-sm font-normal text-danger">{error}</span> : hint}
    </label>
  )
})
