import { ImagePlus, UserRound, X } from 'lucide-react'
import { useId, useRef } from 'react'
import { Button } from './Button'
import { cn } from '../lib/cn'

export function MediaField({
  label,
  hint,
  preview,
  shape = 'rounded',
  onFile,
  onRemove,
}: {
  label: string
  hint: string
  preview: string | null
  shape?: 'rounded' | 'circle'
  onFile: (file: File | null) => void
  onRemove?: () => void
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const frame = shape === 'circle' ? 'rounded-full' : 'rounded-2xl'

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative size-24 shrink-0">
        <button
          type="button"
          className={cn('grid size-full place-items-center overflow-hidden border border-line bg-canvas', frame)}
          aria-label={`Choose ${label.toLowerCase()}`}
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            shape === 'circle' ? <UserRound className="text-muted" size={28} /> : <ImagePlus className="text-muted" size={28} />
          )}
        </button>
        {preview && onRemove ? (
          <button
            type="button"
            className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-danger text-white shadow-sm hover:bg-danger/90"
            aria-label={`Remove ${label.toLowerCase()}`}
            onClick={onRemove}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
      <div>
        <p className="text-sm font-semibold text-navy">{label}</p>
        <p className="mt-1 text-xs text-muted">{hint}</p>
        <div className="mt-3">
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>Choose image</Button>
          <input
            ref={inputRef}
            id={inputId}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              onFile(event.target.files?.[0] ?? null)
              event.target.value = ''
            }}
          />
        </div>
      </div>
    </div>
  )
}
