import React, { useState } from 'react';
import { BarChart3, PieChart, Clock, History } from 'lucide-react';
import { TaxCalculator } from './TaxCalculator';
import { TaxChart } from './TaxChart';
import { TaxSuggestions } from './TaxSuggestions';
import { generateTaxSuggestions } from '../../utils/taxSuggestions';
import { ChartType, ViewMode } from '../../types';

export function Dashboard() {
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [currentInput, setCurrentInput] = useState({ income: 1000000, deductions: 150000 });

  const handleCalculationChange = (result: any, input: any) => {
    setCalculationResult(result);
    setCurrentInput(input);
  };

  const suggestions = calculationResult 
    ? generateTaxSuggestions(currentInput.income, currentInput.deductions, calculationResult)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tax Dashboard</h1>
            <p className="text-gray-600 mt-1">Compare old vs new tax regimes and optimize your savings</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setViewMode('today')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  viewMode === 'today'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Today</span>
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  viewMode === 'history'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </button>
            </div>
            
            <div className="flex bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setChartType('pie')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  chartType === 'pie'
                    ? 'bg-yellow-400 text-purple-900 shadow-md'
                    : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                <PieChart className="h-4 w-4" />
                <span>Pie Chart</span>
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  chartType === 'bar'
                    ? 'bg-yellow-400 text-purple-900 shadow-md'
                    : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Bar Chart</span>
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'today' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <TaxCalculator onCalculationChange={handleCalculationChange} />
              {calculationResult && (
                <TaxChart
                  chartType={chartType}
                  oldRegimeTax={calculationResult.oldRegimeTax}
                  newRegimeTax={calculationResult.newRegimeTax}
                  savings={calculationResult.savings}
                />
              )}
            </div>
            {calculationResult && (
              <TaxSuggestions suggestions={suggestions} />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tax History</h3>
            <p className="text-gray-600 mb-6">View your past tax calculations and comparisons</p>
            <div className="space-y-4 max-w-md mx-auto">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-gray-200 rounded-lg p-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Calculation #{item}</span>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Income: ₹10,00,000 • Savings: ₹15,000
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}