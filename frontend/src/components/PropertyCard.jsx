import { Link } from 'react-router-dom'
import { FiMapPin, FiMaximize2, FiHeart, FiArrowRight } from 'react-icons/fi'
import { FaBed, FaBath } from 'react-icons/fa'
import { useState } from 'react'
import Badge from './ui/Badge'

const PropertyCard = ({ property }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col border border-grey-200 hover:border-grey-400 hover:shadow-strong hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-64 bg-grey-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={property.images[0]}
              alt={property.title}
              className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`} />

            {/* View Details Button - Shows on Hover */}
            <div className={`absolute inset-x-0 bottom-0 p-6 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
              <div className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg font-semibold text-sm shadow-lg">
                View Details
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-grey-400">
            <FiMaximize2 className="w-12 h-12" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant={status.variant} size="sm" className="shadow-lg backdrop-blur-sm">
            {status.label}
          </Badge>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 hover:scale-110 shadow-lg group/wishlist"
          aria-label="Add to wishlist"
        >
          <FiHeart
            className={`w-5 h-5 transition-all duration-200 ${isWishlisted ? 'fill-error text-error scale-110' : 'text-grey-700 group-hover/wishlist:text-error'
              }`}
          />
        </button>

        {/* Property Type Badge */}
        {property.propertyType && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-grey-900 capitalize shadow-md border border-grey-200">
              {property.propertyType}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Property Features */}
        <div className="flex items-center gap-4 text-grey-600 text-sm mb-3">
          <div className="flex items-center gap-1.5 group/feature">
            <FaBed className="w-4 h-4 text-grey-500 group-hover/feature:text-black transition-colors" />
            <span className="font-semibold">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 group/feature">
            <FaBath className="w-4 h-4 text-grey-500 group-hover/feature:text-black transition-colors" />
            <span className="font-semibold">{property.bathrooms}</span>
          </div>
          {property.area && (
            <div className="flex items-center gap-1.5 group/feature">
              <FiMaximize2 className="w-4 h-4 text-grey-500 group-hover/feature:text-black transition-colors" />
              <span className="font-semibold">{property.area} sq.ft</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-grey-900 mb-2 line-clamp-1 leading-tight group-hover:text-black transition-colors">
          {property.title}
        </h3>

        {/* Price */}
        <div className="text-2xl font-bold text-black mb-4 font-display">
          {formatPrice(property.price)}
        </div>

        {/* Location */}
        <div className="flex items-center text-grey-600 text-sm mt-auto pt-4 border-t border-grey-200 group-hover:border-grey-300 transition-colors">
          <FiMapPin className="mr-2 w-4 h-4 flex-shrink-0 text-grey-500" />
          <span className="line-clamp-1 font-medium">
            {property.location?.address}, {property.location?.city}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard
