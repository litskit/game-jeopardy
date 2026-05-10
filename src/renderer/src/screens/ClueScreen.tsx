import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../store/gameStore'

export default function ClueScreen() {
  const gameFile = useGameStore((s) => s.gameFile)
  const activeClue = useGameStore((s) => s.activeClue)
  const phase = useGameStore((s) => s.phase)
  const buzzedPlayerId = useGameStore((s) => s.buzzedPlayerId)
  const players = useGameStore(useShallow((s) => s.players.slice(0, s.playerCount)))
  const { buzz, judgeCorrect, judgeWrong, revealAnswer, backToBoard } = useGameStore()

  const clue =
    activeClue && gameFile
      ? gameFile.categories[activeClue.categoryIndex].clues[activeClue.clueIndex]
      : null
  const categoryName =
    activeClue && gameFile ? gameFile.categories[activeClue.categoryIndex].name : ''

  const buzzedPlayer = players.find((p) => p.id === buzzedPlayerId) ?? null

  // Keyboard buzz-in listener
  useEffect(() => {
    if (phase !== 'clue') return
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const player = players.find((p) => p.buzzKey === key)
      if (player) buzz(player.id)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, players, buzz])

  if (!clue) return null

  return (
    <div className="flex flex-col h-full w-full items-center justify-between p-6" style={{ background: '#0f0f1a' }}>
      {/* Category + value */}
      <div className="text-center">
        <div className="uppercase tracking-widest text-sm" style={{ color: '#94a3b8' }}>{categoryName}</div>
        <div className="text-2xl font-bold" style={{ color: '#ffcc00', fontFamily: 'Anton, Impact, sans-serif' }}>
          ${clue.value}
        </div>
      </div>

      {/* Clue text */}
      <div
        className="flex-1 flex items-center justify-center text-center px-8 text-white"
        style={{
          fontFamily: 'Anton, Impact, sans-serif',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          lineHeight: 1.3,
          maxWidth: '80vw'
        }}
      >
        {clue.question}
      </div>

      {/* Answer reveal (only in reveal phase) */}
      {phase === 'reveal' && (
        <div
          className="text-center mb-4 px-6 py-3 rounded"
          style={{ background: '#1a1a2e', border: '2px solid #ffcc00' }}
        >
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#94a3b8' }}>Answer</div>
          <div
            className="font-bold"
            style={{ color: '#ffcc00', fontFamily: 'Anton, Impact, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
          >
            {clue.answer}
          </div>
        </div>
      )}

      {/* Buzz status */}
      <div className="w-full flex flex-col items-center gap-4">
        {phase === 'clue' && (
          <div className="text-sm uppercase tracking-widest animate-pulse" style={{ color: '#94a3b8' }}>
            Waiting for buzz-in… (
            {players.map((p, i) => (
              <span key={p.id}>
                <span className="text-yellow-400 font-bold">{p.buzzKey.toUpperCase()}</span>
                {i < players.length - 1 ? ' / ' : ''}
              </span>
            ))}
            )
          </div>
        )}

        {phase === 'buzzed' && buzzedPlayer && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="text-2xl font-bold uppercase tracking-wider"
              style={{ color: '#ffcc00', fontFamily: 'Anton, Impact, sans-serif' }}
            >
              {buzzedPlayer.name} buzzed in!
            </div>
            <div className="flex gap-4">
              <button
                onClick={judgeCorrect}
                className="px-8 py-3 rounded font-bold uppercase tracking-wide text-lg"
                style={{ background: '#27ae60', color: '#fff', boxShadow: '0 3px 0 #1a7a42' }}
              >
                ✓ Correct
              </button>
              <button
                onClick={judgeWrong}
                className="px-8 py-3 rounded font-bold uppercase tracking-wide text-lg"
                style={{ background: '#c0392b', color: '#fff', boxShadow: '0 3px 0 #8e2218' }}
              >
                ✗ Wrong
              </button>
            </div>
          </div>
        )}

        {/* Host controls */}
        <div className="flex gap-3">
          {phase === 'clue' && (
            <button
              onClick={revealAnswer}
              className="px-6 py-2 rounded text-sm uppercase tracking-wide transition-colors"
              style={{ border: '2px solid #2d2d4a', color: '#94a3b8' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffcc00'; (e.currentTarget as HTMLButtonElement).style.color = '#ffcc00'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2d2d4a'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
            >
              Reveal Answer
            </button>
          )}
          {phase === 'reveal' && (
            <button
              onClick={backToBoard}
              className="px-8 py-3 rounded font-bold uppercase tracking-widest text-lg"
              style={{ background: '#ffcc00', color: '#0f0f1a', boxShadow: '0 3px 0 #b89400' }}
            >
              Back to Board
            </button>
          )}
        </div>

        {/* Score preview */}
        <div className="flex gap-6 mt-2">
          {players.map((p) => (
            <div
              key={p.id}
              className="text-center"
              style={{ opacity: buzzedPlayerId === p.id ? 1 : 0.5 }}
            >
              <div className="text-xs uppercase" style={{ color: '#94a3b8' }}>{p.name}</div>
              <div
                className="font-bold"
                style={{
                  color: p.score < 0 ? '#ef4444' : '#ffcc00',
                  fontFamily: 'Anton, Impact, sans-serif'
                }}
              >
                {p.score < 0 ? `-$${Math.abs(p.score)}` : `$${p.score}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
