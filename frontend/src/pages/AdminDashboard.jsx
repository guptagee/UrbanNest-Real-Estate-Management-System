import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import StatsCard from '../components/dashboard/StatsCard'
import toast from 'react-hot-toast'
import {
  FiUsers, FiCalendar, FiHome,
  FiTrendingUp, FiSearch, FiTrash2, FiEye, FiAlertCircle, FiSettings, FiMessageCircle,FiLayers, FiBox
} from 'react-icons/fi'
import BuilderManagement from '../components/admin/BuilderManagement'
import ProjectManagement from '../components/admin/ProjectManagement'
import UnitManagement from '../components/admin/UnitManagement'
import { format } from 'date-fns'
import { FaBuilding } from "react-icons/fa";

const AdminDashboard = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    revenue: 0,
    usersByRole: {},
    propertiesByStatus: {},
    bookingsByStatus: {},
    totalInquiries: 0,
    inquiriesByStatus: {},
    totalReports: 0,
    reportsByStatus: {},
    pendingProperties: 0,
    pendingBookings: 0
  })
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    fetchStats()
    if (activeTab === 'users') fetchUsers()
    if (activeTab === 'properties') fetchProperties()
    if (activeTab === 'bookings') fetchBookings()
    if (activeTab === 'inquiries') fetchInquiries()
    if (activeTab === 'reports') fetchReports()
    // Builders, Projects, Units are managed by their own components
  }, [activeTab, searchTerm])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      toast.error('Failed to load statistics')
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/users?search=${searchTerm}`)
      setUsers(response.data.data)
    } catch (error) { toast.error('Failed to load users') }
  }

  const fetchProperties = async () => {
    try {
      const response = await api.get(`/admin/properties?search=${searchTerm}`)
      setProperties(response.data.data)
    } catch (error) { toast.error('Failed to load properties') }
  }

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings')
      setBookings(response.data.data)
    } catch (error) { toast.error('Failed to load bookings') }
  }

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/admin/inquiries')
      setInquiries(response.data.data)
    } catch (error) { toast.error('Failed to load inquiries') }
  }

  const fetchReports = async () => {
    try {
      const response = await api.get('/admin/reports')
      setReports(response.data.data)
    } catch (error) { toast.error('Failed to load reports') }
  }

  const handleUpdateUserRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role })
      toast.success('User role updated')
      fetchUsers()
      fetchStats()
    } catch (error) { 
      toast.error(error.response?.data?.message || 'Failed to update role') 
    }
  }

  const handleToggleUserStatus = async (id, currentStatus, field) => {
    try {
      await api.put(`/admin/users/${id}`, { [field]: !currentStatus })
      toast.success(`User ${field === 'isActive' ? 'activation' : 'block'} status updated`)
      fetchUsers()
      fetchStats()
    } catch (error) { 
      toast.error(error.response?.data?.message || `Failed to update ${field}`) 
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete their listings and bookings.')) return
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
      fetchStats()
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to delete user') }
  }

  const handleUpdatePropertyStatus = async (id, status) => {
    try {
      await api.put(`/admin/properties/${id}/status`, { status })
      toast.success(`Property marked as ${status}`)
      fetchProperties()
      fetchStats()
    } catch (error) { toast.error('Failed to update status') }
  }

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await api.delete(`/admin/properties/${id}`)
      toast.success('Listing removed')
      fetchProperties()
      fetchStats()
    } catch (error) { toast.error('Failed to delete listing') }
  }

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.put(`/admin/bookings/${id}/status`, { status })
      toast.success(`Booking marked as ${status}`)
      fetchBookings()
      fetchStats()
    } catch (error) { toast.error('Failed to update booking status') }
  }

  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      await api.put(`/admin/inquiries/${id}`, { status })
      toast.success('Inquiry status updated')
      fetchInquiries()
      fetchStats()
    } catch (error) { toast.error('Failed to update inquiry status') }
  }

  const handleUpdateReportStatus = async (id, status) => {
    try {
      await api.put(`/admin/reports/${id}`, { status })
      toast.success('Report updated')
      fetchReports()
      fetchStats()
    } catch (error) { toast.error('Failed to update report') }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(price)
  }

  const sparklineData = [
    { value: 10 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 20 }, { value: 40 }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
            <p className="text-gray-500 mt-1">Complete control over the Urbannest Real Estate Management System.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-1 rounded-xl border border-gray-100 shadow-sm inline-flex gap-1 overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: 'Overview', icon: FiTrendingUp },
            { id: 'users', label: 'User Directory', icon: FiUsers },
            { id: 'properties', label: 'Listing Catalog', icon: FiHome },
            { id: 'builders', label: 'Builders', icon: FaBuilding },
            { id: 'projects', label: 'Projects', icon: FiLayers },
            { id: 'units', label: 'Units', icon: FiBox },
            { id: 'bookings', label: 'Reservation History', icon: FiCalendar },
            { id: 'inquiries', label: 'Inquiries', icon: FiMessageCircle },
            { id: 'reports', label: 'Complaints & Reports', icon: FiAlertCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                navigate(`/admin?tab=${tab.id}`, { replace: true })
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === tab.id ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Pending Alerts */}
            {(stats.pendingProperties > 0 || stats.pendingBookings > 0 || (stats.reportsByStatus?.pending || 0) > 0) && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-900 mb-4">Pending Actions Required</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.pendingProperties > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FiHome className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-bold text-amber-900">{stats.pendingProperties}</div>
                        <div className="text-sm text-amber-700">Properties Pending Approval</div>
                      </div>
                    </div>
                  )}
                  {stats.pendingBookings > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FiCalendar className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-bold text-amber-900">{stats.pendingBookings}</div>
                        <div className="text-sm text-amber-700">Pending Bookings</div>
                      </div>
                    </div>
                  )}
                  {(stats.reportsByStatus?.pending || 0) > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FiAlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-bold text-amber-900">{stats.reportsByStatus.pending}</div>
                        <div className="text-sm text-amber-700">Pending Reports</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wight">Platform Users</span>
                  <div className="p-2 bg-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <FiUsers className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-blue-900">{stats.totalUsers}</div>
                  <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700 font-medium">Agents: {stats.usersByRole?.agent || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <span className="text-blue-600 font-medium">Users: {stats.usersByRole?.user || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wight">Total Listings</span>
                  <div className="p-2 bg-emerald-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <FiHome className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-emerald-900">{stats.totalProperties}</div>
                  <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-700 font-medium">{stats.propertiesByStatus?.available || 0} Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                      <span className="text-emerald-600 font-medium">{stats.propertiesByStatus?.sold || 0} Sold</span>
                    </div>
                    {stats.propertiesByStatus?.pending > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-700 font-medium">{stats.propertiesByStatus.pending} Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wight">System Activity</span>
                  <div className="p-2 bg-amber-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-amber-900">{stats.totalBookings}</div>
                  <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-amber-700 font-medium">Confirmed: {stats.bookingsByStatus?.confirmed || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                      <span className="text-amber-600 font-medium">Pending: {stats.bookingsByStatus?.pending || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wight">Revenue</span>
                  <div className="p-2 bg-purple-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <FiTrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-purple-900">{formatPrice(stats.revenue || 0)}</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">+12% from last month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'users' || activeTab === 'properties') && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-xl font-bold capitalize">{activeTab} Management</h3>
              <div className="relative w-full md:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    {activeTab === 'users' ? (
                      <>
                        <th className="px-6 py-4">User Details</th>
                        <th className="px-6 py-4">Security Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4">Property Identity</th>
                        <th className="px-6 py-4">Valuation</th>
                        <th className="px-6 py-4">Market Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeTab === 'users' ? (
                    users.length > 0 ? users.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-gray-900">{u.name}</div>
                          <div className="text-[10px] text-gray-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                            disabled={u.role === 'admin'}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider outline-none border-none focus:ring-0 ${u.role === 'admin' ? 'bg-red-50 text-red-600 cursor-not-allowed' :
                              u.role === 'agent' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            <option value="user">User</option>
                            <option value="agent">Agent</option>
                            {u.role === 'admin' && <option value="admin">Admin</option>}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleToggleUserStatus(u._id, u.isActive, 'isActive')}
                              className={`text-xs px-2 py-1 rounded ${u.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} hover:opacity-80`}
                              title={u.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {u.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(u._id, u.blocked, 'blocked')}
                              className={`text-xs px-2 py-1 rounded ${u.blocked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'} hover:opacity-80`}
                              title={u.blocked ? 'Unblock' : 'Block'}
                            >
                              {u.blocked ? 'Blocked' : 'Unblocked'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">{u.phone || 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">No users found.</td>
                      </tr>
                    )
                  ) : (
                    properties.length > 0 ? properties.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/properties/${p._id}`} className="font-bold text-sm text-gray-900 hover:text-primary-600 transition-all">{p.title}</Link>
                          <div className="text-[10px] text-gray-500 capitalize">{p.location?.city || 'Unknown'}, {p.propertyType}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-black">{formatPrice(p.price)}</td>
                        <td className="px-6 py-4">
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdatePropertyStatus(p._id, e.target.value)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider outline-none border-none ${p.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                              p.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                p.status === 'sold' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link to={`/properties/${p._id}`} className="p-2 inline-block text-gray-400 hover:text-black transition-colors" title="View"><FiEye className="w-4 h-4" /></Link>
                          <button
                            onClick={() => handleDeleteProperty(p._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">No properties found.</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-xl font-bold">Reservation Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Reservation Details</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4">Approval State</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {bookings.length > 0 ? bookings.map(b => (
                    <tr key={b._id}>
                      <td className="px-6 py-4">
                        <div className="font-bold">{b.property?.title || 'Unknown Property'}</div>
                        <div className="text-[10px] text-gray-500">By: {b.user?.name || 'Unknown User'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{format(new Date(b.bookingDate), 'MMM dd, yyyy')}</div>
                        <div className="text-[10px] text-gray-500">{b.bookingTime}</div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold outline-none border-none ${b.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                            b.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                              b.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                            }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/properties/${b.property?._id}`} className="p-2 inline-block text-gray-400 hover:text-black transition-colors" title="View Property"><FiEye className="w-4 h-4" /></Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">No bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-xl font-bold">Inquiry Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Property & User</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {inquiries.length > 0 ? inquiries.map(i => (
                    <tr key={i._id}>
                      <td className="px-6 py-4">
                        <div className="font-bold">{i.property?.title || 'Unknown Property'}</div>
                        <div className="text-[10px] text-gray-500">By: {i.user?.name || 'Unknown User'}</div>
                        <div className="text-[10px] text-gray-500">{i.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-700 truncate max-w-xs">{i.message}</div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <select
                          value={i.status}
                          onChange={(e) => handleUpdateInquiryStatus(i._id, e.target.value)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold outline-none border-none ${i.status === 'closed' ? 'bg-gray-50 text-gray-600' :
                            i.status === 'converted' ? 'bg-green-50 text-green-600' :
                              i.status === 'contacted' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                            }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {format(new Date(i.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/properties/${i.property?._id}`} className="p-2 inline-block text-gray-400 hover:text-black transition-colors" title="View Property"><FiEye className="w-4 h-4" /></Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">No inquiries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-xl font-bold">Complaints & Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Reporter</th>
                    <th className="px-6 py-4">Issue</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {reports.length > 0 ? reports.map(r => (
                    <tr key={r._id}>
                      <td className="px-6 py-4">
                        <div className="font-bold">{r.reporter?.name}</div>
                        <div className="text-[10px] text-gray-500">{r.reporter?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{r.subject}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{r.description}</div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateReportStatus(r._id, e.target.value)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold outline-none border-none ${r.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                            r.status === 'investigating' ? 'bg-blue-50 text-blue-600' :
                              r.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                            }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="investigating">Investigating</option>
                          <option value="resolved">Resolved</option>
                          <option value="dismissed">Dismissed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-black transition-colors" title="View Details"><FiEye className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">No reports found in the system.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Builder Management Tab */}
        {activeTab === 'builders' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <BuilderManagement />
          </div>
        )}

        {/* Project Management Tab */}
        {activeTab === 'projects' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ProjectManagement />
          </div>
        )}

        {/* Unit Management Tab */}
        {activeTab === 'units' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <UnitManagement />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
