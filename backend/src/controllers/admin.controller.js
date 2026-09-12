import {
  getDashboardStats, listUsers, getUserDetails, listAllStores, createStore,
} from '../services/admin.service.js'
import { registerUser } from '../services/auth.service.js'
import { userQuerySchema, storeAdminQuerySchema, idSchema } from '../utils/validators.js'
import AppError from '../utils/AppError.js'

export async function dashboard(req, res) {
  const stats = await getDashboardStats()
  res.json({ stats })
}

export async function getUsers(req, res) {
  const query = userQuerySchema.parse(req.query)
  const users = await listUsers(query)
  res.json({ users })
}

export async function createUser(req, res) {
  const user = await registerUser(req.body, req.body.role)
  res.status(201).json({ user })
}

export async function getUser(req, res) {
  if (!idSchema.safeParse(req.params.id).success) {
    throw new AppError(400, 'Invalid user id')
  }
  const user = await getUserDetails(req.params.id)
  res.json({ user })
}

export async function getStores(req, res) {
  const query = storeAdminQuerySchema.parse(req.query)
  const stores = await listAllStores(query)
  res.json({ stores })
}

export async function addStore(req, res) {
  const store = await createStore(req.body)
  res.status(201).json({ store })
}
