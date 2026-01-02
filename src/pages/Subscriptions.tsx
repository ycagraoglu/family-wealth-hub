import { MainLayout } from '@/components/layout/MainLayout';
import { subscriptions } from '@/data/mockData';
import { formatCurrency, getNextPaymentDate, getDaysUntil } from '@/lib/formatters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  CalendarDays,
  MoreVertical,
  Repeat
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SubscriptionsPage = () => {
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const totalYearly = totalMonthly * 12;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Abonelikler</h1>
            <p className="text-muted-foreground">Düzenli ödemelerinizi takip edin</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Abonelik Ekle
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-chart-3/10">
                <Repeat className="w-6 h-6 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aylık Toplam</p>
                <p className="text-2xl font-bold">{formatCurrency(totalMonthly)}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-chart-5/10">
                <CalendarDays className="w-6 h-6 text-chart-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Yıllık Toplam</p>
                <p className="text-2xl font-bold">{formatCurrency(totalYearly)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((sub, index) => {
            const nextPayment = getNextPaymentDate(sub.billingDay);
            const daysUntil = getDaysUntil(nextPayment);
            
            return (
              <Card 
                key={sub.id} 
                className="glass-card overflow-hidden animate-slide-up hover:border-primary/30 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Color Bar */}
                <div 
                  className="h-1.5"
                  style={{ backgroundColor: sub.color }}
                />
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${sub.color}15` }}
                      >
                        {sub.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{sub.name}</h3>
                        <p className="text-sm text-muted-foreground">{sub.category}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(sub.amount)}</p>
                      <p className="text-xs text-muted-foreground">/ ay</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium",
                        daysUntil <= 3 ? "text-warning" : "text-muted-foreground"
                      )}>
                        {daysUntil === 0 ? 'Bugün' : 
                         daysUntil === 1 ? 'Yarın' : 
                         `${daysUntil} gün sonra`}
                      </p>
                      <p className="text-xs text-muted-foreground">Her ayın {sub.billingDay}'i</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Monthly breakdown */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Kategori Bazlı Dağılım</h3>
          <div className="space-y-3">
            {Object.entries(
              subscriptions.reduce((acc, sub) => {
                acc[sub.category] = (acc[sub.category] || 0) + sub.amount;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="font-medium">{category}</span>
                <span className="text-muted-foreground">{formatCurrency(amount)}/ay</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SubscriptionsPage;
