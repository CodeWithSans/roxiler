import { listStores } from '../services/store.service.js'
import { storeQuerySchema } from '../utils/validators.js'

export async function getStores(req, res) {
  const query = storeQuerySchema.parse(req.query)
  const stores = await listStores(req.user.id, query)
  res.json({ stores })
}
