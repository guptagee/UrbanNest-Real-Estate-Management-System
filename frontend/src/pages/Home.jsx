import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../utils/api'
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
      const response = await api.get('/projects?featured=true&limit=3')
      setFeaturedProjects(response.data.data)
    } catch (error) {
      console.error('Error fetching featured projects:', error)
    }
  }

  const fetchFeaturedProperties = async () => {
    try {
      // Fetch latest 6 properties regardless of featured status to ensure user listings appear
      const response = await api.get('/properties?limit=6')
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
    <div className="min-h-screen bg-grey-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-grey-50 to-white pt-32 pb-28 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://cdn.dribbble.com/userupload/16006995/file/original-d940fb9b7d53542e0d887c1e08b60571.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40"></div>
        </div>

        {/* Animated Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-float z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl z-10" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl z-10" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-8 lg:px-24 relative z-20">
          <div className="max-w-4xl animate-fade-in">
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
              Find your perfect{' '}
              <span className="relative inline-block">
                <span className="relative z-10">space</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-purple-500/50 -rotate-1 -z-10"></span>
              </span>
              .
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl drop-shadow-lg">
              Urbannest is your trusted partner for finding premium properties.
              Discover apartments, villas, and new developments across India.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-10 max-w-2xl relative z-10 animate-slide-in-up">
              <div className="relative flex items-center group bg-white rounded-2xl shadow-strong hover:shadow-intense transition-all duration-300 border border-grey-200 hover:border-grey-400">
                <FiSearch className="absolute left-5 text-grey-400 w-6 h-6 group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  placeholder="Search by city, locality..."
                  className="w-full pl-14 pr-36 py-5 rounded-2xl focus:outline-none text-grey-900 bg-transparent text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-black text-white px-8 py-3 rounded-xl hover:bg-grey-900 hover:shadow-lg transition-all font-semibold flex items-center gap-2 group/btn"
                >
                  Search
                  <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <Link
                to="/properties"
                className="bg-white text-black px-8 py-4 rounded-xl hover:bg-grey-100 hover:shadow-strong transition-all font-semibold inline-flex items-center gap-2 group shadow-md"
              >
                Explore Properties
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/projects"
                className="text-white px-8 py-4 rounded-xl hover:bg-white/10 hover:shadow-md transition-all font-semibold border-2 border-white/50 hover:border-white backdrop-blur-sm"
              >
                New Projects
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium drop-shadow">500+ Verified Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium drop-shadow">2,000+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium drop-shadow">15+ Cities Covered</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-20 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="group text-center cursor-default">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-grey-100 rounded-2xl mb-4 group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                <FiHome className="w-8 h-8 text-black group-hover:text-white transition-colors" />
              </div>
              <div className="text-5xl font-bold text-black mb-2 font-display group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm text-grey-600 font-semibold uppercase tracking-wider">Properties Listed</div>
            </div>
            <div className="group text-center cursor-default">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-grey-100 rounded-2xl mb-4 group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                <FiUsers className="w-8 h-8 text-black group-hover:text-white transition-colors" />
              </div>
              <div className="text-5xl font-bold text-black mb-2 font-display group-hover:scale-110 transition-transform">2,000+</div>
              <div className="text-sm text-grey-600 font-semibold uppercase tracking-wider">Happy Customers</div>
            </div>
            <div className="group text-center cursor-default">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-grey-100 rounded-2xl mb-4 group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                <FiSearch className="w-8 h-8 text-black group-hover:text-white transition-colors" />
              </div>
              <div className="text-5xl font-bold text-black mb-2 font-display group-hover:scale-110 transition-transform">15+</div>
              <div className="text-sm text-grey-600 font-semibold uppercase tracking-wider">Cities Covered</div>
            </div>
            <div className="group text-center cursor-default">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-grey-100 rounded-2xl mb-4 group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                <FiTrendingUp className="w-8 h-8 text-black group-hover:text-white transition-colors" />
              </div>
              <div className="text-5xl font-bold text-black mb-2 font-display group-hover:scale-110 transition-transform">₹500Cr+</div>
              <div className="text-sm text-grey-600 font-semibold uppercase tracking-wider">Property Value Sold</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation Engine */}
      <AIRecommendations />

      {/* Platform Features - Bento Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-display">Why Choose Urbannest?</h2>
            <p className="text-grey-600 text-xl leading-relaxed">
              We simplify the real estate journey. Whether you are buying, selling, or renting,
              we provide the tools and transparency you need to make the right decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="group bg-grey-50 rounded-3xl p-8 border border-grey-200 hover:border-black hover:shadow-strong transition-all duration-300 hover:-translate-y-1 animate-fade-in">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FiHome className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 font-display">Verified Listings</h3>
              <p className="text-grey-600 leading-relaxed">
                Browse through hundreds of verified properties. We ensure every listing is authentic and up-to-date.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-grey-50 rounded-3xl p-8 border border-grey-200 hover:border-black hover:shadow-strong transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FiSearch className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 font-display">Smart Search</h3>
              <p className="text-grey-600 leading-relaxed">
                Find your perfect home with advanced filters. Search by location, budget, amenities, and more.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-grey-50 rounded-3xl p-8 border border-grey-200 hover:border-black hover:shadow-strong transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FiUsers className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 font-display">Expert Support</h3>
              <p className="text-grey-600 leading-relaxed">
                Connect with top-rated agents and get expert advice throughout your property journey.
              </p>
            </div>

            {/* Feature Card 4 - Larger */}
            <div className="group bg-grey-50 rounded-3xl p-8 border border-grey-200 hover:border-black hover:shadow-strong transition-all duration-300 hover:-translate-y-1 md:col-span-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FiTrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 font-display">Seamless Bookings</h3>
              <p className="text-grey-600 leading-relaxed mb-6">
                Schedule property visits instantly. Pick a date and time that works for you, and we handle the rest.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-black font-semibold">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-black font-semibold">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span>Virtual Tours</span>
                </div>
                <div className="flex items-center gap-2 text-black font-semibold">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span>Visit Reminders</span>
                </div>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="group bg-grey-50 rounded-3xl p-8 border border-grey-200 hover:border-black hover:shadow-strong transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FiZap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 font-display">New Projects</h3>
              <p className="text-grey-600 leading-relaxed">
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
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-display">New Projects</h2>
              <p className="text-grey-600 text-lg">Discover premium developments and new launches</p>
            </div>
            <Link
              to="/projects"
              className="text-black font-semibold hover:gap-3 flex items-center gap-2 group transition-all"
            >
              View All Projects
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-24 bg-grey-50">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-display">Featured Properties</h2>
              <p className="text-grey-600 text-lg">Carefully curated selections just for you</p>
            </div>
            <Link
              to="/properties"
              className="text-black font-semibold hover:gap-3 flex items-center gap-2 group transition-all"
            >
              View All
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-24 bg-white border-y border-grey-200">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-display">How it works.</h2>
            <p className="text-grey-600 text-xl leading-relaxed">
              We've made buying and renting properties simple and transparent. Here is how you can get started with Urbannest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute -left-1 top-0 w-1 h-full bg-gradient-to-b from-black to-grey-400 rounded-full"></div>
              <div className="pl-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 font-display">Register & Search</h3>
                <p className="text-grey-600 leading-relaxed">
                  Create your account and browse our extensive list of properties. Use our smart filters to find exactly what you need.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-1 top-0 w-1 h-full bg-gradient-to-b from-grey-400 to-grey-300 rounded-full"></div>
              <div className="pl-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-grey-800 text-white rounded-xl font-bold text-xl mb-4 group-hover:scale-110 group-hover:bg-black transition-all">
                  2
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 font-display">Book a Visit</h3>
                <p className="text-grey-600 leading-relaxed">
                  Like what you see? Schedule a site visit directly through the platform. We will confirm the time with the agent.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-1 top-0 w-1 h-full bg-gradient-to-b from-grey-300 to-grey-200 rounded-full"></div>
              <div className="pl-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-grey-600 text-white rounded-xl font-bold text-xl mb-4 group-hover:scale-110 group-hover:bg-black transition-all">
                  3
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 font-display">Close the Deal</h3>
                <p className="text-grey-600 leading-relaxed">
                  Connect with the owner or agent, negotiate the best price, and make the property yours with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#F7F7F7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-medium text-[#0E0E0E] mb-4">What our customers say.</h2>
            <p className="text-[#6B6B6B] text-lg">
              Don't just take our word for it. Here's what our customers have to say about their experience with Urbannest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial-card bg-white rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-all hover:shadow-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#0E0E0E] mb-6 leading-relaxed">
                "Finding my dream apartment was so easy with Urbannest. The platform is intuitive, and the property listings are detailed and accurate. Highly recommend!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6E6E6]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E0E0E] to-[#4A4A4A] flex items-center justify-center text-white font-medium">
                  RS
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0E0E0E]">Rajesh Sharma</div>
                  <div className="text-xs text-[#6B6B6B]">Homebuyer, Mumbai</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card bg-white rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-all hover:shadow-xl animation-delay-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#0E0E0E] mb-6 leading-relaxed">
                "As a property owner, listing on Urbannest was seamless. I received genuine inquiries within days and closed the deal in just two weeks!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6E6E6]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E0E0E] to-[#4A4A4A] flex items-center justify-center text-white font-medium">
                  PM
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0E0E0E]">Priya Mehta</div>
                  <div className="text-xs text-[#6B6B6B]">Property Owner, Rajkot</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card bg-white rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-all hover:shadow-xl animation-delay-400">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#0E0E0E] mb-6 leading-relaxed">
                "The AI chatbot helped me narrow down my search instantly. I found the perfect villa in my budget without spending hours browsing. Amazing service!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6E6E6]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E0E0E] to-[#4A4A4A] flex items-center justify-center text-white font-medium">
                  AK
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0E0E0E]">Amit Kumar</div>
                  <div className="text-xs text-[#6B6B6B]">Investor, Bangalore</div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="testimonial-card bg-white rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-all hover:shadow-xl animation-delay-600">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#0E0E0E] mb-6 leading-relaxed">
                "Urbannest made my first home purchase stress-free. The verified listings gave me confidence, and the booking process was incredibly smooth."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6E6E6]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E0E0E] to-[#4A4A4A] flex items-center justify-center text-white font-medium">
                  SG
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0E0E0E]">Sneha Gupta</div>
                  <div className="text-xs text-[#6B6B6B]">First-time Buyer, Delhi</div>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="testimonial-card bg-white rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-all hover:shadow-xl animation-delay-800">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#0E0E0E] mb-6 leading-relaxed">
                "Professional service from start to finish. The agent network is top-notch, and I appreciated the transparency throughout the entire process."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6E6E6]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E0E0E] to-[#4A4A4A] flex items-center justify-center text-white font-medium">
                  VR
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0E0E0E]">Vikram Reddy</div>
                  <div className="text-xs text-[#6B6B6B]">Real Estate Agent, Hyderabad</div>
                </div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="testimonial-card bg-white rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-all hover:shadow-xl animation-delay-1000">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#0E0E0E] mb-6 leading-relaxed">
                "I've used several real estate platforms, but Urbannest stands out. The user experience is exceptional, and the property quality is consistently high."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6E6E6]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E0E0E] to-[#4A4A4A] flex items-center justify-center text-white font-medium">
                  NK
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0E0E0E]">Neha Kapoor</div>
                  <div className="text-xs text-[#6B6B6B]">Property Consultant, Pune</div>
                </div>
              </div>
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
      <section className="relative py-32 bg-gradient-to-t from-purple-100 via-violet-600 to-slate-800 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 lg:px-24 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-display">
            Start Your Journey Today
          </h2>
          <p className="text-grey-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the fastest growing real estate community in India. Find your dream home or list your property in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-black px-10 py-5 rounded-xl hover:bg-grey-100 hover:shadow-strong transition-all font-bold text-lg inline-flex items-center gap-2 group shadow-lg"
            >
              Sign Up Now
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/properties"
              className="text-white px-10 py-5 rounded-xl hover:bg-white/10 transition-all font-bold text-lg border-2 border-white/30 hover:border-white/50"
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
