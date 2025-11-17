import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiCalendar, FiMessageSquare, FiHeart, FiSettings } from 'react-icons/fi'
import PropertyCard from '../components/PropertyCard'

const Dashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [stats, setStats] = useState({
    bookings: 0,
    saved: 0,
    messages: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, recommendationsRes] = await Promise.all([
        axios.get('/api/bookings'),
        axios.get('/api/properties/recommendations')
      ])
      
      setBookings(bookingsRes.data.data.slice(0, 5))
      setRecommendations(recommendationsRes.data.data.slice(0, 6))
      setStats({
        bookings: bookingsRes.data.count || 0,
        saved: 0,
        messages: 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {user?.name}!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/bookings"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FiCalendar className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bookings}</p>
              </div>
            </div>
          </Link>
          <Link
            to="/messages"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiMessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.messages}</p>
              </div>
            </div>
          </Link>
          <Link
            to="/profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiSettings className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Profile</p>
                <p className="text-2xl font-bold text-gray-900">Settings</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              <Link to="/bookings" className="text-primary-600 hover:text-primary-700">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <Link
                      to={`/properties/${booking.property?._id}`}
                      className="font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {booking.property?.title}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recommended Properties</h2>
              <Link to="/properties" className="text-primary-600 hover:text-primary-700">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

