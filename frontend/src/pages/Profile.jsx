import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiUser, FiMail, FiPhone } from 'react-icons/fi'

const Profile = () => {
  const { user: authUser, fetchUser } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: {
      propertyType: [],
      priceRange: { min: '', max: '' },
      location: [],
      bedrooms: '',
      bathrooms: ''
    }
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile')
      const userData = response.data.data
      setUser(userData)
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        preferences: {
          propertyType: userData.preferences?.propertyType || [],
          priceRange: {
            min: userData.preferences?.priceRange?.min || '',
            max: userData.preferences?.priceRange?.max || ''
          },
          location: userData.preferences?.location || [],
          bedrooms: userData.preferences?.bedrooms || '',
          bathrooms: userData.preferences?.bathrooms || ''
        }
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handlePreferenceChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/users/profile', {
        name: formData.name,
        phone: formData.phone
      })
      toast.success('Profile updated successfully')
      fetchUserProfile()
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/users/preferences', formData.preferences)
      toast.success('Preferences updated successfully')
    } catch (error) {
      toast.error('Failed to update preferences')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const getAccountStatus = () => {
    if (user?.blocked) return { text: 'Blocked', color: 'text-red-600', bg: 'bg-red-50', icon: FiXCircle }
    if (!user?.isActive) return { text: 'Inactive', color: 'text-amber-600', bg: 'bg-amber-50', icon: FiAlertCircle }
    if (!user?.isVerified) return { text: 'Pending Verification', color: 'text-blue-600', bg: 'bg-blue-50', icon: FiAlertCircle }
    return { text: 'Active', color: 'text-green-600', bg: 'bg-green-50', icon: FiCheckCircle }
  }

  const accountStatus = getAccountStatus()
  const StatusIcon = accountStatus.icon

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
        </div>

        {/* Account Status Card (for Agents) */}
        {user?.role === 'agent' && (
          <div className={`${accountStatus.bg} border border-gray-200 rounded-2xl p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon className={`w-6 h-6 ${accountStatus.color}`} />
                <div>
                  <div className="font-semibold text-gray-900">Account Status</div>
                  <div className={`text-sm font-medium ${accountStatus.color}`}>{accountStatus.text}</div>
                </div>
              </div>
              {!user?.isVerified && (
                <div className="text-xs text-gray-600">
                  Your account is pending admin verification
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 capitalize"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
              >
                Update Profile
              </button>
            </form>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Property Preferences</h2>
            <form onSubmit={handlePreferencesSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {['house', 'apartment', 'flat', 'villa', 'land', 'plot', 'commercial'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.preferences.propertyType.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...formData.preferences.propertyType, type]
                            : formData.preferences.propertyType.filter(t => t !== type)
                          handlePreferenceChange('propertyType', newTypes)
                        }}
                        className="mr-2"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={formData.preferences.priceRange.min}
                    onChange={(e) => handlePreferenceChange('priceRange', {
                      ...formData.preferences.priceRange,
                      min: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={formData.preferences.priceRange.max}
                    onChange={(e) => handlePreferenceChange('priceRange', {
                      ...formData.preferences.priceRange,
                      max: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.preferences.bedrooms}
                    onChange={(e) => handlePreferenceChange('bedrooms', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.preferences.bathrooms}
                    onChange={(e) => handlePreferenceChange('bathrooms', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      </DashboardLayout>
  )
}

export default Profile

