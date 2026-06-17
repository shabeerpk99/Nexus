import { Deal } from '../types';

export const deals: Deal[] = [
  {
    id: 'd1',
    entrepreneurId: 'e1',
    investorId: 'i1',
    title: 'Series A Funding - TechWave AI',
    description: 'Seeking $1.5M Series A funding to expand product development and market reach for our AI-powered financial analytics platform.',
    fundingAmount: 500000,
    fundingTarget: 1500000,
    equity: 15,
    status: 'funded',
    currency: 'USD',
    createdAt: '2024-01-20T09:00:00Z',
    fundedAt: '2024-02-01T14:22:00Z',
  },
  {
    id: 'd2',
    entrepreneurId: 'e2',
    title: 'Seed Funding - GreenLife Solutions',
    description: 'Looking for $2M seed funding for sustainable packaging development and scaling production facilities.',
    fundingAmount: 0,
    fundingTarget: 2000000,
    equity: 20,
    status: 'open',
    currency: 'USD',
    createdAt: '2024-02-05T10:30:00Z',
  },
  {
    id: 'd3',
    entrepreneurId: 'e3',
    investorId: 'i2',
    title: 'Series A Funding - HealthPulse',
    description: 'Seeking $800K to scale our mental health platform to additional cities and build enterprise partnerships.',
    fundingAmount: 300000,
    fundingTarget: 800000,
    equity: 12,
    status: 'open',
    currency: 'USD',
    createdAt: '2024-02-08T14:15:00Z',
  },
  {
    id: 'd4',
    entrepreneurId: 'e4',
    title: 'Series B Funding - UrbanFarm',
    description: 'Raising $3M Series B to expand IoT vertical farming systems to 50 cities and build institutional partnerships.',
    fundingAmount: 0,
    fundingTarget: 3000000,
    equity: 18,
    status: 'open',
    currency: 'USD',
    createdAt: '2024-02-10T11:45:00Z',
  },
];

// Helper functions
export const findDealById = (dealId: string): Deal | undefined => {
  return deals.find(d => d.id === dealId);
};

export const getDealsByEntrepreneur = (entrepreneurId: string): Deal[] => {
  return deals.filter(d => d.entrepreneurId === entrepreneurId);
};

export const getDealsByInvestor = (investorId: string): Deal[] => {
  return deals.filter(d => d.investorId === investorId);
};

export const getOpenDeals = (): Deal[] => {
  return deals.filter(d => d.status === 'open');
};

export const getFundedDeals = (): Deal[] => {
  return deals.filter(d => d.status === 'funded');
};

export const calculateDealProgress = (dealId: string): number => {
  const deal = findDealById(dealId);
  if (!deal) return 0;
  return Math.round((deal.fundingAmount / deal.fundingTarget) * 100);
};

export const updateDealFunding = (dealId: string, amount: number): Deal | undefined => {
  const deal = findDealById(dealId);
  if (deal) {
    deal.fundingAmount += amount;
    if (deal.fundingAmount >= deal.fundingTarget) {
      deal.status = 'funded';
      deal.fundedAt = new Date().toISOString();
    }
  }
  return deal;
};

export const createDeal = (deal: Deal): void => {
  deals.push(deal);
};
