from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for frontend origins (local dev and Docker)
CORS(app, origins=["http://localhost:5173", "http://client:5173", "http://localhost:80", "http://localhost"])

# Processor base rates: (percentage, fixed fee)
PROCESSOR_RATES = {
    "stripe": (2.9, 0.30),
    "paypal": (3.49, 0.49),
    "paddle": (5.0, 0.50),
    "lemon": (5.0, 0.50),
}

# Paaaid rates
PAAAID_RATE = (2.5, 0.25)
PAAAID_FX_RATE = 0.005  # 0.5%
PAAAID_FAILED_REDUCTION = 0.20  # 20% reduction in failed payments


@app.route('/api/calculate', methods=['POST'])
def calculate():
    """
    POST route for revenue leakage calculations.
    Expects JSON data with: mrr, processor, international_percent, eu_percent, failed_payment_rate
    """
    data = request.get_json()
    
    # Extract and validate inputs
    try:
        mrr = float(data.get('mrr', 0))
        processor = str(data.get('processor', 'stripe')).lower()
        international_percent = float(data.get('international_percent', 0))
        eu_percent = float(data.get('eu_percent', 0))
        failed_payment_rate = float(data.get('failed_payment_rate', 0))
    except (TypeError, ValueError) as e:
        return jsonify({
            "success": False,
            "error": f"Invalid input data: {str(e)}"
        }), 400
    
    # Get processor rates
    if processor not in PROCESSOR_RATES:
        return jsonify({
            "success": False,
            "error": f"Unknown processor: {processor}. Supported: {list(PROCESSOR_RATES.keys())}"
        }), 400
    
    base_rate, fixed_fee = PROCESSOR_RATES[processor]
    
    # Calculate current costs
    # Payment Fees: base rate + additional 1% for Stripe international
    fee_rate = base_rate
    if processor == "stripe" and international_percent > 0:
        fee_rate += 1.0  # Add 1% for international transactions
    
    # Estimate number of transactions (assuming average transaction of $50)
    avg_transaction = 50
    num_transactions = mrr / avg_transaction if avg_transaction > 0 else 0
    
    current_payment_fees = (mrr * (fee_rate / 100)) + (fixed_fee * num_transactions)
    
    # FX Fees: 2% on international portion
    current_fx_fees = (international_percent / 100 * mrr) * 0.02
    
    # Failed Payments
    current_failed_payments = mrr * (failed_payment_rate / 100)
    
    # Tax Overhead: 0.5% on EU portion
    current_tax_overhead = (eu_percent / 100 * mrr) * 0.005
    
    # Chargebacks: 0.3% of MRR
    current_chargebacks = mrr * 0.003
    
    # Total current leakage
    current_total = (
        current_payment_fees +
        current_fx_fees +
        current_failed_payments +
        current_tax_overhead +
        current_chargebacks
    )
    
    # Calculate Paaaid costs
    paaaid_rate, paaaid_fixed = PAAAID_RATE
    paaaid_payment_fees = (mrr * (paaaid_rate / 100)) + (paaaid_fixed * num_transactions)
    
    # Paaaid FX Fees: 0.5% on international portion
    paaaid_fx_fees = (international_percent / 100 * mrr) * PAAAID_FX_RATE
    
    # Paaaid Failed Payments: 20% reduction
    paaaid_failed_payments = current_failed_payments * (1 - PAAAID_FAILED_REDUCTION)
    
    # Paaaid Tax Overhead: 0
    paaaid_tax_overhead = 0
    
    # Paaaid Chargebacks: same as current
    paaaid_chargebacks = current_chargebacks
    
    # Total Paaaid costs
    paaaid_total = (
        paaaid_payment_fees +
        paaaid_fx_fees +
        paaaid_failed_payments +
        paaaid_tax_overhead +
        paaaid_chargebacks
    )
    
    # Calculate savings
    total_savings = current_total - paaaid_total
    savings_percentage = (total_savings / current_total * 100) if current_total > 0 else 0
    
    return jsonify({
        "success": True,
        "current": {
            "payment_fees": round(current_payment_fees, 2),
            "fx_fees": round(current_fx_fees, 2),
            "failed_payments": round(current_failed_payments, 2),
            "tax_overhead": round(current_tax_overhead, 2),
            "chargebacks": round(current_chargebacks, 2),
            "total": round(current_total, 2)
        },
        "paaaid": {
            "payment_fees": round(paaaid_payment_fees, 2),
            "fx_fees": round(paaaid_fx_fees, 2),
            "failed_payments": round(paaaid_failed_payments, 2),
            "tax_overhead": round(paaaid_tax_overhead, 2),
            "chargebacks": round(paaaid_chargebacks, 2),
            "total": round(paaaid_total, 2)
        },
        "savings": {
            "total": round(total_savings, 2),
            "percentage": round(savings_percentage, 2),
            "annual": round(total_savings * 12, 2)
        }
    })


if __name__ == '__main__':
    app.run(port=5000, debug=True)
