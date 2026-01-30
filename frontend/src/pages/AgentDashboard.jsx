import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import PropertyListItem from '../components/dashboard/PropertyListItem'
import toast from 'react-hot-toast'
import { FiPlus, FiHome, FiCalendar, FiMessageCircle, FiUsers, FiAlertCircle, FiTrendingUp, FiEye, FiBarChart2 } from 'react-icons/fi'

const AgentDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    myProperties: 0,
    bookings: 0,
    inquiries: 0,
    available: 0,
    sold: 0,
    rented: 0
  })
  const [myProperties, setMyProperties] = useState([])
  const [recentInquiries, setRecentInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [propertiesRes, bookingsRes, inquiriesRes] = await Promise.all([
        api.get('/users/my-properties'),
        api.get('/bookings').catch(() => ({ data: { data: [] } })),
        api.get('/inquiries?status=new').catch(() => ({ data: { data: [] } }))
      ])

      const properties = propertiesRes.data.data
      setMyProperties(properties.slice(0, 5))
      setRecentInquiries(inquiriesRes.data.data.slice(0, 5))

      const available = properties.filter(p => p.status === 'available').length
      const sold = properties.filter(p => p.status === 'sold').length
      const rented = properties.filter(p => p.status === 'rented').length

      setStats({
        myProperties: properties.length,
        bookings: bookingsRes.data.data?.length || 0,
        inquiries: inquiriesRes.data.data?.length || 0,
        available,
        sold,
        rented
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome to UrbanNest Agent Panel, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 text-sm">
                Manage your listings, connect with buyers, and grow your business.
              </p>
            </div>
            <Link
              to="/properties/new"
              className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-semibold text-sm shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              Add Listing
            </Link>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiHome className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">My Property Listings</h2>
                <p className="text-xs text-gray-500">Manage and track your properties</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/properties/new"
                className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1"
              >
                Add New
                <FiPlus className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase">My Properties</span>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiHome className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.myProperties}</div>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{stats.available} Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">{stats.sold} Sold</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase">Bookings</span>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <FiCalendar className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.bookings}</div>
            <div className="text-xs text-gray-500">Total bookings this month</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase">New Inquiries</span>
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiMessageCircle className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.inquiries}</div>
            <div className="text-xs text-gray-500">Awaiting your response</div>
          </div>
        </div>

        {/* Quick Actions Widget */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/bookings"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FiCalendar className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">Bookings</span>
              {stats.bookings > 0 && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{stats.bookings}</span>
              )}
            </Link>

            <Link
              to="/inquiries"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
            >
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <FiMessageCircle className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600">Inquiries</span>
              {stats.inquiries > 0 && (
                <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{stats.inquiries}</span>
              )}
            </Link>

            <Link
              to="/properties/new"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
            >
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                <FiPlus className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600">Add Property</span>
            </Link>

            <Link
              to="/analytics"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
            >
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-amber-100 transition-colors">
                <FiBarChart2 className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-amber-600">Analytics</span>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">My Properties</h2>
                <Link to="/properties/new" className="text-sm font-semibold text-purple-600 hover:text-purple-700">Add New</Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
                  </div>
                ) : (
                  myProperties.length > 0 ? (
                    myProperties.map(property => (
                      <PropertyListItem key={property._id} property={property} onUpdate={fetchDashboardData} />
                    ))
                  ) : (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
                      <FiHome className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium text-sm mb-4">No properties listed yet.</p>
                      <Link to="/properties/new" className="inline-block text-sm font-semibold bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors">Create your first listing</Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Recent Inquiries */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
                <Link to="/inquiries" className="text-sm font-semibold text-purple-600 hover:text-purple-700">View All</Link>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
                  </div>
                ) : recentInquiries.length > 0 ? (
                  recentInquiries.map(inquiry => (
                    <div key={inquiry._id} className="p-3 rounded-lg hover:bg-gray-50 transition-all border border-gray-100 hover:border-purple-200 group">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                          <FiUsers className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{inquiry.user?.name}</p>
                          <p className="text-xs text-gray-600 truncate mt-1">{inquiry.property?.title}</p>
                          <p className="text-xs text-gray-400 mt-2">{formatDate(inquiry.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FiAlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No new inquiries</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AgentDashboard
