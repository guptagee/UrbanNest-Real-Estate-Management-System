import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    FiHome, FiMail, FiBell, FiSettings,
    FiPieChart, FiUsers,
    FiBriefcase, FiZap, FiSearch, FiChevronDown,
    FiMenu, FiX, FiLogOut, FiCalendar, FiAlertCircle, FiHeart
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const SidebarItem = ({ icon: Icon, label, href, badge, hasSubmenu, active }) => {
    const location = useLocation()
    
    // Enhanced active state detection for admin tabs
    const isActive = () => {
        if (active) return true
        
        // Special handling for admin tabs with query parameters
        if (href.includes('/admin?tab=')) {
            const tabParam = href.split('tab=')[1]
            const currentTab = new URLSearchParams(location.search).get('tab')
            return location.pathname === '/admin' && currentTab === tabParam
        }
        
        return location.pathname === href
    }
    
    const isCurrentlyActive = isActive()

    return (
        <Link
            to={href}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isCurrentlyActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-medium shadow-lg shadow-blue-100 border border-blue-200'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isCurrentlyActive 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                }`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {badge && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] px-2 py-1 rounded-full min-w-[20px] text-center font-bold shadow-lg animate-pulse">
                        {badge}
                    </span>
                )}
                {hasSubmenu && <FiChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />}
            </div>
            {isCurrentlyActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
            )}
        </Link>
    )
}

const DashboardLayout = ({ children, user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const role = user?.role || 'user'

    const getMenuItems = () => {
        const commonItems = [
            { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
        ]

        if (role === 'admin') {
            return [
                ...commonItems,
                { icon: FiUsers, label: 'Manage Users', href: '/admin?tab=users' },
                { icon: FiBriefcase, label: 'All Properties', href: '/admin?tab=properties' },
                { icon: FiCalendar, label: 'Bookings', href: '/admin?tab=bookings' },
                { icon: FiZap, label: 'Analytics', href: '/admin?tab=overview' },
                { icon: FiAlertCircle, label: 'Complaints & Reports', href: '/admin?tab=reports' },
            ]
        }

        if (role === 'agent') {
            return [
                ...commonItems,
                { icon: FiBriefcase, label: 'My Listings', href: '/my-listings' },
            ]
        }

        // Default: Buyer/User
        return [
            ...commonItems,
            { icon: FiSearch, label: 'Explore', href: '/properties' },
            { icon: FiCalendar, label: 'My Bookings', href: '/bookings' },
            { icon: FiPieChart, label: 'Recommendations', href: '/dashboard?tab=recommendations' },
        ]
    }

    const getSecondaryMenuItems = () => {
        const items = []

        // For agents, add Bookings and Inquiries
        if (role === 'agent') {
            items.push(
                { icon: FiCalendar, label: 'Bookings', href: '/bookings' },
                { icon: FiAlertCircle, label: 'Inquiries', href: '/inquiries' },
                { icon: FiMail, label: 'Messages', href: '/messages' }
            )
        } else if (role === 'user') {
            items.push({ icon: FiMail, label: 'Messages', href: '/messages' })
        }
        // Admin has no secondary menu items

        return items
    }

    const menuItems = getMenuItems()
    const secondaryMenuItems = getSecondaryMenuItems()

    const settingsItems = [
        { icon: FiSettings, label: 'Settings', href: '/profile', hasSubmenu: true },
    ]

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans text-gray-900">
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 lg:hidden hover:shadow-xl transition-all duration-200"
            >
                {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white/80 backdrop-blur-xl border-r border-gray-200 w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:shadow-xl`}
            >
                <div className="flex flex-col h-full px-4 py-6 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center px-4 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-3">
                            U
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Urbannest</span>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.label}
                                {...item}
                                active={false} // Let SidebarItem handle active state detection
                            />
                        ))}

                        {secondaryMenuItems.length > 0 && (
                            <div className="pt-8 pb-4">
                                <div className="px-4 mb-3">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</span>
                                </div>
                                {secondaryMenuItems.map((item) => (
                                    <SidebarItem
                                        key={item.label}
                                        {...item}
                                        active={false} // Let SidebarItem handle active state detection
                                    />
                                ))}
                            </div>
                        )}

                        <div className="pt-8 space-y-1">
                            <div className="px-4 mb-3">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</span>
                            </div>
                            {settingsItems.map((item) => (
                                <SidebarItem
                                    key={item.label}
                                    {...item}
                                    active={false} // Let SidebarItem handle active state detection
                                />
                            ))}
                        </div>
                    </nav>

                    {/* User Profile & Log out Section at bottom */}
                    <div className="mt-auto px-2 space-y-3">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 font-medium text-sm focus:outline-none border border-transparent hover:border-rose-200"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 lg:ml-64`}>
                {/* Page Content */}
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
