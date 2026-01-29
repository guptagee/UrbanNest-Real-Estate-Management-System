const Input = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    className = '',
    containerClassName = '',
    ...props
}) => {
    const baseStyles = 'w-full px-4 py-3 transition-all duration-200 focus:outline-none'

    const variants = {
        default: 'border border-grey-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white',
        filled: 'bg-grey-100 border border-transparent rounded-xl focus:ring-2 focus:ring-black focus:bg-white',
        outlined: 'border-2 border-grey-300 rounded-xl focus:border-black bg-transparent',
    }

    const errorStyles = error ? 'border-error focus:ring-error' : ''

    return (
        <div className={`${containerClassName}`}>
            {label && (
                <label className="block text-sm font-semibold text-grey-900 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={`${baseStyles} ${variants[variant]} ${errorStyles} ${leftIcon ? 'pl-12' : ''} ${rightIcon ? 'pr-12' : ''} ${className}`}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-error">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-grey-600">{helperText}</p>
            )}
        </div>
    )
}

export default Input
