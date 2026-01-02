import { UpcomingPayment } from "@/types/finance";
import { formatCurrency, formatShortDate, getDaysUntil } from "@/lib/formatters";
import { Calendar, CreditCard, Home, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UpcomingPaymentsProps {
  payments: UpcomingPayment[];
}

const getPaymentIcon = (type: UpcomingPayment['type']) => {
  switch (type) {
    case 'credit_card':
      return <CreditCard className="w-4 h-4" />;
    case 'loan':
      return <Home className="w-4 h-4" />;
    case 'subscription':
      return <Tv className="w-4 h-4" />;
  }
};

const getPaymentColor = (type: UpcomingPayment['type']) => {
  switch (type) {
    case 'credit_card':
      return 'bg-negative/10 text-negative';
    case 'loan':
      return 'bg-warning/10 text-warning';
    case 'subscription':
      return 'bg-chart-3/10 text-chart-3';
  }
};

export const UpcomingPaymentsWidget = ({ payments }: UpcomingPaymentsProps) => {
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Yaklaşan Ödemeler</h3>
        <span className="ml-auto text-sm text-muted-foreground">30 gün içinde</span>
      </div>
      
      <ScrollArea className="h-[320px] pr-4">
        <div className="space-y-3">
          {sortedPayments.map((payment) => {
            const daysUntil = getDaysUntil(payment.dueDate);
            const isUrgent = daysUntil <= 3;
            
            return (
              <div
                key={payment.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors",
                  isUrgent && "border border-destructive/30"
                )}
              >
                <div className={cn("p-2 rounded-lg", getPaymentColor(payment.type))}>
                  {getPaymentIcon(payment.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{payment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatShortDate(payment.dueDate)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-negative">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className={cn(
                    "text-xs",
                    isUrgent ? "text-destructive font-medium" : "text-muted-foreground"
                  )}>
                    {daysUntil === 0 ? 'Bugün' : 
                     daysUntil === 1 ? 'Yarın' : 
                     `${daysUntil} gün`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
