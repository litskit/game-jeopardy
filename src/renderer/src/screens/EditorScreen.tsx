import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { saveGameFile } from '../utils/platform'
import type { GameFile, Category, Clue } from '../types/game'

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

function emptyClue(value: number): Clue {
  return { id: makeId(), value, question: '', answer: '', isUsed: false }
}

function emptyCategory(): Category {
  return {
    id: makeId(),
    name: '',
    clues: [200, 400, 600, 800, 1000].map(emptyClue)
  }
}

function emptyGame(): GameFile {
  return {
    id: makeId(),
    title: 'My Jeopardy Game',
    categories: Array.from({ length: 5 }, emptyCategory)
  }
}

export default function EditorScreen({ onUseGame }: { onUseGame: () => void }) {
  const existingFile = useGameStore((s) => s.gameFile)
  const setGameFile = useGameStore((s) => s.setGameFile)

  const [game, setGame] = useState<GameFile>(existingFile ?? emptyGame())
  const [saved, setSaved] = useState(false)

  function updateTitle(title: string) {
    setGame((g) => ({ ...g, title }))
  }

  function updateCategoryName(catIdx: number, name: string) {
    setGame((g) => ({
      ...g,
      categories: g.categories.map((c, i) => (i === catIdx ? { ...c, name } : c))
    }))
  }

  function updateClueField(catIdx: number, clueIdx: number, field: 'question' | 'answer', value: string) {
    setGame((g) => ({
      ...g,
      categories: g.categories.map((c, ci) =>
        ci === catIdx
          ? {
              ...c,
              clues: c.clues.map((cl, qi) => (qi === clueIdx ? { ...cl, [field]: value } : cl))
            }
          : c
      )
    }))
  }

  function addCategory() {
    setGame((g) => ({ ...g, categories: [...g.categories, emptyCategory()] }))
  }

  function removeCategory(catIdx: number) {
    setGame((g) => ({ ...g, categories: g.categories.filter((_, i) => i !== catIdx) }))
  }

  async function handleSave() {
    setGameFile(game)
    await saveGameFile(game)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleUseGame() {
    setGameFile(game)
    onUseGame()
  }

  return (
    <div
      className="flex flex-col h-full w-full overflow-auto p-4 gap-4"
      style={{ background: '#0f0f1a', color: '#e2e8f0' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2
            className="text-2xl font-bold uppercase tracking-widest"
            style={{ color: '#ffcc00', fontFamily: 'Anton, Impact, sans-serif' }}
          >
            Game Editor
          </h2>
          <input
            value={game.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="border-2 text-white rounded px-3 py-1 focus:outline-none text-sm"
            style={{ background: '#1a1a2e', borderColor: '#2d2d4a' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#a855f7')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#2d2d4a')}
            placeholder="Game title"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={addCategory}
            disabled={game.categories.length >= 6}
            className="px-4 py-2 border-2 rounded text-sm uppercase tracking-wide hover:border-yellow-400 hover:text-yellow-400 transition-colors disabled:opacity-40"
            style={{ borderColor: '#2d2d4a', color: '#94a3b8' }}
          >
            + Category
          </button>
          <button
            onClick={handleUseGame}
            className="px-4 py-2 border-2 border-green-400 text-green-400 rounded text-sm uppercase tracking-wide hover:bg-green-400 hover:text-gray-900 transition-colors"
          >
            Use This Game
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded text-sm uppercase tracking-wide font-bold transition-colors"
            style={{ background: saved ? '#22c55e' : '#ffcc00', color: '#0f0f1a' }}
          >
            {saved ? '✓ Saved!' : 'Save JSON'}
          </button>
        </div>
      </div>

      {/* Category columns */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ minHeight: 0 }}>
        {game.categories.map((cat, catIdx) => (
          <div
            key={cat.id}
            className="flex flex-col gap-2 flex-shrink-0"
            style={{ width: 220 }}
          >
            {/* Category name */}
            <div className="flex items-center gap-1">
              <input
                value={cat.name}
                onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                className="flex-1 border-2 border-yellow-400 text-white text-center rounded px-2 py-1 text-xs uppercase font-bold focus:outline-none tracking-wider"
                style={{ background: '#1a1a2e' }}
                placeholder="CATEGORY NAME"
                maxLength={24}
              />
              {game.categories.length > 1 && (
                <button
                  onClick={() => removeCategory(catIdx)}
                  className="text-red-400 hover:text-red-300 text-xs px-1"
                  title="Remove category"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Clue rows */}
            {cat.clues.map((clue, clueIdx) => (
              <div
                key={clue.id}
                className="flex flex-col gap-1 rounded p-2"
                style={{ background: '#12121f', border: '1px solid #2d2d4a' }}
              >
                <div
                  className="text-center text-xs font-bold"
                  style={{ color: '#ffcc00', fontFamily: 'Anton, Impact, sans-serif' }}
                >
                  ${clue.value}
                </div>
                <textarea
                  value={clue.question}
                  onChange={(e) => updateClueField(catIdx, clueIdx, 'question', e.target.value)}
                  className="border text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-yellow-400 resize-none"
                  style={{ background: '#0d0d18', borderColor: '#2d2d4a' }}
                  placeholder="Clue (shown to players)"
                  rows={2}
                />
                <textarea
                  value={clue.answer}
                  onChange={(e) => updateClueField(catIdx, clueIdx, 'answer', e.target.value)}
                  className="border text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-green-400 resize-none"
                  style={{ background: '#0d0d18', borderColor: '#2d2d4a' }}
                  placeholder="Answer (e.g. What is...?)"
                  rows={2}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
