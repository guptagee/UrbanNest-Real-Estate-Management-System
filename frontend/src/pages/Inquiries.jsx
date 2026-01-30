import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiMessageCircle, FiCheck, FiX, FiClock, FiHome } from 'react-icons/fi'

const Inquiries = () => {
    const { user, isAgent, isAdmin } = useAuth()
    const [inquiries, setInquiries] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        fetchInquiries()
    }, [filter])

    const fetchInquiries = async () => {
        try {
            setLoading(true)
            const params = filter !== 'all' ? `?status=${filter}` : ''
            const response = await api.get(`/inquiries${params}`)
            setInquiries(response.data.data)
        } catch (error) {
            console.error('Error fetching inquiries:', error)
            toast.error('Failed to load inquiries')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (inquiryId, newStatus) => {
        try {
            await api.put(`/inquiries/${inquiryId}`, { status: newStatus })
            toast.success('Inquiry status updated')
            fetchInquiries()
        } catch (error) {
            toast.error('Failed to update inquiry status')
        }
    }

    const handleDelete = async (inquiryId) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return

        try {
            await api.delete(`/inquiries/${inquiryId}`)
            toast.success('Inquiry deleted')
            fetchInquiries()
        } catch (error) {
            toast.error('Failed to delete inquiry')
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-50 text-blue-600'
            case 'contacted':
                return 'bg-amber-50 text-amber-600'
            case 'converted':
                return 'bg-emerald-50 text-emerald-600'
            case 'closed':
                return 'bg-gray-50 text-gray-600'
            default:
                return 'bg-gray-50 text-gray-600'
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Inquiries & Leads</h1>
                    <p className="text-gray-600 text-sm">Manage property inquiries and convert leads</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white border border-gray-200 rounded-xl p-2 flex gap-2 overflow-x-auto">
                    {['all', 'new', 'contacted', 'converted', 'closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${filter === status
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Inquiries List */}
                {inquiries.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <FiMessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-4">No inquiries found</p>
                        <Link
                            to="/properties"
                            className="text-purple-600 hover:text-purple-700 font-semibold"
                        >
                            View Properties →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {inquiries.map((inquiry) => (
                            <div
                                key={inquiry._id}
                                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    {/* Inquiry Details */}
                                    <div className="flex-1">
                                        {/* Property Info */}
                                        <div className="flex items-start gap-4 mb-4">
                                            {inquiry.property?.images?.[0] && (
                                                <img
                                                    src={inquiry.property.images[0]}
                                                    alt={inquiry.property.title}
                                                    className="w-20 h-20 rounded-xl object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <Link
                                                    to={`/properties/${inquiry.property?._id}`}
                                                    className="text-lg font-bold text-gray-900 hover:text-purple-600 mb-1 block"
                                                >
                                                    {inquiry.property?.title}
                                                </Link>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiHome className="w-4 h-4" />
                                                    <span>₹{inquiry.property?.price?.toLocaleString()}</span>
                                                    <span className="text-gray-400">•</span>
                                                    <span>{inquiry.property?.location?.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FiUser className="w-4 h-4 text-gray-600" />
                                                <span className="font-semibold text-gray-900">{inquiry.user?.name}</span>
                                                <span className={`ml-auto px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(inquiry.status)}`}>
                                                    {inquiry.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FiMail className="w-4 h-4" />
                                                    <span>{inquiry.user?.email || inquiry.userEmail}</span>
                                                </div>
                                                {(inquiry.user?.phone || inquiry.userPhone) && (
                                                    <div className="flex items-center gap-2">
                                                        <FiPhone className="w-4 h-4" />
                                                        <span>{inquiry.user?.phone || inquiry.userPhone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Message */}
                                        {inquiry.message && (
                                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                                <p className="text-sm text-gray-700">{inquiry.message}</p>
                                            </div>
                                        )}

                                        {/* Timestamp */}
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                                            <FiClock className="w-3 h-3" />
                                            <span>{formatDate(inquiry.createdAt)}</span>
                                            {inquiry.contactPreference && (
                                                <>
                                                    <span className="text-gray-400">•</span>
                                                    <span>Prefers: {inquiry.contactPreference}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {(isAgent || isAdmin) && (
                                        <div className="flex flex-col gap-2 lg:w-48">
                                            {inquiry.status === 'new' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(inquiry._id, 'contacted')}
                                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 text-sm font-semibold"
                                                >
                                                    <FiMessageCircle className="w-4 h-4" />
                                                    Mark Contacted
                                                </button>
                                            )}
                                            {inquiry.status === 'contacted' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(inquiry._id, 'converted')}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 text-sm font-semibold"
                                                >
                                                    <FiCheck className="w-4 h-4" />
                                                    Mark Converted
                                                </button>
                                            )}
                                            {inquiry.status !== 'closed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(inquiry._id, 'closed')}
                                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm font-semibold"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                    Close
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(inquiry._id)}
                                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 text-sm font-semibold"
                                            >
                                                <FiX className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default Inquiries
