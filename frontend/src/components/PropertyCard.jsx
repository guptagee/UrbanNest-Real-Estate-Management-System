import { Link } from 'react-router-dom'
import { FiMapPin, FiMaximize2, FiHeart } from 'react-icons/fi'
import { FaBed, FaBath } from 'react-icons/fa'
import { useState } from 'react'
import Badge from './ui/Badge'

const PropertyCard = ({ property }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleWishlistClick = (e) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  const getStatusBadge = () => {
    const statusConfig = {
      available: { variant: 'success', label: 'For Sale' },
      sold: { variant: 'error', label: 'Sold' },
      rented: { variant: 'info', label: 'Rented' },
      pending: { variant: 'warning', label: 'Pending' },
    }
    return statusConfig[property.status] || statusConfig.available
  }

  const status = getStatusBadge()

  return (
    <Link
      to={`/properties/${property._id}`}
      className="group bg-white rounded-2xl overflow-hidden hover-lift h-full flex flex-col border border-gray-100"
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={property.images[0]}
              alt={property.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              onLoad={() => setImageLoaded(true)}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiMaximize2 className="w-12 h-12" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant={status.variant} size="sm" className="shadow-lg">
            {status.label}
          </Badge>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 hover:scale-110 shadow-lg"
        >
          <FiHeart
            className={`w-5 h-5 transition-all duration-200 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
          />
        </button>

        {/* Property Type Badge */}
        {property.propertyType && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900 capitalize shadow-md">
              {property.propertyType}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Property Features */}
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
          <div className="flex items-center gap-1.5">
            <FaBed className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaBath className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{property.bathrooms}</span>
          </div>
          {property.area && (
            <div className="flex items-center gap-1.5">
              <FiMaximize2 className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{property.area} sq.ft</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 leading-tight group-hover:text-[#0E0E0E] transition-colors">
          {property.title}
        </h3>

        {/* Price */}
        <div className="text-2xl font-bold text-[#0E0E0E] mb-4">
          {formatPrice(property.price)}
        </div>

        {/* Location */}
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
