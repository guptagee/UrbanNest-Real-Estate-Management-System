import { Link } from 'react-router-dom'
import { FiMapPin,  FiStar } from 'react-icons/fi'
import { FaBuilding } from "react-icons/fa";

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
    >
      <div className="relative h-64 bg-gray-200">
        {project.images && project.images.length > 0 ? (
          <img
            src={project.images[0]}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FaBuilding className="w-16 h-16" />
          </div>
        )}
        {project.featured && (
          <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-md">
            <FiStar className="w-4 h-4" />
            Featured
          </span>
        )}
        <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md ${
          project.projectStatus === 'Ready' ? 'bg-green-600 text-white' :
          project.projectStatus === 'Under Construction' ? 'bg-blue-600 text-white' :
          'bg-amber-600 text-white'
        }`}>
          {project.projectStatus}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <FiMapPin className="mr-1 w-4 h-4" />
          <span>{project.location?.city}, {project.location?.state}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {project.name}
        </h3>
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-2 font-medium">
              <FaBuilding className="w-4 h-4 text-gray-400" />
              {project.builder?.name || 'Builder'}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              {project.projectType}
            </span>
          </div>
          {project.totalUnits > 0 && (
            <div className="text-sm text-gray-500 font-medium">
              {project.totalUnits} Units Available
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
