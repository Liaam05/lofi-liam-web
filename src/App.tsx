import { Header } from './components/Header'
import { MusicPlayer } from './components/MusicPlayer'
import { PomodoroTimer } from './components/PomodoroTimer'
import { SceneBackground } from './components/SceneBackground'
import { scenes } from './data/scenes'
import { usePersistentState } from './hooks/usePersistentState'

export default function App() {
  const [sceneId, setSceneId] = usePersistentState('scene', scenes[0].id)
  // 保存されていた id が一覧から消えていたら先頭に戻す
  const scene = scenes.find((s) => s.id === sceneId) ?? scenes[0]

  return (
    <>
      <SceneBackground scene={scene} />
      <div className="layout">
        <Header scene={scene} onChange={setSceneId} />
        <main className="center">
          <PomodoroTimer />
        </main>
        <footer className="bottom">
          <MusicPlayer scene={scene} />
        </footer>
      </div>
    </>
  )
}
