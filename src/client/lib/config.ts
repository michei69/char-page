const isDev = import.meta.env['VITE_DEV'] === 'true'

export const API_BASE_URL = isDev ? 'http://localhost:3111' : ''