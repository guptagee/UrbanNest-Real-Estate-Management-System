import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <Link to="/" className="text-xl font-medium text-[#0E0E0E] tracking-tight">
            Urbannest
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E6E6E6] rounded-xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-[#0E0E0E] mb-2">
              Sign in
            </h1>
            <p className="text-sm text-[#6B6B6B]">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-[#0E0E0E] hover:opacity-70 transition-opacity font-normal underline underline-offset-2"
              >
                Create an account
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-[#0E0E0E] bg-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0E0E0E] focus:ring-0 transition-colors text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-[#0E0E0E] bg-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0E0E0E] focus:ring-0 transition-colors text-sm"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0E0E0E] text-white px-4 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
