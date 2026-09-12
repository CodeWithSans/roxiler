import { getDashboardStats } from '../services/admin.service.js'

export async function dashboard(req, res) {
  const stats = await getDashboardStats()
  res.json({ stats })
}
