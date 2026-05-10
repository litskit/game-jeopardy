import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../store/gameStore'

export default function BoardScreen() {
  const gameFile = useGameStore((s) => s.gameFile)
  const players = useGameStore(useShallow((s) => s.players.slice(0, s.playerCount)))
  const selectClue = useGameStore((s) => s.selectClue)
  const endGame = useGameStore((s) => s.endGame)

  if (!gameFile) return null

  const { categories } = gameFile

  return (
    <div className="flex flex-col h-full w-full" style={{ background: '#0f0f1a' }}>
      {/* Score bar */}
      <div className="flex justify-around px-4 py-2" style={{ borderBottom: '2px solid #2d2d4a' }}>
        {players.map((p) => (
          <div key={p.id} className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-wider" style={{ color: '#94a3b8' }}>{p.name}</span>
            <span
              className="text-2xl font-bold"
              style={{ color: p.score < 0 ? '#ef4444' : '#ffcc00', fontFamily: 'Anton, Impact, sans-serif' }}
            >
              {p.score < 0 ? `-$${Math.abs(p.score)}` : `$${p.score}`}
            </span>
          </div>
        ))}
        <button
          onClick={endGame}
          className="text-xs uppercase tracking-wider self-center transition-colors"
          style={{ color: '#94a3b8' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          End Game
        </button>
      </div>

      {/* Board grid */}
      <div
        className="flex-1 grid gap-1 p-1"
        style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}
      >
        {/* Category headers */}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-center text-center p-2 font-bold uppercase tracking-wide text-sm"
            style={{
              background: '#1a1a2e',
              color: '#e2e8f0',
              fontFamily: 'Anton, Impact, sans-serif',
              fontSize: 'clamp(0.65rem, 1.2vw, 1rem)',
              border: '2px solid #2d2d4a',
              minHeight: '4rem'
            }}
          >
            {cat.name}
          </div>
        ))}

        {/* Clue tiles — render row by row */}
        {Array.from({ length: categories[0].clues.length }, (_, rowIndex) =>
          categories.map((cat) => {
            const clue = cat.clues[rowIndex]
            return (
              <button
                key={clue.id}
                disabled={clue.isUsed}
                onClick={() => {
                  const catIndex = categories.indexOf(cat)
                  selectClue(catIndex, rowIndex)
                }}
                className="flex items-center justify-center font-bold transition-all duration-150"
                style={{
                  background: clue.isUsed ? '#111120' : '#1a1a2e',
                  border: `2px solid ${clue.isUsed ? '#1a1a2e' : '#2d2d4a'}`,
                  color: clue.isUsed ? 'transparent' : '#ffcc00',
                  fontFamily: 'Anton, Impact, sans-serif',
                  fontSize: 'clamp(1rem, 2.5vw, 2rem)',
                  cursor: clue.isUsed ? 'default' : 'pointer',
                  textShadow: clue.isUsed ? 'none' : '1px 1px 0 #000'
                }}
                onMouseEnter={(e) => {
                  if (!clue.isUsed) (e.currentTarget as HTMLButtonElement).style.background = '#7c3aed'
                }}
                onMouseLeave={(e) => {
                  if (!clue.isUsed) (e.currentTarget as HTMLButtonElement).style.background = '#1a1a2e'
                }}
              >
                {clue.isUsed ? '' : `$${clue.value}`}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
