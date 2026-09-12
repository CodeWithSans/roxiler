import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { loginSchema } from '../utils/validators.js'
import { HOME_BY_ROLE } from '../utils/constants.js'
import { getErrorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import { Button } from '../components/Button.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      const user = await login(values.email, values.password)
      navigate(HOME_BY_ROLE[user.role], { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <AuthCard title="Sign in" subtitle="Welcome back. Enter your details to continue.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <Alert>{serverError}</Alert>}

        <FormField label="Email" type="email" error={errors.email} {...register('email')} />
        <FormField label="Password" type="password" error={errors.password} {...register('password')} />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="text-center text-sm text-muted">
          No account?{' '}
          <Link to="/signup" className="font-medium text-ink underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
