import { User, AssetAccount, CreditCard, Transaction, Loan, Subscription } from '@/types/finance';

export const users: User[] = [
  { id: 'u1', name: 'Ahmet Yılmaz', role: 'admin', avatar: 'ahmet-yilmaz' },
  { id: 'u2', name: 'Ayşe Demir', role: 'member', avatar: 'ayse-demir' },
  { id: 'u3', name: 'Can Yılmaz', role: 'kid', avatar: 'can-yilmaz' },
];

export const assetAccounts: AssetAccount[] = [
  { id: 'a1', name: 'Ziraat Bankası', type: 'bank', balance: 50000, icon: '🏦' },
  { id: 'a2', name: 'Nakit Cüzdan', type: 'cash', balance: 2000, icon: '💵' },
  { id: 'a3', name: 'Garanti Bankası', type: 'bank', balance: 15000, icon: '🏦' },
];

export const creditCards: CreditCard[] = [
  { 
    id: 'c1', 
    name: 'Bonus Card', 
    type: 'credit_card',
    totalLimit: 100000, 
    currentDebt: 45000, 
    cutoffDay: 15, 
    minPaymentRatio: 20,
    color: '#f97066'
  },
  { 
    id: 'c2', 
    name: 'Axess Card', 
    type: 'credit_card',
    totalLimit: 50000, 
    currentDebt: 10000, 
    cutoffDay: 20, 
    minPaymentRatio: 25,
    color: '#3b82f6'
  },
  { 
    id: 'c3', 
    name: 'Maximum Card', 
    type: 'credit_card',
    totalLimit: 75000, 
    currentDebt: 22500, 
    cutoffDay: 10, 
    minPaymentRatio: 20,
    color: '#8b5cf6'
  },
];

export const transactions: Transaction[] = [
  { id: 't1', date: '2026-01-02', userId: 'u1', description: 'Market Alışverişi - Migros', category: 'Yiyecek', amount: 1250, accountId: 'c1', installments: 3, currentInstallment: 1, type: 'expense' },
  { id: 't2', date: '2026-01-01', userId: 'u2', description: 'Benzin', category: 'Ulaşım', amount: 800, accountId: 'c2', type: 'expense' },
  { id: 't3', date: '2025-12-30', userId: 'u3', description: 'Harçlık', category: 'Harçlık', amount: 500, accountId: 'a2', type: 'expense' },
  { id: 't4', date: '2025-12-28', userId: 'u1', description: 'Maaş', category: 'Gelir', amount: 35000, accountId: 'a1', type: 'income' },
  { id: 't5', date: '2025-12-27', userId: 'u2', description: 'Elektrik Faturası', category: 'Fatura', amount: 650, accountId: 'c1', type: 'expense' },
  { id: 't6', date: '2025-12-25', userId: 'u1', description: 'Laptop - Vatan Bilgisayar', category: 'Elektronik', amount: 45000, accountId: 'c1', installments: 12, currentInstallment: 1, type: 'expense' },
  { id: 't7', date: '2025-12-24', userId: 'u2', description: 'Restoran', category: 'Yeme-İçme', amount: 450, accountId: 'c2', type: 'expense' },
  { id: 't8', date: '2025-12-22', userId: 'u1', description: 'Spor Salonu Üyelik', category: 'Spor', amount: 2500, accountId: 'c3', installments: 6, currentInstallment: 1, type: 'expense' },
  { id: 't9', date: '2025-12-20', userId: 'u3', description: 'Kitap', category: 'Eğitim', amount: 150, accountId: 'a2', type: 'expense' },
  { id: 't10', date: '2025-12-18', userId: 'u2', description: 'Freelance Gelir', category: 'Gelir', amount: 8000, accountId: 'a3', type: 'income' },
];

export const loans: Loan[] = [
  { 
    id: 'l1', 
    name: 'Konut Kredisi', 
    totalAmount: 2500000, 
    remainingAmount: 2150000, 
    totalInstallments: 180, 
    paidInstallments: 24,
    monthlyPayment: 28500,
    interestRate: 1.89,
    nextPaymentDate: '2026-01-15'
  },
  { 
    id: 'l2', 
    name: 'Araç Kredisi', 
    totalAmount: 450000, 
    remainingAmount: 280000, 
    totalInstallments: 48, 
    paidInstallments: 18,
    monthlyPayment: 12500,
    interestRate: 2.49,
    nextPaymentDate: '2026-01-10'
  },
];

export const subscriptions: Subscription[] = [
  { id: 's1', name: 'Netflix', amount: 199.99, billingDay: 5, category: 'Eğlence', icon: '🎬', color: '#e50914' },
  { id: 's2', name: 'Spotify', amount: 59.99, billingDay: 12, category: 'Müzik', icon: '🎵', color: '#1db954' },
  { id: 's3', name: 'YouTube Premium', amount: 79.99, billingDay: 18, category: 'Eğlence', icon: '📺', color: '#ff0000' },
  { id: 's4', name: 'iCloud Storage', amount: 39.99, billingDay: 1, category: 'Teknoloji', icon: '☁️', color: '#007aff' },
  { id: 's5', name: 'Amazon Prime', amount: 99.99, billingDay: 22, category: 'Alışveriş', icon: '📦', color: '#ff9900' },
  { id: 's6', name: 'Gym Membership', amount: 450, billingDay: 1, category: 'Spor', icon: '💪', color: '#10b981' },
];

export const categories = [
  'Yiyecek',
  'Ulaşım',
  'Fatura',
  'Eğlence',
  'Alışveriş',
  'Sağlık',
  'Eğitim',
  'Gelir',
  'Harçlık',
  'Elektronik',
  'Spor',
  'Yeme-İçme',
  'Diğer',
];

export const getTotalAssets = (): number => {
  return assetAccounts.reduce((sum, account) => sum + account.balance, 0);
};

export const getTotalLiabilities = (): number => {
  const cardDebt = creditCards.reduce((sum, card) => sum + card.currentDebt, 0);
  const loanDebt = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  return cardDebt + loanDebt;
};

export const getNetWorth = (): number => {
  return getTotalAssets() - getTotalLiabilities();
};
