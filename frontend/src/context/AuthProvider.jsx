import { AuthContext } from './AuthContext.js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api/client.js'

async function fetchMe() {
  try {
    const { data } = await api.get('/auth/me')
    return data.user
  } catch (error) {
    if (error.response?.status === 401) return null
    throw error
  }
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: Infinity,
    retry: false,
  })

   async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    queryClient.setQueryData(['me'], data.user)
    return data.user
  }

  async function logout() {
    await api.post('/auth/logout')
    queryClient.clear()
    queryClient.setQueryData(['me'], null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
