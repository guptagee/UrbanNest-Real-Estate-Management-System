import { Link } from 'react-router-dom'
import { FiMapPin, FiStar, FiArrowRight } from 'react-icons/fi'
import { FaBuilding } from "react-icons/fa"
import { useState } from 'react'

const ProjectCard = ({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status) => {
    const colors = {
      'Ready': 'bg-success text-white',
      'Under Construction': 'bg-grey-800 text-white',
      'Upcoming': 'bg-warning text-white',
    }
    return colors[status] || 'bg-grey-700 text-white'
  }

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-strong hover:-translate-y-2 h-full flex flex-col border border-grey-200 hover:border-grey-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 bg-grey-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        {project.images && project.images.length > 0 ? (
          <>
            <img
              src={project.images[0]}
              alt={project.name}
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
                Explore Project
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-grey-400">
            <FaBuilding className="w-16 h-16" />
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <span className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-grey-700">
            <FiStar className="w-3.5 h-3.5 fill-white" />
            Featured
          </span>
        )}

        {/* Status Badge */}
        <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm ${getStatusColor(project.projectStatus)}`}>
          {project.projectStatus}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Location */}
        <div className="flex items-center text-grey-600 text-sm mb-3">
          <FiMapPin className="mr-1.5 w-4 h-4 text-grey-500" />
          <span className="font-medium">{project.location?.city}, {project.location?.state}</span>
        </div>

        {/* Project Name */}
        <h3 className="text-xl font-bold text-grey-900 mb-3 line-clamp-2 leading-tight group-hover:text-black transition-colors">
          {project.name}
        </h3>

        <div className="mt-auto">
          {/* Builder Info */}
          <div className="flex items-center justify-between text-sm text-grey-600 mb-3 pt-3 border-t border-grey-200 group-hover:border-grey-300 transition-colors">
            <span className="flex items-center gap-2 font-semibold">
              <FaBuilding className="w-4 h-4 text-grey-500" />
              {project.builder?.name || 'Builder'}
            </span>
            <span className="px-3 py-1 bg-grey-100 rounded-full text-xs font-bold text-grey-700 capitalize">
              {project.projectType}
            </span>
          </div>

          {/* Units Available */}
          {project.totalUnits > 0 && (
            <div className="text-sm text-grey-600 font-semibold">
              <span className="text-black">{project.totalUnits}</span> Units Available
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
