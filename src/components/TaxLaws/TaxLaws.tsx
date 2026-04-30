import React, { useState } from 'react';
import { Search, BookOpen, Tag, ExternalLink } from 'lucide-react';

interface TaxLawItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export function TaxLaws() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'income-tax', name: 'Income Tax' },
    { id: 'deductions', name: 'Deductions' },
    { id: 'exemptions', name: 'Exemptions' },
    { id: 'compliance', name: 'Compliance' },
  ];

  const taxLaws: TaxLawItem[] = [
    {
      id: '1',
      title: 'Section 80C Deductions',
      content: 'Deductions up to ₹1.5 lakh under Section 80C for investments in EPF, PPF, ELSS, life insurance premiums, and tax-saving fixed deposits.',
      category: 'deductions',
      tags: ['80C', 'deductions', 'investments']
    },
    {
      id: '2',
      title: 'New Tax Regime Benefits',
      content: 'The new tax regime offers lower tax rates but with limited deductions. Standard deduction of ₹50,000 is available.',
      category: 'income-tax',
      tags: ['new regime', 'tax rates', 'standard deduction']
    },
    {
      id: '3',
      title: 'HRA Exemption Rules',
      content: 'House Rent Allowance exemption is the minimum of: actual HRA received, 50% of salary (40% for non-metro cities), or rent paid minus 10% of salary.',
      category: 'exemptions',
      tags: ['HRA', 'exemption', 'salary']
    },
    {
      id: '4',
      title: 'ITR Filing Deadlines',
      content: 'Income Tax Return filing deadline is July 31st for individuals not subject to audit. Extended deadline may apply in certain cases.',
      category: 'compliance',
      tags: ['ITR', 'deadline', 'filing']
    },
    {
      id: '5',
      title: 'Section 80D Medical Insurance',
      content: 'Deduction up to ₹25,000 for medical insurance premiums for self and family, additional ₹25,000 for parents (₹50,000 if senior citizens).',
      category: 'deductions',
      tags: ['80D', 'medical insurance', 'health']
    },
    {
      id: '6',
      title: 'Capital Gains Tax',
      content: 'Short-term capital gains taxed at slab rates. Long-term capital gains from equity exceeding ₹1 lakh taxed at 10% without indexation.',
      category: 'income-tax',
      tags: ['capital gains', 'equity', 'LTCG']
    }
  ];

  const filteredLaws = taxLaws.filter(law => {
    const matchesSearch = law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         law.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         law.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || law.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Laws & Guides</h1>
          <p className="text-gray-600">Comprehensive tax information, laws, and resources to help you understand Indian taxation</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tax laws, sections, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLaws.map((law) => (
            <div key={law.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{law.title}</h3>
                </div>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {categories.find(cat => cat.id === law.category)?.name}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{law.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {law.tags.map((tag, index) => (
                  <span key={index} className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
              
              <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200">
                <span>Learn More</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {filteredLaws.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
}