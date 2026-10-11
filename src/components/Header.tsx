import { CHANNEL_URL } from '../data/links'
import { type Scene, scenes } from '../data/scenes'

type Props = {
  scene: Scene
  onChange: (id: string) => void
}

export function Header({ scene, onChange }: Props) {
  const index = scenes.findIndex((s) => s.id === scene.id)
  const go = (step: number) => {
    // % で端までいったら反対側に回る（-1 のときも正の数になるよう + length）
    const next = scenes[(index + step + scenes.length) % scenes.length]
    onChange(next.id)
  }

  return (
    <header className="header">
      <h1 className="brand">Lofi Liam</h1>
      <div className="scene-switcher panel">
        <button onClick={() => go(-1)} aria-label="前の情景">◀</button>
        <span className="scene-title">{scene.title}</span>
        <button onClick={() => go(1)} aria-label="次の情景">▶</button>
      </div>
      <nav className="links">
        <a href={CHANNEL_URL} target="_blank" rel="noreferrer">YouTube</a>
      </nav>
    </header>
  )
}
