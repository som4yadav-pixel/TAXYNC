import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Calculator, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  IndianRupee,
  PiggyBank,
  Lightbulb
} from 'lucide-react';
import { ModeSelector, CalculationMode } from './ModeSelector';

interface OnboardingData {
  income: string;
  hasInvestments: boolean;
  taxGoal: 'save-maximum' | 'simplify-process' | 'compare-options';
  calculationMode: CalculationMode;
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export function OnboardingWizard({ isOpen, onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    income: '',
    hasInvestments: false,
    taxGoal: 'compare-options',
    calculationMode: 'quick-comparison'
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Taxync!',
      subtitle: 'Your Personal Tax Planning Assistant',
      icon: Lightbulb,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'income',
      title: 'What\'s your annual income?',
      subtitle: 'This helps us personalize your tax recommendations',
      icon: IndianRupee,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'investments',
      title: 'Do you have tax-saving investments?',
      subtitle: 'Like PPF, ELSS, insurance, home loan, etc.',
      icon: PiggyBank,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'goal',
      title: 'What\'s your main tax goal?',
      subtitle: 'We\'ll customize the experience based on your priority',
      icon: Target,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'mode',
      title: 'Choose your calculation mode',
      subtitle: 'Select how you want to approach tax planning',
      icon: Calculator,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'complete',
      title: 'You\'re all set!',
      subtitle: 'Let\'s start optimizing your taxes',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(onboardingData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const getRecommendedMode = (): CalculationMode => {
    const income = Number(onboardingData.income);
    
    if (income > 1500000 && onboardingData.hasInvestments) {
      return 'old-regime-optimizer';
    } else if (income < 500000 || onboardingData.taxGoal === 'simplify-process') {
      return 'new-regime-direct';
    }
    return 'quick-comparison';
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    const Icon = step.icon;

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`w-24 h-24 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg`}
            >
              <Icon className="h-12 w-12 text-white" />
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {step.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
              >
                <Calculator className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Smart Calculations</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">FY 2025-26 compliant tax engine</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
              >
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">Wealth Creation</h3>
                <p className="text-sm text-green-700 dark:text-green-300">ELSS/NPS investment suggestions</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">25+ Deductions</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Comprehensive tax saving options</p>
              </motion.div>
            </div>
          </div>
        );

      case 'income':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg mb-4`}
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {step.subtitle}
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={onboardingData.income}
                  onChange={(e) => setOnboardingData({ ...onboardingData, income: e.target.value })}
                  placeholder="Enter your annual income"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {['500000', '1000000', '2000000'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setOnboardingData({ ...onboardingData, income: amount })}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    ₹{Number(amount).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'investments':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg mb-4`}
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {step.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOnboardingData({ ...onboardingData, hasInvestments: true })}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  onboardingData.hasInvestments
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                }`}
              >
                <PiggyBank className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Yes, I have investments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">PPF, ELSS, Insurance, Home Loan, etc.</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOnboardingData({ ...onboardingData, hasInvestments: false })}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  !onboardingData.hasInvestments
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                }`}
              >
                <Calculator className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No, just starting out</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">I want to explore tax-saving options</p>
              </motion.button>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg mb-4`}
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {step.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'save-maximum', title: 'Save Maximum Tax', desc: 'I want to explore all possible deductions', icon: Shield },
                { value: 'simplify-process', title: 'Simplify Process', desc: 'I prefer quick and straightforward calculations', icon: Zap },
                { value: 'compare-options', title: 'Compare Options', desc: 'Show me both regimes and help me decide', icon: TrendingUp }
              ].map((option) => {
                const OptionIcon = option.icon;
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setOnboardingData({ ...onboardingData, taxGoal: option.value as any })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      onboardingData.taxGoal === option.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <OptionIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{option.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 'mode':
        const recommendedMode = getRecommendedMode();
        return (
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg mb-4`}
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {step.subtitle}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Based on your profile, we recommend:
                </span>
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300 capitalize">
                  {recommendedMode.replace('-', ' ')}
                </span>
              </div>
            </div>

            <ModeSelector
              selectedMode={onboardingData.calculationMode}
              onModeChange={(mode) => setOnboardingData({ ...onboardingData, calculationMode: mode })}
              income={Number(onboardingData.income)}
            />
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className={`w-24 h-24 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg`}
            >
              <Icon className="h-12 w-12 text-white" />
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {step.subtitle}
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">Your Profile Summary</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Income:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{Number(onboardingData.income).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Investments:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {onboardingData.hasInvestments ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Goal:</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {onboardingData.taxGoal.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400 capitalize">
                    {onboardingData.calculationMode.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Skip onboarding
                </button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              >
                <span>
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
