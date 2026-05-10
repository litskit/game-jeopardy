import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { loadGameFile } from '../utils/platform'
import type { GameFile } from '../types/game'

// Bundled sample games
import classicGame from '../../../../resources/sample-game.json'
import scienceGame from '../../../../resources/games/science-and-nature.json'
import historyGame from '../../../../resources/games/world-history.json'
import popCultureGame from '../../../../resources/games/pop-culture.json'
import geoGame from '../../../../resources/games/around-the-world.json'
import foodGame from '../../../../resources/games/food-and-drink.json'
import sportsGame from '../../../../resources/games/sports-and-athletes.json'

const SAMPLE_GAMES: GameFile[] = [
  classicGame as GameFile,
  scienceGame as GameFile,
  historyGame as GameFile,
  popCultureGame as GameFile,
  geoGame as GameFile,
  foodGame as GameFile,
  sportsGame as GameFile,
]

const BUZZ_KEYS = ['Q', 'W', 'E']

const C = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceHover: '#22223b',
  border: '#2d2d4a',
  accent: '#7c3aed',
  accentHover: '#6d28d9',
  accentLight: '#a855f7',
  gold: '#ffcc00',
  goldDark: '#b89400',
  text: '#e2e8f0',
  muted: '#94a3b8',
}

export default function HomeScreen() {
  const { gameFile, players, playerCount, setGameFile, setPlayerName, setPlayerCount, startGame } =
    useGameStore()
  const [loading, setLoading] = useState(false)

  async function handleLoad() {
    setLoading(true)
    const file = await loadGameFile()
    if (file) setGameFile(file)
    setLoading(false)
  }

  const canStart = gameFile !== null && players.slice(0, playerCount).every((p) => p.name.trim())

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full gap-6 p-6 overflow-auto"
      style={{ background: C.bg, color: C.text }}
    >
      {/* Title */}
      <h1
        className="text-6xl font-bold tracking-widest uppercase"
        style={{ color: C.gold, fontFamily: 'Anton, Impact, sans-serif', textShadow: '2px 2px 0 #000' }}
      >
        Jeopardy!
      </h1>

      {/* Game picker */}
      <div className="w-full max-w-3xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest" style={{ color: C.muted }}>
            Choose a Game
          </span>
          <button
            onClick={handleLoad}
            disabled={loading}
            className="text-xs uppercase tracking-wider px-3 py-1 rounded border transition-colors disabled:opacity-50"
            style={{ borderColor: C.accentLight, color: C.accentLight }}
          >
            {loading ? 'Loading…' : '+ Load JSON File'}
          </button>
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {SAMPLE_GAMES.map((game) => {
            const isSelected = gameFile?.id === game.id
            return (
              <button
                key={game.id}
                onClick={() => setGameFile(game)}
                className="flex flex-col items-start px-4 py-3 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? C.accent : C.surface,
                  border: `2px solid ${isSelected ? C.accentLight : C.border}`,
                  color: isSelected ? '#fff' : C.text,
                  boxShadow: isSelected ? `0 0 0 3px ${C.accent}44` : 'none',
                }}
              >
                <span
                  className="font-bold text-sm uppercase tracking-wide"
                  style={{ color: isSelected ? C.gold : C.gold }}
                >
                  {game.title}
                </span>
                <span className="text-xs mt-1" style={{ color: isSelected ? '#ddd' : C.muted }}>
                  {game.categories.length} categories
                </span>
              </button>
            )
          })}

          {/* Custom loaded game (if not in list) */}
          {gameFile && !SAMPLE_GAMES.find((g) => g.id === gameFile.id) && (
            <button
              className="flex flex-col items-start px-4 py-3 rounded-lg text-left"
              style={{
                background: C.accent,
                border: `2px solid ${C.accentLight}`,
                boxShadow: `0 0 0 3px ${C.accent}44`,
              }}
            >
              <span className="font-bold text-sm uppercase tracking-wide" style={{ color: C.gold }}>
                {gameFile.title}
              </span>
              <span className="text-xs mt-1" style={{ color: '#ddd' }}>
                Custom · {gameFile.categories.length} categories
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Players section */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest" style={{ color: C.muted }}>
            Players
          </span>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPlayerCount(n)}
                className="w-9 h-9 rounded font-bold text-base border-2 transition-colors"
                style={{
                  background: playerCount === n ? C.accent : 'transparent',
                  borderColor: playerCount === n ? C.accentLight : C.border,
                  color: playerCount === n ? '#fff' : C.muted,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {players.slice(0, playerCount).map((player) => (
            <div key={player.id} className="flex flex-col items-center gap-1">
              <input
                type="text"
                value={player.name}
                maxLength={16}
                onChange={(e) => setPlayerName(player.id, e.target.value)}
                className="text-center rounded px-3 py-2 w-36 focus:outline-none font-bold text-sm"
                placeholder={`Player ${player.id}`}
                style={{
                  background: C.surface,
                  border: `2px solid ${C.border}`,
                  color: '#fff',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.accentLight)}
                onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
              />
              <span className="text-xs uppercase tracking-wider" style={{ color: C.muted }}>
                Buzz:{' '}
                <span className="font-bold" style={{ color: C.gold }}>
                  {BUZZ_KEYS[player.id - 1]}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={startGame}
        disabled={!canStart}
        className="px-12 py-4 text-xl font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: canStart ? C.gold : '#333',
          color: C.bg,
          boxShadow: canStart ? `0 4px 0 ${C.goldDark}` : 'none',
        }}
      >
        Start Game
      </button>
    </div>
  )
}

