import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import { controlClass } from './control'
import { cn } from '../lib/cn'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  children: ReactNode
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, id, children, className, ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <label className="block text-sm font-medium text-navy" htmlFor={fieldId}>
      <span>{label}</span>
      <select ref={ref} id={fieldId} className={cn(controlClass, 'mt-1', className)} aria-invalid={error ? true : undefined} {...props}>
        {children}
      </select>
      {error && <span className="mt-1 block text-sm font-normal text-danger">{error}</span>}
    </label>
  )
})
