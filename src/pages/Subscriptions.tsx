import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { subscriptions as initialSubscriptions } from '@/data/mockData';
import { formatCurrency, getNextPaymentDate, getDaysUntil } from '@/lib/formatters';
import { Subscription } from '@/types/finance';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  CalendarDays,
  MoreVertical,
  Repeat,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getBrandLogo } from '@/lib/brandLogos';

const subscriptionCategories = ['Eğlence', 'Müzik', 'Teknoloji', 'Alışveriş', 'Spor', 'Eğitim', 'Diğer'];
const subscriptionIcons = ['🎬', '🎵', '📺', '☁️', '📦', '💪', '📚', '🎮', '🎧', '📱'];
const subscriptionColors = ['#e50914', '#1db954', '#ff0000', '#007aff', '#ff9900', '#10b981', '#8b5cf6', '#f97066'];

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billingDay: '',
    category: '',
    icon: '🎬',
    color: '#e50914'
  });

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const totalYearly = totalMonthly * 12;

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      billingDay: '',
      category: '',
      icon: '🎬',
      color: '#e50914'
    });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.amount || !formData.billingDay || !formData.category) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    const newSubscription: Subscription = {
      id: `s${Date.now()}`,
      name: formData.name,
      amount: parseFloat(formData.amount),
      billingDay: parseInt(formData.billingDay),
      category: formData.category,
      icon: formData.icon,
      color: formData.color
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Abonelik eklendi');
  };

  const handleEdit = () => {
    if (!selectedSubscription) return;
    if (!formData.name || !formData.amount || !formData.billingDay || !formData.category) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setSubscriptions(subscriptions.map(sub => 
      sub.id === selectedSubscription.id 
        ? {
            ...sub,
            name: formData.name,
            amount: parseFloat(formData.amount),
            billingDay: parseInt(formData.billingDay),
            category: formData.category,
            icon: formData.icon,
            color: formData.color
          }
        : sub
    ));
    setIsEditDialogOpen(false);
    setSelectedSubscription(null);
    resetForm();
    toast.success('Abonelik güncellendi');
  };

  const handleDelete = () => {
    if (!selectedSubscription) return;
    setSubscriptions(subscriptions.filter(sub => sub.id !== selectedSubscription.id));
    setDeleteDialogOpen(false);
    setSelectedSubscription(null);
    toast.success('Abonelik silindi');
  };

  const openEditDialog = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setFormData({
      name: sub.name,
      amount: sub.amount.toString(),
      billingDay: sub.billingDay.toString(),
      category: sub.category,
      icon: sub.icon,
      color: sub.color
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setDeleteDialogOpen(true);
  };

  const SubscriptionLogo = ({ name, icon, color }: { name: string; icon: string; color: string }) => {
    const logoUrl = getBrandLogo(name);
    
    if (logoUrl) {
      return (
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white p-1.5 overflow-hidden"
        >
          <img 
            src={logoUrl} 
            alt={name}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to icon if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl">${icon}</span>`;
            }}
          />
        </div>
      );
    }
    
    return (
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
    );
  };

  const SubscriptionForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Abonelik Adı</Label>
        <Input 
          placeholder="Örn: Netflix" 
          className="bg-secondary border-border"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Aylık Tutar</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="bg-secondary border-border"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Ödeme Günü</Label>
          <Select value={formData.billingDay} onValueChange={(v) => setFormData({ ...formData, billingDay: v })}>
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
      </div>
      <div className="space-y-2">
        <Label>Kategori</Label>
        <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {subscriptionCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>İkon (Logo yoksa)</Label>
          <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subscriptionIcons.map(icon => (
                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Renk</Label>
          <Select value={formData.color} onValueChange={(v) => setFormData({ ...formData, color: v })}>
            <SelectTrigger className="bg-secondary border-border">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.color }} />
                <span>Renk</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {subscriptionColors.map(color => (
                <SelectItem key={color} value={color}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button className="w-full bg-primary hover:bg-primary/90" onClick={onSubmit}>
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Abonelikler</h1>
            <p className="text-muted-foreground">Düzenli ödemelerinizi takip edin</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Abonelik Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Yeni Abonelik Ekle</DialogTitle>
              </DialogHeader>
              <SubscriptionForm onSubmit={handleAdd} submitLabel="Abonelik Oluştur" />
            </DialogContent>
          </Dialog>
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
                      <SubscriptionLogo name={sub.name} icon={sub.icon} color={sub.color} />
                      <div>
                        <h3 className="font-semibold">{sub.name}</h3>
                        <p className="text-sm text-muted-foreground">{sub.category}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(sub)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(sub)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Aboneliği Düzenle</DialogTitle>
            </DialogHeader>
            <SubscriptionForm onSubmit={handleEdit} submitLabel="Kaydet" />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Aboneliği Sil</AlertDialogTitle>
              <AlertDialogDescription>
                "{selectedSubscription?.name}" aboneliğini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default SubscriptionsPage;
