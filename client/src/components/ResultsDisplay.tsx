import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ResultsData {
    current: {
        payment_fees: number
        fx_fees: number
        failed_payments: number
        tax_overhead: number
        chargebacks: number
        total: number
    }
    paaaid: {
        payment_fees: number
        fx_fees: number
        failed_payments: number
        tax_overhead: number
        chargebacks: number
        total: number
    }
    savings: {
        total: number
        percentage: number
        annual: number
    }
}

interface ResultsDisplayProps {
    data: ResultsData | null
    loading: boolean
    mrr: number
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-md shadow-lg">
                <p className="font-medium">{label}</p>
                <p className="text-slate-300">${payload[0].value.toLocaleString()}</p>
            </div>
        )
    }
    return null
}

export function ResultsDisplay({ data, loading, mrr }: ResultsDisplayProps) {
    if (!data) {
        return (
            <div className="h-full flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#00A8E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-slate-500">
                        {loading ? 'Calculating...' : 'Enter your details to see your potential savings with Paaaid'}
                    </p>
                </div>
            </div>
        )
    }

    const netRevenue = mrr - data.paaaid.total
    const totalLeakage = data.current.total

    // Chart data for cost breakdown
    const chartData = [
        { name: 'Payment Fees', current: data.current.payment_fees, paaaid: data.paaaid.payment_fees },
        { name: 'FX Fees', current: data.current.fx_fees, paaaid: data.paaaid.fx_fees },
        { name: 'Failed Payments', current: data.current.failed_payments, paaaid: data.paaaid.failed_payments },
        { name: 'Tax Overhead', current: data.current.tax_overhead, paaaid: data.paaaid.tax_overhead },
        { name: 'Chargebacks', current: data.current.chargebacks, paaaid: data.paaaid.chargebacks },
    ]

    // Pastel colors for bars
    const barColors = ['#60a5fa', '#f87171', '#fbbf24', '#34d399', '#a78bfa']

    return (
        <div className="space-y-4">
            {/* Bento Grid - Top Metric Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Net Revenue Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Net Revenue
                        </p>
                        <p className="text-4xl font-bold tracking-tighter text-emerald-600">
                            ${netRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            After Paaaid fees
                        </p>
                    </div>
                </div>

                {/* Total Leakage Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 relative overflow-hidden">
                    {/* Red glow effect for alarming feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 to-transparent pointer-events-none" />
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Total Leakage
                        </p>
                        <p className="text-4xl font-bold tracking-tighter text-rose-500">
                            ${totalLeakage.toLocaleString()}
                        </p>
                        <p className="text-xs text-rose-500/80 mt-2">
                            With current provider
                        </p>
                    </div>
                </div>
            </div>

            {/* Savings Summary Card */}
            <div className="bg-gradient-to-r from-[#00A8E8] to-[#0088BC] p-6 rounded-2xl shadow-lg shadow-blue-500/25 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                            Monthly Savings with Paaaid
                        </p>
                        <p className="text-3xl font-bold tracking-tighter">
                            ${data.savings.total.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{data.savings.percentage}%</p>
                        <p className="text-xs text-white/70">reduction</p>
                    </div>
                </div>
                <p className="text-sm text-white/80 mt-3 pt-3 border-t border-white/20">
                    That's <span className="font-semibold text-white">${data.savings.annual.toLocaleString()}</span> saved annually
                </p>
            </div>

            {/* Chart Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Cost Breakdown Comparison</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(value) => `$${value}`} />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="current" radius={[0, 4, 4, 0]} maxBarSize={24}>
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={barColors[index]} fillOpacity={0.7} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-blue-400/70" /> Payment Fees
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-rose-400/70" /> FX Fees
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-amber-400/70" /> Failed
                    </span>
                </div>
            </div>

            {/* Comparison Table Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Detailed Comparison</h3>
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                        <span>Category</span>
                        <span className="text-center">Current</span>
                        <span className="text-center text-[#00A8E8]">Paaaid</span>
                    </div>

                    {[
                        { label: 'Payment Fees', current: data.current.payment_fees, paaaid: data.paaaid.payment_fees },
                        { label: 'FX Fees', current: data.current.fx_fees, paaaid: data.paaaid.fx_fees },
                        { label: 'Failed Payments', current: data.current.failed_payments, paaaid: data.paaaid.failed_payments },
                        { label: 'Tax Overhead', current: data.current.tax_overhead, paaaid: data.paaaid.tax_overhead },
                        { label: 'Chargebacks', current: data.current.chargebacks, paaaid: data.paaaid.chargebacks },
                    ].map((row) => (
                        <div key={row.label} className="grid grid-cols-3 gap-4 text-sm py-2">
                            <span className="text-slate-600">{row.label}</span>
                            <span className="text-center text-slate-700 font-medium">${row.current.toLocaleString()}</span>
                            <span className="text-center text-emerald-600 font-semibold">${row.paaaid.toLocaleString()}</span>
                        </div>
                    ))}

                    <div className="grid grid-cols-3 gap-4 text-sm font-bold py-3 border-t border-slate-200">
                        <span className="text-slate-900">Total</span>
                        <span className="text-center text-rose-500">${data.current.total.toLocaleString()}</span>
                        <span className="text-center text-emerald-600">${data.paaaid.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
