import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import { FiCalendar, FiClock, FiUser, FiHome, FiX, FiCheck, FiSearch, FiFilter } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const Bookings = () => {
  const { user, isAgent, isAdmin } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    let filtered = bookings

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredBookings(filtered)
  }, [bookings, statusFilter, searchTerm])

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings')
      setBookings(response.data.data)
      setFilteredBookings(response.data.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: newStatus })
      toast.success('Booking status updated')
      fetchBookings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking status')
    }
  }

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await axios.delete(`/api/bookings/${bookingId}`)
      toast.success('Booking cancelled')
      fetchBookings()
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
            <p className="text-gray-500 mt-1">View and manage property booking requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by property, user name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-sm bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-black outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <FiCalendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No bookings found</p>
            {!isAgent && !isAdmin && (
              <Link
                to="/properties"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Browse Properties →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link
                          to={`/properties/${booking.property?._id}`}
                          className="text-xl font-bold text-gray-900 hover:text-primary-600 mb-2 block"
                        >
                          {booking.property?.title}
                        </Link>
                        <div className="flex items-center text-gray-600 text-sm space-x-4 mt-2">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2" />
                            {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-2" />
                            {booking.bookingTime}
                          </div>
                          {booking.property?.location?.city && (
                            <div className="flex items-center">
                              <FiHome className="mr-2" />
                              {booking.property.location.city}
                            </div>
                          )}
                        </div>
                      </div>
                      {isAgent || isAdmin ? (
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold outline-none border-none ${
                            booking.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                            booking.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                            booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-blue-50 text-blue-700'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                          booking.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                          booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      )}
                    </div>

                    {(isAgent || isAdmin) && booking.user && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="flex items-center text-gray-700 mb-2">
                          <FiUser className="mr-2" />
                          <span className="font-semibold">Booked by: {booking.user.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Email: {booking.user.email}</div>
                          {booking.user.phone && <div>Phone: {booking.user.phone}</div>}
                        </div>
                      </div>
                    )}

                    {booking.message && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-gray-700">{booking.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    {(isAgent || isAdmin) && booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                          <FiCheck className="w-4 h-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                          <FiX className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'pending' && !isAgent && !isAdmin && (
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm font-semibold"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel Booking
                      </button>
                    )}
                    <Link
                      to={`/properties/${booking.property?._id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <FiHome className="w-4 h-4" />
                      View Property
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Bookings
