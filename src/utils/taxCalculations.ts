export interface TaxInput {
  income: number;
  deductions: number;
}

export interface TaxResult {
  oldRegimeTax: number;
  newRegimeTax: number;
  savings: number;
  oldRegimeBreakdown: {
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
  newRegimeBreakdown: {
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
}

export function calculateTax(input: TaxInput): TaxResult {
  const { income, deductions } = input;
  
  // Old Regime: allow standard deduction + 80C/80D/etc. via aggregated deductions
  const oldRegimeTax = calculateOldRegimeTax(income, deductions);
  
  // New Regime: standard deduction only (₹50,000 by default)
  const newRegimeTax = calculateNewRegimeTax(income, 50000);
  
  const savings = oldRegimeTax - newRegimeTax;
  
  return {
    oldRegimeTax,
    newRegimeTax,
    savings,
    oldRegimeBreakdown: {
      taxableIncome: Math.max(0, income - deductions),
      tax: oldRegimeTax,
      effectiveRate: income > 0 ? (oldRegimeTax / income) * 100 : 0
    },
    newRegimeBreakdown: {
      taxableIncome: Math.max(0, income - 50000),
      tax: newRegimeTax,
      effectiveRate: income > 0 ? (newRegimeTax / income) * 100 : 0
    }
  };
}

/**
 * Old Regime (FY 2025-26) with deductions
 * - Slabs: 0–2.5L:0%, 2.5–5L:5%, 5–10L:20%, 10L+:30%
 * - Applies 4% cess at the end and rounds to nearest integer
 */
export function calculateOldRegimeTax(income: number, totalDeductions: number): number {
  const taxableIncome = Math.max(0, (income || 0) - (totalDeductions || 0));
  const tax = computeOldRegimeSlabTax(taxableIncome);
  return Math.round(tax * 1.04);
}

/**
 * New Regime (FY 2025-26) with standard deduction only
 * - Slabs: 0–3L:0%, 3–6L:5%, 6–9L:10%, 9–12L:15%, 12–15L:20%, 15L+:30%
 * - Applies 4% cess at the end and rounds to nearest integer
 */
export function calculateNewRegimeTax(income: number, standardDeduction: number = 50000): number {
  const taxableIncome = Math.max(0, (income || 0) - (standardDeduction || 0));
  const tax = computeNewRegimeSlabTax(taxableIncome);
  return Math.round(tax * 1.04);
}

// Internal helpers: slab-wise computation without cess/rounding
function computeOldRegimeSlabTax(taxableIncome: number): number {
  if (taxableIncome <= 250000) return 0;
  if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
  if (taxableIncome <= 1000000) return 12500 + (taxableIncome - 500000) * 0.20;
  return 112500 + (taxableIncome - 1000000) * 0.30;
}

function computeNewRegimeSlabTax(taxableIncome: number): number {
  if (taxableIncome <= 300000) return 0;
  if (taxableIncome <= 600000) return (taxableIncome - 300000) * 0.05;
  if (taxableIncome <= 900000) return 15000 + (taxableIncome - 600000) * 0.10;
  if (taxableIncome <= 1200000) return 45000 + (taxableIncome - 900000) * 0.15;
  if (taxableIncome <= 1500000) return 90000 + (taxableIncome - 1200000) * 0.20;
  return 150000 + (taxableIncome - 1500000) * 0.30;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}