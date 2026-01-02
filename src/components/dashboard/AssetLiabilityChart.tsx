import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AssetLiabilityChartProps {
  totalAssets: number;
  totalLiabilities: number;
}

export const AssetLiabilityChart = ({ totalAssets, totalLiabilities }: AssetLiabilityChartProps) => {
  const data = [
    { name: 'Varlıklar', value: totalAssets, color: 'hsl(160, 84%, 39%)' },
    { name: 'Borçlar', value: totalLiabilities, color: 'hsl(12, 76%, 61%)' },
  ];

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-lg font-semibold mb-6">Varlık vs Borç Analizi</h3>
      
      <div className="flex items-center gap-8">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 98%)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-positive/5 border border-positive/20">
            <div className="p-2 rounded-lg bg-positive/10">
              <TrendingUp className="w-5 h-5 text-positive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Varlık</p>
              <p className="text-xl font-bold text-positive">{formatCurrency(totalAssets)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-lg bg-negative/5 border border-negative/20">
            <div className="p-2 rounded-lg bg-negative/10">
              <TrendingDown className="w-5 h-5 text-negative" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Borç</p>
              <p className="text-xl font-bold text-negative">{formatCurrency(totalLiabilities)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
