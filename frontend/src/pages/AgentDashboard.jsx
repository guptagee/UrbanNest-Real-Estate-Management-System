import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiHome, FiCalendar, FiMessageCircle, FiPlus } from 'react-icons/fi'
import PropertyCard from '../components/PropertyCard'
import toast from 'react-hot-toast'

const AgentDashboard = () => {
  const [stats, setStats] = useState({
    myProperties: 0,
    bookings: 0,
    messages: 0,
    views: 0
  })
  const [myProperties, setMyProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [propertiesRes, bookingsRes] = await Promise.all([
        axios.get('/api/properties?limit=6'),
        axios.get('/api/bookings?limit=5')
      ])
      
      const myProps = propertiesRes.data.data.filter(
        prop => prop.agent || prop.owner
      )
      
      setMyProperties(myProps)
      setStats({
        myProperties: propertiesRes.data.total || 0,
        bookings: bookingsRes.data.count || 0,
        messages: 0,
        views: myProps.reduce((sum, p) => sum + (p.views || 0), 0)
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <Link
            to="/properties/new"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <FiPlus className="h-5 w-5" />
            Add New Property
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FiHome className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">My Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.myProperties}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCalendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiMessageCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.messages}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiHome className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/properties"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <FiHome className="h-8 w-8 text-primary-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Properties</h3>
                <p className="text-sm text-gray-600">View and edit your listings</p>
              </div>
            </div>
          </Link>
          <Link
            to="/bookings"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <FiCalendar className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">View Bookings</h3>
                <p className="text-sm text-gray-600">Manage property viewings</p>
              </div>
            </div>
          </Link>
          <Link
            to="/messages"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <FiMessageCircle className="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">Communicate with clients</p>
              </div>
            </div>
          </Link>
        </div>

        {/* My Properties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Properties</h2>
            <Link to="/properties" className="text-primary-600 hover:text-primary-700">
              View All →
            </Link>
          </div>
          {myProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiHome className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't listed any properties yet.</p>
              <Link
                to="/properties/new"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Add your first property →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentDashboard

