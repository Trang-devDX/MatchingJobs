import { ChevronDown } from 'lucide-react'
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
      <span className="relative mt-1 block">
        <select ref={ref} id={fieldId} className={cn(controlClass, 'appearance-none pr-10', className)} aria-invalid={error ? true : undefined} {...props}>
          {children}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
      </span>
      {error && <span className="mt-1 block text-sm font-normal text-danger">{error}</span>}
    </label>
  )
})
