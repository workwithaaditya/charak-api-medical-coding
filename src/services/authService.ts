import { mockUsers } from '../lib/mockData'

export interface LoginCredentials {
  username: string
  password: string
}

export class AuthService {
  // Validate login credentials using mock data
  static async validateLogin(credentials: LoginCredentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const user = mockUsers.find(u => u.username === credentials.username)
    
    if (!user) {
      return null
    }

    // Direct password comparison for demo
    if (user.password === credentials.password) {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    }

    return null
  }

  // Find user by username
  static async findUserByUsername(username: string) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockUsers.find(u => u.username === username)
  }
}