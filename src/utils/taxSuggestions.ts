import { TaxResult } from './taxCalculations';

export interface TaxSuggestion {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  category: 'investment' | 'deduction' | 'exemption' | 'planning';
  icon: string;
  actionText: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
}

export function generateTaxSuggestions(
  income: number, 
  currentDeductions: number, 
  taxResult: TaxResult
): TaxSuggestion[] {
  const suggestions: TaxSuggestion[] = [];
  
  // ELSS Mutual Funds suggestion
  if (currentDeductions < 150000) {
    const remainingLimit = 150000 - currentDeductions;
    const potentialSavings = Math.min(remainingLimit, 50000) * 0.30; // 30% tax bracket assumption
    
    suggestions.push({
      id: 'elss-investment',
      title: 'Invest in ELSS Mutual Funds',
      description: `Invest up to ₹${remainingLimit.toLocaleString()} more in ELSS funds. Get tax savings + potential 12-15% annual returns. Beat inflation while saving taxes!`,
      potentialSavings,
      category: 'investment',
      icon: 'TrendingUp',
      actionText: 'Start SIP Now',
      riskLevel: 'medium',
      timeframe: '3+ years'
    });
  }

  // Stocks and Equity Investment suggestion
  if (income > 1000000 && taxResult.savings < 0) {
    suggestions.push({
      id: 'equity-investment',
      title: 'Invest in Blue-chip Stocks',
      description: 'Build wealth through equity investments. Long-term capital gains above ₹1 lakh taxed at only 10%. Diversify with quality stocks.',
      potentialSavings: 20000,
      category: 'investment',
      icon: 'TrendingUp',
      actionText: 'Explore Stocks',
      riskLevel: 'medium',
      timeframe: '1+ years'
    });
  }
  // PPF Investment suggestion
  if (income > 500000) {
    suggestions.push({
      id: 'ppf-investment',
      title: 'Open Public Provident Fund (PPF)',
      description: 'Safe 7.1% returns + tax savings! Invest up to ₹1.5L annually. Triple tax benefit (EEE) makes this a no-brainer for wealth building.',
      potentialSavings: 30000,
      category: 'investment',
      icon: 'Landmark',
      actionText: 'Open PPF Account',
      riskLevel: 'low',
      timeframe: '15 years'
    });
  }

  // Health Insurance suggestion
  suggestions.push({
    id: 'health-insurance',
    title: 'Buy Health Insurance',
    description: 'Get tax deduction up to ₹25,000 under Section 80D for health insurance premiums. Additional ₹25,000 for parents.',
    potentialSavings: 15000,
    category: 'deduction',
    icon: 'Shield',
    actionText: 'Compare Plans',
    riskLevel: 'low',
    timeframe: 'Annual'
  });

  // NPS Investment suggestion
  if (income > 800000) {
    suggestions.push({
      id: 'nps-investment',
      title: 'National Pension System (NPS)',
      description: 'Extra ₹50K deduction beyond 80C limit! NPS offers market-linked returns + tax benefits. Perfect for retirement planning.',
      potentialSavings: 15000,
      category: 'investment',
      icon: 'Calendar',
      actionText: 'Open NPS Account',
      riskLevel: 'medium',
      timeframe: 'Until retirement'
    });
  }

  // Tax Loss Harvesting for high earners
  if (income > 1500000) {
    suggestions.push({
      id: 'tax-loss-harvesting',
      title: 'Tax Loss Harvesting',
      description: 'Smart strategy for high earners! Offset gains with losses to reduce capital gains tax. Book profits while minimizing tax impact.',
      potentialSavings: 25000,
      category: 'planning',
      icon: 'BarChart3',
      actionText: 'Review Portfolio',
      riskLevel: 'medium',
      timeframe: 'Before March 31'
    });
  }

  // HRA Optimization
  if (income > 600000) {
    suggestions.push({
      id: 'hra-optimization',
      title: 'Optimize HRA Claims',
      description: 'Don\'t miss out on HRA savings! Proper documentation can save ₹20K+ annually. Ensure rent receipts and agreements are in order.',
      potentialSavings: 20000,
      category: 'exemption',
      icon: 'Home',
      actionText: 'Review HRA',
      riskLevel: 'low',
      timeframe: 'Immediate'
    });
  }

  // Fixed Deposits for conservative investors
  suggestions.push({
    id: 'tax-saving-fd',
    title: 'Tax Saving Fixed Deposits',
    description: 'Risk-free tax savings! Guaranteed 6-7% returns with 5-year lock-in. Perfect for conservative investors seeking steady growth.',
    potentialSavings: 12000,
    category: 'investment',
    icon: 'Landmark',
    actionText: 'Compare FD Rates',
    riskLevel: 'low',
    timeframe: '5 years'
  });

  // Sort by potential savings (highest first)
  return suggestions.sort((a, b) => b.potentialSavings - a.potentialSavings);
}

export function getDetailedSuggestion(suggestionId: string): {
  steps: string[];
  benefits: string[];
  considerations: string[];
} {
  const suggestionDetails: Record<string, any> = {
    'elss-investment': {
      steps: [
        'Research top-performing ELSS mutual funds with good track records',
        'Open a mutual fund account with a reputable AMC or platform',
        'Start a monthly SIP to spread your investment over time',
        'Monitor performance and review annually'
      ],
      benefits: [
        'Tax deduction under Section 80C up to ₹1.5 lakh',
        'Potential for higher returns compared to traditional tax-saving instruments',
        'Only 3-year lock-in period (shortest among 80C options)',
        'Professional fund management and diversification'
      ],
      considerations: [
        'Market-linked returns - value can fluctuate',
        'Choose funds based on your risk tolerance',
        'Consider expense ratios and fund manager track record'
      ]
    },
    'ppf-investment': {
      steps: [
        'Visit any authorized bank or post office',
        'Fill PPF account opening form with KYC documents',
        'Make initial deposit (minimum ₹500, maximum ₹1.5 lakh per year)',
        'Set up auto-debit for regular contributions'
      ],
      benefits: [
        'Triple tax benefit - EEE (Exempt-Exempt-Exempt)',
        'Guaranteed returns with government backing',
        'Current interest rate around 7.1% per annum',
        'Loan facility available after 3rd year'
      ],
      considerations: [
        '15-year lock-in period with limited withdrawal options',
        'Returns are lower compared to equity investments',
        'Interest rates are subject to government revision'
      ]
    },
    'health-insurance': {
      steps: [
        'Compare health insurance plans from different insurers',
        'Choose coverage amount based on your family size and medical history',
        'Complete medical check-ups if required',
        'Pay premium and claim tax deduction'
      ],
      benefits: [
        'Tax deduction under Section 80D',
        'Financial protection against medical emergencies',
        'Cashless treatment at network hospitals',
        'Additional coverage for critical illnesses'
      ],
      considerations: [
        'Read policy terms and exclusions carefully',
        'Consider waiting periods for pre-existing conditions',
        'Premium increases with age and claims history'
      ]
    }
  };
  
  return suggestionDetails[suggestionId] || {
    steps: ['Contact a financial advisor for personalized guidance'],
    benefits: ['Potential tax savings and financial growth'],
    considerations: ['Consult with experts before making investment decisions']
  };
}

export function formatSavings(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}