import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../store/gameStore'

export default function EndScreen() {
  const players = useGameStore(useShallow((s) => s.players.slice(0, s.playerCount)))
  const resetGame = useGameStore((s) => s.resetGame)

  const sorted = [...players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-8 p-8" style={{ background: '#0f0f1a' }}>
      <h1
        className="text-6xl font-bold tracking-widest uppercase"
        style={{ color: '#ffcc00', fontFamily: 'Anton, Impact, sans-serif', textShadow: '3px 3px 0 #000' }}
      >
        Game Over!
      </h1>

      {winner && (
        <div className="text-center">
          <div className="text-sm uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>Winner</div>
          <div
            className="text-4xl font-bold uppercase"
            style={{ color: '#ffcc00', fontFamily: 'Anton, Impact, sans-serif' }}
          >
            {winner.name}
          </div>
          <div className="text-2xl text-white mt-1">${winner.score.toLocaleString()}</div>
        </div>
      )}

      {/* Final scores */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-6 py-3 rounded"
            style={{ background: i === 0 ? '#22223b' : '#1a1a2e', border: `2px solid ${i === 0 ? '#ffcc00' : '#2d2d4a'}` }}
          >
            <span className="font-bold uppercase tracking-wider">
              {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : '🥉 '}
              {p.name}
            </span>
            <span
              className="font-bold text-xl"
              style={{ color: p.score < 0 ? '#ef4444' : '#ffcc00', fontFamily: 'Anton, Impact, sans-serif' }}
            >
              {p.score < 0 ? `-$${Math.abs(p.score)}` : `$${p.score}`}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-10 py-3 rounded font-bold uppercase tracking-widest text-xl mt-4"
        style={{ background: '#ffcc00', color: '#0f0f1a', boxShadow: '0 4px 0 #b89400' }}
      >
        Play Again
      </button>
    </div>
  )
}
