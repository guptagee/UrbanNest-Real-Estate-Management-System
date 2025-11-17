import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiSearch, FiHome, FiMapPin, FiDollarSign } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import PropertyCard from '../components/PropertyCard'

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchFeaturedProperties()
    if (isAuthenticated) {
      fetchRecommendations()
    }
  }, [isAuthenticated])

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get('/api/properties?featured=true&limit=6')
      setFeaturedProperties(response.data.data)
    } catch (error) {
      console.error('Error fetching featured properties:', error)
    }
  }

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/api/properties/recommendations')
      setRecommendations(response.data.data)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Property
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover the perfect home with our real estate platform
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, property type, or features..."
                  className="flex-1 px-6 py-4 text-gray-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-800 px-8 py-4 flex items-center"
                >
                  <FiSearch className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FiHome className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div className="text-center">
              <FiMapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div className="text-center">
              <FiDollarSign className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      {isAuthenticated && recommendations.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Recommended For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <Link
              to="/properties"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of satisfied customers who found their dream home with us
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

