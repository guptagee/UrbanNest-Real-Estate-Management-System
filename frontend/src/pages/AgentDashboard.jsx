import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import PropertyListItem from '../components/dashboard/PropertyListItem'
import toast from 'react-hot-toast'
import { FiPlus, FiHome, FiCalendar, FiMessageCircle, FiUsers, FiAlertCircle } from 'react-icons/fi'

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
        axios.get('/api/users/my-properties'),
        axios.get('/api/bookings').catch(() => ({ data: { data: [] } })),
        axios.get('/api/inquiries?status=new').catch(() => ({ data: { data: [] } }))
      ])

      const properties = propertiesRes.data.data
      setMyProperties(properties.slice(0, 5))
      setRecentInquiries(inquiriesRes.data.data.slice(0, 5))

      // Calculate stats from properties
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
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage properties, bookings, and communicate with buyers.</p>
          </div>
          <Link
            to="/properties/new"
            className="bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-bold text-sm shadow-lg shadow-black/10"
          >
            <FiPlus className="w-5 h-5" />
            Add New Listing
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wight">My Properties</span>
              <div className="p-2 bg-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                <FiHome className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-blue-900">{stats.myProperties}</div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-700 font-medium">{stats.available} Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-700 font-medium">{stats.sold} Sold</span>
                </div>
                {stats.rented > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-700 font-medium">{stats.rented} Rented</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wight">Bookings</span>
              <div className="p-2 bg-emerald-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                <FiCalendar className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-emerald-900">{stats.bookings}</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-600 font-medium">Total bookings this month</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wight">New Inquiries</span>
              <div className="p-2 bg-purple-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                <FiMessageCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-purple-900">{stats.inquiries}</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-600 font-medium">Awaiting your response</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Property Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">My Properties</h2>
              <Link to="/properties/new" className="text-xs font-bold text-primary-600 hover:underline">Add New</Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>)}
                </div>
              ) : (
                myProperties.length > 0 ? (
                  myProperties.map(property => (
                    <PropertyListItem key={property._id} property={property} onUpdate={fetchDashboardData} />
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <FiHome className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-sm">No properties listed yet.</p>
                    <Link to="/properties/new" className="mt-4 inline-block text-xs font-bold text-primary-600">Create your first listing →</Link>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Inquiries */}
            <section className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-tight text-gray-900">Recent Inquiries</h2>
                <Link to="/inquiries" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">View All</Link>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
                  </div>
                ) : recentInquiries.length > 0 ? (
                  recentInquiries.map(inquiry => (
                    <div key={inquiry._id} className="p-4 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-gray-100 hover:border-blue-200 group">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                          <FiUsers className="w-4 h-4" />
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
            </section>

            {/* Quick Actions */}
            <section className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-bold tracking-tight mb-6 text-gray-900">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/bookings" className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm font-semibold border border-gray-100 hover:border-blue-200 group">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                    <FiCalendar className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-700">Manage Bookings</span>
                </Link>
                <Link to="/inquiries" className="flex items-center gap-3 p-4 rounded-xl hover:bg-emerald-50 transition-all duration-200 text-sm font-semibold border border-gray-100 hover:border-emerald-200 group">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                    <FiMessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700 group-hover:text-emerald-700">View Inquiries</span>
                </Link>
                <Link to="/messages" className="flex items-center gap-3 p-4 rounded-xl hover:bg-purple-50 transition-all duration-200 text-sm font-semibold border border-gray-100 hover:border-purple-200 group">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                    <FiMessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700 group-hover:text-purple-700">Messages</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AgentDashboard
