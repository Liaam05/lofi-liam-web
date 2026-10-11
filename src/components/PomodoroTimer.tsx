import { useEffect } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'
import { type Mode, useTimer } from '../hooks/useTimer'
import { playChime, playTick } from '../lib/audio'
import { music } from '../lib/youtube'

const LABEL: Record<Mode, string> = { focus: '集中', break: '休憩' }

export function PomodoroTimer() {
  const [focusMin, setFocusMin] = usePersistentState('focusMin', 25)
  const [breakMin, setBreakMin] = usePersistentState('breakMin', 5)
  const timer = useTimer({ focusMin, breakMin, onFinish: () => playChime() })
  const time = formatTime(timer.remaining)

  // タブのタイトルに残り時間を出す（別タブで作業中でも見える）
  useEffect(() => {
    document.title = timer.running ? `${time} ${LABEL[timer.mode]} · Lofi Liam` : 'Lofi Liam'
  }, [time, timer.running, timer.mode])

  // 終わり際の演出: 残り10秒から音楽をゆっくり下げ、残り3秒で無音に → 3・2・1 でピッ → 0 でチャイム（onFinish）
  // 次のモードが始まったら（残りが10秒より多くなったら）音楽を戻す。止めたときも戻す
  const { remaining } = timer
  useEffect(() => {
    if (!timer.running || remaining > 10) {
      music.fadeIn()
      return
    }
    // 途中から再開した場合も「残り3秒で無音」に合うよう、フェードの長さは残り時間から決める
    music.fadeOut(Math.max(0, remaining - 3) * 1000)
    if (remaining >= 1 && remaining <= 3) playTick()
  }, [remaining, timer.running])

  // スペースキーでスタート／一時停止（入力欄やボタンにフォーカスがあるときは何もしない）
  const { running, start, pause } = timer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || (e.target as HTMLElement).closest('input, button, textarea, summary, iframe')) return
      e.preventDefault()
      if (running) pause()
      else start()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running, start, pause])

  return (
    <section className="timer panel">
      <div className="mode-tabs" role="tablist">
        {(['focus', 'break'] as const).map((m) => (
          <button key={m} role="tab" aria-selected={timer.mode === m} onClick={() => timer.switchMode(m)}>
            {LABEL[m]}
          </button>
        ))}
      </div>
      <div className="time" aria-live="off">{time}</div>
      <div className="controls">
        {timer.running ? (
          <button className="primary" onClick={timer.pause}>一時停止</button>
        ) : (
          <button className="primary" onClick={timer.start}>スタート</button>
        )}
        <button onClick={timer.reset}>リセット</button>
      </div>
      <details className="settings">
        <summary>時間の設定</summary>
        <label>
          集中 <MinutesInput value={focusMin} onChange={setFocusMin} /> 分
        </label>
        <label>
          休憩 <MinutesInput value={breakMin} onChange={setBreakMin} /> 分
        </label>
      </details>
    </section>
  )
}

function MinutesInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      min={1}
      max={120}
      value={value}
      onChange={(e) => {
        const v = Number(e.target.value)
        if (v >= 1 && v <= 120) onChange(v)
      }}
    />
  )
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
