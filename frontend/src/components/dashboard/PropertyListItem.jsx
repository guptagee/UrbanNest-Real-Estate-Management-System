import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const PropertyListItem = ({ property, onUpdate }) => {
    const navigate = useNavigate()
    const [isToggling, setIsToggling] = useState(false)

    const handleStatusChange = async (e) => {
        e.stopPropagation()
        const newStatus = e.target.value
        setIsToggling(true)
        try {
            await api.put(`/properties/${property._id}`, { status: newStatus })
            toast.success('Property status updated')
            if (onUpdate) onUpdate()
        } catch (error) {
            toast.error('Failed to update property status')
        } finally {
            setIsToggling(false)
        }
    }

    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this property?')) return

        try {
            await api.delete(`/properties/${property._id}`)
            toast.success('Property deleted successfully')
            if (onUpdate) onUpdate()
        } catch (error) {
            toast.error('Failed to delete property')
        }
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        navigate(`/properties/${property._id}/edit`)
    }

    return (
        <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100">
            {/* Property Image */}
            <Link to={`/properties/${property._id}`} className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img
                    src={property?.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=500'}
                    alt={property?.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {property?.images?.length > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="font-bold">{property.images.length}</span>
                    </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold ${property.status === 'available' ? 'bg-green-500 text-white' :
                        property.status === 'sold' ? 'bg-red-500 text-white' :
                            property.status === 'rented' ? 'bg-blue-500 text-white' :
                                'bg-yellow-500 text-white'
                    }`}>
                    {property.status}
                </div>
            </Link>

            {/* Property Details */}
            <div className="flex-1 min-w-0">
                <Link to={`/properties/${property._id}`}>
                    <h3 className="text-xl font-bold tracking-tight truncate hover:text-primary-600 transition-colors">
                        ₹{property?.price?.toLocaleString() || '0'}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 truncate mt-1">{property?.title}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                    <span>{property?.bedrooms || 0} beds</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{property?.bathrooms || 0} baths</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{property?.area || 0} {property?.areaUnit || 'sqm'}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mt-2">
                    <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {property?.location?.city || 'Location not specified'}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <select
                    value={property.status}
                    onChange={handleStatusChange}
                    disabled={isToggling}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold outline-none border-none ${
                        property.status === 'available' ? 'bg-green-50 text-green-700' :
                        property.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        property.status === 'sold' ? 'bg-red-50 text-red-700' :
                        property.status === 'rented' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-700'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                </select>

                <button
                    onClick={handleEdit}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                    title="Edit Property"
                >
                    <FiEdit2 className="w-4 h-4" />
                </button>

                <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    title="Delete Property"
                >
                    <FiTrash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default PropertyListItem
