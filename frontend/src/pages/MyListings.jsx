import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import PropertyListItem from '../components/dashboard/PropertyListItem'
import toast from 'react-hot-toast'
import { FiPlus, FiHome, FiSearch, FiFilter } from 'react-icons/fi'

const MyListings = () => {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    let filtered = [...properties]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(p =>
        p.location?.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        p.location?.state?.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'price-high':
          return b.price - a.price
        case 'price-low':
          return a.price - b.price
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredProperties(filtered)
  }, [properties, searchTerm, statusFilter, locationFilter, sortBy])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/users/my-properties')
      setProperties(response.data.data)
      setFilteredProperties(response.data.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-gray-500 mt-1">Manage your property listings</p>
          </div>
          <Link
            to="/properties/new"
            className="bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-bold text-sm shadow-lg shadow-black/10"
          >
            <FiPlus className="w-5 h-5" />
            Add New Listing
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, city, or address..."
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
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-black outline-none"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-black outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Filter by city or state..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-black outline-none"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredProperties.length} of {properties.length} properties
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>)}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="space-y-4">
              {filteredProperties.map(property => (
                <PropertyListItem key={property._id} property={property} onUpdate={fetchProperties} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <FiHome className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-sm">
                {searchTerm || statusFilter !== 'all' || locationFilter
                  ? 'No properties match your filters.'
                  : 'No properties listed yet.'}
              </p>
              {!searchTerm && statusFilter === 'all' && !locationFilter && (
                <Link to="/properties/new" className="mt-4 inline-block text-xs font-bold text-primary-600">
                  Create your first listing →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyListings
