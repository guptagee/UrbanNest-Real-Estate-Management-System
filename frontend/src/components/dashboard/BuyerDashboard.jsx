import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiCalendar, FiMessageSquare, FiTrendingUp, FiSearch, FiBell, FiMapPin, FiEye } from 'react-icons/fi'
import PropertyCard from '../../components/PropertyCard'
import api from '../../utils/api'

const BuyerDashboard = ({ user }) => {
    const [favorites, setFavorites] = useState([])
    const [bookings, setBookings] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [favRes, bookRes, recRes] = await Promise.all([
                api.get('/users/favorites').catch(() => ({ data: { data: [] } })),
                api.get('/bookings').catch(() => ({ data: { data: [] } })),
                api.get('/properties/recommendations').catch(() => ({ data: { data: [] } }))
            ])

            setFavorites(favRes.data.data?.slice(0, 3) || [])
            setBookings(bookRes.data.data?.slice(0, 4) || [])
            setRecommendations(recRes.data.data?.slice(0, 3) || [])
        } catch (error) {
            console.error('Error fetching buyer data:', error)
            setFavorites([])
            setBookings([])
            setRecommendations([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Welcome to UrbanNest, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-gray-600 text-sm mb-6">
                    Find your dream property and make your next move with confidence.
                </p>

                {/* Promotional Cards */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-bold text-gray-900">Discover Premium Properties</span>
                                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Get exclusive access to premium listings and virtual tours.
                            </p>
                        </div>
                        {/* <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Card 1 */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-2">Premium Listings</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                Access exclusive properties before they hit the market.
                            </p>
                            <div className="mb-3">
                                <div className="flex items-baseline gap-1">

                                    <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded">FREE</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Limited time offer</div>
                            </div>
                            {/* <button className="w-full bg-white border border-purple-600 text-purple-600 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors">
                                Get Started
                            </button> */}
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-2">Virtual Tours</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                Experience properties from the comfort of your home.
                            </p>
                            <div className="mb-3">
                                <div className="flex items-baseline gap-1">

                                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded">FREE</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">For all users</div>
                            </div>
                            {/* <button className="w-full bg-white border border-purple-600 text-purple-600 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors">
                                Explore Now
                            </button> */}
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-2">Property Alerts</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                Get notified when new properties match your criteria.
                            </p>
                            <div className="mb-3">
                                <div className="flex items-baseline gap-1">

                                    <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded">FREE</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Always free</div>
                            </div>
                            {/* <button className="w-full bg-white border border-purple-600 text-purple-600 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors">
                                Set Alert
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Your Properties Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiHeart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900">{user?.email?.split('@')[0] || 'Your'} Saved Properties</h2>
                            <p className="text-xs text-gray-500">Manage your favorite listings</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/favorites"
                            className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1"
                        >
                            View All
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Saved Properties</span>
                        <div className="p-2 bg-rose-50 rounded-lg">
                            <FiHeart className="w-4 h-4 text-rose-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{favorites.length}</div>
                    <div className="text-xs text-gray-500">Properties you love</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Scheduled Visits</span>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FiCalendar className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{bookings.length}</div>
                    <div className="text-xs text-gray-500">Upcoming property tours</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Inquiries</span>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <FiMessageSquare className="w-4 h-4 text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        <Link to="/inquiries" className="hover:text-purple-600 transition-colors">View</Link>
                    </div>
                    <div className="text-xs text-gray-500">Track your messages</div>
                </div>
            </div>

            {/* Widgets Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link
                        to="/properties"
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
                    >
                        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <FiSearch className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600">Browse</span>
                    </Link>

                    <Link
                        to="/bookings"
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <FiCalendar className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">Visits</span>
                    </Link>

                    <Link
                        to="/favorites"
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all group"
                    >
                        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-rose-100 transition-colors">
                            <FiHeart className="w-5 h-5 text-gray-600 group-hover:text-rose-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-rose-600">Saved</span>
                    </Link>

                    <Link
                        to="/messages"
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                    >
                        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                            <FiMessageSquare className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600">Messages</span>
                    </Link>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FiTrendingUp className="text-purple-600" /> Recommended for You
                            </h2>
                            <Link to="/properties" className="text-sm font-semibold text-purple-600 hover:text-purple-700">View all</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {loading ? (
                                <div className="col-span-full animate-pulse space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>)}
                                </div>
                            ) : recommendations.length > 0 ? (
                                recommendations.map(p => <PropertyCard key={p._id} property={p} />)
                            ) : (
                                <div className="col-span-full border border-dashed border-gray-200 rounded-xl p-8 text-center">
                                    <FiSearch className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm mb-4">Start searching to get personalized recommendations</p>
                                    <Link to="/properties" className="inline-block text-sm font-semibold bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors">Explore Properties</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FiHeart className="text-rose-600" /> Recently Saved
                            </h2>
                            <Link to="/favorites" className="text-sm font-semibold text-purple-600 hover:text-purple-700">View all</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {loading ? (
                                <div className="col-span-full animate-pulse space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>)}
                                </div>
                            ) : favorites.length > 0 ? (
                                favorites.map(p => <PropertyCard key={p._id} property={p} />)
                            ) : (
                                <p className="text-gray-400 text-sm col-span-full">You haven't saved any properties yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Upcoming Visits */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Upcoming Visits</h2>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FiCalendar className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="animate-pulse space-y-3">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
                                </div>
                            ) : bookings.length > 0 ? (
                                bookings.map(booking => (
                                    <div key={booking._id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all border border-gray-100 hover:border-blue-200 group">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <span className="text-[10px] uppercase font-bold">{new Date(booking.bookingDate).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-bold leading-none">{new Date(booking.bookingDate).getDate()}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-bold truncate text-gray-900">{booking.property?.title}</h4>
                                            <p className="text-xs text-gray-600 mt-1">{booking.bookingTime}</p>
                                            <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FiCalendar className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">No upcoming visits scheduled.</p>
                                    <Link to="/properties" className="inline-block text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Schedule a Visit
                                    </Link>
                                </div>
                            )}
                        </div>
                        {bookings.length > 0 && (
                            <Link to="/bookings" className="mt-5 block text-center py-3 text-sm font-semibold border-t border-gray-100 text-gray-600 hover:text-purple-600 transition-colors">
                                View all bookings →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerDashboard
