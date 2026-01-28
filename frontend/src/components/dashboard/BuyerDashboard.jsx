import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiCalendar, FiMessageSquare, FiTrendingUp, FiSearch } from 'react-icons/fi'
import PropertyCard from '../../components/PropertyCard'
import axios from 'axios'

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
                axios.get('/api/users/favorites').catch(() => ({ data: { data: [] } })),
                axios.get('/api/bookings').catch(() => ({ data: { data: [] } })),
                axios.get('/api/properties/recommendations').catch(() => ({ data: { data: [] } }))
            ])

            setFavorites(favRes.data.data?.slice(0, 3) || [])
            setBookings(bookRes.data.data?.slice(0, 4) || [])
            setRecommendations(recRes.data.data?.slice(0, 3) || [])
        } catch (error) {
            console.error('Error fetching buyer data:', error)
            // Set empty arrays on error to prevent crashes
            setFavorites([])
            setBookings([])
            setRecommendations([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-3xl text-white shadow-2xl">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-blue-100 text-lg">Here's what's happening with your property search journey.</p>
                    <div className="mt-6 flex gap-4">
                        <Link to="/properties" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                            Browse Properties
                        </Link>
                        <Link to="/favorites" className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-400 transition-colors border border-blue-400">
                            View Favorites
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-2xl border border-rose-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-rose-600 uppercase tracking-wight">Saved Properties</span>
                        <div className="p-2 bg-rose-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                            <FiHeart className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="text-4xl font-bold text-rose-900">{favorites.length}</div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-rose-600 font-medium">Properties you love</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wight">Scheduled Visits</span>
                        <div className="p-2 bg-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                            <FiCalendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="text-4xl font-bold text-blue-900">{bookings.length}</div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-600 font-medium">Upcoming property tours</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wight">Inquiries Sent</span>
                        <div className="p-2 bg-emerald-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                            <FiMessageSquare className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="text-4xl font-bold text-emerald-900">View</div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-600 font-medium">Track your messages</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Recommendations & Favorites */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <FiTrendingUp className="text-primary-600" /> Recommended for You
                            </h2>
                            <Link to="/properties" className="text-xs font-bold text-primary-600 hover:underline">View all</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {loading ? (
                                <div className="col-span-full animate-pulse space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>)}
                                </div>
                            ) : recommendations.length > 0 ? (
                                recommendations.map(p => <PropertyCard key={p._id} property={p} />)
                            ) : (
                                <div className="col-span-full border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                                    <FiSearch className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm italic">Start searching to get personalized recommendations</p>
                                    <Link to="/properties" className="mt-4 inline-block text-xs font-bold bg-black text-white px-4 py-2 rounded-lg">Explore Properties</Link>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <FiHeart className="text-rose-600" /> Recently Saved
                            </h2>
                            <Link to="/favorites" className="text-xs font-bold text-primary-600 hover:underline">View all</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </section>
                </div>

                {/* Sidebar: Recent Bookings */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900">Upcoming Visits</h2>
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <FiCalendar className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
                                </div>
                            ) : bookings.length > 0 ? (
                                bookings.map(booking => (
                                    <div key={booking._id} className="flex gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-gray-100 hover:border-blue-200 group">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <span className="text-[10px] uppercase font-bold">{new Date(booking.bookingDate).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-bold leading-none">{new Date(booking.bookingDate).getDate()}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-bold truncate text-gray-900">{booking.property?.title}</h4>
                                            <p className="text-xs text-gray-600 mt-1">{booking.bookingTime}</p>
                                            <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded-md ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiCalendar className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">No upcoming visits scheduled.</p>
                                    <Link to="/properties" className="inline-block text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Schedule a Visit
                                    </Link>
                                </div>
                            )}
                        </div>
                        {bookings.length > 0 && (
                            <Link to="/bookings" className="mt-6 block text-center py-3 text-xs font-bold border-t border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
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
