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
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
    >
      <div className="relative h-64 bg-gray-200">
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
        {property.status === 'available' && (
          <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md">
            For Sale
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-gray-600 text-sm mb-4 space-x-4">
          <div className="flex items-center">
            <FaBed className="mr-2 w-4 h-4" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-2 w-4 h-4" />
            <span>{property.bathrooms} Baths</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 leading-tight">
          {property.title}
        </h3>
        <div className="text-2xl font-bold text-[#0E0E0E] mb-3">
          {formatPrice(property.price)}
        </div>
        <div className="flex items-center text-gray-500 text-sm mt-auto pt-4 border-t border-gray-100">
          <FiMapPin className="mr-2 w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.location?.address}, {property.location?.city}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard
