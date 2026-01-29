import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiToggleLeft, FiToggleRight, FiLayers, FiStar } from 'react-icons/fi'
import { FaBuilding } from "react-icons/fa";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([])
  const [builders, setBuilders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    builder: '',
    description: '',
    location: { address: '', city: '', state: '', zipCode: '' },
    projectType: 'Residential',
    projectStatus: 'New Launch',
    possessionDate: '',
    amenities: [],
    images: [],
    brochures: [],
    floorPlans: [],
    featured: false,
    isActive: true
  })
  const [amenityInput, setAmenityInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    fetchBuilders()
    fetchProjects()
  }, [searchTerm])

  const fetchBuilders = async () => {
    try {
      const response = await api.get('/admin/builders', { params: { isActive: 'true' } })
      setBuilders(response.data.data || [])
    } catch (error) {
      console.error('Failed to load builders:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      const params = searchTerm ? { search: searchTerm } : {}
      const response = await api.get('/admin/projects', { params })
      setProjects(response.data.data || [])
    } catch (error) {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { ...formData }
      if (data.possessionDate) data.possessionDate = new Date(data.possessionDate)
      if (editingProject) {
        await api.put(`/admin/projects/${editingProject._id}`, data)
        toast.success('Project updated successfully')
      } else {
        await api.post('/admin/projects', data)
        toast.success('Project created successfully')
      }
      setShowForm(false)
      setEditingProject(null)
      resetForm()
      fetchProjects()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name || '',
      builder: project.builder?._id || project.builder || '',
      description: project.description || '',
      location: project.location || { address: '', city: '', state: '', zipCode: '' },
      projectType: project.projectType || 'Residential',
      projectStatus: project.projectStatus || 'New Launch',
      possessionDate: project.possessionDate ? new Date(project.possessionDate).toISOString().split('T')[0] : '',
      amenities: project.amenities || [],
      images: project.images || [],
      brochures: project.brochures || [],
      floorPlans: project.floorPlans || [],
      featured: project.featured || false,
      isActive: project.isActive !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated units will need to be deleted first.')) return
    try {
      await api.delete(`/admin/projects/${id}`)
      toast.success('Project deleted successfully')
      fetchProjects()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/admin/projects/${id}/toggle-status`)
      toast.success('Project status updated')
      fetchProjects()
    } catch (error) {
      toast.error('Failed to update project status')
    }
  }

  const handleToggleFeatured = async (id) => {
    try {
      await api.put(`/admin/projects/${id}/toggle-featured`)
      toast.success('Project featured status updated')
      fetchProjects()
    } catch (error) {
      toast.error('Failed to update featured status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      builder: '',
      description: '',
      location: { address: '', city: '', state: '', zipCode: '' },
      projectType: 'Residential',
      projectStatus: 'New Launch',
      possessionDate: '',
      amenities: [],
      images: [],
      brochures: [],
      floorPlans: [],
      featured: false,
      isActive: true
    })
    setAmenityInput('')
    setImageUrl('')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('location.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenityInput.trim()] }))
      setAmenityInput('')
    }
  }

  const removeAmenity = (amenity) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }))
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

  if (loading) return <div className="text-center py-12">Loading projects...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Management</h2>
          <p className="text-gray-500 mt-1">Manage builder projects and developments</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProject(null)
            resetForm()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <FiPlus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Builder *</label>
                  <select name="builder" value={formData.builder} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black">
                    <option value="">Select Builder</option>
                    {builders.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Type *</label>
                  <select name="projectType" value={formData.projectType} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black">
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Project Status *</label>
                  <select name="projectStatus" value={formData.projectStatus} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black">
                    <option value="New Launch">New Launch</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Possession Date</label>
                <input type="date" name="possessionDate" value={formData.possessionDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input type="text" name="location.address" value={formData.location.address} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input type="text" name="location.city" value={formData.location.city} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input type="text" name="location.state" value={formData.location.state} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Zip Code *</label>
                  <input type="text" name="location.zipCode" value={formData.location.zipCode} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amenities</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" placeholder="Add amenity" />
                  <button type="button" onClick={addAmenity} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((a, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                      {a}
                      <button type="button" onClick={() => removeAmenity(a)} className="text-red-600 hover:text-red-800">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="flex gap-2 mb-2">
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black" placeholder="Image URL" />
                  <button type="button" onClick={addImage} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt={`Project ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(img)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4" />
                  <span className="text-sm font-medium">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4" />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">{editingProject ? 'Update Project' : 'Create Project'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingProject(null); resetForm() }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Builder</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No projects found.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.images?.[0] ? (
                          <img src={project.images[0]} alt={project.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"><FiLayers className="w-6 h-6 text-gray-400" /></div>
                        )}
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {project.name}
                            {project.featured && <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <div className="text-sm text-gray-500">{project.projectType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{project.builder?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm">{project.projectType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.projectStatus === 'Ready' ? 'bg-green-100 text-green-700' :
                        project.projectStatus === 'Under Construction' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {project.projectStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.location?.city}, {project.location?.state}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleToggleFeatured(project._id)} className={`p-2 rounded-lg ${project.featured ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'}`} title="Toggle Featured"><FiStar className="w-4 h-4" /></button>
                        <button onClick={() => handleToggleStatus(project._id)} className={`p-2 rounded-lg ${project.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`} title="Toggle Status">{project.isActive ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}</button>
                        <button onClick={() => handleEdit(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(project._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
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

export default ProjectManagement

