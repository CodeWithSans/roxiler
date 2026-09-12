import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export function getErrorMessage(error) {
  return error.response?.data?.error ?? 'Something went wrong'
}

export default api
