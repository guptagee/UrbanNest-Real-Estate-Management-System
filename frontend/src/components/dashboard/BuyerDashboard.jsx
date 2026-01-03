import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiCalendar, FiMessageSquare, FiTrendingUp, FiSearch } from 'react-icons/fi'
import PropertyCard from '../PropertyCard'
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your property search.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                        <FiHeart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase">Saved</p>
                        <p className="text-2xl font-bold">{favorites.length} Properties</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <FiCalendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase">Bookings</p>
                        <p className="text-2xl font-bold">{bookings.length} Scheduled</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <FiMessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase">Inquiries</p>
                        <p className="text-2xl font-bold">View</p>
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
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
                        <h2 className="text-xl font-bold tracking-tight mb-6">Upcoming Visits</h2>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
                                </div>
                            ) : bookings.length > 0 ? (
                                bookings.map(booking => (
                                    <div key={booking._id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex flex-col items-center justify-center text-primary-600 flex-shrink-0">
                                            <span className="text-[10px] uppercase font-bold">{new Date(booking.bookingDate).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-bold leading-none">{new Date(booking.bookingDate).getDate()}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-bold truncate">{booking.property?.title}</h4>
                                            <p className="text-xs text-gray-500">{booking.bookingTime}</p>
                                            <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <FiCalendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">No upcoming visits scheduled.</p>
                                </div>
                            )}
                        </div>
                        <Link to="/bookings" className="mt-6 block text-center py-2 text-xs font-bold border-t border-gray-50 text-gray-400 hover:text-primary-600 transition-colors">
                            View all bookings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerDashboard
