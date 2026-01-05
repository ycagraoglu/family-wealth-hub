import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Trash2,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const AccountsPage = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<AssetAccount[]>(assetAccounts);
  const [cards, setCards] = useState<CreditCard[]>(creditCards);
  
  // Card CRUD state
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [cardFormData, setCardFormData] = useState({
    name: '',
    totalLimit: '',
    currentDebt: '',
    cutoffDay: '',
    minPaymentRatio: '',
    color: '#6366f1'
  });

  const totalAssetBalance = assets.reduce((sum, acc) => sum + acc.balance, 0);
  const totalCardDebt = cards.reduce((sum, card) => sum + card.currentDebt, 0);
  const totalCardLimit = cards.reduce((sum, card) => sum + card.totalLimit, 0);

  // Card CRUD handlers
  const resetCardForm = () => {
    setCardFormData({
      name: '',
      totalLimit: '',
      currentDebt: '',
      cutoffDay: '',
      minPaymentRatio: '',
      color: '#6366f1'
    });
    setEditingCard(null);
  };

  const openCardDialog = (card?: CreditCard) => {
    if (card) {
      setEditingCard(card);
      setCardFormData({
        name: card.name,
        totalLimit: card.totalLimit.toString(),
        currentDebt: card.currentDebt.toString(),
        cutoffDay: card.cutoffDay.toString(),
        minPaymentRatio: card.minPaymentRatio.toString(),
        color: card.color || '#6366f1'
      });
    } else {
      resetCardForm();
    }
    setIsCardDialogOpen(true);
  };

  const handleSaveCard = () => {
    if (!cardFormData.name || !cardFormData.totalLimit || !cardFormData.cutoffDay) {
      toast({ title: 'Hata', description: 'Lütfen zorunlu alanları doldurun', variant: 'destructive' });
      return;
    }

    const cardData: CreditCard = {
      id: editingCard?.id || `c${Date.now()}`,
      name: cardFormData.name,
      type: 'credit_card',
      totalLimit: parseFloat(cardFormData.totalLimit),
      currentDebt: parseFloat(cardFormData.currentDebt) || 0,
      cutoffDay: parseInt(cardFormData.cutoffDay),
      minPaymentRatio: parseFloat(cardFormData.minPaymentRatio) || 20,
      color: cardFormData.color
    };

    if (editingCard) {
      setCards(prev => prev.map(c => c.id === editingCard.id ? cardData : c));
      toast({ title: 'Başarılı', description: 'Kredi kartı güncellendi' });
    } else {
      setCards(prev => [...prev, cardData]);
      toast({ title: 'Başarılı', description: 'Yeni kredi kartı eklendi' });
    }

    setIsCardDialogOpen(false);
    resetCardForm();
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    setDeleteCardId(null);
    toast({ title: 'Başarılı', description: 'Kredi kartı silindi' });
  };

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
                  className="glass-card p-6 animate-slide-up hover:border-primary/30 transition-colors cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/accounts/asset/${account.id}`)}
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
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <Button className="bg-primary hover:bg-primary/90" onClick={() => openCardDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Kart Ekle
              </Button>
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
                    className="glass-card overflow-hidden animate-slide-up group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Card Header with gradient */}
                    <div 
                      className="h-3"
                      style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}88)` }}
                    />
                    <div className="p-6 space-y-5">
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => navigate(`/accounts/card/${card.id}`)}
                        >
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
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Sonraki Kesim</p>
                            <p className={cn(
                              "text-sm font-medium",
                              daysUntil <= 5 ? "text-warning" : "text-muted-foreground"
                            )}>
                              {daysUntil} gün
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openCardDialog(card); }}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => { e.stopPropagation(); setDeleteCardId(card.id); }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Balance Info */}
                      <div 
                        className="grid grid-cols-3 gap-4 cursor-pointer"
                        onClick={() => navigate(`/accounts/card/${card.id}`)}
                      >
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

            {/* Card Dialog */}
            <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>{editingCard ? 'Kredi Kartı Düzenle' : 'Yeni Kredi Kartı Ekle'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Kart Adı *</Label>
                    <Input 
                      placeholder="Örn: Bonus Card" 
                      className="bg-secondary border-border"
                      value={cardFormData.name}
                      onChange={(e) => setCardFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Toplam Limit *</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="bg-secondary border-border"
                        value={cardFormData.totalLimit}
                        onChange={(e) => setCardFormData(prev => ({ ...prev, totalLimit: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mevcut Borç</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="bg-secondary border-border"
                        value={cardFormData.currentDebt}
                        onChange={(e) => setCardFormData(prev => ({ ...prev, currentDebt: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hesap Kesim Günü *</Label>
                      <Select 
                        value={cardFormData.cutoffDay} 
                        onValueChange={(value) => setCardFormData(prev => ({ ...prev, cutoffDay: value }))}
                      >
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
                      <Input 
                        type="number" 
                        placeholder="20" 
                        className="bg-secondary border-border"
                        value={cardFormData.minPaymentRatio}
                        onChange={(e) => setCardFormData(prev => ({ ...prev, minPaymentRatio: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Kart Rengi</Label>
                    <div className="flex gap-2">
                      {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                        <button
                          key={color}
                          type="button"
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-transform",
                            cardFormData.color === color ? "border-foreground scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setCardFormData(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSaveCard}>
                    {editingCard ? 'Güncelle' : 'Kart Oluştur'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Card Confirmation */}
            <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Kredi kartını silmek istediğinize emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem geri alınamaz. Karta ait tüm veriler silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => deleteCardId && handleDeleteCard(deleteCardId)}
                  >
                    Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AccountsPage;
