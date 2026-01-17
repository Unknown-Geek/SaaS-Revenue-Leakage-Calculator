import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CalculationResult {
  success: boolean
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

function App() {
  const [mrr, setMrr] = useState<string>('10000')
  const [processor, setProcessor] = useState<string>('stripe')
  const [internationalPercent, setInternationalPercent] = useState<string>('30')
  const [euPercent, setEuPercent] = useState<string>('20')
  const [failedPaymentRate, setFailedPaymentRate] = useState<string>('5')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mrr: parseFloat(mrr),
          processor,
          international_percent: parseFloat(internationalPercent),
          eu_percent: parseFloat(euPercent),
          failed_payment_rate: parseFloat(failedPaymentRate),
        }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Calculation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            SaaS Revenue Leakage Calculator
          </h1>
          <p className="text-slate-300">
            Discover how much you could save with Paaaid
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Business Details</CardTitle>
              <CardDescription className="text-slate-300">
                Enter your current metrics to calculate potential savings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mrr" className="text-white">Monthly Recurring Revenue ($)</Label>
                <Input
                  id="mrr"
                  type="number"
                  value={mrr}
                  onChange={(e) => setMrr(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="10000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processor" className="text-white">Payment Processor</Label>
                <Select value={processor} onValueChange={setProcessor}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select processor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="paddle">Paddle</SelectItem>
                    <SelectItem value="lemon">Lemon Squeezy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="international" className="text-white">International Transactions (%)</Label>
                <Input
                  id="international"
                  type="number"
                  value={internationalPercent}
                  onChange={(e) => setInternationalPercent(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eu" className="text-white">EU Customers (%)</Label>
                <Input
                  id="eu"
                  type="number"
                  value={euPercent}
                  onChange={(e) => setEuPercent(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="failed" className="text-white">Failed Payment Rate (%)</Label>
                <Input
                  id="failed"
                  type="number"
                  value={failedPaymentRate}
                  onChange={(e) => setFailedPaymentRate(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="5"
                />
              </div>

              <Button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
              >
                {loading ? 'Calculating...' : 'Calculate Savings'}
              </Button>
            </CardContent>
          </Card>

          {/* Right Column - Results */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Potential Savings</CardTitle>
              <CardDescription className="text-slate-300">
                See how Paaaid compares to your current provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result?.success ? (
                <div className="space-y-6">
                  {/* Savings Highlight */}
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 text-center border border-green-500/30">
                    <p className="text-green-400 text-sm font-medium mb-1">Monthly Savings</p>
                    <p className="text-4xl font-bold text-white">${result.savings.total.toLocaleString()}</p>
                    <p className="text-green-400 text-sm mt-1">
                      {result.savings.percentage}% reduction • ${result.savings.annual.toLocaleString()}/year
                    </p>
                  </div>

                  {/* Comparison Table */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm font-medium text-slate-300 border-b border-white/10 pb-2">
                      <span>Category</span>
                      <span className="text-center">Current</span>
                      <span className="text-center text-green-400">Paaaid</span>
                    </div>

                    {[
                      { label: 'Payment Fees', current: result.current.payment_fees, paaaid: result.paaaid.payment_fees },
                      { label: 'FX Fees', current: result.current.fx_fees, paaaid: result.paaaid.fx_fees },
                      { label: 'Failed Payments', current: result.current.failed_payments, paaaid: result.paaaid.failed_payments },
                      { label: 'Tax Overhead', current: result.current.tax_overhead, paaaid: result.paaaid.tax_overhead },
                      { label: 'Chargebacks', current: result.current.chargebacks, paaaid: result.paaaid.chargebacks },
                    ].map((row) => (
                      <div key={row.label} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-white/5">
                        <span className="text-slate-300">{row.label}</span>
                        <span className="text-center text-red-400">${row.current.toLocaleString()}</span>
                        <span className="text-center text-green-400">${row.paaaid.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="grid grid-cols-3 gap-4 text-sm font-bold py-3 border-t border-white/20">
                      <span className="text-white">Total</span>
                      <span className="text-center text-red-400">${result.current.total.toLocaleString()}</span>
                      <span className="text-center text-green-400">${result.paaaid.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center py-20">
                  <p className="text-slate-400 text-center">
                    Enter your details and click "Calculate Savings" to see your potential savings with Paaaid
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
