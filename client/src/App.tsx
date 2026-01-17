import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalculatorForm, CalculatorFormData } from '@/components/CalculatorForm'

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
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = useCallback(async (formData: CalculatorFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Calculation failed:', error)
    } finally {
      setLoading(false)
    }
  }, [])

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
          <CalculatorForm onCalculate={handleCalculate} loading={loading} />

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
                    {loading ? 'Calculating...' : 'Enter your details to see your potential savings with Paaaid'}
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
