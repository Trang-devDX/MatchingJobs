import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { errorMessage } from '../api/errors'

export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fallback: string,
) {
  if (error && typeof error === 'object' && 'errors' in error) {
    const fieldErrors = (error as { errors?: Record<string, string[]> }).errors ?? {}
    for (const [field, messages] of Object.entries(fieldErrors)) {
      const message = messages[0]
      if (message) setError(field as Path<T>, { message })
    }
  }

  return errorMessage(error, fallback)
}
