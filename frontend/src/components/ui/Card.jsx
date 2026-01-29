const Card = ({
    children,
    variant = 'default',
    hover = false,
    className = '',
    header,
    footer,
    ...props
}) => {
    const baseStyles = 'bg-white rounded-2xl transition-all duration-200'

    const variants = {
        default: 'border border-grey-200',
        elevated: 'shadow-medium',
        bordered: 'border-2 border-grey-300',
    }

    const hoverStyles = hover ? 'hover:shadow-strong hover:-translate-y-1 cursor-pointer' : ''

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
            {...props}
        >
            {header && (
                <div className="px-6 py-4 border-b border-grey-200">
                    {header}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 border-t border-grey-200 bg-grey-50 rounded-b-2xl">
                    {footer}
                </div>
            )}
        </div>
    )
}

export default Card
