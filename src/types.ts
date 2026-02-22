export interface Company {
  id: string;
  name: string;
  cnpj: string;
  city: string;
  state: string;
}

export interface Sector {
  id: string;
  companyId: string;
  name: string;
}

export interface ActionItem {
  id: string;
  description: string;
  responsible: string;
  deadline: string;
  status: 'open' | 'completed' | 'overdue';
}

export interface ComplianceData {
  topic: string;
  percentage: number;
}

export type TabType = 'dashboard' | 'companies' | 'sectors' | 'collection' | 'reports' | 'analysis';
