import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiEye, FiCalendar, FiMessageCircle, FiTrendingUp, FiUsers } from 'react-icons/fi'

const PropertyAnalytics = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [property, setProperty] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPropertyAnalytics()
    }, [id])

    const fetchPropertyAnalytics = async () => {
        try {
            setLoading(true)
            const [propertyRes, analyticsRes] = await Promise.all([
                axios.get(`/api/properties/${id}`),
                axios.get(`/api/properties/${id}/analytics`)
            ])
            setProperty(propertyRes.data.data)
            setAnalytics(analyticsRes.data.data)
        } catch (error) {
            console.error('Error fetching analytics:', error)
            toast.error('Failed to load analytics')
            navigate('/properties')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 text-primary-600 hover:text-primary-700 flex items-center font-medium"
                >
                    <FiArrowLeft className="mr-2" />
                    Back
                </button>

                {/* Property Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {property?.images?.[0] && (
                            <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property?.title}</h1>
                            <p className="text-2xl font-bold text-primary-600 mb-2">
                                ₹{property?.price?.toLocaleString()}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>{property?.bedrooms} beds</span>
                                <span>•</span>
                                <span>{property?.bathrooms} baths</span>
                                <span>•</span>
                                <span>{property?.area} {property?.areaUnit}</span>
                                <span>•</span>
                                <span>{property?.location?.city}</span>
                            </div>
                            <div className="mt-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${property?.status === 'available' ? 'bg-green-100 text-green-800' :
                                        property?.status === 'sold' ? 'bg-red-100 text-red-800' :
                                            property?.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {property?.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FiEye className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {analytics?.views?.toLocaleString() || 0}
                        </h3>
                        <p className="text-sm text-gray-600">Total Views</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FiCalendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {analytics?.bookings?.total || 0}
                        </h3>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-xs text-green-600 mt-1">
                            {analytics?.bookings?.confirmed || 0} confirmed
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <FiMessageCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {analytics?.inquiries?.total || 0}
                        </h3>
                        <p className="text-sm text-gray-600">Total Inquiries</p>
                        <p className="text-xs text-blue-600 mt-1">
                            {analytics?.inquiries?.new || 0} new
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-100 rounded-lg">
                                <FiTrendingUp className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {analytics?.bookings?.total > 0
                                ? Math.round((analytics.bookings.confirmed / analytics.bookings.total) * 100)
                                : 0}%
                        </h3>
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                    </div>
                </div>

                {/* Performance Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Listed On</span>
                                <span className="font-semibold">{formatDate(analytics?.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Last Updated</span>
                                <span className="font-semibold">{formatDate(analytics?.lastUpdated)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Average Views/Day</span>
                                <span className="font-semibold">
                                    {Math.round(analytics?.views / Math.max(1, Math.ceil((new Date() - new Date(analytics?.createdAt)) / (1000 * 60 * 60 * 24))))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-gray-600">Engagement Rate</span>
                                <span className="font-semibold">
                                    {analytics?.views > 0
                                        ? Math.round(((analytics.bookings?.total || 0) + (analytics.inquiries?.total || 0)) / analytics.views * 100)
                                        : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                to={`/properties/${id}/edit`}
                                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
                            >
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FiUsers className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Edit Property</p>
                                    <p className="text-sm text-gray-600">Update details and images</p>
                                </div>
                            </Link>

                            <Link
                                to={`/properties/${id}`}
                                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
                            >
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <FiEye className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">View Listing</p>
                                    <p className="text-sm text-gray-600">See public view</p>
                                </div>
                            </Link>

                            <Link
                                to="/inquiries"
                                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
                            >
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <FiMessageCircle className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">View Inquiries</p>
                                    <p className="text-sm text-gray-600">Manage leads</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertyAnalytics
