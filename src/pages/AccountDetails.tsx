import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { MainLayout } from '@/components/layout/MainLayout';
import { assetAccounts, creditCards, transactions as initialTransactions, categories } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Transaction } from '@/types/finance';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { 
  ArrowLeft, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard as CardIcon,
  Building,
  MoreVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AccountDetailsPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Edit/Delete states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    type: 'expense' as 'income' | 'expense',
    installments: '',
    currentInstallment: ''
  });

  // Find the account or card
  const account = type === 'asset' 
    ? assetAccounts.find(a => a.id === id)
    : creditCards.find(c => c.id === id);

  if (!account) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <p className="text-muted-foreground">Hesap bulunamadı</p>
          <Button onClick={() => navigate('/accounts')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Filter transactions for this account
  const accountTransactions = useMemo(() => {
    return transactions
      .filter(t => t.accountId === id)
      .filter(t => {
        // Search filter
        if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        // Category filter
        if (selectedCategory && selectedCategory !== 'all' && t.category !== selectedCategory) {
          return false;
        }
        // Date range filter
        if (dateRange?.from && new Date(t.date) < dateRange.from) {
          return false;
        }
        if (dateRange?.to && new Date(t.date) > dateRange.to) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [id, transactions, searchTerm, selectedCategory, dateRange]);

  const totalIncome = accountTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = accountTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const isCard = type === 'card';
  const cardData = isCard ? (account as typeof creditCards[0]) : null;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setDateRange(undefined);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || dateRange;

  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
      installments: transaction.installments?.toString() || '',
      currentInstallment: transaction.currentInstallment?.toString() || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedTransaction) return;
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    setTransactions(transactions.map(t => 
      t.id === selectedTransaction.id 
        ? {
            ...t,
            description: formData.description,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date: formData.date,
            type: formData.type,
            installments: formData.installments ? parseInt(formData.installments) : undefined,
            currentInstallment: formData.currentInstallment ? parseInt(formData.currentInstallment) : undefined
          }
        : t
    ));
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
    toast.success('İşlem güncellendi');
  };

  const handleDelete = () => {
    if (!selectedTransaction) return;
    setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
    setDeleteDialogOpen(false);
    setSelectedTransaction(null);
    toast.success('İşlem silindi');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/accounts')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4 flex-1">
            <div 
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                isCard ? "text-white" : "bg-chart-3/10"
              )}
              style={isCard && cardData ? { backgroundColor: `${cardData.color}20` } : undefined}
            >
              {isCard ? (
                <CardIcon className="w-7 h-7" style={{ color: cardData?.color }} />
              ) : (
                (account as typeof assetAccounts[0]).type === 'bank' 
                  ? <Building className="w-7 h-7 text-chart-3" />
                  : <Wallet className="w-7 h-7 text-positive" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{account.name}</h1>
              <p className="text-muted-foreground">
                {isCard ? 'Kredi Kartı' : (account as typeof assetAccounts[0]).type === 'bank' ? 'Banka Hesabı' : 'Nakit'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2.5 rounded-lg",
                isCard ? "bg-negative/10" : "bg-chart-3/10"
              )}>
                {isCard ? <CardIcon className="w-5 h-5 text-negative" /> : <Wallet className="w-5 h-5 text-chart-3" />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isCard ? 'Mevcut Borç' : 'Bakiye'}
                </p>
                <p className={cn(
                  "text-xl font-bold",
                  isCard ? "text-negative" : "text-positive"
                )}>
                  {formatCurrency(isCard ? cardData!.currentDebt : (account as typeof assetAccounts[0]).balance)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-positive/10">
                <TrendingUp className="w-5 h-5 text-positive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Gelir</p>
                <p className="text-xl font-bold text-positive">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-negative/10">
                <TrendingDown className="w-5 h-5 text-negative" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Gider</p>
                <p className="text-xl font-bold text-negative">{formatCurrency(totalExpense)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="İşlem ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] bg-secondary border-border">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Picker */}
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-[260px]"
              placeholder="Tarih aralığı"
            />

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="shrink-0">
                Temizle
              </Button>
            )}
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Tarih</TableHead>
                <TableHead className="text-muted-foreground">Açıklama</TableHead>
                <TableHead className="text-muted-foreground">Kategori</TableHead>
                <TableHead className="text-muted-foreground text-right">Tutar</TableHead>
                <TableHead className="text-muted-foreground w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    {hasActiveFilters
                      ? 'Filtreye uygun işlem bulunamadı'
                      : 'Bu hesapta henüz işlem yok'}
                  </TableCell>
                </TableRow>
              ) : (
                accountTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-border">
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{transaction.description}</p>
                        {transaction.installments && (
                          <p className="text-xs text-muted-foreground">
                            {transaction.currentInstallment}/{transaction.installments} Taksit
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "font-semibold",
                        transaction.type === 'income' ? 'text-positive' : 'text-negative'
                      )}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(transaction)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(transaction)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Edit Transaction Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>İşlemi Düzenle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Açıklama *</Label>
                <Input 
                  placeholder="İşlem açıklaması" 
                  className="bg-secondary border-border"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tutar *</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className="bg-secondary border-border"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tarih *</Label>
                  <Input 
                    type="date" 
                    className="bg-secondary border-border"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tür *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Gelir</SelectItem>
                      <SelectItem value="expense">Gider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {isCard && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Toplam Taksit</Label>
                    <Input 
                      type="number" 
                      placeholder="Taksit yok" 
                      className="bg-secondary border-border"
                      value={formData.installments}
                      onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mevcut Taksit</Label>
                    <Input 
                      type="number" 
                      placeholder="1" 
                      className="bg-secondary border-border"
                      value={formData.currentInstallment}
                      onChange={(e) => setFormData({ ...formData, currentInstallment: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleEdit}>
                Kaydet
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Transaction Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>İşlemi Sil</AlertDialogTitle>
              <AlertDialogDescription>
                "{selectedTransaction?.description}" işlemini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

export default AccountDetailsPage;