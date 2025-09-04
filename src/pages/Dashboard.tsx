import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  IndianRupee, 
  TrendingUp, 
  ChevronDown,
  BarChart3,
  PieChart,
  LineChart,
  AreaChart,
  Lightbulb,
  Home,
  PiggyBank,
  Building,
  Gift,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Heart,
  GraduationCap,
  Receipt,
  Share2,
  
} from 'lucide-react';
import { calculateTax as apiCalculateTax, createShareableLink } from '../api';
import { PieChart as RechartsPie, BarChart as RechartsBar, LineChart as RechartsLine, AreaChart as RechartsArea, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, Bar, Pie, Line, Area } from 'recharts';
import { LottieAnimation } from '../components/LottieAnimation';
import dashboardAnimation from '../assets/dashboard-animation.json';

interface TaxFormData {
  income: number;
  standardDeduction: number;
  section80C: number;
  hra: number;
  section80D: number;
  homeLoanInterest: number;
  educationLoan: number;
  donations: number;
}

interface TaxResult {
  old_regime_tax: number;
  new_regime_tax: number;
  savings: number;
  suggestions?: string[];
}

export function Dashboard() {
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [comparisonChartType, setComparisonChartType] = useState<'line' | 'bar' | 'area'>('bar');
  const [savingsChartType, setSavingsChartType] = useState<'donut' | 'pie'>('donut');
  const [growthRate, setGrowthRate] = useState<number>(10);
  const [isCalculating, setIsCalculating] = useState(false);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [salaryHike, setSalaryHike] = useState(10); // Default 10% hike
  const [future80C, setFuture80C] = useState(0);
  const [future80D, setFuture80D] = useState(0);
  const [simulationResult, setSimulationResult] = useState<TaxResult | null>(null);

  const [formData, setFormData] = useState<TaxFormData>({
    income: 1200000,
    standardDeduction: 50000,
    section80C: 150000,
    hra: 240000,
    section80D: 25000,
    homeLoanInterest: 200000,
    educationLoan: 50000,
    donations: 10000
  });

  // Default chart data when no calculation is done
  const getDefaultDonutData = () => [
    { name: 'Old Regime Tax', value: 1, fill: '#FFD700' },
    { name: 'New Regime Tax', value: 1, fill: '#9333ea' }
  ];

  const getDefaultBarData = () => [
    { month: 'Jan', oldRegime: 0, newRegime: 0 },
    { month: 'Feb', oldRegime: 0, newRegime: 0 },
    { month: 'Mar', oldRegime: 0, newRegime: 0 },
    { month: 'Apr', oldRegime: 0, newRegime: 0 },
    { month: 'May', oldRegime: 0, newRegime: 0 },
    { month: 'Jun', oldRegime: 0, newRegime: 0 }
  ];


  const handleCalculateTax = async (isSimulation = false) => {
    setIsCalculating(true);
    if (!isSimulation) {
      setTaxResult(null); // Clear previous results to show loading state
    }
    setError(null);

    const payload = isSimulation
      ? {
          ...formData,
          income: formData.income * (1 + salaryHike / 100),
          section80C: future80C > 0 ? future80C : formData.section80C,
          section80D: future80D > 0 ? future80D : formData.section80D,
        }
      : { ...formData };

    try {
      // Step 1: Get core tax calculation results immediately.
      const result = await apiCalculateTax(payload);

      if (isSimulation) {
        setSimulationResult(result);
        setIsCalculating(false);
        return;
      }

      // Step 2: Display core results instantly.
      setTaxResult(result);
      setIsCalculating(false); // Stop main loader

      const calculationData = {
        formData,
        result,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('lastTaxCalculation', JSON.stringify(calculationData));
    } catch (error) {
      console.error('Tax calculation failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to calculate tax. Please check your connection and try again.';
      setError(errorMessage);
      setIsCalculating(false); // Ensure loader stops on error
    }
  };

  useEffect(() => {
    if (isSimulating) {
      handleCalculateTax(true);
    }
  }, [isSimulating, salaryHike, formData, future80C, future80D]);


  // Helper: share via best available method (Web Share API > Clipboard > Legacy copy)
  const shareViaBestAvailable = async (shareableLink: string) => {
    const navAny: any = navigator;
    // 1) Try native Web Share API first (best UX on mobile)
    if (navAny.share && typeof navAny.share === 'function') {
      try {
        await navAny.share({
          title: 'Taxync – Tax Comparison Report',
          text: 'Check out my tax comparison report from Taxync.',
          url: shareableLink,
        });
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 2000);
        return;
      } catch (shareErr) {
        console.warn('Web Share API failed, falling back to clipboard.', shareErr);
      }
    }

    // 2) Clipboard API fallback (requires secure context or localhost)
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(shareableLink);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
      return;
    }

    // 3) Legacy textarea-based copy as a last resort
    const textarea = document.createElement('textarea');
    textarea.value = shareableLink;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  // Base64URL helpers for UTF-8 strings
  const base64UrlEncode = (str: string) => {
    // Note: escape/unescape are deprecated but widely supported; ok for this small payload
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const buildLocalShareLink = (payload: object) => {
    const json = JSON.stringify(payload);
    const enc = base64UrlEncode(json);
    return `${window.location.origin}/shared-report/local?data=${enc}`;
  };

  const handleShareReport = async () => {
    if (!taxResult) return;

    try {
      // Preferred: ask backend to create a short reportId link
      const shareableLink = await createShareableLink(formData, taxResult);
      await shareViaBestAvailable(shareableLink);
    } catch (e) {
      console.warn('Share API unavailable, falling back to local encoded link.', e);
      try {
        const fallbackLink = buildLocalShareLink({ formData, taxResult });
        await shareViaBestAvailable(fallbackLink);
      } catch (fallbackErr) {
        const errorMessage = fallbackErr instanceof Error ? fallbackErr.message : 'Failed to create shareable link.';
        setError(errorMessage);
        console.error('Sharing failed (including fallback):', fallbackErr);
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('lastTaxCalculation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.result) {
          setTaxResult(parsed.result);
        }
      } catch (e) {
        console.error('Failed to parse lastTaxCalculation from localStorage', e);
      }
    }
  }, []);


  const getDonutData = () => {
    if (!taxResult) return getDefaultDonutData();
    
    return [
      { name: 'Old Regime Tax', value: taxResult.old_regime_tax, fill: '#FFD700' },
      { name: 'New Regime Tax', value: taxResult.new_regime_tax, fill: '#9333ea' }
    ];
  };

  const getSavingsAmount = () => {
    if (!taxResult) return 0;
    return taxResult.old_regime_tax - taxResult.new_regime_tax;
  };

    const getDeductionsPieData = () => {
    const totalDeductions =
      (formData.section80C || 0) +
      (formData.hra || 0) +
      (formData.section80D || 0) +
      (formData.homeLoanInterest || 0) +
      (formData.educationLoan || 0) +
      (formData.donations || 0) +
      (formData.standardDeduction || 0);

    const taxableIncome = (formData.income || 0) - totalDeductions;

    if (taxableIncome <= 0 && totalDeductions <= 0) {
        return [
            { name: 'Taxable Income', value: 1, fill: '#8884d8' },
            { name: 'Total Deductions', value: 1, fill: '#82ca9d' },
        ];
    }

    return [
      { name: 'Taxable Income', value: taxableIncome > 0 ? taxableIncome : 0, fill: '#8884d8' },
      { name: 'Total Deductions', value: totalDeductions, fill: '#82ca9d' },
    ];
  };

  const getBarData = () => {
    if (!taxResult) return getDefaultBarData();
    
    if (timeframe === 'monthly') {
      return [
        { month: 'Jan', oldRegime: Math.round(taxResult.old_regime_tax / 12), newRegime: Math.round(taxResult.new_regime_tax / 12) },
        { month: 'Feb', oldRegime: Math.round(taxResult.old_regime_tax / 12), newRegime: Math.round(taxResult.new_regime_tax / 12) },
        { month: 'Mar', oldRegime: Math.round(taxResult.old_regime_tax / 12), newRegime: Math.round(taxResult.new_regime_tax / 12) },
        { month: 'Apr', oldRegime: Math.round(taxResult.old_regime_tax / 12), newRegime: Math.round(taxResult.new_regime_tax / 12) },
        { month: 'May', oldRegime: Math.round(taxResult.old_regime_tax / 12), newRegime: Math.round(taxResult.new_regime_tax / 12) },
        { month: 'Jun', oldRegime: Math.round(taxResult.old_regime_tax / 12), newRegime: Math.round(taxResult.new_regime_tax / 12) }
      ];
    } else {
      return [
        { year: '2021', oldRegime: Math.round(taxResult.old_regime_tax * 0.9), newRegime: Math.round(taxResult.new_regime_tax * 0.9) },
        { year: '2022', oldRegime: Math.round(taxResult.old_regime_tax * 0.95), newRegime: Math.round(taxResult.new_regime_tax * 0.95) },
        { year: '2023', oldRegime: Math.round(taxResult.old_regime_tax * 0.98), newRegime: Math.round(taxResult.new_regime_tax * 0.98) },
        { year: '2024', oldRegime: taxResult.old_regime_tax, newRegime: taxResult.new_regime_tax }
      ];
    }
  };

  const getProjectionData = () => {
    if (!formData.income) {
      const year = new Date().getFullYear();
      return [
        { year: year + 1, oldRegime: 0, newRegime: 0 },
        { year: year + 2, oldRegime: 0, newRegime: 0 },
        { year: year + 3, oldRegime: 0, newRegime: 0 },
        { year: year + 4, oldRegime: 0, newRegime: 0 },
        { year: year + 5, oldRegime: 0, newRegime: 0 },
      ];
    }
    const baseIncome = formData.income || 0;
    const baseOldTax = taxResult?.old_regime_tax || 0;
    const baseNewTax = taxResult?.new_regime_tax || 0;
    const year = new Date().getFullYear();
    const data = [] as Array<{ year: number; oldRegime: number; newRegime: number }>;
    for (let i = 1; i <= 5; i++) {
      const projectedIncome = baseIncome * Math.pow(1 + (growthRate || 0) / 100, i);
      const factor = baseIncome > 0 ? projectedIncome / baseIncome : 0;
      data.push({
        year: year + i,
        oldRegime: Math.round(baseOldTax * factor),
        newRegime: Math.round(baseNewTax * factor),
      });
    }
    return data;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Taxync Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Compare Old vs New Tax Regime for India FY 2025-26
          </p>
          
          {/* Lottie Animation */}
          <div className="mt-6 flex justify-center">
            <LottieAnimation 
              animationData={dashboardAnimation}
              className="w-48 h-48"
              ariaLabel="Animated graphic of financial charts and graphs"
            />
          </div>
        </div>

        {/* Tax Input Form */}
        <motion.div
          id="tour-step-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calculator className="h-6 w-6 mr-3 text-purple-600" />
            Tax Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Annual Income */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-4 w-4 text-purple-600" />
                  <span>Annual Income</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="Enter annual income"
              />
            </div>

            {/* Standard Deduction */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Receipt className="h-4 w-4 text-purple-600" />
                  <span>Standard Deduction</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.standardDeduction}
                onChange={(e) => setFormData({...formData, standardDeduction: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="Enter standard deduction"
              />
            </div>

            {/* Section 80C */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <PiggyBank className="h-4 w-4 text-purple-600" />
                  <span>Section 80C Investments</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.section80C}
                onChange={(e) => setFormData({...formData, section80C: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="Enter 80C investments"
              />
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="mb-6">
            <motion.button
              onClick={() => setShowAdvanced(!showAdvanced)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200 font-medium"
            >
              <motion.div
                animate={{ rotate: showAdvanced ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
              <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
            </motion.button>
          </div>

          {/* Advanced Fields */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* HRA */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4 text-purple-600" />
                        <span>House Rent Allowance (HRA)</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.hra}
                      onChange={(e) => setFormData({...formData, hra: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Enter HRA amount"
                    />
                  </div>

                  {/* Section 80D */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-purple-600" />
                        <span>Health Insurance (80D)</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.section80D}
                      onChange={(e) => setFormData({...formData, section80D: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Enter health insurance premium"
                    />
                  </div>

                  {/* Home Loan Interest */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        <span>Home Loan Interest</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.homeLoanInterest}
                      onChange={(e) => setFormData({...formData, homeLoanInterest: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Enter home loan interest"
                    />
                  </div>

                  {/* Education Loan Interest */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                        <span>Education Loan Interest</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.educationLoan}
                      onChange={(e) => setFormData({...formData, educationLoan: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Enter education loan interest"
                    />
                  </div>

                  {/* Donations */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-purple-600" />
                        <span>Donations (80G)</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.donations}
                      onChange={(e) => setFormData({...formData, donations: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Enter donation amount"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        
          {/* Simulation Toggle */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                'What If?' Simulation
              </h3>
              <div 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isSimulating ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <motion.div 
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                  layout 
                  transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                  initial={{ x: 0 }}
                  animate={{ x: isSimulating ? 24 : 0 }}
                />
              </div>
            </div>
            <AnimatePresence>
              {isSimulating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Salary Hike: <span className='font-bold text-purple-600'>{salaryHike}%</span>
                  </label>
                  <input
                    id="salary-hike"
                    type="range"
                    min="0"
                    max="50"
                    value={salaryHike}
                    onChange={(e) => setSalaryHike(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="future-80c" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Future 80C Investment
                      </label>
                      <input
                        id="future-80c"
                        type="number"
                        value={future80C}
                        onChange={(e) => setFuture80C(Number(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="e.g. 150000"
                      />
                    </div>
                    <div>
                      <label htmlFor="future-80d" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Future 80D (Health)
                      </label>
                      <input
                        id="future-80d"
                        type="number"
                        value={future80D}
                        onChange={(e) => setFuture80D(Number(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="e.g. 25000"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tax Results Cards - Always Visible */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <motion.button
              onClick={() => handleCalculateTax(false)}
              disabled={isCalculating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5" />
                  <span>Calculate Tax</span>
                </>
              )}
            </motion.button>
            <div className="relative">
              <motion.button
                onClick={handleShareReport}
                disabled={!taxResult}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </motion.button>
              <AnimatePresence>
                {showShareSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full mb-2 w-full bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-md text-center"
                  >
                    Link Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </motion.div>

      {/* Tax Results Cards - Always Visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {[
                { 
                  title: 'Old Regime Tax', 
              value: (isSimulating && simulationResult) ? `₹${simulationResult.old_regime_tax?.toLocaleString() || '0'}` : (taxResult ? `₹${taxResult.old_regime_tax?.toLocaleString() || '0'}` : '₹0'),
              change: taxResult ? 'Higher Tax' : 'Calculate to see',
                  color: 'from-purple-500 to-purple-600',
                  textColor: 'text-purple-600 dark:text-purple-400',
              icon: Calculator,
              description: 'Traditional tax system with deductions and exemptions',
              link: 'https://incometaxindia.gov.in/pages/tax-information-services.aspx'
                },
                { 
                  title: 'New Regime Tax', 
              value: (isSimulating && simulationResult) ? `₹${simulationResult.new_regime_tax?.toLocaleString() || '0'}` : (taxResult ? `₹${taxResult.new_regime_tax?.toLocaleString() || '0'}` : '₹0'),
              change: taxResult ? 'Lower Tax' : 'Calculate to see',
                  color: 'from-yellow-500 to-orange-500',
                  textColor: 'text-yellow-600 dark:text-yellow-400',
              icon: TrendingUp,
              description: 'Simplified tax system with lower rates but no deductions',
              link: 'https://incometaxindia.gov.in/pages/tax-information-services.aspx'
                },
                { 
                  title: 'Total Savings', 
              value: (isSimulating && simulationResult) ? `₹${Math.abs(simulationResult.savings || 0).toLocaleString()}` : (taxResult ? `₹${Math.abs(taxResult.savings || 0).toLocaleString()}` : '₹0'),
              change: taxResult ? (taxResult.savings > 0 ? 'You Save!' : 'Old Regime Better') : 'Calculate to see',
              color: taxResult && taxResult.savings > 0 ? 'from-green-500 to-green-600' : 'from-gray-400 to-gray-500',
              textColor: taxResult && taxResult.savings > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400',
              icon: taxResult && taxResult.savings > 0 ? CheckCircle : AlertCircle,
              description: 'Difference between Old and New regime taxes',
              link: 'https://incometaxindia.gov.in/pages/tax-information-services.aspx'
                },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stat.title}
                      </h3>
                      <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-full`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </p>
                <p className={`text-sm font-medium ${stat.textColor} mb-3`}>
                      {stat.change}
                    </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {stat.description}
                </p>
                <a 
                  href={stat.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  View Govt. Tax Info →
                </a>
                  </motion.div>
                );
              })}
            </motion.div>

            

            {/* Recommended Regime */}
            {taxResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Recommended Regime</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Based on current inputs and results</p>
                  </div>
                  <div id="tour-step-4" className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Optimized</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end gap-6">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {taxResult.old_regime_tax <= taxResult.new_regime_tax ? 'Old Regime' : 'New Regime'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lower tax liability</p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Difference: <span className="font-semibold">₹{Math.abs((taxResult.old_regime_tax || 0) - (taxResult.new_regime_tax || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Suggestions Panel - Always Visible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-600 to-yellow-500 p-3 rounded-full">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Tax Optimization Suggestions
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Personalized tips based on your calculation results
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {taxResult?.suggestions && taxResult.suggestions.length > 0 ? (
                  <div className="space-y-4">
                    {taxResult.suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
                      >
                        <Lightbulb className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {suggestion}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No suggestions yet. Calculate your taxes to see personalized tips.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Charts - Always Visible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
            >
              {/* Bar Chart */}
              <motion.div
                id="tour-step-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tax Comparison
                  </h3>
                  <div className="flex flex-col gap-2">
                    {/* Chart Type Toggle */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setComparisonChartType('line')}
                        className={`flex items-center px-2 py-1 text-xs rounded-lg transition-all duration-200 ${
                          comparisonChartType === 'line'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                        }`}
                      >
                        <LineChart className="h-3 w-3 mr-1" />
                        Line
                      </button>
                      <button
                        onClick={() => setComparisonChartType('bar')}
                        className={`flex items-center px-2 py-1 text-xs rounded-lg transition-all duration-200 ${
                          comparisonChartType === 'bar'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                        }`}
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Bar
                      </button>
                      <button
                        onClick={() => setComparisonChartType('area')}
                        className={`flex items-center px-2 py-1 text-xs rounded-lg transition-all duration-200 ${
                          comparisonChartType === 'area'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                        }`}
                      >
                        <AreaChart className="h-3 w-3 mr-1" />
                        Area
                      </button>
                    </div>
                    {/* Timeframe Toggle */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTimeframe('monthly')}
                        className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                          timeframe === 'monthly'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setTimeframe('yearly')}
                        className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                          timeframe === 'yearly'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {comparisonChartType === 'bar' ? (
                      <RechartsBar data={getBarData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey={timeframe === 'monthly' ? 'month' : 'year'} 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <RechartsTooltip 
                          formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Tax Amount']}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '8px'
                          }}
                        />
                        <RechartsLegend 
                          verticalAlign="top" 
                          height={36}
                          wrapperStyle={{
                            paddingBottom: '10px'
                          }}
                        />
                        <Bar 
                          dataKey="oldRegime" 
                          fill="#FFD700" 
                          name="Old Regime" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="newRegime" 
                          fill="#9333ea" 
                          name="New Regime" 
                          radius={[4, 4, 0, 0]}
                        />
                      </RechartsBar>
                    ) : comparisonChartType === 'line' ? (
                      <RechartsLine data={getBarData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey={timeframe === 'monthly' ? 'month' : 'year'} 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <RechartsTooltip 
                          formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Tax Amount']}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '8px'
                          }}
                        />
                        <RechartsLegend 
                          verticalAlign="top" 
                          height={36}
                          wrapperStyle={{
                            paddingBottom: '10px'
                          }}
                        />
                        <Line 
                          type="monotone"
                          dataKey="oldRegime" 
                          stroke="#FFD700" 
                          strokeWidth={3}
                          name="Old Regime"
                          dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone"
                          dataKey="newRegime" 
                          stroke="#9333ea" 
                          strokeWidth={3}
                          name="New Regime"
                          dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
                        />
                      </RechartsLine>
                    ) : (
                      <RechartsArea data={getBarData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey={timeframe === 'monthly' ? 'month' : 'year'} 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <RechartsTooltip 
                          formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Tax Amount']}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '8px'
                          }}
                        />
                        <RechartsLegend 
                          verticalAlign="top" 
                          height={36}
                          wrapperStyle={{
                            paddingBottom: '10px'
                          }}
                        />
                        <Area 
                          type="monotone"
                          dataKey="oldRegime" 
                          stackId="1"
                          stroke="#FFD700" 
                          fill="#FFD700"
                          fillOpacity={0.6}
                          name="Old Regime"
                        />
                        <Area 
                          type="monotone"
                          dataKey="newRegime" 
                          stackId="2"
                          stroke="#9333ea" 
                          fill="#9333ea"
                          fillOpacity={0.6}
                          name="New Regime"
                        />
                      </RechartsArea>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Donut Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white rounded-2xl shadow p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Savings Overview
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSavingsChartType('donut')}
                      className={`flex items-center px-2 py-1 text-xs rounded-lg transition-all duration-200 ${
                        savingsChartType === 'donut'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                      }`}
                    >
                      <PieChart className="h-3 w-3 mr-1" />
                      Donut
                    </button>
                    <button
                      onClick={() => setSavingsChartType('pie')}
                      className={`flex items-center px-2 py-1 text-xs rounded-lg transition-all duration-200 ${
                        savingsChartType === 'pie'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                      }`}
                    >
                      <PieChart className="h-3 w-3 mr-1" />
                      Pie
                    </button>
                  </div>
                </div>
                <div className="h-80 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={getDonutData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={savingsChartType === 'donut' ? 60 : 0}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getDonutData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Tax Amount']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                      />
                      <RechartsLegend 
                        verticalAlign="bottom" 
                        height={36}
                        wrapperStyle={{
                          paddingTop: '10px'
                        }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                  
                  {/* Center Savings Display - Only for Donut Chart */}
                  {savingsChartType === 'donut' && (
                    <motion.div
                      key={getSavingsAmount()}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    >
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-500 mb-1">Savings</p>
                        <p className={`text-lg font-bold ${
                          getSavingsAmount() > 0 ? 'text-green-600' : getSavingsAmount() < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          ₹{Math.abs(getSavingsAmount()).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getSavingsAmount() > 0 ? 'New Regime Saves' : getSavingsAmount() < 0 ? 'Old Regime Better' : 'No Difference'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Deductions Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-white rounded-2xl shadow p-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Income Breakdown
                </h3>
                <div className="h-80 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={getDeductionsPieData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                      >
                        {getDeductionsPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                      />
                      <RechartsLegend 
                        verticalAlign="bottom" 
                        height={36}
                        wrapperStyle={{
                          paddingTop: '10px'
                        }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* 5-Year Projection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-white rounded-2xl shadow p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">5-Year Tax Projection</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Growth Rate</span>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={1}
                      value={growthRate}
                      onChange={(e) => setGrowthRate(Number(e.target.value))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <span>%</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLine data={getProjectionData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <RechartsTooltip 
                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Tax Amount']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                      />
                      <RechartsLegend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px' }} />
                      <Line type="monotone" dataKey="oldRegime" stroke="#FFD700" strokeWidth={3} name="Old Regime" dot={{ fill: '#FFD700', strokeWidth: 2, r: 3 }} />
                      <Line type="monotone" dataKey="newRegime" stroke="#9333ea" strokeWidth={3} name="New Regime" dot={{ fill: '#9333ea', strokeWidth: 2, r: 3 }} />
                    </RechartsLine>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
    </div>
  );
}
