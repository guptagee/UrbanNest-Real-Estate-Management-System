import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiHome } from 'react-icons/fi'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="min-h-screen bg-grey-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-2xl shadow-strong mb-4 group hover:scale-105 transition-transform duration-300">
            <FiHome className="w-10 h-10 text-white" />
          </div>
          <Link to="/" className="text-3xl font-bold text-black font-display hover:text-grey-800 transition-colors">
            Urbannest
          </Link>
          <p className="text-grey-600 mt-2">Your gateway to dream properties</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-grey-200 rounded-3xl p-8 shadow-strong hover:shadow-intense transition-all duration-300 animate-scale-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-grey-900 mb-2 font-display">
              Welcome Back
            </h1>
            <p className="text-grey-600">
              Sign in to access your account and continue your property journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-grey-700 mb-2">
                <FiMail className="inline mr-1" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-grey-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-grey-700 mb-2">
                <FiLock className="inline mr-1" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-grey-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-grey-400 hover:text-grey-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-grey-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-grey-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-semibold text-black hover:text-grey-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-grey-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-grey-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-black hover:text-grey-700 transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
