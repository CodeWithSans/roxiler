import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import api, { getErrorMessage } from '../api/client.js'
import { useAuth } from '../hooks/useAuth.js'
import { signupSchema } from '../utils/validators.js'
import { HOME_BY_ROLE } from '../utils/constants.js'
import Alert from '../components/Alert.jsx'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import { Button } from '../components/Button.jsx'

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
      toast.success('Welcome! Your account is ready')
      navigate(HOME_BY_ROLE[user.role], { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <AuthCard title="Create an account" subtitle="Sign up to rate the stores you visit.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <Alert>{serverError}</Alert>}

        <FormField label="Full name" error={errors.name} {...register('name')} />
        <FormField label="Email" type="email" error={errors.email} {...register('email')} />
        <FormField label="Address" rows={3} error={errors.address} {...register('address')} />
        <FormField label="Password" type="password" error={errors.password} {...register('password')} />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
