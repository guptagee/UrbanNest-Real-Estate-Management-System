import { Link } from 'react-router-dom'
import { FiMapPin, FiMaximize2 } from 'react-icons/fi'
import { FaBed, FaBath } from 'react-icons/fa'
import { format } from 'date-fns'

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <Link
      to={`/properties/${property._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {property.featured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </span>
        )}
        <span className="absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded text-sm font-semibold">
          {formatPrice(property.price)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <FiMapPin className="mr-1" />
          <span className="line-clamp-1">
            {property.location?.address}, {property.location?.city}, {property.location?.state}
          </span>
        </div>
        <div className="flex items-center justify-between text-gray-600 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaBed className="mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <FiMaximize2 className="mr-1" />
              <span>{property.area} {property.areaUnit || 'sqm'}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            property.status === 'available' ? 'bg-green-100 text-green-800' :
            property.status === 'sold' ? 'bg-red-100 text-red-800' :
            property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard

