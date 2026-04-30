export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
}

export interface TaxCalculation {
  id: string;
  user_id: string;
  income: number;
  deductions: number;
  old_regime_tax: number;
  new_regime_tax: number;
  savings: number;
  created_at: string;
}

export interface TaxLaw {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export type ChartType = 'pie' | 'bar';
export type ViewMode = 'today' | 'history';