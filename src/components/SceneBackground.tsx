import { useEffect, useState } from 'react'
import { type Scene, posterSrc, videoSrc } from '../data/scenes'

// 全画面の背景。OSで「視差効果を減らす」設定なら動画をやめて静止画だけにする。
export function SceneBackground({ scene }: { scene: Scene }) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <div className="scene-bg" aria-hidden="true">
      {reduceMotion ? (
        <img src={posterSrc(scene)} alt="" />
      ) : (
        // key を変えると React が <video> を作り直す → 情景切替で確実に新しい動画を読み込む
        <video key={scene.id} src={videoSrc(scene)} poster={posterSrc(scene)} autoPlay muted loop playsInline />
      )}
    </div>
  )
}

function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduce, setReduce] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setReduce(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return reduce
}
