import { useEffect, useRef, useState } from 'react'

export type Mode = 'focus' | 'break'

type Options = {
  focusMin: number
  breakMin: number
  onFinish: (finished: Mode) => void
}

export function useTimer({ focusMin, breakMin, onFinish }: Options) {
  const [mode, setMode] = useState<Mode>('focus')
  const total = (mode === 'focus' ? focusMin : breakMin) * 60
  const [remaining, setRemaining] = useState(total)
  const [running, setRunning] = useState(false)
  const endAt = useRef(0)
  // onFinish は毎回新しい関数になるので ref に入れて、タイマーの effect を作り直さずに最新を呼ぶ
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  })

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      // 切り上げ: 「00:03」は残り 3.0〜2.01 秒の間。0 になった瞬間がちょうど終わり
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        // 終わったらチャイムを鳴らして、止めずに次のモードへ（集中→休憩→集中…とループ）
        onFinishRef.current(mode)
        const next: Mode = mode === 'focus' ? 'break' : 'focus'
        const nextSec = (next === 'focus' ? focusMin : breakMin) * 60
        endAt.current = Date.now() + nextSec * 1000
        setMode(next)
        setRemaining(nextSec)
      }
    }, 250)
    return () => clearInterval(id)
  }, [running, mode, focusMin, breakMin])

  const start = () => {
    endAt.current = Date.now() + remaining * 1000
    setRunning(true)
  }
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setRemaining(total)
  }
  const switchMode = (m: Mode) => {
    setRunning(false)
    setMode(m)
    setRemaining((m === 'focus' ? focusMin : breakMin) * 60)
  }

  return { mode, remaining, total, running, start, pause, reset, switchMode }
}
