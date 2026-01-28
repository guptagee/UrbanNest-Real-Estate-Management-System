import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { FiArrowUpRight, FiArrowDownRight, FiMoreHorizontal, FiTrendingUp } from 'react-icons/fi'

const StatsCard = ({ title, value, data, trend, trendValue, subtitle, icon: Icon, color = 'blue' }) => {
    const isPositive = trend === 'up'
    
    const colorClasses = {
        blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900',
        emerald: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900',
        purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900',
        rose: 'from-rose-50 to-rose-100 border-rose-200 text-rose-900',
        amber: 'from-amber-50 to-amber-100 border-amber-200 text-amber-900'
    }
    
    const iconColorClasses = {
        blue: 'bg-blue-500 text-blue-500',
        emerald: 'bg-emerald-500 text-emerald-500',
        purple: 'bg-purple-500 text-purple-500',
        rose: 'bg-rose-500 text-rose-500',
        amber: 'bg-amber-500 text-amber-500'
    }
    
    const chartColor = {
        blue: '#3b82f6',
        emerald: '#10b981',
        purple: '#8b5cf6',
        rose: '#f43f5e',
        amber: '#f59e0b'
    }

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 group`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{title}</span>
                {Icon && (
                    <div className={`p-2 ${iconColorClasses[color]} bg-opacity-10 rounded-xl text-${color}-600 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="text-4xl font-bold">{value}</div>
                
                <div className="flex items-center gap-3">
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                        isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {isPositive ? <FiArrowUpRight className="mr-1" /> : <FiArrowDownRight className="mr-1" />}
                        {trendValue}%
                    </div>
                    <span className="text-xs opacity-70">{subtitle}</span>
                </div>
            </div>

            {data && data.length > 0 && (
                <div className="mt-4 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor[color]} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={chartColor[color]} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={chartColor[color]}
                                strokeWidth={2}
                                fill={`url(#gradient-${color})`}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-current border-opacity-10 flex justify-between items-center">
                <span className="text-xs opacity-60">Last 7 days</span>
                <button className="text-xs font-semibold hover:opacity-80 transition-opacity flex items-center gap-1">
                    View Details <FiTrendingUp className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}

export default StatsCard
