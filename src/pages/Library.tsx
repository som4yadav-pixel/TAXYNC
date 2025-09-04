import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, ExternalLink, IndianRupee, Home, Heart, Briefcase, Info } from 'lucide-react';

export function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showInfoModal, setShowInfoModal] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'section' | 'limit' | 'category'>('section');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const taxLaws = [
    {
      id: 1,
      section: '80C',
      title: 'Life Insurance, PPF, ELSS, NSC',
      description: 'Deduction up to ₹1.5 lakh for investments in life insurance premiums, PPF, ELSS mutual funds, NSC, etc.',
      simpleExplanation: 'Save tax by investing in PPF, life insurance, or ELSS mutual funds. Maximum benefit: ₹46,500 tax saving.',
      limit: '₹1,50,000',
      category: 'Investment',
      icon: IndianRupee,
      color: 'bg-green-500',
      officialLink: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-forms-and-instructions/itr-1/deductions-under-chapter-vi-a'
    },
    {
      id: 2,
      section: '80D',
      title: 'Health Insurance Premium',
      description: 'Deduction for health insurance premiums paid for self, family, and parents.',
      simpleExplanation: 'Pay health insurance premiums and save tax. ₹25,000 for family + ₹25,000 for parents = ₹15,500 tax saving.',
      limit: '₹25,000 - ₹1,00,000',
      category: 'Health',
      icon: Heart,
      color: 'bg-red-500',
      officialLink: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-forms-and-instructions/itr-1/deductions-under-chapter-vi-a'
    },
    {
      id: 3,
      section: 'HRA',
      title: 'House Rent Allowance',
      description: 'Exemption for HRA received from employer for rented accommodation.',
      simpleExplanation: 'If you pay rent and get HRA from employer, you can save tax. Show rent receipts to claim exemption.',
      limit: 'Least of 3 conditions',
      category: 'Housing',
      icon: Home,
      color: 'bg-blue-500',
      officialLink: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-forms-and-instructions/itr-1/salary-income'
    },
    {
      id: 4,
      section: '80E',
      title: 'Education Loan Interest',
      description: 'Deduction for interest paid on education loan for higher studies.',
      simpleExplanation: 'Took education loan? The interest you pay can reduce your tax. No limit on deduction amount.',
      limit: 'No upper limit',
      category: 'Education',
      icon: BookOpen,
      color: 'bg-purple-500',
      officialLink: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-forms-and-instructions/itr-1/deductions-under-chapter-vi-a'
    },
    {
      id: 5,
      section: '80G',
      title: 'Donations to Charity',
      description: 'Deduction for donations made to eligible charitable institutions and funds.',
      simpleExplanation: 'Donate to approved charities and save tax. 50% or 100% of donation amount can be deducted from tax.',
      limit: '50% or 100% of donation',
      category: 'Charity',
      icon: Heart,
      color: 'bg-pink-500',
      officialLink: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-forms-and-instructions/itr-1/deductions-under-chapter-vi-a'
    },
    {
      id: 6,
      section: '24(b)',
      title: 'Home Loan Interest',
      description: 'Deduction for interest paid on home loan for self-occupied or let-out property.',
      simpleExplanation: 'Bought a house with loan? Interest paid can save tax up to ₹2 lakh per year. Maximum saving: ₹62,000.',
      limit: '₹2,00,000 (self-occupied)',
      category: 'Housing',
      icon: Home,
      color: 'bg-orange-500',
      officialLink: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-forms-and-instructions/itr-2/income-from-house-property'
    },
    {
      id: 7,
      section: '80CCD(1B)',
      title: 'National Pension System',
      description: 'Additional deduction for contribution to NPS over and above 80C limit.',
      simpleExplanation: 'Invest in NPS for retirement and get extra tax benefit of ₹50,000 beyond 80C. Tax saving: ₹15,500.',
      limit: '₹50,000',
      category: 'Investment',
      icon: Briefcase,
      color: 'bg-indigo-500',
      officialLink: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-forms-and-instructions/itr-1/deductions-under-chapter-vi-a'
    },
    {
      id: 8,
      section: '80TTA',
      title: 'Savings Account Interest',
      description: 'Deduction for interest earned on savings bank account.',
      simpleExplanation: 'Interest from your savings account up to ₹10,000 is tax-free. No need to pay tax on this income.',
      limit: '₹10,000',
      category: 'Investment',
      icon: IndianRupee,
      color: 'bg-teal-500',
      officialLink: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-forms-and-instructions/itr-1/deductions-under-chapter-vi-a'
    }
  ];

  const categories = ['All', 'Investment', 'Health', 'Housing', 'Education', 'Charity'];

  // Filter and sort laws based on search term, selected category, and sort options
  const filteredAndSortedLaws = taxLaws
    .filter(law => {
      const matchesSearch = law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           law.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           law.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || law.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'section':
          aValue = a.section;
          bValue = b.section;
          break;
        case 'limit':
          // Extract numeric value for sorting (rough approximation)
          aValue = parseInt(a.limit.replace(/[^\d]/g, '')) || 0;
          bValue = parseInt(b.limit.replace(/[^\d]/g, '')) || 0;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.section;
          bValue = b.section;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tax Laws Library</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive guide to Indian tax laws, deductions, and exemptions with official government links.
          </p>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tax laws..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cadbury-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <motion.button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
                showFilterDropdown 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </motion.button>
            
            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
              >
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Sort Options</h3>
                  
                  {/* Sort By */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'section' | 'limit' | 'category')}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="section">Section</option>
                      <option value="limit">Deduction Limit</option>
                      <option value="category">Category</option>
                    </select>
                  </div>
                  
                  {/* Sort Order */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Order</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortOrder('asc')}
                        className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${
                          sortOrder === 'asc'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                        }`}
                      >
                        Ascending
                      </button>
                      <button
                        onClick={() => setSortOrder('desc')}
                        className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${
                          sortOrder === 'desc'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                        }`}
                      >
                        Descending
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                        setSortBy('section');
                        setSortOrder('asc');
                        setShowFilterDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-cadbury-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-cadbury-100 dark:hover:bg-cadbury-900'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tax Laws Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedLaws.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No tax laws found matching your search.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            filteredAndSortedLaws.map((law, index) => {
            const Icon = law.icon;
            return (
              <motion.div
                key={law.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${law.color} p-3 rounded-full group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => setShowInfoModal(showInfoModal === law.id ? null : law.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                        title="Simple explanation"
                      >
                        <Info className="h-4 w-4" />
                      </motion.button>
                      <span className="bg-cadbury-100 dark:bg-cadbury-900 text-cadbury-700 dark:text-cadbury-300 px-3 py-1 rounded-full text-sm font-medium">
                        {law.section}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {law.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {law.description}
                  </p>
                  
                  {/* Simple Explanation Modal */}
                  {showInfoModal === law.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Simple Explanation</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {law.simpleExplanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Deduction Limit
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {law.limit}
                      </p>
                    </div>
                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {law.category}
                    </span>
                  </div>
                  
                  <motion.a
                    href={law.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cadbury-500 to-cadbury-600 hover:from-cadbury-600 hover:to-cadbury-700 text-white py-2 px-4 rounded-lg transition-all duration-200 group-hover:shadow-lg"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm font-medium">Official Guidelines</span>
                  </motion.a>
                </div>
              </motion.div>
            );
          })
          )}
        </div>
      </motion.div>
    </div>
  );
}
