import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  IndianRupee, 
  TrendingUp, 
  Home, 
  Heart, 
  GraduationCap, 
  RefreshCw,
  PieChart,
  BarChart3,
  Lightbulb,
  Target,
  CheckCircle,
  AlertCircle,
  Receipt,
  PiggyBank,
  ChevronDown,
  Building,
  Gift
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

function App() {
  // State Management
  const [formData, setFormData] = useState({
    income: 1200000,
    standardDeduction: 50000,
    section80C: 150000,
    section80D: 25000,
    hra: 240000,
    homeLoanInterest: 200000,
    educationLoanInterest: 50000,
    donations: 10000
  });

  const [taxResult, setTaxResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [chartType, setChartType] = useState('pie');
  const [suggestions, setSuggestions] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);



  // Calculate Tax - FastAPI Integration
  const calculateTax = async () => {
    setIsCalculating(true);
    
    try {
      const response = await fetch('/api/calculate-tax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          income: formData.income,
          standard_deduction: formData.standardDeduction,
          section80C: formData.section80C,
          section80D: formData.section80D,
          hra: formData.hra,
          home_loan_interest: formData.homeLoanInterest,
          edu_loan_interest: formData.educationLoanInterest,
          donations: formData.donations
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTaxResult({
          oldRegimeTax: result.old_regime_tax,
          newRegimeTax: result.new_regime_tax,
          savings: result.savings
        });
        setSuggestions(result.suggestions || [
          "Consider maximizing your Section 80C investments up to ₹1.5 lakh",
          "Health insurance premiums under Section 80D can save additional tax",
          "HRA exemption can significantly reduce your taxable income",
          "Compare both tax regimes annually as your income changes"
        ]);
        
        // Store in localStorage
        localStorage.setItem('taxCalculationResult', JSON.stringify(result));
      } else {
        console.error('Failed to calculate tax');
        // Show default suggestions on error
        setSuggestions([
          "Unable to connect to server. Please check your connection",
          "Consider maximizing your Section 80C investments up to ₹1.5 lakh",
          "Health insurance premiums under Section 80D can save additional tax"
        ]);
      }
    } catch (error) {
      console.error('Error calculating tax:', error);
      // Show default suggestions on error
      setSuggestions([
        "Unable to connect to server. Please check your connection",
        "Consider maximizing your Section 80C investments up to ₹1.5 lakh",
        "Health insurance premiums under Section 80D can save additional tax"
      ]);
    } finally {
      setIsCalculating(false);
    }
  };

  // Chart Data for Recharts
  const getChartData = () => {
    if (!taxResult) return [];
    
    return [
      {
        name: 'Old Regime',
        value: taxResult.oldRegimeTax,
        fill: '#663399'
      },
      {
        name: 'New Regime', 
        value: taxResult.newRegimeTax,
        fill: '#f59e0b'
      }
    ];
  };

  const COLORS = ['#663399', '#f59e0b'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-purple-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`${payload[0].name}: ₹${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Tax Comparison Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Compare Old vs New Tax Regime for India FY 2025-26 and get personalized tax optimization suggestions
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <IndianRupee className="h-6 w-6 mr-3 text-purple-600" />
            Tax Information
          </h2>
          
          {/* Default Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Annual Income */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-4 w-4 text-purple-600" />
                  <span>Annual Income</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                placeholder="Enter annual income"
              />
            </div>

            {/* Standard Deduction */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Receipt className="h-4 w-4 text-purple-600" />
                  <span>Standard Deduction</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.standardDeduction}
                onChange={(e) => setFormData({...formData, standardDeduction: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                placeholder="Enter standard deduction"
              />
            </div>

            {/* Section 80C */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <PiggyBank className="h-4 w-4 text-purple-600" />
                  <span>Section 80C Investments</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.section80C}
                onChange={(e) => setFormData({...formData, section80C: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
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
              className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-4 border-t border-gray-200">
                  {/* HRA */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4 text-purple-600" />
                        <span>House Rent Allowance (HRA)</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.hra}
                      onChange={(e) => setFormData({...formData, hra: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter HRA amount"
                    />
                  </div>

                  {/* Section 80D */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-purple-600" />
                        <span>Health Insurance (80D)</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.section80D}
                      onChange={(e) => setFormData({...formData, section80D: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter health insurance premium"
                    />
                  </div>

                  {/* Home Loan Interest */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        <span>Home Loan Interest</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.homeLoanInterest}
                      onChange={(e) => setFormData({...formData, homeLoanInterest: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter home loan interest"
                    />
                  </div>

                  {/* Education Loan Interest */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                        <span>Education Loan Interest</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.educationLoanInterest}
                      onChange={(e) => setFormData({...formData, educationLoanInterest: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter education loan interest"
                    />
                  </div>

                  {/* Donations */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-purple-600" />
                        <span>Donations (80G)</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.donations}
                      onChange={(e) => setFormData({...formData, donations: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter donation amount"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="text-center">
            <motion.button
              onClick={calculateTax}
              disabled={isCalculating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center space-x-3 mx-auto"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Calculator className="h-6 w-6" />
                  <span>Calculate Tax</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Results Section - Only show after calculation */}
        <AnimatePresence>
          {taxResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Tax Results Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { 
                    title: 'Old Regime Tax', 
                    value: `₹${taxResult.oldRegimeTax.toLocaleString()}`, 
                    change: 'Higher Tax',
                    color: 'from-purple-500 to-purple-600',
                    textColor: 'text-purple-600',
                    icon: Calculator
                  },
                  { 
                    title: 'New Regime Tax', 
                    value: `₹${taxResult.newRegimeTax.toLocaleString()}`, 
                    change: 'Lower Tax',
                    color: 'from-yellow-500 to-orange-500',
                    textColor: 'text-yellow-600',
                    icon: TrendingUp
                  },
                  { 
                    title: 'Total Savings', 
                    value: `₹${Math.abs(taxResult.savings).toLocaleString()}`, 
                    change: taxResult.savings > 0 ? 'You Save!' : 'Old Regime Better',
                    color: taxResult.savings > 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600',
                    textColor: taxResult.savings > 0 ? 'text-green-600' : 'text-red-600',
                    icon: taxResult.savings > 0 ? CheckCircle : AlertCircle
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
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm font-medium ${stat.textColor}`}>{stat.change}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Chart Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20"
              >
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                    Tax Regime Comparison
                  </h3>
                  
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setChartType('pie')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                        chartType === 'pie'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                      }`}
                    >
                      <PieChart className="h-5 w-5" />
                      <span className="font-semibold">Pie Chart</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setChartType('bar')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                        chartType === 'bar'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                      }`}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span className="font-semibold">Bar Chart</span>
                    </motion.button>
                  </div>
                </div>
                
                <div className="h-96">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={chartType}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4 }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'pie' ? (
                          <RechartsPieChart data={getChartData()}>
                            <Pie
                              data={getChartData()}
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                            >
                              {getChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </RechartsPieChart>
                        ) : (
                          <RechartsBarChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="value" fill="#663399" radius={[4, 4, 0, 0]} />
                          </RechartsBarChart>
                        )}
                      </ResponsiveContainer>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Suggestions Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Tax Optimization Suggestions
                    </h3>
                    <p className="text-gray-600">
                      Personalized tips based on your calculation results
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-full flex-shrink-0">
                          <Lightbulb className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{suggestion}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-600 col-span-2">No suggestions available at the moment.</p>
                  )}
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
