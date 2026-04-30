import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  FileText,
  BarChart3,
  Lightbulb,
  Calculator
} from 'lucide-react';

interface TaxStrategyReportProps {
  taxResult: any;
  formData: any;
  calculationMode: string;
}

// Error fallback component
const ErrorFallback = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
    <div className="text-center">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Tax Strategy Report Unavailable
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Please try calculating your taxes again to see the strategy report.
      </p>
    </div>
  </div>
);

export function TaxStrategyReport({ taxResult, formData, calculationMode }: TaxStrategyReportProps) {
  // Comprehensive error boundary
  try {
    // Early return with null checks
    if (!taxResult || !formData || calculationMode !== 'old-regime-optimizer') {
      return null;
    }

    // Additional validation
    if (typeof taxResult !== 'object' || typeof formData !== 'object') {
      console.error('Invalid props structure:', { taxResult, formData });
      return <ErrorFallback />;
    }

  // Simplified data extraction with maximum safety
  const safeFormData = {
    income: Number(formData.income) || 0,
    section80C: Number(formData.section80C) || 0,
    section80D: Number(formData.section80D) || 0,
    hra: Number(formData.hra) || 0,
    homeLoanInterest: Number(formData.homeLoanInterest) || 0
  };

  const safeTaxResult = {
    old_regime_tax: Number(taxResult.old_regime_tax) || 0,
    optimization_score: Number(taxResult.optimization_score) || 0,
    savings: Number(taxResult.savings) || 0
  };

  // Simple investment gaps calculation
  const investmentGaps = {
    section80C: {
      current: safeFormData.section80C,
      max: 150000,
      gap: Math.max(0, 150000 - safeFormData.section80C),
      potential: Math.max(0, 150000 - safeFormData.section80C) * 0.31
    },
    section80D: {
      current: safeFormData.section80D,
      max: 25000,
      gap: Math.max(0, 25000 - safeFormData.section80D),
      potential: Math.max(0, 25000 - safeFormData.section80D) * 0.31
    },
    hra: {
      current: safeFormData.hra,
      suggested: safeFormData.income * 0.2,
      gap: Math.max(0, (safeFormData.income * 0.2) - safeFormData.hra),
      potential: Math.max(0, (safeFormData.income * 0.2) - safeFormData.hra) * 0.31
    }
  };

  // Calculate total potential savings
  const totalPotentialSavings = investmentGaps.section80C.potential + investmentGaps.section80D.potential + investmentGaps.hra.potential;

  // Simple metrics calculation
  const metrics = {
    effectiveTaxRate: safeFormData.income > 0 ? Math.round((safeTaxResult.old_regime_tax / safeFormData.income) * 1000) / 10 : 0,
    optimizationScore: safeTaxResult.optimization_score,
    totalDeductions: safeFormData.section80C + safeFormData.section80D + safeFormData.hra,
    taxSavings: Math.max(0, safeTaxResult.savings)
  };

  // Simple recommendations array with proper types
  const recommendations: Array<{
    title: string;
    description: string;
    icon: any;
    color: string;
    priority: string;
    actions: string[];
  }> = [];
  
  if (investmentGaps.section80C.gap > 0) {
    recommendations.push({
      title: 'Maximize Section 80C',
      description: `Invest ₹${investmentGaps.section80C.gap.toLocaleString()} to save ₹${Math.round(investmentGaps.section80C.potential).toLocaleString()}`,
      icon: BarChart3,
      color: 'bg-green-500',
      priority: 'high',
      actions: ['ELSS Mutual Funds', 'PPF', 'Tax-Saving FDs']
    });
  }
  
  if (investmentGaps.section80D.gap > 0) {
    recommendations.push({
      title: 'Health Insurance',
      description: `Get health insurance for ₹${investmentGaps.section80D.gap.toLocaleString()} premium`,
      icon: Target,
      color: 'bg-blue-500',
      priority: 'medium',
      actions: ['Family Floater Plan', 'Parents Health Insurance']
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="space-y-6"
    >
      {/* Tax Strategy Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              Tax Strategy Report
            </h2>
            <p className="text-purple-100">
              Personalized recommendations based on your {calculationMode.replace('-', ' ')} analysis
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{metrics.optimizationScore}%</div>
            <div className="text-sm text-purple-200">Optimization Score</div>
          </div>
        </div>
      </div>

      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Effective Tax Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.effectiveTaxRate}%</p>
            </div>
            <Calculator className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{metrics.totalDeductions.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tax Savings</p>
              <p className="text-2xl font-bold text-green-600">₹{metrics.taxSavings.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Potential Savings</p>
              <p className="text-2xl font-bold text-orange-600">₹{Math.round(totalPotentialSavings).toLocaleString()}</p>
            </div>
            <Zap className="h-8 w-8 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Investment Gap Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-600" />
          Investment Gap Analysis
        </h3>
        
        <div className="space-y-4">
          {Object.entries(investmentGaps).map(([key, gap]: [string, any]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + Math.random() * 0.2 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                  {key === 'section80C' ? 'Section 80C' : key === 'section80D' ? 'Section 80D' : 'HRA'}
                </h4>
                {gap.gap > 0 ? (
                  <span className="text-sm font-medium text-orange-600">
                    Gap: ₹{gap.gap.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Optimized
                  </span>
                )}
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(gap.current / gap.max) * 100}%` }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Current: ₹{gap.current.toLocaleString()}</span>
                <span>Max: ₹{gap.max.toLocaleString()}</span>
                {gap.potential > 0 && (
                  <span className="text-green-600 font-medium">
                    Save: ₹{Math.round(gap.potential).toLocaleString()}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strategy Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          Strategy Recommendations
        </h3>
        
        <div className="space-y-4">
          {recommendations.map((rec: any, index: number) => {
            const Icon = rec.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className={`border-l-4 ${
                  rec.priority === 'high' ? 'border-red-500' : 
                  rec.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                } bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${rec.color} p-2 rounded-lg text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {rec.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {rec.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rec.actions.map((action: string, actionIndex: number) => (
                        <span
                          key={actionIndex}
                          className="text-xs bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
            Immediate Action Items
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-green-800 dark:text-green-200">This Month</h4>
            <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
              {investmentGaps.section80C.gap > 0 && <li>• Start SIP in ELSS funds</li>}
              {investmentGaps.section80D.gap > 0 && <li>• Purchase health insurance</li>}
              <li>• Submit investment proofs to employer</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-green-800 dark:text-green-200">This Quarter</h4>
            <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <li>• Review tax-saving portfolio</li>
              <li>• Plan for advance tax payments</li>
              <li>• Consider NPS for additional deduction</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
  } catch (error) {
    console.error('TaxStrategyReport error:', error);
    return <ErrorFallback />;
  }
}
