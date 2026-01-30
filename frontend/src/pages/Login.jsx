import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa'

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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">
              Simplify your workflow and boost your productivity with{' '}
              <span className="font-semibold text-gray-900">UrbanNest</span>. Get started for free.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-scale-in">
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Username"
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:border-gray-900 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full px-6 py-3.5 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-gray-900 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-gray-900 hover:text-gray-700 transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 px-6 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

            {/* Divider
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div> */}

            {/* Social Login Buttons */}
            {/* <div className="flex gap-4 justify-center">
              <button
                type="button"
                className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              >
                <FaGoogle className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              >
                <FaApple className="w-6 h-6" />
              </button>
              <button
                type="button"
                className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              >
                <FaFacebook className="w-5 h-5" />
              </button>
            </div> */}

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Not a member?{' '}
                <Link to="/register" className="font-semibold text-gray-900 hover:text-gray-700 transition-colors underline underline-offset-2">
                  Register now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-green-100 items-center justify-center p-12">
        <div className="max-w-lg text-center animate-fade-in">
          <img
            src="/login-illustration.png"
            alt="Productivity illustration"
            className="w-full max-w-md mx-auto mb-8 drop-shadow-2xl"
          />
          <div className="space-y-2">

            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              Simplify your real estate workflow
            </h2>
            <p className="text-gray-700">
              with <span className="font-bold">UrbanNest</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
