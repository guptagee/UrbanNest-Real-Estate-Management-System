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
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-tight block mb-2">My Properties</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{stats.myProperties}</span>
              <div className="w-16 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                <FiHome className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <span className="text-green-600 font-medium">{stats.available} Available</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-600 font-medium">{stats.sold} Sold</span>
              {stats.rented > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-purple-600 font-medium">{stats.rented} Rented</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-tight block mb-2">Bookings</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{stats.bookings}</span>
              <div className="w-16 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <FiCalendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Total bookings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-tight block mb-2">New Inquiries</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{stats.inquiries}</span>
              <div className="w-16 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <FiMessageCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting response</p>
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
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold tracking-tight">Recent Inquiries</h2>
                <Link to="/inquiries" className="text-xs font-bold text-primary-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
                  </div>
                ) : recentInquiries.length > 0 ? (
                  recentInquiries.map(inquiry => (
                    <div key={inquiry._id} className="p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0">
                          <FiUsers className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{inquiry.user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{inquiry.property?.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(inquiry.createdAt)}</p>
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
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/bookings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold border border-transparent hover:border-gray-100">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FiCalendar className="w-4 h-4" /></div>
                  Manage Bookings
                </Link>
                <Link to="/inquiries" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold border border-transparent hover:border-gray-100">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><FiMessageCircle className="w-4 h-4" /></div>
                  View Inquiries
                </Link>
                <Link to="/messages" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold border border-transparent hover:border-gray-100">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><FiMessageCircle className="w-4 h-4" /></div>
                  Messages
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
