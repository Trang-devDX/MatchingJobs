import { ImagePlus, UserRound } from 'lucide-react'
import { useId, useRef } from 'react'
import { Button } from './Button'
import { cn } from '../lib/cn'

export function MediaField({
  label,
  hint,
  preview,
  shape = 'rounded',
  onFile,
  showRemove = false,
  removeChecked = false,
  onRemoveChange,
}: {
  label: string
  hint: string
  preview: string | null
  shape?: 'rounded' | 'circle'
  onFile: (file: File | null) => void
  showRemove?: boolean
  removeChecked?: boolean
  onRemoveChange?: (checked: boolean) => void
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const frame = shape === 'circle' ? 'rounded-full' : 'rounded-2xl'

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className={cn('relative grid size-24 place-items-center overflow-hidden border border-line bg-canvas', frame)}>
        {preview ? (
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          shape === 'circle' ? <UserRound className="text-muted" size={28} /> : <ImagePlus className="text-muted" size={28} />
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-navy">{label}</p>
        <p className="mt-1 text-xs text-muted">{hint}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>Choose image</Button>
          <input
            ref={inputRef}
            id={inputId}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => onFile(event.target.files?.[0] ?? null)}
          />
          {showRemove && onRemoveChange ? (
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={removeChecked} onChange={(event) => onRemoveChange(event.target.checked)} />
              Remove
            </label>
          ) : null}
        </div>
      </div>
    </div>
  )
}
