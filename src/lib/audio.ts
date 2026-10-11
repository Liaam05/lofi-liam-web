// 音まわり（Web Audio API）。タイマーのカウントダウン音と終了チャイム。
// ブラウザはユーザー操作の前に音を鳴らせないので、AudioContext は最初の操作時に resume() する。

let ctx: AudioContext | null = null

export function audioContext(): AudioContext {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

// ---- 終了チャイム（ポーン・ポーンと2音） ----
export function playChime() {
  const ac = audioContext()
  const notes = [880, 660] // A5 → E5
  notes.forEach((freq, i) => {
    const t = ac.currentTime + i * 0.45
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.4, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
    osc.connect(gain).connect(ac.destination)
    osc.start(t)
    osc.stop(t + 1.3)
  })
}

// ---- カウントダウン音（残り 3・2・1 秒で「ピッ」） ----
export function playTick() {
  const ac = audioContext()
  const t = ac.currentTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  // 集中していても気づけるよう、倍音のある三角波で大きめ・少し長めに鳴らす
  osc.type = 'triangle'
  osc.frequency.value = 1046 // C6
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(0.6, t + 0.01)
  gain.gain.setValueAtTime(0.6, t + 0.08)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + 0.32)
}
