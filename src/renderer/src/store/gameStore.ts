import { create } from 'zustand'
import type { GameFile, GamePhase, Player, ActiveClue } from '../types/game'

const DEFAULT_PLAYERS: Player[] = [
  { id: 1, name: 'Player 1', score: 0, buzzKey: 'q' },
  { id: 2, name: 'Player 2', score: 0, buzzKey: 'w' },
  { id: 3, name: 'Player 3', score: 0, buzzKey: 'e' }
]

interface GameState {
  gameFile: GameFile | null
  players: Player[]
  phase: GamePhase
  activeClue: ActiveClue | null
  buzzedPlayerId: number | null
  playerCount: number

  // Actions
  setGameFile: (file: GameFile) => void
  setPlayerName: (id: number, name: string) => void
  setPlayerCount: (count: number) => void
  startGame: () => void
  selectClue: (categoryIndex: number, clueIndex: number) => void
  buzz: (playerId: number) => void
  judgeCorrect: () => void
  judgeWrong: () => void
  revealAnswer: () => void
  backToBoard: () => void
  endGame: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  gameFile: null,
  players: DEFAULT_PLAYERS,
  phase: 'setup',
  activeClue: null,
  buzzedPlayerId: null,
  playerCount: 2,

  setGameFile: (file) => set({ gameFile: file }),

  setPlayerName: (id, name) =>
    set((s) => ({
      players: s.players.map((p) => (p.id === id ? { ...p, name } : p))
    })),

  setPlayerCount: (count) => set({ playerCount: count }),

  startGame: () => {
    const { gameFile } = get()
    if (!gameFile) return
    // Reset clue used flags
    const file: GameFile = {
      ...gameFile,
      categories: gameFile.categories.map((cat) => ({
        ...cat,
        clues: cat.clues.map((clue) => ({ ...clue, isUsed: false }))
      }))
    }
    set({
      gameFile: file,
      phase: 'board',
      activeClue: null,
      buzzedPlayerId: null,
      players: get().players.map((p) => ({ ...p, score: 0 }))
    })
  },

  selectClue: (categoryIndex, clueIndex) => {
    set({ activeClue: { categoryIndex, clueIndex }, phase: 'clue', buzzedPlayerId: null })
  },

  buzz: (playerId) => {
    if (get().phase !== 'clue') return
    set({ buzzedPlayerId: playerId, phase: 'buzzed' })
  },

  judgeCorrect: () => {
    const { activeClue, gameFile, buzzedPlayerId, players } = get()
    if (!activeClue || !gameFile || buzzedPlayerId === null) return
    const clue = gameFile.categories[activeClue.categoryIndex].clues[activeClue.clueIndex]
    const categories = gameFile.categories.map((cat, ci) =>
      ci === activeClue.categoryIndex
        ? {
            ...cat,
            clues: cat.clues.map((c, qi) =>
              qi === activeClue.clueIndex ? { ...c, isUsed: true } : c
            )
          }
        : cat
    )
    set({
      players: players.map((p) =>
        p.id === buzzedPlayerId ? { ...p, score: p.score + clue.value } : p
      ),
      gameFile: { ...gameFile, categories },
      phase: 'reveal'
    })
  },

  judgeWrong: () => {
    const { activeClue, gameFile, buzzedPlayerId, players } = get()
    if (!activeClue || !gameFile || buzzedPlayerId === null) return
    const clue = gameFile.categories[activeClue.categoryIndex].clues[activeClue.clueIndex]
    set({
      players: players.map((p) =>
        p.id === buzzedPlayerId ? { ...p, score: p.score - clue.value } : p
      ),
      phase: 'clue', // allow another buzz
      buzzedPlayerId: null
    })
  },

  revealAnswer: () => {
    const { activeClue, gameFile } = get()
    if (!activeClue || !gameFile) return
    const categories = gameFile.categories.map((cat, ci) =>
      ci === activeClue.categoryIndex
        ? {
            ...cat,
            clues: cat.clues.map((c, qi) =>
              qi === activeClue.clueIndex ? { ...c, isUsed: true } : c
            )
          }
        : cat
    )
    set({ gameFile: { ...gameFile, categories }, phase: 'reveal' })
  },

  backToBoard: () => {
    const { gameFile } = get()
    if (!gameFile) return
    const allUsed = gameFile.categories.every((cat) => cat.clues.every((c) => c.isUsed))
    set({ phase: allUsed ? 'end' : 'board', activeClue: null, buzzedPlayerId: null })
  },

  endGame: () => set({ phase: 'end' }),

  resetGame: () =>
    set({
      gameFile: null,
      players: DEFAULT_PLAYERS,
      phase: 'setup',
      activeClue: null,
      buzzedPlayerId: null,
      playerCount: 2
    })
}))


