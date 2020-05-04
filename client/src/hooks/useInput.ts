import { useState } from 'react'

type TValue = string | number

interface HookInput {
  value: TValue
  setValue(v: unknown): void
  reset(): void
  bind: {
    value: TValue
    onChange(value: string): void
  }
}

export const useInput = (initialValue: TValue): HookInput => {
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
