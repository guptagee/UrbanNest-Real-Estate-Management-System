import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa'
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Join UrbanNest
            </h1>
            <p className="text-gray-600">
              Create your account and start your property journey today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-scale-in">
            {/* Name Input */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:border-gray-900 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:border-gray-900 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Phone Input */}
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:border-gray-900 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Role Select */}
            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:border-gray-900 transition-all duration-200 text-gray-900 bg-white"
              >
                <option value="user">Buyer/User</option>
                <option value="agent">Real Estate Agent</option>
              </select>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password (min. 6 characters)"
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

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                className="w-full px-6 py-3.5 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-gray-900 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 px-6 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>


            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-gray-900 hover:text-gray-700 transition-colors underline underline-offset-2">
                  Sign in
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
            src="/signup-illustration.png"
            alt="Get started illustration"
            className="w-full max-w-md mx-auto mb-8 drop-shadow-2xl"
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Get Started
            </h2>
            <p className="text-xl text-green-600 font-semibold">
              Join for Free
            </p>
            <p className="text-gray-700 mt-4">
              Discover your dream property with <span className="font-bold">UrbanNest</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
