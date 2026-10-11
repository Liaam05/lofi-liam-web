// YouTube IFrame Player API（公式の操作用API）。音量をタイマーと連動させるために使う。
// https://developers.google.com/youtube/iframe_api_reference

export type YTPlayer = {
  getVolume(): number
  setVolume(v: number): void
  loadVideoById(id: string): void
  destroy(): void
}

type YTNamespace = {
  Player: new (el: HTMLElement, options: Record<string, unknown>) => YTPlayer
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YTNamespace> | null = null

/** API のスクリプトを1回だけ読み込む */
export function loadYouTubeApi(): Promise<YTNamespace> {
  apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT)
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!)
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return apiPromise
}

// ---- 音楽の音量をタイマーから操作する ----
// フェードアウト前の音量を覚えておき、フェードインでそこへ戻す（ユーザーがプレイヤーで決めた音量を尊重）。

let player: YTPlayer | null = null
let savedVolume: number | null = null
let fadeTimer: ReturnType<typeof setInterval> | undefined

function fadeTo(target: number, ms: number, done?: () => void) {
  if (!player) return
  clearInterval(fadeTimer)
  const p = player
  const from = p.getVolume()
  const steps = Math.max(1, Math.round(ms / 50))
  let i = 0
  fadeTimer = setInterval(() => {
    i++
    p.setVolume(Math.round(from + ((target - from) * i) / steps))
    if (i >= steps) {
      clearInterval(fadeTimer)
      done?.()
    }
  }, 50)
}

export const music = {
  attach(p: YTPlayer) {
    player = p
  },
  detach() {
    clearInterval(fadeTimer)
    if (player && savedVolume !== null) player.setVolume(savedVolume)
    player = null
    savedVolume = null
  },
  fadeOut(ms = 1500) {
    if (!player || savedVolume !== null) return // すでにフェード済み
    savedVolume = player.getVolume()
    fadeTo(0, ms)
  },
  fadeIn(ms = 2000) {
    if (!player || savedVolume === null) return
    const v = savedVolume
    fadeTo(v, ms, () => {
      savedVolume = null
    })
  },
}
