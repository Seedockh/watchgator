import { useState } from 'react'

export interface HookInput {
  value: string
  setValue(v: string): void
  reset(): void
  bind: {
    value: string
    onChange(value: string): void
  }
}

export const useInput = (initialValue: string): HookInput => {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    setValue,
    reset(): void {
      setValue(initialValue)
    },
    bind: {
      value,
      onChange(value: string): void {
        setValue(value)
      },
    },
  }
}
