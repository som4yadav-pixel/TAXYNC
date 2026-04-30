import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  IndianRupee, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Calendar,
  User,
  FileSpreadsheet,
  Loader,
  CheckCircle
} from 'lucide-react';
import { exportPDF, exportExcel } from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function Reports() {
  const pieChartRef = useRef<ChartJS<'pie', number[], string>>(null);
  const barChartRef = useRef<ChartJS<'bar', number[], string>>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [calculationData, setCalculationData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load last calculation data
  useEffect(() => {
    const loadData = () => {
      try {
        // Get from localStorage (Dashboard saves here)
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

    // Listen for localStorage changes to sync with Dashboard calculations
    const handleStorageChange = () => {
      const stored = localStorage.getItem('lastTaxCalculation');
      if (stored) {
        try {
          setCalculationData(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to parse stored data:', error);
        }
      }
    };

    // Check for updates every 2 seconds
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!calculationData) return;
    
    setIsLoadingPDF(true);
    try {
            const chartRef = chartType === 'pie' ? pieChartRef : barChartRef;
      const chartImage = chartRef.current?.toBase64Image();
      await exportPDF(calculationData.formData, calculationData.result, chartImage);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); 
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
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); 
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setIsLoadingExcel(false);
    }
  };

  // Get tax data for display
  const getTaxData = () => {
    if (calculationData?.result) {
      return {
        oldRegimeTax: calculationData.result.old_regime_tax,
        newRegimeTax: calculationData.result.new_regime_tax,
        savings: calculationData.result.savings,
        income: calculationData.formData?.income || 0
      };
    }
    // Fallback data if no calculation exists
    return {
      oldRegimeTax: 0,
      newRegimeTax: 0,
      savings: 0,
      income: 0
    };
  };

  const taxData = getTaxData();

  const pieData = {
    labels: ['Old Regime Tax', 'New Regime Tax', 'Tax Savings'],
    datasets: [
      {
        data: [taxData.oldRegimeTax, taxData.newRegimeTax, taxData.savings],
        backgroundColor: ['#663399', '#f59e0b', '#10b981'],
        borderWidth: 0,
        hoverOffset: 10,
      }
    ]
  };

  const barData = {
    labels: ['Old Regime', 'New Regime'],
    datasets: [
      {
        label: 'Tax Amount (₹)',
        data: [taxData.oldRegimeTax, taxData.newRegimeTax],
        backgroundColor: ['#663399', '#f59e0b'],
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#663399',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ₹${context.parsed.toLocaleString()}`;
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const,
    }
  };


  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-full relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center z-50"
          >
            <CheckCircle className="h-6 w-6 mr-3" />
            <span>Export successful! Your file is downloading.</span>
            <button onClick={() => setShowSuccess(false)} className="ml-4 text-xl font-bold">&times;</button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tax Reports & Export</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Final tax summary with professional export options
          </p>
        </div>

        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Annual Income', 
              value: `₹${taxData.income.toLocaleString()}`, 
              icon: IndianRupee,
              color: 'bg-blue-500'
            },
            { 
              title: 'Old Regime Tax', 
              value: `₹${taxData.oldRegimeTax.toLocaleString()}`, 
              icon: TrendingUp,
              color: 'bg-cadbury-500'
            },
            { 
              title: 'New Regime Tax', 
              value: `₹${taxData.newRegimeTax.toLocaleString()}`, 
              icon: BarChart3,
              color: 'bg-gold-500'
            },
            { 
              title: 'Total Savings', 
              value: `₹${taxData.savings.toLocaleString()}`, 
              icon: TrendingUp,
              color: 'bg-green-500'
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.title}
                  </h3>
                  <div className={`${stat.color} p-2 rounded-full`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tax Comparison Analysis
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('pie')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  chartType === 'pie'
                    ? 'bg-cadbury-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-cadbury-100 dark:hover:bg-cadbury-900'
                }`}
              >
                <PieChart className="h-4 w-4" />
                <span>Pie</span>
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  chartType === 'bar'
                    ? 'bg-cadbury-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-cadbury-100 dark:hover:bg-cadbury-900'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Bar</span>
              </button>
            </div>
          </div>
          <div className="h-80">
            {chartType === 'pie' ? (
              <Pie ref={pieChartRef} data={pieData} options={chartOptions} />
            ) : (
              <Bar ref={barChartRef} data={barData} options={chartOptions} />
            )}
          </div>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Export Tax Report
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Download professional tax reports with complete analysis
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mt-4">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-cadbury-500 rounded-full"></div>
                  <span>Complete tax regime comparison</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-cadbury-500 rounded-full"></div>
                  <span>Interactive charts and visualizations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-cadbury-500 rounded-full"></div>
                  <span>Deduction breakdowns and limits</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-cadbury-500 rounded-full"></div>
                  <span>Professional branding and formatting</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Report Details:</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Generated for: Demo User</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-4 w-4" />
                  <span>Tax Year: {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={handleExportPDF}
                disabled={!calculationData || isLoadingPDF}
                whileHover={{ scale: !calculationData || isLoadingPDF ? 1 : 1.05 }}
                whileTap={{ scale: !calculationData || isLoadingPDF ? 1 : 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingPDF ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>{isLoadingPDF ? 'Generating...' : 'Export PDF'}</span>
              </motion.button>
              
              <motion.button
                onClick={handleExportExcel}
                disabled={!calculationData || isLoadingExcel}
                whileHover={{ scale: !calculationData || isLoadingExcel ? 1 : 1.05 }}
                whileTap={{ scale: !calculationData || isLoadingExcel ? 1 : 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingExcel ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                <span>{isLoadingExcel ? 'Generating...' : 'Export Excel'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Deductions Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Deductions Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {calculationData?.formData ? [
              { section: 'Section 80C', amount: calculationData.formData.section80C },
              { section: 'Section 80D', amount: calculationData.formData.section80D },
              { section: 'HRA', amount: calculationData.formData.hra },
              { section: 'Home Loan', amount: calculationData.formData.homeLoanInterest },
              { section: 'Education Loan', amount: calculationData.formData.educationLoan },
              { section: 'Donations', amount: calculationData.formData.donations }
            ].map(({ section, amount }, index) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {section}
                  </h4>
                  <p className="text-2xl font-bold text-cadbury-600 dark:text-cadbury-400 mt-2">
                    ₹{amount.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                No calculation data available. Please calculate tax from the Dashboard first.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
