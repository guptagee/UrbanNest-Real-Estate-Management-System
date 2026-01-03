import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
    
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
              Create an account
            </h1>
            <p className="text-sm text-[#6B6B6B]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#0E0E0E] hover:opacity-70 transition-opacity font-normal underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-[#0E0E0E] bg-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0E0E0E] focus:ring-0 transition-colors text-sm"
                placeholder="John Doe"
              />
            </div>

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
              <label htmlFor="phone" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                Phone <span className="text-[#6B6B6B] font-normal">(Optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-[#0E0E0E] bg-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0E0E0E] focus:ring-0 transition-colors text-sm"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-[#0E0E0E] bg-white focus:outline-none focus:border-[#0E0E0E] focus:ring-0 transition-colors text-sm"
              >
                <option value="user">Buyer/User</option>
                <option value="agent">Real Estate Agent</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-[#0E0E0E] bg-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0E0E0E] focus:ring-0 transition-colors text-sm"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-[#0E0E0E] bg-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0E0E0E] focus:ring-0 transition-colors text-sm"
                placeholder="Confirm your password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0E0E0E] text-white px-4 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
