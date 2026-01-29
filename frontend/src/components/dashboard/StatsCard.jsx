import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'black' }) => {
    const iconBgColors = {
        black: 'bg-grey-800',
        success: 'bg-success/20',
        warning: 'bg-warning/20',
        error: 'bg-error/20',
        info: 'bg-info/20',
    }

    const iconColors = {
        black: 'text-white',
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-error',
        info: 'text-info',
    }

    return (
        <div className="group bg-white rounded-2xl p-6 border border-grey-200 hover:border-grey-400 transition-all duration-300 hover:shadow-medium">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-grey-600 uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold text-grey-900 font-display group-hover:text-black transition-colors">
                        {value}
                    </h3>
                </div>

                {Icon && (
                    <div className={`p-3 rounded-xl ${iconBgColors[color]} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${iconColors[color]}`} />
                    </div>
                )}
            </div>

            {trend && (
                <div className="flex items-center gap-2 pt-3 border-t border-grey-200">
                    {trend === 'up' ? (
                        <div className="flex items-center gap-1 text-success text-sm font-semibold">
                            <FiTrendingUp className="w-4 h-4" />
                            <span>{trendValue || '+0%'}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-error text-sm font-semibold">
                            <FiTrendingDown className="w-4 h-4" />
                            <span>{trendValue || '-0%'}</span>
                        </div>
                    )}
                    <span className="text-xs text-grey-500">vs last month</span>
                </div>
            )}
        </div>
    )
}

export default StatsCard
