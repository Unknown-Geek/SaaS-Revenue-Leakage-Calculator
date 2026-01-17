import { useState, useCallback } from 'react'
import { CalculatorForm, type CalculatorFormData } from '@/components/CalculatorForm'
import { ResultsDisplay } from '@/components/ResultsDisplay'

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
  const [currentMrr, setCurrentMrr] = useState(10000)

  const handleCalculate = useCallback(async (formData: CalculatorFormData) => {
    setLoading(true)
    setCurrentMrr(formData.mrr)
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
            <span className="text-[#00A8E8] font-semibold">Paaaid</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <CalculatorForm onCalculate={handleCalculate} loading={loading} />

          {/* Right Column - Results (Bento Grid) */}
          <div>
            <ResultsDisplay
              data={result?.success ? result : null}
              loading={loading}
              mrr={currentMrr}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
