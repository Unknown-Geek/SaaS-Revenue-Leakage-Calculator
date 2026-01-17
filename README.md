# SaaS Revenue Leakage Calculator

A full-stack tool to calculate and visualize revenue leakage for SaaS businesses, comparing current payment processor costs with Paaaid's optimized rates.

![SaaS Calculator Preview](client/public/calculator.png)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

Run the entire stack with a single command:

```bash
docker-compose up --build
```

Access the app at `http://localhost:5173`.

### Option 2: Manual Setup

#### Backend (Flask API)

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
Runs on `http://localhost:5000`.

#### Frontend (React + Vite)

```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Visualization**: Recharts, Framer Motion
- **Backend**: Flask, Gunicorn
- **Deployment**: Docker, Vercel (Frontend), Render (Backend)
- **Analytics**: Vercel Analytics

## 🚢 Deployment

### 1. Backend (Render)
- Deploy the `server` directory.
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`

### 2. Frontend (Vercel)
- Deploy the `client` directory.
- **Rewrites**: Configured in `vercel.json` to proxy `/api` calls to the deployed backend.
- **Environment**: No env vars needed for routing, handled by rewrites.

## 📡 API Reference

### POST `/api/calculate`

Calculate revenue leakage and potential savings.

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `mrr` | float | Monthly Recurring Revenue in USD |
| `processor` | string | Current payment processor: `stripe`, `paypal`, `paddle`, `lemon` |
| `international_percent` | float | Percentage of international transactions (0-100) |
| `eu_percent` | float | Percentage of EU customers (0-100) |
| `failed_payment_rate` | float | Current failed payment rate (0-100) |

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

## 📝 License

MIT
