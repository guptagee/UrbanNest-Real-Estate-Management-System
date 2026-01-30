import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            toast.error('Please enter your email address')
            return
        }

        setLoading(true)

        try {
            const response = await api.post('/auth/forgot-password', { email })

            if (response.data.success) {
                setEmailSent(true)
                toast.success('Password reset link sent to your email')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email')
        } finally {
            setLoading(false)
        }
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

                    {!emailSent ? (
                        <>
                            {/* Header */}
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                                    Forgot Password?
                                </h2>
                                <p className="text-gray-600">
                                    No worries! Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="appearance-none block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        'Send Reset Link'
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
                                    Check Your Email
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-blue-800">
                                        <strong>Didn't receive the email?</strong> Check your spam folder or try again with a different email address.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="text-purple-600 hover:text-purple-700 font-semibold"
                                >
                                    Try another email
                                </button>
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
                                <FiMail className="w-16 h-16" />
                            </div>
                            <h3 className="text-4xl font-bold mb-4">Password Recovery</h3>
                            <p className="text-xl text-purple-100 max-w-md mx-auto">
                                Secure and quick password reset process to get you back to finding your dream home
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-12">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold mb-1">1</div>
                                <div className="text-sm text-purple-100">Enter Email</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold mb-1">2</div>
                                <div className="text-sm text-purple-100">Check Inbox</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold mb-1">3</div>
                                <div className="text-sm text-purple-100">Reset Password</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
