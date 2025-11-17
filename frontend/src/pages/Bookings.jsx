import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FiCalendar, FiClock, FiUser, FiHome, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Bookings = () => {
  const { user, isAgent, isAdmin } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings')
      setBookings(response.data.data)
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
      toast.error('Failed to update booking status')
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiCalendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No bookings found</p>
            <Link
              to="/properties"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse Properties →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link
                          to={`/properties/${booking.property?._id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-primary-600 mb-2"
                        >
                          {booking.property?.title}
                        </Link>
                        <div className="flex items-center text-gray-600 text-sm space-x-4 mt-2">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2" />
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-2" />
                            {booking.bookingTime}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    {(isAgent || isAdmin) && booking.user && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <FiUser className="mr-2" />
                        <span>Booked by: {booking.user.name} ({booking.user.email})</span>
                      </div>
                    )}

                    {booking.message && (
                      <p className="text-gray-700 mt-2 p-3 bg-gray-50 rounded">
                        {booking.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-4">
                    {(isAgent || isAdmin) && booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'pending' && !isAgent && !isAdmin && (
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                      >
                        <FiX className="mr-2" />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings

