import { CreditCard } from "@/types/finance";
import { formatCurrency, getPercentage, getNextPaymentDate, getDaysUntil } from "@/lib/formatters";
import { Progress } from "@/components/ui/progress";
import { CreditCard as CardIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditCardUtilizationProps {
  cards: CreditCard[];
}

export const CreditCardUtilization = ({ cards }: CreditCardUtilizationProps) => {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-negative/10">
          <CardIcon className="w-5 h-5 text-negative" />
        </div>
        <h3 className="text-lg font-semibold">Kredi Kartı Kullanımı</h3>
      </div>
      
      <div className="space-y-5">
        {cards.map((card) => {
          const utilization = getPercentage(card.currentDebt, card.totalLimit);
          const available = card.totalLimit - card.currentDebt;
          const nextPayment = getNextPaymentDate(card.cutoffDay);
          const daysUntil = getDaysUntil(nextPayment);
          
          return (
            <div key={card.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: card.color }}
                  />
                  <span className="font-medium">{card.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {daysUntil} gün sonra hesap kesim
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Kullanılan: <span className="text-foreground font-medium">{formatCurrency(card.currentDebt)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Limit: <span className="text-foreground font-medium">{formatCurrency(card.totalLimit)}</span>
                  </span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={utilization} 
                    className="h-2.5 bg-secondary"
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span 
                    className={cn(
                      "font-medium",
                      utilization > 80 ? "text-destructive" : 
                      utilization > 50 ? "text-warning" : "text-positive"
                    )}
                  >
                    %{utilization} kullanılıyor
                  </span>
                  <span className="text-muted-foreground">
                    Kalan: {formatCurrency(available)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
