import { useInput } from './useInput';
import { useState, useEffect } from 'react'
import { HookInput } from './useInput'

interface HookInputTimeout extends HookInput {
  timeoutValue: string;
}

export const useInputTimeout = (initialValue: string = '', timeout: number = 800): HookInputTimeout => {
  const input = useInput(initialValue)
  const [timeoutValue, setTimeoutValue] = useState(initialValue)
  const [tyingTimeout, setTyingTimeout] = useState<NodeJS.Timeout>()

  useEffect(() => {
    if (tyingTimeout) {
      clearTimeout(tyingTimeout);
    }
    setTyingTimeout(setTimeout(() => {
      setTimeoutValue(input.value)
    }, timeout));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.value])

  return {
    ...input,
    timeoutValue
  }
}
