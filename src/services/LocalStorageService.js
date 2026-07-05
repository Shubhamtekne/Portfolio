const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const LocalStorageService = {
  get(key, defaultValue = null) {
    if (!isBrowser) return defaultValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? defaultValue : raw
    } catch {
      return defaultValue
    }
  },

  set(key, value) {
    if (!isBrowser) return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // ignore storage errors
    }
  },

  remove(key) {
    if (!isBrowser) return
    try {
      window.localStorage.removeItem(key)
    } catch {
      // ignore storage errors
    }
  },

  getJson(key, defaultValue = null) {
    const raw = this.get(key)
    if (raw === null) return defaultValue
    try {
      return JSON.parse(raw)
    } catch {
      return defaultValue
    }
  },

  setJson(key, value) {
    this.set(key, JSON.stringify(value))
  },
}

export default LocalStorageService
