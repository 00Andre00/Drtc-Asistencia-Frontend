export interface User {
  id: string
  username: string
  nombre: string
  role: string
}

export interface LoginResponse {
  user: User
  token: string
}