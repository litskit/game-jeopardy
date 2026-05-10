import type { GameFile } from '../types/game'

/** Returns true when running inside Electron */
export const isElectron = (): boolean =>
  typeof window !== 'undefined' && 'electronAPI' in window

/** Load a game file — Electron: native dialog, Web: <input type="file"> */
export async function loadGameFile(): Promise<GameFile | null> {
  if (isElectron()) {
    // @ts-expect-error electronAPI injected by preload
    return window.electronAPI.loadGameFile()
  }
  return loadGameFileWeb()
}

/** Save a game file — Electron: native dialog, Web: download */
export async function saveGameFile(file: GameFile): Promise<void> {
  if (isElectron()) {
    // @ts-expect-error electronAPI injected by preload
    return window.electronAPI.saveGameFile(file)
  }
  saveGameFileWeb(file)
}

function loadGameFileWeb(): Promise<GameFile | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as GameFile
          resolve(data)
        } catch {
          alert('Invalid game file.')
          resolve(null)
        }
      }
      reader.readAsText(file)
    }
    input.oncancel = () => resolve(null)
    input.click()
  })
}

function saveGameFileWeb(file: GameFile): void {
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${file.title.replace(/\s+/g, '-').toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
