import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiArrowLeft } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    useEffect(() => {
        // Calculate password strength
        const { password } = formData
        let strength = 0

        if (password.length >= 6) strength += 25
        if (password.length >= 8) strength += 25
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
        if (/\d/.test(password)) strength += 25

        setPasswordStrength(strength)
    }, [formData.password])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const response = await api.post(`/auth/reset-password/${token}`, {
                password: formData.password
            })

            if (response.data.success) {
                setSuccess(true)
                toast.success('Password reset successful!')

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    const getStrengthColor = () => {
        if (passwordStrength <= 25) return 'bg-red-500'
        if (passwordStrength <= 50) return 'bg-orange-500'
        if (passwordStrength <= 75) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getStrengthText = () => {
        if (passwordStrength <= 25) return 'Weak'
        if (passwordStrength <= 50) return 'Fair'
        if (passwordStrength <= 75) return 'Good'
        return 'Strong'
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="max-w-md w-full space-y-8">
                    {/* Back to Login */}
                    <Link
                        to="/login"
                        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors font-semibold"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Login
                    </Link>

                    {!success ? (
                        <>
                            {/* Header */}
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                                    Reset Password
                                </h2>
                                <p className="text-gray-600">
                                    Enter your new password below. Make sure it's strong and secure.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                {/* New Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="appearance-none block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-600">Password Strength:</span>
                                                <span className={`text-xs font-semibold ${passwordStrength <= 25 ? 'text-red-600' :
                                                        passwordStrength <= 50 ? 'text-orange-600' :
                                                            passwordStrength <= 75 ? 'text-yellow-600' :
                                                                'text-green-600'
                                                    }`}>
                                                    {getStrengthText()}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                                                    style={{ width: `${passwordStrength}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="appearance-none block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                        >
                                            {showConfirmPassword ? (
                                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li className={formData.password.length >= 6 ? 'text-green-600' : ''}>
                                            ✓ At least 6 characters
                                        </li>
                                        <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                                            ✓ 8+ characters recommended
                                        </li>
                                        <li className={/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                                            ✓ Mix of uppercase and lowercase
                                        </li>
                                        <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                                            ✓ At least one number
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || formData.password !== formData.confirmPassword}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Resetting...
                                        </div>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success Message */}
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                                    <FiCheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Password Reset Successful!
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Your password has been successfully reset. You can now login with your new password.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-blue-800">
                                        Redirecting to login page in 3 seconds...
                                    </p>
                                </div>
                                <Link
                                    to="/login"
                                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 font-semibold transition-colors"
                                >
                                    Go to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-white">
                        <div className="mb-8">
                            <div className="w-32 h-32 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6">
                                <FiLock className="w-16 h-16" />
                            </div>
                            <h3 className="text-4xl font-bold mb-4">Secure Reset</h3>
                            <p className="text-xl text-purple-100 max-w-md mx-auto">
                                Create a strong password to keep your account safe and secure
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
                            <h4 className="font-bold text-lg mb-3">Security Tips</h4>
                            <ul className="text-left text-sm text-purple-100 space-y-2">
                                <li>🔒 Use a unique password for each account</li>
                                <li>🔑 Combine letters, numbers, and symbols</li>
                                <li>📝 Consider using a password manager</li>
                                <li>🚫 Never share your password with anyone</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
