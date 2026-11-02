import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'
import { controlClass } from './control'

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  error?: string
  showLabel: string
  hideLabel: string
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { label, error, showLabel, hideLabel, id, ...props },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [visible, setVisible] = useState(false)

  return (
    <div className="block text-sm font-medium">
      <label htmlFor={fieldId}>{label}</label>
      <div className="relative mt-1">
        <input
          ref={ref}
          id={fieldId}
          type={visible ? 'text' : 'password'}
          className={cn(controlClass, 'pr-12')}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <button
          type="button"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 text-brand"
          aria-label={visible ? hideLabel : showLabel}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff aria-hidden="true" size={16} /> : <Eye aria-hidden="true" size={16} />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm font-normal text-danger">{error}</p>}
    </div>
  )
})
