import React, { useState } from 'react';
import { calculateTax, formatCurrency, TaxInput } from '../../utils/taxCalculations';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';

interface TaxCalculatorProps {
  onCalculationChange: (result: any, input: any) => void;
}

export function TaxCalculator({ onCalculationChange }: TaxCalculatorProps) {
  const [input, setInput] = useState<TaxInput>({
    income: 1000000,
    deductions: 150000
  });

  const result = calculateTax(input);

  React.useEffect(() => {
    onCalculationChange(result, input);
  }, [input, result, onCalculationChange]);

  const handleInputChange = (field: keyof TaxInput, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInput(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Calculator className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tax Calculator</h2>
          <p className="text-gray-600">Enter your income details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income (₹)
          </label>
          <input
            type="number"
            value={input.income}
            onChange={(e) => handleInputChange('income', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
            placeholder="Enter annual income"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deductions (₹)
          </label>
          <input
            type="number"
            value={input.deductions}
            onChange={(e) => handleInputChange('deductions', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
            placeholder="Enter total deductions"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-purple-600 mb-1">Old Regime Tax</h3>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(result.oldRegimeTax)}</p>
          <p className="text-xs text-purple-600">Effective: {result.oldRegimeBreakdown.effectiveRate.toFixed(2)}%</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-blue-600 mb-1">New Regime Tax</h3>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(result.newRegimeTax)}</p>
          <p className="text-xs text-blue-600">Effective: {result.newRegimeBreakdown.effectiveRate.toFixed(2)}%</p>
        </div>
        
        <div className={`p-4 rounded-lg border-l-4 ${
          result.savings >= 0 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className={`text-sm font-medium ${
              result.savings >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {result.savings >= 0 ? 'Savings' : 'Extra Tax'}
            </h3>
            {result.savings >= 0 ? (
              <TrendingDown className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${
            result.savings >= 0 ? 'text-green-900' : 'text-red-900'
          }`}>
            {formatCurrency(Math.abs(result.savings))}
          </p>
          <p className={`text-xs ${
            result.savings >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {result.savings >= 0 ? 'You save with new regime' : 'Old regime is better'}
          </p>
        </div>
      </div>
    </div>
  );
}