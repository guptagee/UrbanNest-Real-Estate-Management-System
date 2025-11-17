import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FiMapPin, FiMaximize2, FiCalendar, FiMessageSquare, FiUser } from 'react-icons/fi'
import { FaBed, FaBath } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    bookingTime: '',
    message: ''
  })

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`)
      setProperty(response.data.data)
      
      // Add to search history if authenticated
      if (isAuthenticated) {
        try {
          await axios.post('/api/users/search-history', { propertyId: id })
        } catch (error) {
          // Silently fail - not critical
        }
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      toast.error('Property not found')
      navigate('/properties')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to book a viewing')
      navigate('/login')
      return
    }

    try {
      await axios.post('/api/bookings', {
        property: id,
        ...bookingData
      })
      toast.success('Booking request submitted successfully!')
      setShowBookingModal(false)
      setBookingData({ bookingDate: '', bookingTime: '', message: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit booking')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!property) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/properties"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Properties
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {property.images && property.images.length > 0 ? (
              property.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`${property.title} - Image ${idx + 1}`}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              ))
            ) : (
              <div className="col-span-2 h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                No Images Available
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <FiMapPin className="mr-2" />
                  <span>
                    {property.location?.address}, {property.location?.city}, {property.location?.state} - {property.location?.zipCode}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {formatPrice(property.price)}
                </div>
                <span className={`px-3 py-1 rounded text-sm ${
                  property.status === 'available' ? 'bg-green-100 text-green-800' :
                  property.status === 'sold' ? 'bg-red-100 text-red-800' :
                  property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.status}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <FaBed className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Bedrooms</div>
                <div className="text-lg font-semibold">{property.bedrooms}</div>
              </div>
              <div className="text-center">
                <FaBath className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Bathrooms</div>
                <div className="text-lg font-semibold">{property.bathrooms}</div>
              </div>
              <div className="text-center">
                <FiMaximize2 className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Area</div>
                <div className="text-lg font-semibold">
                  {property.area} {property.areaUnit || 'sqm'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Type</div>
                <div className="text-lg font-semibold capitalize">{property.propertyType}</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner/Agent Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              {property.owner && (
                <div className="flex items-center mb-2">
                  <FiUser className="mr-2 text-primary-600" />
                  <div>
                    <div className="font-medium">{property.owner.name}</div>
                    <div className="text-sm text-gray-600">{property.owner.email}</div>
                    {property.owner.phone && (
                      <div className="text-sm text-gray-600">{property.owner.phone}</div>
                    )}
                  </div>
                </div>
              )}
              {property.agent && property.agent._id !== property.owner?._id && (
                <div className="flex items-center">
                  <FiUser className="mr-2 text-primary-600" />
                  <div>
                    <div className="font-medium">Agent: {property.agent.name}</div>
                    <div className="text-sm text-gray-600">{property.agent.email}</div>
                    {property.agent.phone && (
                      <div className="text-sm text-gray-600">{property.agent.phone}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {property.status === 'available' && (
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center justify-center"
                >
                  <FiCalendar className="mr-2" />
                  Book a Viewing
                </button>
                {isAuthenticated && (
                  <Link
                    to={`/messages?property=${id}&receiver=${property.agent?._id || property.owner?._id}`}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 flex items-center justify-center"
                  >
                    <FiMessageSquare className="mr-2" />
                    Contact Agent
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Book a Viewing</h2>
            <form onSubmit={handleBooking}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={bookingData.bookingDate}
                  onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={bookingData.bookingTime}
                  onChange={(e) => setBookingData({ ...bookingData, bookingTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={bookingData.message}
                  onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail

