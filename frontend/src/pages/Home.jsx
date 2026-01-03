import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiArrowRight, FiCheck, FiHome, FiSearch, FiShield, FiTrendingUp, FiUsers, FiZap } from 'react-icons/fi'
import PropertyCard from '../components/PropertyCard'
import ProjectCard from '../components/ProjectCard'
import AIRecommendations from '../components/AIRecommendations'

const Home = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])

  useEffect(() => {
    fetchFeaturedProperties()
    fetchFeaturedProjects()
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      const response = await axios.get('/api/projects?featured=true&limit=3')
      setFeaturedProjects(response.data.data)
    } catch (error) {
      console.error('Error fetching featured projects:', error)
    }
  }

  const fetchFeaturedProperties = async () => {
    try {
      // Fetch latest 6 properties regardless of featured status to ensure user listings appear
      const response = await axios.get('/api/properties?limit=6')
      setFeaturedProperties(response.data.data)
    } catch (error) {
      console.error('Error fetching featured properties:', error)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Hero Section */}
      <section className="relative bg-white pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-medium text-[#0E0E0E] leading-tight mb-6 tracking-tight">
              Find your perfect space.
            </h1>
            <p className="text-xl text-[#6B6B6B] mb-8 leading-relaxed max-w-2xl">
              Urbannest is your trusted partner for finding premium properties. 
              Discover apartments, villas, and new developments in Rajkot and across India.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8 max-w-xl relative z-10">
              <div className="relative flex items-center">
                <FiSearch className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by city, locality, or project..."
                  className="w-full pl-12 pr-32 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0E0E0E] shadow-lg text-gray-900 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-[#0E0E0E] text-white px-6 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4">
              <Link
                to="/properties"
                className="bg-[#0E0E0E] text-white px-6 py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm font-medium inline-flex items-center gap-2"
              >
                Explore Properties
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/projects"
                className="text-[#0E0E0E] px-6 py-3 rounded-lg hover:bg-[#F7F7F7] transition-colors text-sm font-medium border border-[#E6E6E6]"
              >
                New Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-[#E6E6E6]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="text-4xl font-medium text-[#0E0E0E] mb-2">500+</div>
              <div className="text-sm text-[#6B6B6B]">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-[#0E0E0E] mb-2">2,000+</div>
              <div className="text-sm text-[#6B6B6B]">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-[#0E0E0E] mb-2">15+</div>
              <div className="text-sm text-[#6B6B6B]">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-[#0E0E0E] mb-2">₹500Cr+</div>
              <div className="text-sm text-[#6B6B6B]">Property Value Sold</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation Engine */}
      <AIRecommendations />

      {/* Platform Features - Bento Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="mb-16">
            <h2 className="text-3xl font-medium text-[#0E0E0E] mb-4">Why Choose Urbannest?</h2>
            <p className="text-[#6B6B6B] text-lg max-w-2xl">
              We simplify the real estate journey. Whether you are buying, selling, or renting, 
              we provide the tools and transparency you need to make the right decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-[#F7F7F7] rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-colors">
              <div className="w-12 h-12 bg-[#0E0E0E] rounded-lg flex items-center justify-center mb-6">
                <FiHome className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">Verified Listings</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Browse through hundreds of verified properties. We ensure every listing is authentic and up-to-date.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-[#F7F7F7] rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-colors">
              <div className="w-12 h-12 bg-[#0E0E0E] rounded-lg flex items-center justify-center mb-6">
                <FiSearch className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">Smart Search</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Find your perfect home with advanced filters. Search by location, budget, amenities, and more.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-[#F7F7F7] rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-colors">
              <div className="w-12 h-12 bg-[#0E0E0E] rounded-lg flex items-center justify-center mb-6">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">Expert Support</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Connect with top-rated agents and get expert advice throughout your property journey.
              </p>
            </div>

            {/* Feature Card 4 - Larger */}
            <div className="bg-[#F7F7F7] rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-colors md:col-span-2">
              <div className="w-12 h-12 bg-[#0E0E0E] rounded-lg flex items-center justify-center mb-6">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">Seamless Bookings</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                Schedule property visits instantly. Pick a date and time that works for you, and we handle the rest.
              </p>
              <div className="flex items-center gap-4 text-sm text-[#0E0E0E]">
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  <span>Virtual Tours</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  <span>Visit Reminders</span>
                </div>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-[#F7F7F7] rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-colors">
              <div className="w-12 h-12 bg-[#0E0E0E] rounded-lg flex items-center justify-center mb-6">
                <FiZap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">New Projects</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Be the first to know about upcoming residential and commercial projects in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-medium text-[#0E0E0E] mb-4">New Projects</h2>
              <p className="text-[#6B6B6B] text-sm">Discover premium developments and new launches</p>
            </div>
            <Link
              to="/projects"
              className="text-[#0E0E0E] text-sm font-medium hover:underline flex items-center gap-2"
            >
              View All Projects
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#6B6B6B]">
              <p>No featured projects available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-medium text-[#0E0E0E] mb-4">Featured Properties</h2>
              <p className="text-[#6B6B6B] text-sm">Carefully curated selections just for you</p>
            </div>
            <Link
              to="/properties"
              className="text-[#0E0E0E] text-sm font-medium hover:underline flex items-center gap-2"
            >
              View All
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#6B6B6B]">
              <p>No featured properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white border-y border-[#E6E6E6]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-medium text-[#0E0E0E] mb-4">How it works.</h2>
            <p className="text-[#6B6B6B] text-lg">
              We've made buying and renting properties simple and transparent. Here is how you can get started with Urbannest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-2 border-[#0E0E0E] pl-6">
              <div className="text-sm font-medium text-[#6B6B6B] mb-2 uppercase tracking-wider">Step 1</div>
              <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">Register & Search</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Create your account and browse our extensive list of properties. Use our smart filters to find exactly what you need.
              </p>
            </div>
            <div className="border-l-2 border-[#E6E6E6] pl-6">
              <div className="text-sm font-medium text-[#6B6B6B] mb-2 uppercase tracking-wider">Step 2</div>
              <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">Book a Visit</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Like what you see? Schedule a site visit directly through the platform. We will confirm the time with the agent.
              </p>
            </div>
            <div className="border-l-2 border-[#E6E6E6] pl-6">
              <div className="text-sm font-medium text-[#6B6B6B] mb-2 uppercase tracking-wider">Step 3</div>
              <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">Close the Deal</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Connect with the owner or agent, negotiate the best price, and make the property yours with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-medium text-[#0E0E0E] mb-4">Trusted by Thousands.</h2>
            <p className="text-[#6B6B6B] text-lg mb-12">
              Urbannest is committed to trust and transparency. We ensure a secure environment for all your real estate transactions.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="text-3xl font-medium text-[#0E0E0E] mb-2">500+</div>
                <div className="text-xs text-[#6B6B6B] uppercase tracking-wider">Verified Listings</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-[#0E0E0E] mb-2">15+</div>
                <div className="text-xs text-[#6B6B6B] uppercase tracking-wider">Cities</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-[#0E0E0E] mb-2">2K+</div>
                <div className="text-xs text-[#6B6B6B] uppercase tracking-wider">Happy Users</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-[#0E0E0E] mb-2">24/7</div>
                <div className="text-xs text-[#6B6B6B] uppercase tracking-wider">Support</div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E6E6E6]">
              <div className="flex items-center gap-2 mb-4">
                <FiShield className="w-5 h-5 text-[#0E0E0E]" />
                <span className="text-sm font-medium text-[#0E0E0E]">Secure & Verified.</span>
              </div>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                We verify property details and agent credentials to ensure you have a safe and reliable experience on Urbannest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24 text-center">
          <h2 className="text-4xl font-medium text-white mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-[#E6E6E6] text-lg mb-8 max-w-2xl mx-auto">
            Join the fastest growing real estate community in India. Find your dream home or list your property in minutes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-[#0E0E0E] px-6 py-3 rounded-lg hover:bg-[#F7F7F7] transition-colors text-sm font-medium inline-flex items-center gap-2"
            >
              Sign Up Now
            </Link>
            <Link
              to="/properties"
              className="text-white px-6 py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm font-medium border border-[#6B6B6B]"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
