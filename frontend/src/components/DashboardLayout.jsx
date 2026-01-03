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

const SidebarItem = ({ icon: Icon, label, href, badge, hasSubmenu, active }) => (
    <Link
        to={href}
        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${active
            ? 'bg-primary-50 text-primary-600 font-medium'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
            <span className="text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {badge && (
                <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {badge}
                </span>
            )}
            {hasSubmenu && <FiChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
    </Link>
)

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
        <div className="flex min-h-screen bg-[#F8F9FB] font-sans text-gray-900">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200 w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full px-4 py-6 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center px-4 mb-8">
                        <span className="text-xl font-bold tracking-tight">Urbannest</span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.label}
                                {...item}
                                active={location.pathname === item.href}
                            />
                        ))}

                        <div className="pt-8 pb-4">
                            {secondaryMenuItems.map((item) => (
                                <SidebarItem
                                    key={item.label}
                                    {...item}
                                    active={location.pathname === item.href}
                                />
                            ))}
                        </div>

                        <div className="pt-8 space-y-1">
                            {settingsItems.map((item) => (
                                <SidebarItem
                                    key={item.label}
                                    {...item}
                                    active={location.pathname === item.href}
                                />
                            ))}
                        </div>
                    </nav>

                    {/* Log out Section at bottom */}
                    <div className="mt-auto px-2">

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200 font-medium text-sm focus:outline-none"
                        >
                            <FiLogOut className="w-5 h-5" />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 lg:ml-64`}>
                {/* Page Content */}
                <div className="px-8 pb-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
