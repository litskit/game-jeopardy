import { useState } from 'react'
import { useGameStore } from './store/gameStore'
import HomeScreen from './screens/HomeScreen'
import BoardScreen from './screens/BoardScreen'
import ClueScreen from './screens/ClueScreen'
import EndScreen from './screens/EndScreen'
import EditorScreen from './screens/EditorScreen'

type AppTab = 'game' | 'editor'

function App(): React.JSX.Element {
  const phase = useGameStore((s) => s.phase)
  const [tab, setTab] = useState<AppTab>('game')

  function renderGameContent() {
    if (phase === 'setup') return <HomeScreen />
    if (phase === 'board') return <BoardScreen />
    if (phase === 'clue' || phase === 'buzzed') return <ClueScreen />
    if (phase === 'reveal') return <ClueScreen />
    if (phase === 'end') return <EndScreen />
    return <HomeScreen />
  }

  return (
    <div className="flex flex-col h-full w-full" style={{ background: '#0f0f1a' }}>
      {/* Top nav — only show tabs when not in active game */}
      {(phase === 'setup' || phase === 'end') && (
        <nav className="flex" style={{ borderBottom: '2px solid #2d2d4a' }}>
          <button
            onClick={() => setTab('game')}
            className="px-6 py-2 text-sm uppercase tracking-widest font-bold transition-colors"
            style={{
              color: tab === 'game' ? '#ffcc00' : '#94a3b8',
              borderBottom: tab === 'game' ? '2px solid #ffcc00' : '2px solid transparent',
              marginBottom: -2
            }}
          >
            Play
          </button>
          <button
            onClick={() => setTab('editor')}
            className="px-6 py-2 text-sm uppercase tracking-widest font-bold transition-colors"
            style={{
              color: tab === 'editor' ? '#ffcc00' : '#94a3b8',
              borderBottom: tab === 'editor' ? '2px solid #ffcc00' : '2px solid transparent',
              marginBottom: -2
            }}
          >
            Editor
          </button>
        </nav>
      )}

      <div className="flex-1 overflow-hidden">
        {tab === 'editor' && (phase === 'setup' || phase === 'end') ? (
          <EditorScreen onUseGame={() => setTab('game')} />
        ) : (
          renderGameContent()
        )}
      </div>
    </div>
  )
}

export default App

