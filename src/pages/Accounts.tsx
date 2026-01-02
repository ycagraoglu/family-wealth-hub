import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { assetAccounts, creditCards } from '@/data/mockData';
import { formatCurrency, getPercentage, getNextPaymentDate, getDaysUntil } from '@/lib/formatters';
import { AssetAccount, CreditCard } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Wallet, 
  CreditCard as CardIcon, 
  Building, 
  Pencil,
  MoreVertical 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AccountsPage = () => {
  const [assets, setAssets] = useState<AssetAccount[]>(assetAccounts);
  const [cards, setCards] = useState<CreditCard[]>(creditCards);

  const totalAssetBalance = assets.reduce((sum, acc) => sum + acc.balance, 0);
  const totalCardDebt = cards.reduce((sum, card) => sum + card.currentDebt, 0);
  const totalCardLimit = cards.reduce((sum, card) => sum + card.totalLimit, 0);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Hesaplar & Kartlar</h1>
            <p className="text-muted-foreground">Finansal kaynaklarınızı yönetin</p>
          </div>
        </div>

        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="assets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Wallet className="w-4 h-4 mr-2" />
              Varlıklar
            </TabsTrigger>
            <TabsTrigger value="cards" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CardIcon className="w-4 h-4 mr-2" />
              Kredi Kartları
            </TabsTrigger>
          </TabsList>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="glass-card rounded-lg px-4 py-3">
                <span className="text-sm text-muted-foreground">Toplam Bakiye: </span>
                <span className="text-lg font-bold text-positive">{formatCurrency(totalAssetBalance)}</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Hesap Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Yeni Hesap Ekle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Hesap Adı</Label>
                      <Input placeholder="Örn: Ziraat Bankası" className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hesap Türü</Label>
                      <Select>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Tür seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Banka Hesabı</SelectItem>
                          <SelectItem value="cash">Nakit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Mevcut Bakiye</Label>
                      <Input type="number" placeholder="0" className="bg-secondary border-border" />
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Hesap Oluştur
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((account, index) => (
                <Card 
                  key={account.id} 
                  className="glass-card p-6 animate-slide-up hover:border-primary/30 transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                        account.type === 'bank' ? 'bg-chart-3/10' : 'bg-positive/10'
                      )}>
                        {account.icon || (account.type === 'bank' ? <Building className="w-6 h-6 text-chart-3" /> : '💵')}
                      </div>
                      <div>
                        <h3 className="font-semibold">{account.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {account.type === 'bank' ? 'Banka Hesabı' : 'Nakit'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-auto">
                    <p className="text-sm text-muted-foreground">Bakiye</p>
                    <p className="text-2xl font-bold text-positive">{formatCurrency(account.balance)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Credit Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-4">
                <div className="glass-card rounded-lg px-4 py-3">
                  <span className="text-sm text-muted-foreground">Toplam Borç: </span>
                  <span className="text-lg font-bold text-negative">{formatCurrency(totalCardDebt)}</span>
                </div>
                <div className="glass-card rounded-lg px-4 py-3">
                  <span className="text-sm text-muted-foreground">Toplam Limit: </span>
                  <span className="text-lg font-bold">{formatCurrency(totalCardLimit)}</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Kart Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Yeni Kredi Kartı Ekle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Kart Adı</Label>
                      <Input placeholder="Örn: Bonus Card" className="bg-secondary border-border" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Toplam Limit</Label>
                        <Input type="number" placeholder="0" className="bg-secondary border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label>Mevcut Borç</Label>
                        <Input type="number" placeholder="0" className="bg-secondary border-border" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Hesap Kesim Günü</Label>
                        <Select>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Gün seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                              <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Min. Ödeme Oranı (%)</Label>
                        <Input type="number" placeholder="20" className="bg-secondary border-border" />
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Kart Oluştur
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cards.map((card, index) => {
                const utilization = getPercentage(card.currentDebt, card.totalLimit);
                const available = card.totalLimit - card.currentDebt;
                const nextPayment = getNextPaymentDate(card.cutoffDay);
                const daysUntil = getDaysUntil(nextPayment);
                
                return (
                  <Card 
                    key={card.id}
                    className="glass-card overflow-hidden animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Card Header with gradient */}
                    <div 
                      className="h-3"
                      style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}88)` }}
                    />
                    <div className="p-6 space-y-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${card.color}20` }}
                          >
                            <CardIcon className="w-6 h-6" style={{ color: card.color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{card.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Hesap Kesim: Her ayın {card.cutoffDay}'i
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Sonraki Kesim</p>
                          <p className={cn(
                            "text-sm font-medium",
                            daysUntil <= 5 ? "text-warning" : "text-muted-foreground"
                          )}>
                            {daysUntil} gün
                          </p>
                        </div>
                      </div>

                      {/* Balance Info */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Kullanılan</p>
                          <p className="text-lg font-bold text-negative">{formatCurrency(card.currentDebt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Kalan</p>
                          <p className="text-lg font-bold text-positive">{formatCurrency(available)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Limit</p>
                          <p className="text-lg font-bold">{formatCurrency(card.totalLimit)}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Kullanım Oranı</span>
                          <span className={cn(
                            "font-medium",
                            utilization > 80 ? "text-destructive" : 
                            utilization > 50 ? "text-warning" : "text-positive"
                          )}>
                            %{utilization}
                          </span>
                        </div>
                        <Progress 
                          value={utilization} 
                          className="h-2"
                        />
                      </div>

                      {/* Min Payment */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <span className="text-sm text-muted-foreground">Minimum Ödeme ({card.minPaymentRatio}%)</span>
                        <span className="font-semibold">{formatCurrency(card.currentDebt * (card.minPaymentRatio / 100))}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AccountsPage;
