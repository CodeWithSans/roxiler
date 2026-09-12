import { listStores, rateStore } from '../services/store.service.js'
import { storeQuerySchema, idSchema } from '../utils/validators.js'
import AppError from '../utils/AppError.js'

export async function getStores(req, res) {
  const query = storeQuerySchema.parse(req.query)
  const stores = await listStores(req.user.id, query)
  res.json({ stores })
}

export async function submitRating(req, res) {
  if (!idSchema.safeParse(req.params.id).success) {
    throw new AppError(400, 'Invalid store id')
  }

  const saved = await rateStore(req.user.id, req.params.id, req.body.rating)
  res.json({ rating: saved })
}
