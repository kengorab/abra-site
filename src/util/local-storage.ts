interface Settings {
  vimModeEnabled: boolean
}

const STORAGE_KEY = 'abra-site/settings'

export function getSettings(): Settings {
  const settings = localStorage.getItem(STORAGE_KEY)
  if (!settings) {
    return {
      vimModeEnabled: false
    }
  }
  return JSON.parse(settings)
}

export function saveSettings(update: Partial<Settings>) {
  const settings = getSettings() || {}
  const newSettings = { ...settings, ...update }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
}
