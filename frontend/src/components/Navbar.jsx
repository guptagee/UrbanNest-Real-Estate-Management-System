import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiUser, FiLogOut, FiMessageSquare, FiCalendar, FiBriefcase, FiHeart, FiUsers, FiSearch, FiChevronDown, FiSettings, FiAlertCircle, FiTrendingUp, FiLayers } from 'react-icons/fi'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E6E6E6] backdrop-blur-sm bg-white/95">
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
              className="text-base text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors font-normal"
            >
              Properties
            </Link>
            <Link
              to="/projects"
              className="text-base text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors font-normal"
            >
              Projects
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/about"
                  className="text-base text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors font-normal"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-base text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors font-normal"
                >
                  Contact
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Auth */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-base text-[#0E0E0E] hover:opacity-70 transition-opacity font-normal"
                >
                  <span>{user?.name}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E6E6E6] rounded-lg shadow-sm py-1 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-[#E6E6E6]">
                        <div className="text-sm font-medium text-[#0E0E0E]">{user?.name}</div>
                        <div className="text-xs text-[#6B6B6B] mt-0.5 capitalize">{role}</div>
                      </div>

                      {/* Navigation Links */}
                      {getUserNavLinks().map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F7F7F7] transition-colors"
                        >
                          <link.icon className="mr-3 w-4 h-4" />
                          {link.label}
                        </Link>
                      ))}

                      {/* Settings */}
                      <div className="border-t border-[#E6E6E6] my-1" />
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F7F7F7] transition-colors"
                      >
                        <FiSettings className="mr-3 w-4 h-4" />
                        Settings
                      </Link>

                      {/* Logout */}
                      <div className="border-t border-[#E6E6E6] my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F7F7F7] transition-colors text-left"
                      >
                        <FiLogOut className="mr-3 w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-white text-[#0E0E0E] border border-[#6B6B6B] px-5 py-2.5 rounded-lg hover:bg-[#F7F7F7] transition-colors text-base font-normal"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-[#0E0E0E] text-white border border-[#0E0E0E] px-5 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors text-base font-normal"
                >
                  Start for free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
