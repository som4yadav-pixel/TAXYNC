import React from 'react';
import { 
  TrendingUp, 
  Shield, 
  Calendar, 
  BarChart3, 
  Home, 
  Landmark,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { TaxSuggestion, formatSavings } from '../../utils/taxSuggestions';
import { SuggestionModal } from './SuggestionModal';

interface TaxSuggestionsProps {
  suggestions: TaxSuggestion[];
}

const iconMap = {
  TrendingUp,
  Shield,
  Calendar,
  BarChart3,
  Home,
  Landmark,
};

const riskColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const categoryColors = {
  investment: 'bg-purple-100 text-purple-800',
  deduction: 'bg-blue-100 text-blue-800',
  exemption: 'bg-green-100 text-green-800',
  planning: 'bg-orange-100 text-orange-800',
};

export function TaxSuggestions({ suggestions }: TaxSuggestionsProps) {
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<TaxSuggestion | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSuggestionClick = (suggestion: TaxSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSuggestion(null);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-yellow-100 p-2 rounded-lg">
          <Lightbulb className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Smart Tax Saving Suggestions</h2>
          <p className="text-gray-600">Personalized recommendations to optimize your tax savings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {suggestions.slice(0, 6).map((suggestion) => {
          const IconComponent = iconMap[suggestion.icon as keyof typeof iconMap] || TrendingUp;
          
          return (
            <div
              key={suggestion.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
                  <IconComponent className="h-5 w-5 text-purple-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{suggestion.title}</h3>
                    <span className="text-green-600 font-bold text-sm">
                      Save {formatSavings(suggestion.potentialSavings)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-xs mb-3 leading-relaxed">
                    {suggestion.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[suggestion.category]}`}>
                        {suggestion.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${riskColors[suggestion.riskLevel]}`}>
                        {suggestion.riskLevel} risk
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 font-medium text-xs group-hover:transform group-hover:translate-x-1 transition-all duration-200">
                      <span>{suggestion.actionText}</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Timeframe: {suggestion.timeframe}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {suggestions.length > 6 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium">
            View All Suggestions ({suggestions.length})
          </button>
        </div>
      )}
      </div>

      <SuggestionModal
        suggestion={selectedSuggestion}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}