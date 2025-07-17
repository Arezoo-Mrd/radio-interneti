

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

const Chart = () => {

    const chartData = [
        { month: '۱۴۰۲/۱۲/۱۲', value: 2500 },
        { month: '۱۴۰۲/۱۲/۱۳', value: 3000 },
        { month: '۱۴۰۲/۱۲/۱۴', value: 1900 },
        { month: '۱۴۰۲/۱۲/۱۵', value: 2940 },
        { month: '۱۴۰۲/۱۲/۱۶', value: 1800 },
        { month: '۱۴۰۲/۱۲/۱۷', value: 3100 },
        { month: '۱۴۰۲/۱۲/۱۸', value: 3600 },

    ];

    const CustomTooltip = ({ active, payload }: { active: boolean, payload: any }) => {
        const isVisible = active && payload && payload.length;
        return (
            <div className="custom-tooltip bg-black shadow-sm rounded-xl text-white" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
                {isVisible && (
                    <div className='px-2 py-1 text-center '>
                        <p className="text-[12px]">{`تعداد کاربر`}</p>
                        <p className="intro font-PeydaSemiBold text-base">{payload[0].value}</p>
                    </div>

                )}
            </div>
        );
    };
    return (
        <div className="bg-white rounded-lg shadow-sm md:min-w-[654px] md:h-[354px]">

            <div className="p-6">
                <h2 className="text-lg font-PeydaBold text-black">گزارش بازدید</h2>
            </div>
            <div className="w-full">
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#5BC4FF" />
                                <stop offset="100%" stopColor="#FF5BEF" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#666' }}
                            interval={0}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#666' }}
                            domain={[0, 3000]}
                            ticks={[0, 1000, 2000, 3000]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e5e5',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            labelStyle={{ color: '#666' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="url(#lineGradient)"
                            strokeWidth={5}
                            dot={{ fill: '#fff', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, fill: '#8b5cf6' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Chart