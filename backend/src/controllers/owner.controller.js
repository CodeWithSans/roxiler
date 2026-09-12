import { getOwnerDashboard } from '../services/owner.service.js'
import { raterQuerySchema } from '../utils/validators.js'

export async function dashboard(req, res) {
  const query = raterQuerySchema.parse(req.query)
  const data = await getOwnerDashboard(req.user.id, query)
  res.json(data)
}
