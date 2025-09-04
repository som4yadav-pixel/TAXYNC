import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { TaxSuggestion, getDetailedSuggestion, formatSavings } from '../../utils/taxSuggestions';

interface SuggestionModalProps {
  suggestion: TaxSuggestion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestionModal({ suggestion, isOpen, onClose }: SuggestionModalProps) {
  if (!isOpen || !suggestion) return null;

  const details = getDetailedSuggestion(suggestion.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{suggestion.title}</h2>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-green-600 font-bold text-lg">
                  Save {formatSavings(suggestion.potentialSavings)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  suggestion.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                  suggestion.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {suggestion.riskLevel} risk
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-700 leading-relaxed">{suggestion.description}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">How to Get Started</h3>
            </div>
            <ol className="space-y-2">
              {details.steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Key Benefits</h3>
            </div>
            <ul className="space-y-2">
              {details.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Important Considerations</h3>
            </div>
            <ul className="space-y-2">
              {details.considerations.map((consideration, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{consideration}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Investment Timeframe</p>
                <p className="font-medium text-gray-900">{suggestion.timeframe}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Potential Annual Savings</p>
                <p className="font-bold text-green-600">{formatSavings(suggestion.potentialSavings)}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Maybe Later
            </button>
            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium">
              {suggestion.actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}