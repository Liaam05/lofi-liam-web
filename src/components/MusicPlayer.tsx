import { useEffect, useRef, useState } from 'react'
import type { Scene } from '../data/scenes'
import { loadYouTubeApi, music, type YTPlayer } from '../lib/youtube'

// 音楽 = 今の情景の本編を YouTube 埋め込みで再生する（曲選びは上の ◀ ▶ と共通）。
// YouTube の規約: プレイヤーは見えている必要があり（最小 200x200px）、上に何かを重ねて塞ぐのも不可。
// → 何も重ねない小さなプレイヤーを右下に常に置く。
// 公式の IFrame Player API で作るので、タイマー側から音量を操作できる（lib/youtube.ts の music）。
export function MusicPlayer({ scene }: { scene: Scene }) {
  // 本編がまだ無い情景に切り替えたときは、直前の曲をそのまま出しておく
  const [last, setLast] = useState<Scene | null>(scene.youtubeId ? scene : null)
  if (scene.youtubeId && scene.id !== last?.id) setLast(scene) // 描画中に前回の値を更新する React の定石
  const videoId = (scene.youtubeId ? scene : last)?.youtubeId ?? null

  const wrapRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const loadedId = useRef<string | null>(null)
  const hasVideo = videoId !== null

  // プレイヤーを作る（最初の1回）。開いた直後は自動再生しない
  useEffect(() => {
    const wrap = wrapRef.current
    if (!hasVideo || !wrap) return
    let cancelled = false
    // YT.Player は渡した要素を iframe に置き換えるので、React が管理しない子要素を作って渡す
    const el = document.createElement('div')
    wrap.appendChild(el)
    const initialId = videoId
    void loadYouTubeApi().then((YT) => {
      if (cancelled) return
      loadedId.current = initialId
      const p = new YT.Player(el, {
        host: 'https://www.youtube-nocookie.com',
        videoId: initialId,
        width: '100%',
        height: '100%',
        playerVars: { rel: 0, playsinline: 1 },
        events: {
          onReady: () => {
            playerRef.current = p
            music.attach(p)
          },
        },
      })
    })
    return () => {
      cancelled = true
      music.detach()
      playerRef.current?.destroy()
      playerRef.current = null
      wrap.replaceChildren()
    }
    // videoId はここでは初期値だけ使い、以降の切り替えは下の effect で行う
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo])

  // 情景を切り替えたら、その曲を読み込んで再生する
  useEffect(() => {
    if (!videoId || videoId === loadedId.current || !playerRef.current) return
    loadedId.current = videoId
    playerRef.current.loadVideoById(videoId)
  }, [videoId])

  if (!hasVideo) return null
  return <div ref={wrapRef} className="player" />
}
