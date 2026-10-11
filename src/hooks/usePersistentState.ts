import { useEffect, useState } from 'react'
import { load, save } from '../lib/storage'

// useState と同じ使い方で、値を localStorage にも保存する。
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => load(key, initial))
  useEffect(() => save(key, value), [key, value])
  return [value, setValue] as const
}
