import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import CreateProperty from './pages/CreateProperty'
import EditProperty from './pages/EditProperty'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'
import Bookings from './pages/Bookings'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Inquiries from './pages/Inquiries'
import MyListings from './pages/MyListings'
import Favorites from './pages/Favorites'
import PropertyAnalytics from './pages/PropertyAnalytics'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import ChatWidget from './components/ChatWidget'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

const queryClient = new QueryClient()

// Layout wrapper to conditionally render Footer
function Layout({ children }) {
  const location = useLocation()

  // List of routes where footer should NOT be displayed
  const dashboardRoutes = [
    '/dashboard',
    '/admin',
    '/agent',
    '/bookings',
    '/messages',
    '/profile',
    '/inquiries',
    '/my-listings',
    '/favorites',
    '/forgot-password',
    '/reset-password'
  ]

  // Check if current path starts with any dashboard route
  const isDashboardPage = dashboardRoutes.some(route => location.pathname.startsWith(route))

  return (
    <>
      {children}
      {!isDashboardPage && <Footer />}
      <ChatWidget />
      <Toaster position="top-right" />
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route
                    path="/properties/new"
                    element={
                      <PrivateRoute allowedRoles={['agent']}>
                        <CreateProperty />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/properties/:id/edit"
                    element={
                      <PrivateRoute allowedRoles={['agent', 'admin']}>
                        <EditProperty />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/agent"
                    element={
                      <PrivateRoute allowedRoles={['agent', 'admin']}>
                        <AgentDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <PrivateRoute>
                        <Bookings />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <PrivateRoute>
                        <Messages />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/inquiries"
                    element={
                      <PrivateRoute allowedRoles={['agent', 'admin']}>
                        <Inquiries />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-listings"
                    element={
                      <PrivateRoute allowedRoles={['agent', 'admin']}>
                        <MyListings />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/favorites"
                    element={
                      <PrivateRoute>
                        <Favorites />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/properties/:id/analytics"
                    element={
                      <PrivateRoute allowedRoles={['agent', 'admin']}>
                        <PropertyAnalytics />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App

