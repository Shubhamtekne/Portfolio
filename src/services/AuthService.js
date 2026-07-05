import LocalStorageService from './LocalStorageService'
import { AUTH_CREDENTIALS, AUTH_STORAGE_KEY, AUTH_REMEMBERED_USERNAME_KEY } from '../config/authConfig'

export function validateCredentials(username, password) {
  return username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password
}

export function getStoredAuth() {
  return LocalStorageService.get(AUTH_STORAGE_KEY, 'false') === 'true'
}

export function saveAuth(remember = false, username = '') {
  LocalStorageService.set(AUTH_STORAGE_KEY, 'true')
  if (remember && username) {
    LocalStorageService.set(AUTH_REMEMBERED_USERNAME_KEY, username)
  } else {
    LocalStorageService.remove(AUTH_REMEMBERED_USERNAME_KEY)
  }
}

export function getRememberedUsername() {
  return LocalStorageService.get(AUTH_REMEMBERED_USERNAME_KEY, '')
}

export function clearAuth() {
  LocalStorageService.remove(AUTH_STORAGE_KEY)
  LocalStorageService.remove(AUTH_REMEMBERED_USERNAME_KEY)
}
