import { FiHeart } from 'react-icons/fi'

const Badge = ({ children, variant = 'default', size = 'md', className = '', animated = false }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700 border-gray-200',
        success: 'bg-green-50 text-green-700 border-green-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200',
        primary: 'bg-black text-white border-black',
    }

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
    }

    return (
        <span
            className={`
        inline-flex items-center justify-center
        font-medium rounded-full border
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
        >
            {children}
        </span>
    )
}

export default Badge
