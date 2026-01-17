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

            {/* Premium Savings CTA Section */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 relative overflow-hidden">
                {/* Subtle decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Your Monthly Savings
                            </p>
                            <div className="flex items-center gap-3">
                                {/* Spark/Checkmark Icon */}
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                {/* Premium serif font for savings number */}
                                <p className="text-5xl font-bold tracking-tight text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    ${data.savings.total.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {data.savings.percentage}% less
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-6">
                        Switch to Paaaid and save <span className="font-semibold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>${data.savings.annual.toLocaleString()}</span> annually.
                        That's money back in your business.
                    </p>

                    {/* Pill-shaped CTA Button */}
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-8 rounded-full 
                                     transition-all duration-200 
                                     hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30
                                     active:translate-y-0 active:shadow-md">
                        Get Started with Paaaid
                    </button>
                </div>
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
