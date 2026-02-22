import { Company, Sector, ActionItem, ComplianceData } from './types';

export const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Indústria Exemplo Ltda', cnpj: '12.345.678/0001-90', city: 'São Paulo', state: 'SP' },
  { id: '2', name: 'TecnoLogistics S.A.', cnpj: '98.765.432/0001-01', city: 'Rio de Janeiro', state: 'RJ' },
  { id: '3', name: 'BecnoLogistics Indústria Crfine Ltda', cnpj: '18.335.478/0001-93', city: 'São Paulo', state: 'SP' },
];

export const MOCK_COMPLIANCE: ComplianceData[] = [
  { topic: 'NR-01', percentage: 80 },
  { topic: 'NR-02', percentage: 80 },
  { topic: 'NR-04', percentage: 70 },
  { topic: 'NR-05', percentage: 95 },
  { topic: 'NR-06', percentage: 70 },
  { topic: 'NR-07', percentage: 80 },
];

export const MOCK_ACTIONS: ActionItem[] = [
  {
    id: '1',
    description: 'Adequar sinalização de segurança na área de produção (NR-26)',
    responsible: 'João Silva',
    deadline: '15/11/2023',
    status: 'open',
  },
  {
    id: '2',
    description: 'Realizar treinamento de trabalho em altura (NR-35) para a equipe',
    responsible: 'Maria Santos',
    deadline: '30/10/2023',
    status: 'completed',
  },
  {
    id: '3',
    description: 'Instalar proteções em máquinas operatrizes (NR-12)',
    responsible: 'Pedro Oliveira',
    deadline: '05/11/2023',
    status: 'overdue',
  },
];
