// Type definitions for API functions
export interface TaxFormData {
  income: number;
  standardDeduction: number;
  section80C: number;
  hra: number;
  section80D: number;
  homeLoanInterest: number;
  educationLoan: number;
  donations: number;
}

export interface TaxResult {
  old_regime_tax: number;
  new_regime_tax: number;
  savings: number;
  suggestions?: string[];
}

export interface CalculationData {
  formData: TaxFormData;
  result: TaxResult;
  timestamp: string;
}

export declare function calculateTax(formData: TaxFormData): Promise<TaxResult>;
export declare function getLastCalculation(): Promise<CalculationData | null>;
export declare function exportPDF(formData: TaxFormData, result: TaxResult, chartImage?: string): Promise<void>;
export declare function exportExcel(formData: TaxFormData, result: TaxResult): Promise<void>;

export declare function createShareableLink(formData: TaxFormData, result: TaxResult): Promise<string>;
export declare function getSharedReport(reportId: string): Promise<CalculationData>;
