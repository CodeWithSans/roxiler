import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import api, { getErrorMessage } from '../api/client.js'
import { useAuth } from '../hooks/useAuth.js'
import { signupSchema } from '../utils/validators.js'
import { HOME_BY_ROLE } from '../utils/constants.js'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'

export default function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      await api.post('/auth/register', values)
      const user = await login(values.email, values.password)
      navigate(HOME_BY_ROLE[user.role], { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <AuthCard title="Create account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{serverError}</p>}

        <FormField label="Full name" error={errors.name} {...register('name')} />
        <FormField label="Email" type="email" error={errors.email} {...register('email')} />
        <FormField label="Address" rows={3} error={errors.address} {...register('address')} />
        <FormField label="Password" type="password" error={errors.password} {...register('password')} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 underline">Log in</Link>
        </p>
      </form>
    </AuthCard>
  )
}
