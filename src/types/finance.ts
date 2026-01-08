export type UserRole = 'admin' | 'member' | 'kid';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export type AccountType = 'cash' | 'bank' | 'credit_card';

export interface AssetAccount {
  id: string;
  name: string;
  type: 'cash' | 'bank';
  balance: number;
  icon?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  type: 'credit_card';
  totalLimit: number;
  currentDebt: number;
  cutoffDay: number;
  minPaymentRatio: number;
  color?: string;
}

export type Account = AssetAccount | CreditCard;

export interface Transaction {
  id: string;
  date: string;
  userId: string;
  description: string;
  category: string;
  amount: number;
  accountId: string;
  installments?: number;
  currentInstallment?: number;
  type: 'income' | 'expense';
}

export interface Loan {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  monthlyPayment: number;
  interestRate: number;
  nextPaymentDate: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDay: number;
  category: string;
  icon?: string;
  color?: string;
  logoUrl?: string;
}

export interface UpcomingPayment {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  type: 'credit_card' | 'loan' | 'subscription';
  sourceId: string;
}
