import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { transactions, users, assetAccounts, creditCards, categories } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Transaction } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Wallet,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TransactionsPage = () => {
  const [txList] = useState<Transaction[]>(transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showInstallments, setShowInstallments] = useState(false);

  const allAccounts = [
    ...assetAccounts.map(a => ({ ...a, accountType: 'asset' as const })),
    ...creditCards.map(c => ({ ...c, accountType: 'credit' as const })),
  ];

  const getAccountName = (accountId: string) => {
    const asset = assetAccounts.find(a => a.id === accountId);
    if (asset) return asset.name;
    const card = creditCards.find(c => c.id === accountId);
    return card?.name || 'Bilinmeyen';
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Bilinmeyen';
  };

  const getUserAvatar = (userId: string) => {
    return users.find(u => u.id === userId)?.avatar || '👤';
  };

  const isCardAccount = (accountId: string) => {
    return creditCards.some(c => c.id === accountId);
  };

  const filteredTransactions = txList.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalIncome = filteredTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">İşlemler</h1>
            <p className="text-muted-foreground">Tüm finansal hareketlerinizi görüntüleyin</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                İşlem Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle>Yeni İşlem Ekle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>İşlem Türü</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Gider</SelectItem>
                      <SelectItem value="income">Gelir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Input placeholder="Örn: Market Alışverişi" className="bg-secondary border-border" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tutar</Label>
                    <Input type="number" placeholder="0" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ödeme Yöntemi / Hesap</Label>
                  <Select onValueChange={(value) => {
                    setSelectedAccount(value);
                    setShowInstallments(creditCards.some(c => c.id === value));
                  }}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Hesap seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Nakit / Banka</div>
                      {assetAccounts.map(acc => (
                        <SelectItem key={acc.id} value={acc.id}>
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-positive" />
                            {acc.name}
                          </div>
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Kredi Kartları</div>
                      {creditCards.map(card => (
                        <SelectItem key={card.id} value={card.id}>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-negative" />
                            {card.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showInstallments && (
                  <div className="space-y-2 p-4 rounded-lg bg-warning/10 border border-warning/20 animate-scale-in">
                    <Label className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-warning" />
                      Taksit Sayısı
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Tek çekim" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tek Çekim</SelectItem>
                        {[2, 3, 4, 5, 6, 9, 12].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} Taksit</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Kredi kartı seçildiğinde taksit seçeneği aktif olur
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Kullanıcı</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Kullanıcı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <span>{user.avatar}</span>
                            {user.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">
                  İşlemi Kaydet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-positive/10">
                <ArrowDownLeft className="w-5 h-5 text-positive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Gelir</p>
                <p className="text-xl font-bold text-positive">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-negative/10">
                <ArrowUpRight className="w-5 h-5 text-negative" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Gider</p>
                <p className="text-xl font-bold text-negative">{formatCurrency(totalExpense)}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                totalIncome - totalExpense >= 0 ? "bg-positive/10" : "bg-negative/10"
              )}>
                <Wallet className={cn(
                  "w-5 h-5",
                  totalIncome - totalExpense >= 0 ? "text-positive" : "text-negative"
                )} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net</p>
                <p className={cn(
                  "text-xl font-bold",
                  totalIncome - totalExpense >= 0 ? "text-positive" : "text-negative"
                )}>
                  {formatCurrency(totalIncome - totalExpense)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="İşlem veya kategori ara..."
              className="pl-10 bg-secondary border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-border">
            <Filter className="w-4 h-4 mr-2" />
            Filtreler
          </Button>
        </div>

        {/* Transactions Table */}
        <Card className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Tarih</TableHead>
                <TableHead className="text-muted-foreground">Kullanıcı</TableHead>
                <TableHead className="text-muted-foreground">Açıklama</TableHead>
                <TableHead className="text-muted-foreground">Kategori</TableHead>
                <TableHead className="text-muted-foreground">Hesap</TableHead>
                <TableHead className="text-muted-foreground text-right">Tutar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-border hover:bg-secondary/30">
                  <TableCell className="font-medium">{formatDate(tx.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getUserAvatar(tx.userId)}</span>
                      <span>{getUserName(tx.userId)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{tx.description}</p>
                      {tx.installments && tx.installments > 1 && (
                        <p className="text-xs text-warning">
                          {tx.currentInstallment}/{tx.installments} taksit
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-secondary/80">
                      {tx.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isCardAccount(tx.accountId) ? (
                        <CreditCard className="w-4 h-4 text-negative" />
                      ) : (
                        <Wallet className="w-4 h-4 text-positive" />
                      )}
                      <span className="text-sm">{getAccountName(tx.accountId)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-semibold",
                      tx.type === 'income' ? "text-positive" : "text-negative"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
