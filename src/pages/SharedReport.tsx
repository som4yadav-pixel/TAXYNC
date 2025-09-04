import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getSharedReport } from '../api';
import { motion } from 'framer-motion';
import { BarChart3, Calculator, CheckCircle, IndianRupee, AlertCircle, Server, FileQuestion } from 'lucide-react';

// Interfaces for data structure
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

interface SharedReportData {
  formData: TaxFormData;
  taxResult: TaxResult;
}


export function SharedReport() {
  const { reportId } = useParams<{ reportId: string }>();
  const location = useLocation();
  const [reportData, setReportData] = useState<SharedReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: Base64URL decode to UTF-8 string
  const base64UrlDecode = (enc: string) => {
    try {
      let b64 = enc.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      // decodeURIComponent(escape(atob())) ensures UTF-8 correctness
      return decodeURIComponent(escape(atob(b64)));
    } catch (e) {
      throw new Error('Invalid share data encoding');
    }
  };

  useEffect(() => {
    const load = async () => {
      // Serverless fallback path: /shared-report/local?data=...
      if (reportId === 'local') {
        try {
          setLoading(true);
          const params = new URLSearchParams(location.search);
          const enc = params.get('data');
          if (!enc) {
            throw new Error('Missing share data');
          }
          const json = base64UrlDecode(enc);
          const parsed = JSON.parse(json) as { formData: TaxFormData; taxResult: TaxResult };
          if (!parsed?.formData || !parsed?.taxResult) {
            throw new Error('Malformed share payload');
          }
          const data: SharedReportData = {
            formData: parsed.formData,
            taxResult: parsed.taxResult,
          };
          setReportData(data);
          setError(null);
        } catch (err) {
          console.error('Local shared report decode failed:', err);
          setError('Invalid or corrupted share link.');
          setReportData(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Normal server path: /shared-report/:reportId
      if (reportId) {
        try {
          setLoading(true);
          const rawData: any = await getSharedReport(reportId);
          const data: SharedReportData = {
            formData: rawData.formData,
            taxResult: rawData.taxResult,
          };
          setReportData(data);
          setError(null);
        } catch (err) {
          setError('Failed to load shared report. The link may have expired or is invalid.');
          console.error(err);
          setReportData(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      setError('No report ID provided.');
      setLoading(false);
    };

    load();
  }, [reportId, location.search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Server className="h-12 w-12 text-purple-500 animate-pulse mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Loading Shared Report...</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Fetching data from our secure server.</p>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <FileQuestion className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-800 dark:text-white">Report Not Found</h1>
        <p className="text-red-600 dark:text-red-400 mt-2 text-center max-w-md">
          {error || 'The requested report could not be found. The link may be invalid, or the report may have expired after 24 hours.'}
        </p>
      </div>
    );
  }

  const { taxResult, formData } = reportData;

  const stats = [
    { title: 'Annual Income', value: `₹${formData.income.toLocaleString()}`, icon: IndianRupee, color: 'from-blue-500 to-blue-600' },
    { title: 'Old Regime Tax', value: `₹${taxResult.old_regime_tax.toLocaleString()}`, icon: Calculator, color: 'from-purple-500 to-purple-600' },
    { title: 'New Regime Tax', value: `₹${taxResult.new_regime_tax.toLocaleString()}`, icon: BarChart3, color: 'from-yellow-500 to-orange-500' },
    { 
      title: 'Total Savings', 
      value: `₹${Math.abs(taxResult.savings).toLocaleString()}`, 
      icon: taxResult.savings > 0 ? CheckCircle : AlertCircle, 
      color: taxResult.savings > 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-10 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-yellow-500">Tax Analysis Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">This is a shared, read-only view of a tax calculation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.title}</h3>
                  <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-full shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {taxResult.suggestions && taxResult.suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tax Optimization Suggestions</h3>
            <ul className="space-y-3">
              {taxResult.suggestions.map((suggestion: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-2 h-2 mt-1.5 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Created with Taxync | Developed by Somil Yadav © 2025</p>
        </div>
      </motion.div>
    </div>
  );
}
