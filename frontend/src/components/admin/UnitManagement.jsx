import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiBox } from 'react-icons/fi'

const UnitManagement = () => {
  const [units, setUnits] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProject, setFilterProject] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [formData, setFormData] = useState({
    project: '',
    unitNumber: '',
    unitType: '2BHK',
    area: '',
    areaUnit: 'sqft',
    price: '',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    floor: '',
    facing: '',
    availabilityStatus: 'Available',
    images: [],
    floorPlan: '',
    notes: ''
  })
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    fetchProjects()
    fetchUnits()
  }, [searchTerm, filterProject])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/admin/projects', { params: { isActive: 'true' } })
      setProjects(response.data.data || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const fetchUnits = async () => {
    try {
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (filterProject) params.project = filterProject
      const response = await api.get('/admin/units', { params })
      setUnits(response.data.data || [])
    } catch (error) {
      toast.error('Failed to load units')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        area: parseFloat(formData.area),
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        balconies: parseInt(formData.balconies) || 0
      }
      if (editingUnit) {
        await api.put(`/admin/units/${editingUnit._id}`, data)
        toast.success('Unit updated successfully')
      } else {
        await api.post('/admin/units', data)
        toast.success('Unit created successfully')
      }
      setShowForm(false)
      setEditingUnit(null)
      resetForm()
      fetchUnits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save unit')
    }
  }

  const handleEdit = (unit) => {
    setEditingUnit(unit)
    setFormData({
      project: unit.project?._id || unit.project || '',
      unitNumber: unit.unitNumber || '',
      unitType: unit.unitType || '2BHK',
      area: unit.area || '',
      areaUnit: unit.areaUnit || 'sqft',
      price: unit.price || '',
      bedrooms: unit.bedrooms || '',
      bathrooms: unit.bathrooms || '',
      balconies: unit.balconies || '',
      floor: unit.floor || '',
      facing: unit.facing || '',
      availabilityStatus: unit.availabilityStatus || 'Available',
      images: unit.images || [],
      floorPlan: unit.floorPlan || '',
      notes: unit.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) return
    try {
      await api.delete(`/admin/units/${id}`)
      toast.success('Unit deleted successfully')
      fetchUnits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete unit')
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/units/${id}/availability`, { availabilityStatus: status })
      toast.success('Unit status updated')
      fetchUnits()
    } catch (error) {
      toast.error('Failed to update unit status')
    }
  }

  const resetForm = () => {
    setFormData({
      project: '',
      unitNumber: '',
      unitType: '2BHK',
      area: '',
      areaUnit: 'sqft',
      price: '',
      bedrooms: '',
      bathrooms: '',
      balconies: '',
      floor: '',
      facing: '',
      availabilityStatus: 'Available',
      images: [],
      floorPlan: '',
      notes: ''
    })
    setImageUrl('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl.trim()] }))
      setImageUrl('')
    }
  }

  const removeImage = (image) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== image) }))
  }

  if (loading) return <div className="text-center py-12">Loading units...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Unit Management</h2>
          <p className="text-gray-500 mt-1">Manage inventory units for projects</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingUnit(null)
            resetForm()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <FiPlus className="w-4 h-4" />
          Add Unit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
          />
        </div>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
        >
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingUnit ? 'Edit Unit' : 'Add New Unit'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project *</label>
                  <select name="project" value={formData.project} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black">
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit Number *</label>
                  <input type="text" name="unitNumber" value={formData.unitNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Unit Type *</label>
                  <select name="unitType" value={formData.unitType} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black">
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                    <option value="Villa">Villa</option>
                    <option value="Shop">Shop</option>
                    <option value="Office">Office</option>
                    <option value="Studio">Studio</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area *</label>
                  <input type="number" step="0.01" name="area" value={formData.area} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area Unit *</label>
                  <select name="areaUnit" value={formData.areaUnit} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black">
                    <option value="sqft">sqft</option>
                    <option value="sqm">sqm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Availability Status *</label>
                  <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black">
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Balconies</label>
                  <input type="number" name="balconies" value={formData.balconies} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Floor</label>
                  <input type="text" name="floor" value={formData.floor} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" placeholder="e.g., 5th Floor" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Facing</label>
                <select name="facing" value={formData.facing} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black">
                  <option value="">Select Facing</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="flex gap-2 mb-2">
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" placeholder="Image URL" />
                  <button type="button" onClick={addImage} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt={`Unit ${i + 1}`} className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(img)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Floor Plan URL</label>
                <input type="url" name="floorPlan" value={formData.floorPlan} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">{editingUnit ? 'Update Unit' : 'Create Unit'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingUnit(null); resetForm() }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Area</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {units.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No units found.</td>
                </tr>
              ) : (
                units.map((unit) => (
                  <tr key={unit._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{unit.unitNumber}</div>
                      <div className="text-sm text-gray-500">{unit.bedrooms || 0}BHK</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{unit.project?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm">{unit.unitType}</td>
                    <td className="px-6 py-4 text-sm">{unit.area} {unit.areaUnit}</td>
                    <td className="px-6 py-4 text-sm font-medium">₹{unit.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select
                        value={unit.availabilityStatus}
                        onChange={(e) => handleStatusChange(unit._id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none ${
                          unit.availabilityStatus === 'Available' ? 'bg-green-100 text-green-700' :
                          unit.availabilityStatus === 'Booked' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(unit)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(unit._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
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
  )
}

export default UnitManagement

