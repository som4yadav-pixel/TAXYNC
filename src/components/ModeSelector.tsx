import { motion } from 'framer-motion';
import { Zap, Shield, CheckCircle, TrendingUp } from 'lucide-react';

export type CalculationMode = 'quick-comparison' | 'old-regime-optimizer' | 'new-regime-direct';

interface Mode {
  id: CalculationMode;
  title: string;
  description: string;
  icon: any;
  color: string;
  recommended?: boolean;
}

interface ModeSelectorProps {
  selectedMode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
  income?: number;
}

export function ModeSelector({ selectedMode, onModeChange, income = 0 }: ModeSelectorProps) {
  const modes: Mode[] = [
    {
      id: 'quick-comparison',
      title: 'Quick Comparison',
      description: 'Side-by-side view for both regimes',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      recommended: income > 1500000
    },
    {
      id: 'old-regime-optimizer',
      title: 'Old Regime Optimizer',
      description: 'Maximize 25+ deductions for high-investment users',
      icon: Shield,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'new-regime-direct',
      title: 'New Regime Direct',
      description: 'Fast calculation with zero deductions',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Calculation Mode
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the mode that best fits your tax planning needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onModeChange(mode.id)}
              className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              {mode.recommended && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md"
                >
                  Recommended
                </motion.div>
              )}

              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`bg-gradient-to-r ${mode.color} p-4 rounded-full text-white shadow-lg`}>
                  <Icon className="h-8 w-8" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mode.description}
                  </p>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Smart Recommendation
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {income > 1500000 
                ? "Based on your high income, we recommend 'Quick Comparison' to maximize your tax savings across both regimes."
                : "For your income level, all modes are suitable. Choose based on your preference for simplicity vs. detailed analysis."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
