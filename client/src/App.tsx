import { useState, useCallback } from 'react'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalculatorForm, type CalculatorFormData } from '@/components/CalculatorForm'

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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            SaaS Revenue Leakage Calculator
          </h1>
          <p className="text-slate-600 text-lg">
            Discover how much you could save with{' '}
            <span className="text-paaaid font-semibold">Paaaid</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <CalculatorForm onCalculate={handleCalculate} loading={loading} />

          {/* Right Column - Results */}
          <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="text-slate-900">Your Potential Savings</CardTitle>
              <CardDescription className="text-slate-500">
                See how Paaaid compares to your current provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result?.success ? (
                <div className="space-y-6">
                  {/* Savings Highlight */}
                  <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                    <p className="text-emerald-600 text-sm font-medium mb-1">Monthly Savings</p>
                    <p className="text-4xl font-bold text-slate-900">${result.savings.total.toLocaleString()}</p>
                    <p className="text-emerald-600 text-sm mt-1">
                      {result.savings.percentage}% reduction • ${result.savings.annual.toLocaleString()}/year
                    </p>
                  </div>

                  {/* Comparison Table */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm font-medium text-slate-500 border-b border-slate-100 pb-2">
                      <span>Category</span>
                      <span className="text-center">Current</span>
                      <span className="text-center text-paaaid">Paaaid</span>
                    </div>

                    {[
                      { label: 'Payment Fees', current: result.current.payment_fees, paaaid: result.paaaid.payment_fees },
                      { label: 'FX Fees', current: result.current.fx_fees, paaaid: result.paaaid.fx_fees },
                      { label: 'Failed Payments', current: result.current.failed_payments, paaaid: result.paaaid.failed_payments },
                      { label: 'Tax Overhead', current: result.current.tax_overhead, paaaid: result.paaaid.tax_overhead },
                      { label: 'Chargebacks', current: result.current.chargebacks, paaaid: result.paaaid.chargebacks },
                    ].map((row) => (
                      <div key={row.label} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-50">
                        <span className="text-slate-600">{row.label}</span>
                        <span className="text-center text-slate-700">${row.current.toLocaleString()}</span>
                        <span className="text-center text-emerald-600 font-medium">${row.paaaid.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="grid grid-cols-3 gap-4 text-sm font-bold py-3 border-t border-slate-200">
                      <span className="text-slate-900">Total</span>
                      <span className="text-center text-slate-700">${result.current.total.toLocaleString()}</span>
                      <span className="text-center text-emerald-600">${result.paaaid.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-paaaid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-500">
                      {loading ? 'Calculating...' : 'Enter your details to see your potential savings with Paaaid'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
