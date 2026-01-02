import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AssetLiabilityChart } from '@/components/dashboard/AssetLiabilityChart';
import { CreditCardUtilization } from '@/components/dashboard/CreditCardUtilization';
import { UpcomingPaymentsWidget } from '@/components/dashboard/UpcomingPaymentsWidget';
import { 
  assetAccounts, 
  creditCards, 
  loans, 
  subscriptions,
  getTotalAssets,
  getTotalLiabilities,
  getNetWorth
} from '@/data/mockData';
import { getNextPaymentDate } from '@/lib/formatters';
import { formatCurrency } from '@/lib/formatters';
import { UpcomingPayment } from '@/types/finance';
import { Wallet, TrendingUp, CreditCard, Landmark } from 'lucide-react';

const Dashboard = () => {
  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  const netWorth = getNetWorth();
  const totalCardDebt = creditCards.reduce((sum, card) => sum + card.currentDebt, 0);
  const totalLoanDebt = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);

  // Generate upcoming payments for next 30 days
  const upcomingPayments: UpcomingPayment[] = [
    ...creditCards.map(card => ({
      id: `cc-${card.id}`,
      name: `${card.name} Hesap Kesim`,
      amount: card.currentDebt * (card.minPaymentRatio / 100),
      dueDate: getNextPaymentDate(card.cutoffDay),
      type: 'credit_card' as const,
      sourceId: card.id,
    })),
    ...loans.map(loan => ({
      id: `loan-${loan.id}`,
      name: loan.name,
      amount: loan.monthlyPayment,
      dueDate: loan.nextPaymentDate,
      type: 'loan' as const,
      sourceId: loan.id,
    })),
    ...subscriptions.map(sub => ({
      id: `sub-${sub.id}`,
      name: sub.name,
      amount: sub.amount,
      dueDate: getNextPaymentDate(sub.billingDay),
      type: 'subscription' as const,
      sourceId: sub.id,
    })),
  ].filter(payment => {
    const daysUntil = Math.ceil(
      (new Date(payment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil >= 0 && daysUntil <= 30;
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Merhaba, Ahmet 👋</h1>
          <p className="text-muted-foreground">
            İşte finansal durumunuzun özeti
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Net Değer"
            value={formatCurrency(netWorth)}
            subtitle="Varlıklar - Borçlar"
            icon={<TrendingUp className="w-5 h-5" />}
            valueClassName={netWorth >= 0 ? "text-positive" : "text-negative"}
          />
          <StatCard
            title="Toplam Varlık"
            value={formatCurrency(totalAssets)}
            subtitle={`${assetAccounts.length} hesap`}
            icon={<Wallet className="w-5 h-5" />}
            valueClassName="text-positive"
          />
          <StatCard
            title="Kredi Kartı Borcu"
            value={formatCurrency(totalCardDebt)}
            subtitle={`${creditCards.length} kart`}
            icon={<CreditCard className="w-5 h-5" />}
            valueClassName="text-negative"
          />
          <StatCard
            title="Kredi Borcu"
            value={formatCurrency(totalLoanDebt)}
            subtitle={`${loans.length} kredi`}
            icon={<Landmark className="w-5 h-5" />}
            valueClassName="text-negative"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetLiabilityChart 
            totalAssets={totalAssets} 
            totalLiabilities={totalLiabilities} 
          />
          <CreditCardUtilization cards={creditCards} />
        </div>

        {/* Upcoming Payments */}
        <UpcomingPaymentsWidget payments={upcomingPayments} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
