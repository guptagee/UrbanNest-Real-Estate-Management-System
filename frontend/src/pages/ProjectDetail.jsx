import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FiMapPin, FiCalendar, FiMessageSquare, FiStar, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import ProjectCard from '../components/ProjectCard'
import { FaBuilding } from "react-icons/fa";

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const isBuyer = user?.role === 'user'
  const [project, setProject] = useState(null)
  const [units, setUnits] = useState([])
  const [similarProjects, setSimilarProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [inquiryData, setInquiryData] = useState({
    message: '',
    contactPreference: 'both',
    userEmail: user?.email || '',
    userPhone: user?.phone || ''
  })

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`)
      const projectData = response.data.data
      setProject(projectData)

      // Fetch units
      try {
        const unitsRes = await axios.get(`/api/units?project=${id}`)
        setUnits(unitsRes.data.data || [])
      } catch (error) {
        console.error('Failed to fetch units:', error)
      }

      // Fetch similar projects
      try {
        const similarRes = await axios.get(`/api/projects?projectType=${projectData.projectType}&city=${projectData.location?.city}`)
        const similar = (similarRes.data.data || []).filter(p => p._id !== id).slice(0, 3)
        setSimilarProjects(similar)
      } catch (error) {
        console.error('Failed to fetch similar projects:', error)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Project not found')
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  const handleInquiry = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to send an inquiry')
      navigate('/login')
      return
    }

    if (!isBuyer) {
      toast.error('Only buyers can send inquiries')
      return
    }

    try {
      await axios.post('/api/inquiries', {
        project: id,
        ...inquiryData
      })
      toast.success('Inquiry submitted successfully!')
      setShowInquiryModal(false)
      setInquiryData({
        message: '',
        contactPreference: 'both',
        userEmail: user?.email || '',
        userPhone: user?.phone || ''
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/projects" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Projects
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {project.images && project.images.length > 0 ? (
              project.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`${project.name} - Image ${idx + 1}`}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              ))
            ) : (
              <div className="col-span-2 h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                <FaBuilding className="w-16 h-16" />
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                  {project.featured && <FiStar className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <FaBuilding className="mr-2" />
                  <span className="font-medium">{project.builder?.name}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <FiMapPin className="mr-2" />
                  <span>
                    {project.location?.address}, {project.location?.city}, {project.location?.state} - {project.location?.zipCode}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.projectStatus === 'Ready' ? 'bg-green-100 text-green-800' :
                  project.projectStatus === 'Under Construction' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {project.projectStatus}
                </span>
                <div className="mt-2 text-sm text-gray-600">
                  {project.projectType}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600">Project Type</div>
                <div className="text-lg font-semibold">{project.projectType}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Status</div>
                <div className="text-lg font-semibold">{project.projectStatus}</div>
              </div>
              {project.totalUnits > 0 && (
                <div className="text-center">
                  <div className="text-sm text-gray-600">Total Units</div>
                  <div className="text-lg font-semibold">{project.totalUnits}</div>
                </div>
              )}
              {project.possessionDate && (
                <div className="text-center">
                  <FiCalendar className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Possession</div>
                  <div className="text-lg font-semibold">
                    {new Date(project.possessionDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">About This Project</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Builder Info */}
            {project.builder && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Builder Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Company</div>
                    <div className="font-medium">{project.builder.companyName}</div>
                  </div>
                  {project.builder.reraNumber && (
                    <div>
                      <div className="text-sm text-gray-600">RERA Number</div>
                      <div className="font-medium">{project.builder.reraNumber}</div>
                    </div>
                  )}
                  {project.builder.contact && (
                    <>
                      {project.builder.contact.email && (
                        <div>
                          <div className="text-sm text-gray-600">Email</div>
                          <div className="font-medium">{project.builder.contact.email}</div>
                        </div>
                      )}
                      {project.builder.contact.phone && (
                        <div>
                          <div className="text-sm text-gray-600">Phone</div>
                          <div className="font-medium">{project.builder.contact.phone}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <FiCheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Units */}
            {units.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Available Units</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Unit No</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Type</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Area</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Price</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {units.map((unit) => (
                        <tr key={unit._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{unit.unitNumber}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{unit.unitType}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{unit.area} {unit.areaUnit}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0
                            }).format(unit.price)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              unit.availabilityStatus === 'Available' ? 'bg-green-100 text-green-800' :
                              unit.availabilityStatus === 'Booked' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {unit.availabilityStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isBuyer && (
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  <FiMessageSquare className="w-5 h-5" />
                  Send Inquiry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Similar Projects */}
        {similarProjects.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Similar Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProjects.map((proj) => (
                <ProjectCard key={proj._id} project={proj} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Send Inquiry</h3>
            <form onSubmit={handleInquiry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={inquiryData.userEmail}
                  onChange={(e) => setInquiryData({ ...inquiryData, userEmail: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  value={inquiryData.userPhone}
                  onChange={(e) => setInquiryData({ ...inquiryData, userPhone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="Tell us about your requirements..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Send Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail

