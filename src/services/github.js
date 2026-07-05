/**
 * GitHub API service with caching and rate-limit handling.
 */
const GITHUB_API = 'https://api.github.com'
const USERNAME = 'Shubhamtekne'
const CACHE_PREFIX = 'gh-cache-'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

function getCache(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // Storage full — ignore
  }
}

async function fetchWithFallback(url, fallback = null) {
  const cacheKey = url
  const cached = getCache(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) {
      if (res.status === 403) {
        console.warn('GitHub API rate limited — using cached/fallback data')
        return fallback
      }
      if (res.status === 404) return fallback
      throw new Error(`GitHub API error: ${res.status}`)
    }
    const data = await res.json()
    setCache(cacheKey, data)
    return data
  } catch (err) {
    console.warn('GitHub API fetch failed:', err.message)
    return fallback
  }
}

export async function fetchRepos() {
  const data = await fetchWithFallback(
    `${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=10`,
    [],
  )
  return Array.isArray(data) ? data : []
}

export async function fetchProfile() {
  return fetchWithFallback(`${GITHUB_API}/users/${USERNAME}`, {
    login: USERNAME,
    public_repos: 0,
    followers: 0,
    following: 0,
    avatar_url: '',
  })
}

// Contribution data is not available via unauthenticated API.
// We simulate with a simple array for the UI skeleton.
export function getContributionFallback() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10),
    })
  }
  return days
}
