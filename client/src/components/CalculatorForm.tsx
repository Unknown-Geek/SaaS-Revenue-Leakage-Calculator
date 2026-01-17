import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export interface CalculatorFormData {
    mrr: number
    processor: string
    international_percent: number
    eu_percent: number
    failed_payment_rate: number
}

interface CalculatorFormProps {
    onCalculate: (data: CalculatorFormData) => void
    loading: boolean
}

// Animation variants for staggered fade-in from left
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
}

export function CalculatorForm({ onCalculate, loading }: CalculatorFormProps) {
    const [mrr, setMrr] = useState<string>('10000')
    const [processor, setProcessor] = useState<string>('stripe')
    const [internationalPercent, setInternationalPercent] = useState<number>(30)
    const [euPercent, setEuPercent] = useState<number>(20)
    const [failedPaymentRate, setFailedPaymentRate] = useState<number>(5)

    // Debounced auto-calculate
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const formData: CalculatorFormData = {
                mrr: parseFloat(mrr) || 0,
                processor,
                international_percent: internationalPercent,
                eu_percent: euPercent,
                failed_payment_rate: failedPaymentRate,
            }

            if (formData.mrr > 0) {
                onCalculate(formData)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [mrr, processor, internationalPercent, euPercent, failedPaymentRate, onCalculate])

    const handleManualCalculate = useCallback(() => {
        const formData: CalculatorFormData = {
            mrr: parseFloat(mrr) || 0,
            processor,
            international_percent: internationalPercent,
            eu_percent: euPercent,
            failed_payment_rate: failedPaymentRate,
        }
        onCalculate(formData)
    }, [mrr, processor, internationalPercent, euPercent, failedPaymentRate, onCalculate])

    return (
        <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                    Your Business Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Enter your current metrics to calculate potential savings
                </p>
            </div>

            <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* MRR Input */}
                <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                        htmlFor="mrr"
                        className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                        Monthly Recurring Revenue
                    </Label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <Input
                            id="mrr"
                            type="number"
                            value={mrr}
                            onChange={(e) => setMrr(e.target.value)}
                            className="pl-8 h-12 bg-slate-50 border-transparent text-slate-900 font-medium rounded-xl 
                         transition-all duration-200 
                         focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-transparent
                         placeholder:text-slate-400"
                            placeholder="10000"
                        />
                    </div>
                </motion.div>

                {/* Processor Select */}
                <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                        htmlFor="processor"
                        className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                        Payment Processor
                    </Label>
                    <Select value={processor} onValueChange={setProcessor}>
                        <SelectTrigger
                            className="h-12 bg-slate-50 border-transparent text-slate-900 font-medium rounded-xl 
                         transition-all duration-200
                         focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-transparent"
                        >
                            <SelectValue placeholder="Select processor" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                            <SelectItem value="stripe" className="rounded-lg">Stripe</SelectItem>
                            <SelectItem value="paypal" className="rounded-lg">PayPal</SelectItem>
                            <SelectItem value="paddle" className="rounded-lg">Paddle</SelectItem>
                            <SelectItem value="lemon" className="rounded-lg">Lemon Squeezy</SelectItem>
                        </SelectContent>
                    </Select>
                </motion.div>

                {/* International Transactions Slider */}
                <motion.div className="space-y-4" variants={itemVariants}>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            International Transactions
                        </Label>
                        <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {internationalPercent}%
                        </span>
                    </div>
                    <Slider
                        value={[internationalPercent]}
                        onValueChange={(value) => setInternationalPercent(value[0])}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-white 
                       [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 
                       [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200
                       [&_[role=slider]]:hover:scale-110
                       [&_.relative]:h-2 [&_.relative]:bg-slate-100 [&_.relative]:rounded-full
                       [&_[data-orientation=horizontal]]:bg-blue-500"
                    />
                </motion.div>

                {/* EU Customers Slider */}
                <motion.div className="space-y-4" variants={itemVariants}>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            EU Customers
                        </Label>
                        <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {euPercent}%
                        </span>
                    </div>
                    <Slider
                        value={[euPercent]}
                        onValueChange={(value) => setEuPercent(value[0])}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-white 
                       [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 
                       [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200
                       [&_[role=slider]]:hover:scale-110
                       [&_.relative]:h-2 [&_.relative]:bg-slate-100 [&_.relative]:rounded-full
                       [&_[data-orientation=horizontal]]:bg-blue-500"
                    />
                </motion.div>

                {/* Failed Payment Rate Slider */}
                <motion.div className="space-y-4" variants={itemVariants}>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Failed Payment Rate
                        </Label>
                        <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {failedPaymentRate}%
                        </span>
                    </div>
                    <Slider
                        value={[failedPaymentRate]}
                        onValueChange={(value) => setFailedPaymentRate(value[0])}
                        max={20}
                        step={0.5}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-white 
                       [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 
                       [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200
                       [&_[role=slider]]:hover:scale-110
                       [&_.relative]:h-2 [&_.relative]:bg-slate-100 [&_.relative]:rounded-full
                       [&_[data-orientation=horizontal]]:bg-blue-500"
                    />
                </motion.div>

                {/* Calculate Button */}
                <motion.div variants={itemVariants}>
                    <Button
                        onClick={handleManualCalculate}
                        disabled={loading}
                        className="w-full h-12 bg-[#00A8E8] hover:bg-[#0088BC] text-white font-semibold rounded-xl 
                       transition-all duration-200 shadow-lg shadow-blue-500/25 
                       hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Calculating...
                            </span>
                        ) : (
                            'Calculate Savings'
                        )}
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
