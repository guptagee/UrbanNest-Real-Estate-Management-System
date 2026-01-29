import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import PropertyCard from '../components/PropertyCard'
import { FiSearch, FiFilter, FiX, FiHome, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi'

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    propertyType: searchParams.get('propertyType') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    status: searchParams.get('status') || 'available'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortedProperties, setSortedProperties] = useState([])

  useEffect(() => {
    fetchProperties()
  }, [filters, page])

  useEffect(() => {
    // Sort properties client-side
    const sorted = [...properties].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'popular':
          return (b.views || 0) - (a.views || 0)
        default:
          return 0
      }
    })
    setSortedProperties(sorted)
  }, [properties, sortBy])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      params.append('page', page)
      params.append('limit', 12)

      const response = await api.get(`/properties?${params.toString()}`)
      setProperties(response.data.data)
      setTotalPages(response.data.pages || 1)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
    setSearchParams({ ...filters, [key]: value, page: 1 })
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      propertyType: '',
      city: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      status: 'available'
    }
    setFilters(clearedFilters)
    setPage(1)
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-grey-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-grey-900 mb-2 font-display">Discover Your Dream Home</h1>
              <p className="text-grey-600">Find the perfect property from our curated collection</p>
            </div>
            <a href="/projects" className="bg-black text-white px-6 py-3 rounded-xl hover:bg-grey-900 transition-all duration-200 font-semibold shadow-md hover:shadow-lg">
              Explore New Projects
            </a>
          </div>

          {/* Search Bar */}
          <div className="bg-white border border-grey-200 rounded-2xl p-6 shadow-medium mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grey-400 w-5 h-5" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by location, property name, or keyword..."
                  className="w-full pl-12 pr-4 py-4 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg bg-grey-50 hover:bg-white transition-colors"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white font-medium hover:border-grey-400 transition-colors"
              >
                <option value="newest">🆕 Newest First</option>
                <option value="oldest">📅 Oldest First</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="popular">🔥 Most Popular</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-xl flex items-center font-semibold transition-all duration-200 ${showFilters
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-grey-100 hover:bg-grey-200 text-grey-700'
                  }`}
              >
                <FiFilter className="mr-2 w-5 h-5" />
                Filters
                {Object.values(filters).filter(v => v && v !== 'available').length > 0 && (
                  <span className="ml-2 bg-error text-white text-xs rounded-full px-2 py-1 font-bold">
                    {Object.values(filters).filter(v => v && v !== 'available').length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white border border-grey-200 p-8 rounded-2xl shadow-medium mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-grey-900">Advanced Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-error hover:text-red-700 bg-error-light px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    <FiHome className="inline mr-1" /> Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white hover:border-grey-400 transition-colors"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    <FiMapPin className="inline mr-1" /> City
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black hover:border-grey-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    <FiDollarSign className="inline mr-1" /> Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min price"
                    className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black hover:border-grey-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    <FiDollarSign className="inline mr-1" /> Max Price
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max price"
                    className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black hover:border-grey-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    <FiHome className="inline mr-1" /> Bedrooms
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white hover:border-grey-400 transition-colors"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    <FiHome className="inline mr-1" /> Bathrooms
                  </label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white hover:border-grey-400 transition-colors"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-grey-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white hover:border-grey-400 transition-colors"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-grey-500 text-lg">No properties found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sortedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-grey-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grey-100 transition-colors font-medium"
                >
                  Previous
                </button>
                <span className="px-4 py-2 font-medium text-grey-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-grey-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grey-100 transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Properties

