import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Loader } from './Loader'

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

// Animation variants for staggered fade-in from bottom
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut' as const,
        },
    },
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

// Loading Component
function LoadingState() {
    return (
        <motion.div
            className="flex items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Loader />
        </motion.div>
    )
}

export function ResultsDisplay({ data, loading, mrr }: ResultsDisplayProps) {
    if (!data) {
        return <LoadingState />
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
        <motion.div
            className={`space-y-4 transition-opacity duration-200 ${loading ? 'opacity-60' : ''}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Bento Grid - Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Net Revenue Card */}
                <motion.div
                    className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 relative overflow-hidden"
                    variants={cardVariants}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Net Revenue
                        </p>
                        <p className="text-4xl font-bold tracking-tighter text-emerald-600">
                            $<CountUp end={netRevenue} duration={1} separator="," preserveValue />
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            After Paaaid fees
                        </p>
                    </div>
                </motion.div>

                {/* Total Leakage Card */}
                <motion.div
                    className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 relative overflow-hidden"
                    variants={cardVariants}
                >
                    {/* Red glow effect for alarming feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 to-transparent pointer-events-none" />
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Total Leakage
                        </p>
                        <p className="text-4xl font-bold tracking-tighter text-rose-500">
                            $<CountUp end={totalLeakage} duration={1} separator="," preserveValue />
                        </p>
                        <p className="text-xs text-rose-500/80 mt-2">
                            With current provider
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Savings CTA Section */}
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50"
                variants={cardVariants}
            >
                <div className="flex items-center justify-between mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Your Monthly Savings
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <CountUp end={data.savings.percentage} duration={1} decimals={1} preserveValue />%
                    </div>
                </div>

                <p className="text-5xl font-bold tracking-tight text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    $<CountUp end={data.savings.total} duration={1.2} separator="," preserveValue />
                </p>

                <p className="text-slate-500 text-sm mb-8">
                    Save <span className="font-semibold text-slate-700">${data.savings.annual.toLocaleString()}</span> annually with Paaaid
                </p>

                <button
                    className="w-full bg-[#00A8E8] hover:bg-[#0090C8] text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200"
                    onClick={() => {
                        // Fire tracking event if analytics is available
                        const win = window as unknown as { gtag?: (event: string, eventName: string, params?: Record<string, string | number>) => void }
                        if (typeof window !== 'undefined' && win.gtag) {
                            win.gtag('event', 'cta_clicked', {
                                mrr_value: mrr,
                                destination: mrr <= 20000 ? 'signup' : 'demo'
                            })
                        }

                        // Smart routing based on MRR
                        const utmParams = '?utm_source=calculator&utm_medium=tool&utm_campaign=revenue_leak'
                        const destination = mrr <= 20000 ? '/signup' : '/demo'
                        window.location.href = destination + utmParams
                    }}
                >
                    See How paaaid Fixes This →
                </button>
            </motion.div>

            {/* Chart Card */}
            <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50"
                variants={cardVariants}
            >
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
            </motion.div>

            {/* Comparison Table Card */}
            <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50"
                variants={cardVariants}
            >
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
            </motion.div>
        </motion.div>
    )
}
