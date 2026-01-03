import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { FiArrowUpRight, FiArrowDownRight, FiMoreHorizontal } from 'react-icons/fi'

const StatsCard = ({ title, value, data, trend, trendValue, subtitle }) => {
    const isPositive = trend === 'up'

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-tight">{title}</span>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <div className="text-3xl font-bold tracking-tight mb-4">{value}</div>
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isPositive ? <FiArrowUpRight className="mr-0.5" /> : <FiArrowDownRight className="mr-0.5" />}
                            {trendValue}%
                        </span>
                        <span className="text-[10px] text-gray-400">{subtitle}</span>
                    </div>
                </div>

                <div className="w-20 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={isPositive ? '#10b981' : '#f43f5e'}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                <button className="text-[10px] font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    Show more <FiArrowUpRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}

export default StatsCard
