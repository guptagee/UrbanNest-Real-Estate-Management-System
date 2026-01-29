import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiToggleLeft, FiToggleRight,} from 'react-icons/fi'
import { FaBuilding } from 'react-icons/fa'


const BuilderManagement = () => {
  const [builders, setBuilders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBuilder, setEditingBuilder] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    description: '',
    profile: '',
    reraNumber: '',
    contact: {
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    logo: '',
    isActive: true
  })

  useEffect(() => {
    fetchBuilders()
  }, [searchTerm])

  const fetchBuilders = async () => {
    try {
      const params = searchTerm ? { search: searchTerm } : {}
      const response = await api.get('/admin/builders', { params })
      setBuilders(response.data.data || [])
    } catch (error) {
      toast.error('Failed to load builders')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBuilder) {
        await api.put(`/admin/builders/${editingBuilder._id}`, formData)
        toast.success('Builder updated successfully')
      } else {
        await api.post('/admin/builders', formData)
        toast.success('Builder created successfully')
      }
      setShowForm(false)
      setEditingBuilder(null)
      resetForm()
      fetchBuilders()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save builder')
    }
  }

  const handleEdit = (builder) => {
    setEditingBuilder(builder)
    setFormData({
      name: builder.name || '',
      companyName: builder.companyName || '',
      description: builder.description || '',
      profile: builder.profile || '',
      reraNumber: builder.reraNumber || '',
      contact: {
        email: builder.contact?.email || '',
        phone: builder.contact?.phone || '',
        website: builder.contact?.website || '',
        address: builder.contact?.address || '',
        city: builder.contact?.city || '',
        state: builder.contact?.state || '',
        zipCode: builder.contact?.zipCode || ''
      },
      logo: builder.logo || '',
      isActive: builder.isActive !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this builder?')) return

    try {
      await api.delete(`/admin/builders/${id}`)
      toast.success('Builder deleted successfully')
      fetchBuilders()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete builder')
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/builders/${id}/toggle-status`)
      toast.success(`Builder ${!currentStatus ? 'activated' : 'deactivated'}`)
      fetchBuilders()
    } catch (error) {
      toast.error('Failed to update builder status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      companyName: '',
      description: '',
      profile: '',
      reraNumber: '',
      contact: {
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      },
      logo: '',
      isActive: true
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading builders...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Builder Management</h2>
          <p className="text-gray-500 mt-1">
            Manage builder companies and developers
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingBuilder(null);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <FiPlus className="w-4 h-4" />
          Add Builder
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search builders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingBuilder ? "Edit Builder" : "Add New Builder"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Builder Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Profile
                </label>
                <textarea
                  name="profile"
                  value={formData.profile}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  RERA Number
                </label>
                <input
                  type="text"
                  name="reraNumber"
                  value={formData.reraNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="contact.website"
                  value={formData.contact.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="contact.address"
                  value={formData.contact.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="contact.city"
                    value={formData.contact.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="contact.state"
                    value={formData.contact.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="contact.zipCode"
                    value={formData.contact.zipCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  {editingBuilder ? "Update Builder" : "Create Builder"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBuilder(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Builders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Builder
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  RERA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {builders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No builders found. Create your first builder to get started.
                  </td>
                </tr>
              ) : (
                builders.map((builder) => (
                  <tr key={builder._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {builder.logo ? (
                          <img
                            src={builder.logo}
                            alt={builder.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FaBuilding className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{builder.name}</div>
                          <div className="text-sm text-gray-500">
                            {builder.companyName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{builder.contact?.email}</div>
                        <div className="text-gray-500">
                          {builder.contact?.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {builder.reraNumber || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleToggleStatus(builder._id, builder.isActive)
                        }
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          builder.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {builder.isActive ? (
                          <>
                            <FiToggleRight className="w-4 h-4" /> Active
                          </>
                        ) : (
                          <>
                            <FiToggleLeft className="w-4 h-4" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(builder)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(builder._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BuilderManagement

