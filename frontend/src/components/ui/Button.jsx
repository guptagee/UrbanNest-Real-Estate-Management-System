const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-black text-white hover:bg-grey-900 focus:ring-black shadow-md hover:shadow-lg',
        secondary: 'bg-white text-black border border-grey-200 hover:bg-grey-100 focus:ring-grey-300',
        outline: 'bg-transparent text-black border border-grey-300 hover:bg-grey-100 focus:ring-grey-300',
        ghost: 'bg-transparent text-black hover:bg-grey-100 focus:ring-grey-300',
        danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-md hover:shadow-lg',
        success: 'bg-success text-white hover:bg-green-600 focus:ring-success shadow-md hover:shadow-lg',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
        md: 'px-4 py-2.5 text-base rounded-lg gap-2',
        lg: 'px-6 py-3 text-lg rounded-xl gap-2.5',
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    )
}

export default Button
