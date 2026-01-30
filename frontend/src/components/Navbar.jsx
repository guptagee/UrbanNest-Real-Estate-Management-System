import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiUser, FiLogOut, FiMessageSquare, FiCalendar, FiBriefcase, FiHeart, FiUsers, FiSearch, FiChevronDown, FiSettings, FiAlertCircle, FiTrendingUp, FiLayers, FiMenu, FiX } from 'react-icons/fi'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  const role = user?.role || 'user'

  const getUserNavLinks = () => {
    if (!isAuthenticated) return []

    if (role === 'admin') {
      return [
        { icon: FiHome, label: 'Dashboard', href: '/admin' },
        { icon: FiUsers, label: 'Manage Users', href: '/admin?tab=users' },
        { icon: FiBriefcase, label: 'All Properties', href: '/admin?tab=properties' },
        { icon: FiCalendar, label: 'Bookings', href: '/admin?tab=bookings' },
        { icon: FiTrendingUp, label: 'Analytics', href: '/admin?tab=overview' },
        { icon: FiAlertCircle, label: 'Reports', href: '/admin?tab=reports' },
      ]
    }

    if (role === 'agent') {
      return [
        { icon: FiHome, label: 'Dashboard', href: '/agent' },
        { icon: FiBriefcase, label: 'My Listings', href: '/my-listings' },
        { icon: FiCalendar, label: 'Bookings', href: '/bookings' },
        { icon: FiAlertCircle, label: 'Inquiries', href: '/inquiries' },
        { icon: FiMessageSquare, label: 'Messages', href: '/messages' },
      ]
    }

    // Default: User/Buyer
    return [
      { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
      { icon: FiSearch, label: 'Properties', href: '/properties' },
      { icon: FiLayers, label: 'Projects', href: '/projects' },
      { icon: FiHeart, label: 'Favorites', href: '/favorites' },
      { icon: FiCalendar, label: 'My Bookings', href: '/bookings' },
      { icon: FiMessageSquare, label: 'Messages', href: '/messages' },
    ]
  }

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E6E6E6] shadow-sm">
      <div className="max-w-7xl mx-auto px-8 lg:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <img src="/logo.png" alt="Urbannest" className="h-24 w-auto" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/properties"
              className={`text-base transition-all duration-200 font-normal relative group ${isActiveLink('/properties')
                ? 'text-[#0E0E0E] font-medium'
                : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
                }`}
            >
              Properties
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0E0E0E] transition-all duration-200 ${isActiveLink('/properties') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
            </Link>
            <Link
              to="/projects"
              className={`text-base transition-all duration-200 font-normal relative group ${isActiveLink('/projects')
                ? 'text-[#0E0E0E] font-medium'
                : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
                }`}
            >
              Projects
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0E0E0E] transition-all duration-200 ${isActiveLink('/projects') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/about"
                  className={`text-base transition-all duration-200 font-normal relative group ${isActiveLink('/about')
                    ? 'text-[#0E0E0E] font-medium'
                    : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
                    }`}
                >
                  About
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0E0E0E] transition-all duration-200 ${isActiveLink('/about') ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </Link>
                <Link
                  to="/contact"
                  className={`text-base transition-all duration-200 font-normal relative group ${isActiveLink('/contact')
                    ? 'text-[#0E0E0E] font-medium'
                    : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
                    }`}
                >
                  Contact
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0E0E0E] transition-all duration-200 ${isActiveLink('/contact') ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Auth */}
          <div className="flex items-center space-x-4">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-[#0E0E0E]"
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-base text-[#0E0E0E] hover:opacity-70 transition-opacity font-normal px-4 py-2 rounded-lg hover:bg-[#F7F7F7]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0E0E0E] to-[#4A4A4A] flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E6E6E6] rounded-2xl shadow-xl py-2 z-50 animate-scale-in">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-[#E6E6E6]">
                        <div className="text-sm font-semibold text-[#0E0E0E]">{user?.name}</div>
                        <div className="text-xs text-[#6B6B6B] mt-0.5 capitalize">{role}</div>
                      </div>

                      {/* Navigation Links */}
                      <div className="py-2">
                        {getUserNavLinks().map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F7F7F7] transition-all"
                          >
                            <link.icon className="mr-3 w-4 h-4" />
                            {link.label}
                          </Link>
                        ))}
                      </div>

                      {/* Settings */}
                      <div className="border-t border-[#E6E6E6] pt-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F7F7F7] transition-all"
                        >
                          <FiSettings className="mr-3 w-4 h-4" />
                          Settings
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-[#E6E6E6] pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all text-left"
                        >
                          <FiLogOut className="mr-3 w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-white text-[#0E0E0E] border border-[#E6E6E6] px-5 py-2.5 rounded-lg hover:bg-[#F7F7F7] transition-all text-base font-normal"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-[#0E0E0E] text-white border border-[#0E0E0E] px-5 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-all text-base font-normal shadow-md hover:shadow-lg"
                >
                  Start for free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed top-20 left-0 right-0 bg-white border-b border-[#E6E6E6] shadow-xl z-50 md:hidden animate-slide-in-left">
            <div className="px-8 py-6 space-y-4">
              <Link
                to="/properties"
                onClick={() => setShowMobileMenu(false)}
                className="block text-base text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors py-2"
              >
                Properties
              </Link>
              <Link
                to="/projects"
                onClick={() => setShowMobileMenu(false)}
                className="block text-base text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors py-2"
              >
                Projects
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/about"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-base text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors py-2"
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setShowMobileMenu(false)}
                    className="block text-base text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors py-2"
                  >
                    Contact
                  </Link>
                  <div className="pt-4 border-t border-[#E6E6E6] space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="block w-full text-center bg-white text-[#0E0E0E] border border-[#E6E6E6] px-5 py-2.5 rounded-lg hover:bg-[#F7F7F7] transition-all"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowMobileMenu(false)}
                      className="block w-full text-center bg-[#0E0E0E] text-white px-5 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-all shadow-md"
                    >
                      Start for free
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
