import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { MainLayout } from '@/components/layout/MainLayout';
import { assetAccounts, creditCards, transactions, categories } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { 
  ArrowLeft, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard as CardIcon,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AccountDetailsPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

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
  }, [id, searchTerm, selectedCategory, dateRange]);

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AccountDetailsPage;
