import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Download,
  FileSpreadsheet,
  Calculator,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { exportPDF, exportExcel } from '../api';
import { PieChart as RechartsPie, BarChart as RechartsBar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, Bar } from 'recharts';

interface TaxResult {
  old_regime_tax: number;
  new_regime_tax: number;
  savings: number;
  suggestions?: string[];
}

interface FormData {
  income: number;
  section80C: number;
  section80D: number;
  hra: number;
  homeLoanInterest: number;
  standardDeduction: number;
  educationLoan: number;
  donations: number;
}

export function Report() {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [timeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [calculationData, setCalculationData] = useState<{
    formData: FormData;
    result: TaxResult;
    timestamp: string;
  } | null>(null);

  // Load calculation data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem('lastTaxCalculation');
        if (stored) {
          const parsedData = JSON.parse(stored);
          setCalculationData(parsedData);
        }
      } catch (error) {
        console.error('Failed to load calculation data:', error);
      }
    };

    loadData();

    // Check for updates every 2 seconds
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!calculationData) return;
    
    setIsLoadingPDF(true);
    try {
      await exportPDF(calculationData.formData, calculationData.result);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsLoadingPDF(false);
    }
  };

  // Handle Excel export
  const handleExportExcel = async () => {
    if (!calculationData) return;
    
    setIsLoadingExcel(true);
    try {
      await exportExcel(calculationData.formData, calculationData.result);
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setIsLoadingExcel(false);
    }
  };

  // Get chart data
  const getPieData = () => {
    if (!calculationData?.result) return [];
    
    return [
      { name: 'Old Regime Tax', value: calculationData.result.old_regime_tax, fill: '#663399' },
      { name: 'New Regime Tax', value: calculationData.result.new_regime_tax, fill: '#f59e0b' }
    ];
  };

  const getBarData = () => {
    if (!calculationData?.result) return [];
    
    if (timeframe === 'monthly') {
      return [
        { month: 'Jan', oldRegime: Math.round(calculationData.result.old_regime_tax / 12), newRegime: Math.round(calculationData.result.new_regime_tax / 12) },
        { month: 'Feb', oldRegime: Math.round(calculationData.result.old_regime_tax / 12), newRegime: Math.round(calculationData.result.new_regime_tax / 12) },
        { month: 'Mar', oldRegime: Math.round(calculationData.result.old_regime_tax / 12), newRegime: Math.round(calculationData.result.new_regime_tax / 12) },
        { month: 'Apr', oldRegime: Math.round(calculationData.result.old_regime_tax / 12), newRegime: Math.round(calculationData.result.new_regime_tax / 12) },
        { month: 'May', oldRegime: Math.round(calculationData.result.old_regime_tax / 12), newRegime: Math.round(calculationData.result.new_regime_tax / 12) },
        { month: 'Jun', oldRegime: Math.round(calculationData.result.old_regime_tax / 12), newRegime: Math.round(calculationData.result.new_regime_tax / 12) }
      ];
    } else {
      return [
        { year: '2021', oldRegime: Math.round(calculationData.result.old_regime_tax * 0.9), newRegime: Math.round(calculationData.result.new_regime_tax * 0.9) },
        { year: '2022', oldRegime: Math.round(calculationData.result.old_regime_tax * 0.95), newRegime: Math.round(calculationData.result.new_regime_tax * 0.95) },
        { year: '2023', oldRegime: Math.round(calculationData.result.old_regime_tax * 0.98), newRegime: Math.round(calculationData.result.new_regime_tax * 0.98) },
        { year: '2024', oldRegime: calculationData.result.old_regime_tax, newRegime: calculationData.result.new_regime_tax }
      ];
    }
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
            Tax Report & Export
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            View and export your tax calculation results
          </p>
        </div>

        {!calculationData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Calculation Data Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please calculate your taxes on the Dashboard first to view and export reports.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Export Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Export Reports</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Download your tax calculation results</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleExportPDF}
                    disabled={isLoadingPDF}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoadingPDF ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={handleExportExcel}
                    disabled={isLoadingExcel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoadingExcel ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>Download Excel</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Tax Results Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {[
                { 
                  title: 'Old Regime Tax', 
                  value: `₹${calculationData.result.old_regime_tax?.toLocaleString() || '0'}`, 
                  change: 'Higher Tax',
                  color: 'from-purple-500 to-purple-600',
                  textColor: 'text-purple-600 dark:text-purple-400',
                  icon: Calculator,
                  description: 'Traditional tax system with deductions and exemptions',
                  link: 'https://incometaxindia.gov.in/pages/tax-information-services.aspx'
                },
                { 
                  title: 'New Regime Tax', 
                  value: `₹${calculationData.result.new_regime_tax?.toLocaleString() || '0'}`, 
                  change: 'Lower Tax',
                  color: 'from-yellow-500 to-orange-500',
                  textColor: 'text-yellow-600 dark:text-yellow-400',
                  icon: TrendingUp,
                  description: 'Simplified tax system with lower rates but no deductions',
                  link: 'https://incometaxindia.gov.in/pages/tax-information-services.aspx'
                },
                { 
                  title: 'Total Savings', 
                  value: `₹${Math.abs(calculationData.result.savings || 0).toLocaleString()}`, 
                  change: calculationData.result.savings > 0 ? 'You Save!' : 'Old Regime Better',
                  color: calculationData.result.savings > 0 ? 'from-green-500 to-green-600' : 'from-gray-400 to-gray-500',
                  textColor: calculationData.result.savings > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400',
                  icon: calculationData.result.savings > 0 ? CheckCircle : AlertCircle,
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
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
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

            {/* Suggestions Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
                {calculationData.result?.suggestions && calculationData.result.suggestions.length > 0 ? (
                  <div className="space-y-4">
                    {calculationData.result.suggestions.map((suggestion, index) => (
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
                      No suggestions available for this calculation.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Tax Regime Comparison
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType('pie')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      chartType === 'pie'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900'
                    }`}
                  >
                    <PieChart className="h-4 w-4" />
                    <span>Pie Chart</span>
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      chartType === 'bar'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Bar Chart</span>
                  </button>
                </div>
              </div>
              
              <div className="h-96 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                    <RechartsPie 
                      data={getPieData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                    >
                      <Cell fill="#663399" />
                      <Cell fill="#f59e0b" />
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
                          paddingTop: '20px'
                        }}
                      />
                    </RechartsPie>
                  ) : (
                    <RechartsBar data={getBarData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey={timeframe === 'monthly' ? 'month' : 'year'} 
                        tick={{ fill: '#6b7280' }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        tick={{ fill: '#6b7280' }}
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
                          paddingBottom: '20px'
                        }}
                      />
                      <Bar 
                        dataKey="oldRegime" 
                        fill="#663399" 
                        name="Old Regime" 
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                      />
                      <Bar 
                        dataKey="newRegime" 
                        fill="#f59e0b" 
                        name="New Regime" 
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                      />
                    </RechartsBar>
                  )}
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
