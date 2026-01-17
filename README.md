# SaaS Revenue Leakage Calculator

A tool to calculate and visualize revenue leakage for SaaS businesses, comparing current payment processor costs with Paaaid's optimized rates.

## 🚀 Quick Start

### Backend (Flask API)

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API will run on `http://localhost:5000`.

## 📡 API Reference

### POST `/api/calculate`

Calculate revenue leakage and potential savings.

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| `mrr` | float | Monthly Recurring Revenue in USD |
| `processor` | string | Current payment processor: `stripe`, `paypal`, `paddle`, `lemon` |
| `international_percent` | float | Percentage of international transactions (0-100) |
| `eu_percent` | float | Percentage of EU customers (0-100) |
| `failed_payment_rate` | float | Current failed payment rate (0-100) |

#### Example Request

```bash
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "mrr": 10000,
    "processor": "stripe",
    "international_percent": 30,
    "eu_percent": 20,
    "failed_payment_rate": 5
  }'
```

#### Example Response

```json
{
  "success": true,
  "current": {
    "payment_fees": 450.0,
    "fx_fees": 60.0,
    "failed_payments": 500.0,
    "tax_overhead": 10.0,
    "chargebacks": 30.0,
    "total": 1050.0
  },
  "paaaid": {
    "payment_fees": 300.0,
    "fx_fees": 15.0,
    "failed_payments": 400.0,
    "tax_overhead": 0,
    "chargebacks": 30.0,
    "total": 745.0
  },
  "savings": {
    "total": 305.0,
    "percentage": 29.05,
    "annual": 3660.0
  }
}
```

## 💰 Calculation Formulas

### Current Provider Costs

| Category | Formula |
|----------|---------|
| **Payment Fees** | Stripe: 2.9% + $0.30 (+1% for intl), PayPal: 3.49% + $0.49, Paddle/Lemon: 5% + $0.50 |
| **FX Fees** | `international_percent% × MRR × 2%` |
| **Failed Payments** | `MRR × failed_payment_rate%` |
| **Tax Overhead** | `eu_percent% × MRR × 0.5%` |
| **Chargebacks** | `MRR × 0.3%` |

### Paaaid Costs

| Category | Formula |
|----------|---------|
| **Payment Fees** | 2.5% + $0.25 per transaction |
| **FX Fees** | `international_percent% × MRR × 0.5%` |
| **Failed Payments** | 20% reduction from current |
| **Tax Overhead** | $0 (handled by Paaaid) |
| **Chargebacks** | Same as current |

## 🛠 Tech Stack

- **Backend**: Flask, Flask-CORS
- **Frontend**: Coming soon (Vite + React)

## 📁 Project Structure

```
├── server/
│   ├── app.py           # Flask API
│   ├── requirements.txt # Python dependencies
│   └── venv/            # Virtual environment
└── README.md
```

## 📝 License

MIT
