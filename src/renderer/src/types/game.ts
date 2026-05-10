export interface Clue {
  id: string
  value: number
  question: string // the clue shown to players (what Jeopardy calls "answer")
  answer: string // what the player must say (what Jeopardy calls "question")
  isUsed: boolean
}

export interface Category {
  id: string
  name: string
  clues: Clue[]
}

export interface GameFile {
  id: string
  title: string
  categories: Category[]
}

export interface Player {
  id: number
  name: string
  score: number
  buzzKey: string // 'q' | 'w' | 'e'
}

export type GamePhase =
  | 'setup'       // home screen
  | 'board'       // viewing the board
  | 'clue'        // clue is displayed, waiting for buzz
  | 'buzzed'      // a player buzzed in, waiting for host judgment
  | 'reveal'      // answer revealed after judgment
  | 'end'         // game over

export interface ActiveClue {
  categoryIndex: number
  clueIndex: number
}
