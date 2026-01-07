import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { transactions as initialTransactions, users, assetAccounts, creditCards, categories } from '@/data/mockData';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Wallet,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const getAvatarUrl = (seed: string) => 
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=c0aede,b6e3f4,ffdfbf,ffd5dc,d1d4f9`;

const TransactionsPage = () => {
  const [txList, setTxList] = useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showInstallments, setShowInstallments] = useState(false);
  
  // Edit & Delete state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    description: '',
    amount: '',
    category: '',
    accountId: '',
    userId: '',
    installments: '1'
  });
  
  // Simulated current user - in production this would come from auth context
  const currentUser = users.find(u => u.id === 'u1')!; // Ahmet (Admin)
  const isAdmin = currentUser.role === 'admin';

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
    const user = users.find(u => u.id === userId);
    return user?.name?.toLowerCase() || 'user';
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

  const openEditDialog = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setFormData({
      type: tx.type,
      description: tx.description,
      amount: tx.amount.toString(),
      category: tx.category,
      accountId: tx.accountId,
      userId: tx.userId,
      installments: tx.installments?.toString() || '1'
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setDeleteDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedTransaction) return;

    setTxList(prev => prev.map(tx => 
      tx.id === selectedTransaction.id 
        ? {
            ...tx,
            type: formData.type,
            description: formData.description,
            amount: parseFloat(formData.amount),
            category: formData.category,
            accountId: formData.accountId,
            userId: formData.userId,
            installments: parseInt(formData.installments) || 1
          }
        : tx
    ));

    toast({ title: 'Başarılı', description: 'İşlem güncellendi' });
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleDelete = () => {
    if (!selectedTransaction) return;

    setTxList(prev => prev.filter(tx => tx.id !== selectedTransaction.id));
    toast({ title: 'Başarılı', description: 'İşlem silindi' });
    setDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

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

                {isAdmin ? (
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
                              <img 
                                src={getAvatarUrl(user.name.toLowerCase())} 
                                alt={user.name}
                                className="w-6 h-6 rounded-full"
                              />
                              {user.name}
                              <span className="text-xs text-muted-foreground">
                                ({user.role === 'admin' ? 'Admin' : user.role === 'member' ? 'Üye' : 'Çocuk'})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Kullanıcı</Label>
                    <div className="flex items-center gap-2 p-3 rounded-md bg-secondary border border-border">
                      <img 
                        src={getAvatarUrl(currentUser.name.toLowerCase())} 
                        alt={currentUser.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground">(Sizin adınıza)</span>
                    </div>
                  </div>
                )}

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
                <TableHead className="text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-border hover:bg-secondary/30">
                  <TableCell className="font-medium">{formatDate(tx.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img 
                        src={getAvatarUrl(getUserAvatar(tx.userId))} 
                        alt={getUserName(tx.userId)}
                        className="w-8 h-8 rounded-full"
                      />
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(tx)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(tx)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>İşlemi Düzenle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>İşlem Türü</Label>
              <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Gider</SelectItem>
                  <SelectItem value="income">Gelir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Input 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-secondary border-border" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tutar</Label>
                <Input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-secondary border-border" 
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
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
              <Label>Hesap</Label>
              <Select value={formData.accountId} onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assetAccounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-positive" />
                        {acc.name}
                      </div>
                    </SelectItem>
                  ))}
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

            <Button className="w-full" onClick={handleEdit}>
              Değişiklikleri Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İşlemi silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedTransaction?.description}" işlemi kalıcı olarak silinecektir. Bu işlem geri alınamaz.
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
    </MainLayout>
  );
};

export default TransactionsPage;
