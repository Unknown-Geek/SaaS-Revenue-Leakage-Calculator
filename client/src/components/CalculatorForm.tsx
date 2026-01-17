import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

export function CalculatorForm({ onCalculate, loading }: CalculatorFormProps) {
    const [mrr, setMrr] = useState<string>('10000')
    const [processor, setProcessor] = useState<string>('stripe')
    const [internationalPercent, setInternationalPercent] = useState<string>('30')
    const [euPercent, setEuPercent] = useState<string>('20')
    const [failedPaymentRate, setFailedPaymentRate] = useState<string>('5')

    // Debounced auto-calculate
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const formData: CalculatorFormData = {
                mrr: parseFloat(mrr) || 0,
                processor,
                international_percent: parseFloat(internationalPercent) || 0,
                eu_percent: parseFloat(euPercent) || 0,
                failed_payment_rate: parseFloat(failedPaymentRate) || 0,
            }

            // Only calculate if MRR is valid
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
            international_percent: parseFloat(internationalPercent) || 0,
            eu_percent: parseFloat(euPercent) || 0,
            failed_payment_rate: parseFloat(failedPaymentRate) || 0,
        }
        onCalculate(formData)
    }, [mrr, processor, internationalPercent, euPercent, failedPaymentRate, onCalculate])

    return (
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardHeader>
                <CardTitle className="text-slate-900">Your Business Details</CardTitle>
                <CardDescription className="text-slate-500">
                    Enter your current metrics to calculate potential savings
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="mrr" className="text-slate-700 font-medium">
                        Monthly Recurring Revenue ($)
                    </Label>
                    <Input
                        id="mrr"
                        type="number"
                        value={mrr}
                        onChange={(e) => setMrr(e.target.value)}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-paaaid focus:ring-paaaid"
                        placeholder="10000"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="processor" className="text-slate-700 font-medium">
                        Payment Processor
                    </Label>
                    <Select value={processor} onValueChange={setProcessor}>
                        <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl focus:border-paaaid focus:ring-paaaid">
                            <SelectValue placeholder="Select processor" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="paddle">Paddle</SelectItem>
                            <SelectItem value="lemon">Lemon Squeezy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="international" className="text-slate-700 font-medium">
                        International Transactions (%)
                    </Label>
                    <Input
                        id="international"
                        type="number"
                        value={internationalPercent}
                        onChange={(e) => setInternationalPercent(e.target.value)}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-paaaid focus:ring-paaaid"
                        placeholder="30"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="eu" className="text-slate-700 font-medium">
                        EU Customers (%)
                    </Label>
                    <Input
                        id="eu"
                        type="number"
                        value={euPercent}
                        onChange={(e) => setEuPercent(e.target.value)}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-paaaid focus:ring-paaaid"
                        placeholder="20"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="failed" className="text-slate-700 font-medium">
                        Failed Payment Rate (%)
                    </Label>
                    <Input
                        id="failed"
                        type="number"
                        value={failedPaymentRate}
                        onChange={(e) => setFailedPaymentRate(e.target.value)}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-paaaid focus:ring-paaaid"
                        placeholder="5"
                    />
                </div>

                <Button
                    onClick={handleManualCalculate}
                    disabled={loading}
                    className="w-full bg-paaaid hover:bg-[#0088BC] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    {loading ? 'Calculating...' : 'Calculate Savings'}
                </Button>
            </CardContent>
        </Card>
    )
}
