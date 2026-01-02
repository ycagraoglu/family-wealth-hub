import { MainLayout } from '@/components/layout/MainLayout';
import { loans } from '@/data/mockData';
import { formatCurrency, getPercentage, getDaysUntil, formatShortDate } from '@/lib/formatters';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Landmark, 
  CalendarDays, 
  TrendingDown,
  Plus,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LoansPage = () => {
  const totalLoanDebt = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Krediler</h1>
            <p className="text-muted-foreground">Uzun vadeli kredi borçlarınızı takip edin</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Kredi Ekle
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-negative/10">
                <TrendingDown className="w-6 h-6 text-negative" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Kalan Borç</p>
                <p className="text-2xl font-bold text-negative">{formatCurrency(totalLoanDebt)}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <CalendarDays className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aylık Toplam Ödeme</p>
                <p className="text-2xl font-bold text-warning">{formatCurrency(totalMonthlyPayment)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Loans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loans.map((loan, index) => {
            const paidPercentage = getPercentage(loan.paidInstallments, loan.totalInstallments);
            const remainingInstallments = loan.totalInstallments - loan.paidInstallments;
            const daysUntilPayment = getDaysUntil(loan.nextPaymentDate);
            
            return (
              <Card 
                key={loan.id} 
                className="glass-card overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning/20 to-negative/20 flex items-center justify-center">
                        <Landmark className="w-7 h-7 text-warning" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{loan.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Faiz Oranı: %{loan.interestRate}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Toplam Kredi</p>
                      <p className="text-xl font-bold">{formatCurrency(loan.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Kalan Borç</p>
                      <p className="text-xl font-bold text-negative">{formatCurrency(loan.remainingAmount)}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ödeme İlerlemesi</span>
                      <span className="text-sm font-medium text-positive">%{paidPercentage} tamamlandı</span>
                    </div>
                    <Progress value={paidPercentage} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{loan.paidInstallments} taksit ödendi</span>
                      <span>{remainingInstallments} taksit kaldı</span>
                    </div>
                  </div>

                  {/* Installment Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Aylık Taksit</p>
                      <p className="text-lg font-bold">{formatCurrency(loan.monthlyPayment)}</p>
                    </div>
                    <div className={cn(
                      "p-4 rounded-lg",
                      daysUntilPayment <= 5 ? "bg-destructive/10 border border-destructive/20" : "bg-secondary/50"
                    )}>
                      <p className="text-xs text-muted-foreground mb-1">Sonraki Ödeme</p>
                      <p className={cn(
                        "text-lg font-bold",
                        daysUntilPayment <= 5 && "text-destructive"
                      )}>
                        {daysUntilPayment} gün
                      </p>
                      <p className="text-xs text-muted-foreground">{formatShortDate(loan.nextPaymentDate)}</p>
                    </div>
                  </div>

                  {/* Total Progress Bar */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-positive to-emerald-400 transition-all duration-500"
                        style={{ width: `${paidPercentage}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground font-medium">
                      {loan.paidInstallments}/{loan.totalInstallments}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default LoansPage;
