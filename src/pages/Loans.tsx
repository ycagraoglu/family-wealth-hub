import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { loans as initialLoans } from '@/data/mockData';
import { formatCurrency, getPercentage, getDaysUntil, formatShortDate } from '@/lib/formatters';
import { Loan } from '@/types/finance';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Landmark, 
  CalendarDays, 
  TrendingDown,
  Plus,
  MoreVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const LoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    remainingAmount: '',
    totalInstallments: '',
    paidInstallments: '',
    monthlyPayment: '',
    interestRate: '',
    nextPaymentDate: ''
  });

  const totalLoanDebt = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  const resetForm = () => {
    setFormData({
      name: '',
      totalAmount: '',
      remainingAmount: '',
      totalInstallments: '',
      paidInstallments: '',
      monthlyPayment: '',
      interestRate: '',
      nextPaymentDate: ''
    });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.totalAmount || !formData.remainingAmount || 
        !formData.totalInstallments || !formData.monthlyPayment || !formData.nextPaymentDate) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    const newLoan: Loan = {
      id: `l${Date.now()}`,
      name: formData.name,
      totalAmount: parseFloat(formData.totalAmount),
      remainingAmount: parseFloat(formData.remainingAmount),
      totalInstallments: parseInt(formData.totalInstallments),
      paidInstallments: parseInt(formData.paidInstallments) || 0,
      monthlyPayment: parseFloat(formData.monthlyPayment),
      interestRate: parseFloat(formData.interestRate) || 0,
      nextPaymentDate: formData.nextPaymentDate
    };

    setLoans([...loans, newLoan]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Kredi eklendi');
  };

  const handleEdit = () => {
    if (!selectedLoan) return;
    if (!formData.name || !formData.totalAmount || !formData.remainingAmount || 
        !formData.totalInstallments || !formData.monthlyPayment || !formData.nextPaymentDate) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    setLoans(loans.map(loan => 
      loan.id === selectedLoan.id 
        ? {
            ...loan,
            name: formData.name,
            totalAmount: parseFloat(formData.totalAmount),
            remainingAmount: parseFloat(formData.remainingAmount),
            totalInstallments: parseInt(formData.totalInstallments),
            paidInstallments: parseInt(formData.paidInstallments) || 0,
            monthlyPayment: parseFloat(formData.monthlyPayment),
            interestRate: parseFloat(formData.interestRate) || 0,
            nextPaymentDate: formData.nextPaymentDate
          }
        : loan
    ));
    setIsEditDialogOpen(false);
    setSelectedLoan(null);
    resetForm();
    toast.success('Kredi güncellendi');
  };

  const handleDelete = () => {
    if (!selectedLoan) return;
    setLoans(loans.filter(loan => loan.id !== selectedLoan.id));
    setDeleteDialogOpen(false);
    setSelectedLoan(null);
    toast.success('Kredi silindi');
  };

  const openEditDialog = (loan: Loan) => {
    setSelectedLoan(loan);
    setFormData({
      name: loan.name,
      totalAmount: loan.totalAmount.toString(),
      remainingAmount: loan.remainingAmount.toString(),
      totalInstallments: loan.totalInstallments.toString(),
      paidInstallments: loan.paidInstallments.toString(),
      monthlyPayment: loan.monthlyPayment.toString(),
      interestRate: loan.interestRate.toString(),
      nextPaymentDate: loan.nextPaymentDate
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (loan: Loan) => {
    setSelectedLoan(loan);
    setDeleteDialogOpen(true);
  };

  const LoanForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Kredi Adı *</Label>
        <Input 
          placeholder="Örn: Konut Kredisi" 
          className="bg-secondary border-border"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Toplam Kredi Tutarı *</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="bg-secondary border-border"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Kalan Borç *</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="bg-secondary border-border"
            value={formData.remainingAmount}
            onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Toplam Taksit Sayısı *</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="bg-secondary border-border"
            value={formData.totalInstallments}
            onChange={(e) => setFormData({ ...formData, totalInstallments: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Ödenen Taksit Sayısı</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="bg-secondary border-border"
            value={formData.paidInstallments}
            onChange={(e) => setFormData({ ...formData, paidInstallments: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Aylık Taksit *</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="bg-secondary border-border"
            value={formData.monthlyPayment}
            onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Faiz Oranı (%)</Label>
          <Input 
            type="number" 
            step="0.01"
            placeholder="0" 
            className="bg-secondary border-border"
            value={formData.interestRate}
            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Sonraki Ödeme Tarihi *</Label>
        <Input 
          type="date" 
          className="bg-secondary border-border"
          value={formData.nextPaymentDate}
          onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
        />
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
            <h1 className="text-3xl font-bold">Krediler</h1>
            <p className="text-muted-foreground">Uzun vadeli kredi borçlarınızı takip edin</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Kredi Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni Kredi Ekle</DialogTitle>
              </DialogHeader>
              <LoanForm onSubmit={handleAdd} submitLabel="Kredi Oluştur" />
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-negative/10">
                <TrendingDown className="w-6 h-6 text-negative" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Kalan Borç</p>
                <p className="text-2xl font-bold text-negative">{formatCurrency(totalLoanDebt)}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <CalendarDays className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aylık Toplam Ödeme</p>
                <p className="text-2xl font-bold text-warning">{formatCurrency(totalMonthlyPayment)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Loans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loans.map((loan, index) => {
            const paidPercentage = getPercentage(loan.paidInstallments, loan.totalInstallments);
            const remainingInstallments = loan.totalInstallments - loan.paidInstallments;
            const daysUntilPayment = getDaysUntil(loan.nextPaymentDate);
            
            return (
              <Card 
                key={loan.id} 
                className="glass-card overflow-hidden animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning/20 to-negative/20 flex items-center justify-center">
                        <Landmark className="w-7 h-7 text-warning" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{loan.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Faiz Oranı: %{loan.interestRate}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(loan)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(loan)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Toplam Kredi</p>
                      <p className="text-xl font-bold">{formatCurrency(loan.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Kalan Borç</p>
                      <p className="text-xl font-bold text-negative">{formatCurrency(loan.remainingAmount)}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ödeme İlerlemesi</span>
                      <span className="text-sm font-medium text-positive">%{paidPercentage} tamamlandı</span>
                    </div>
                    <Progress value={paidPercentage} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{loan.paidInstallments} taksit ödendi</span>
                      <span>{remainingInstallments} taksit kaldı</span>
                    </div>
                  </div>

                  {/* Installment Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Aylık Taksit</p>
                      <p className="text-lg font-bold">{formatCurrency(loan.monthlyPayment)}</p>
                    </div>
                    <div className={cn(
                      "p-4 rounded-lg",
                      daysUntilPayment <= 5 ? "bg-destructive/10 border border-destructive/20" : "bg-secondary/50"
                    )}>
                      <p className="text-xs text-muted-foreground mb-1">Sonraki Ödeme</p>
                      <p className={cn(
                        "text-lg font-bold",
                        daysUntilPayment <= 5 && "text-destructive"
                      )}>
                        {daysUntilPayment} gün
                      </p>
                      <p className="text-xs text-muted-foreground">{formatShortDate(loan.nextPaymentDate)}</p>
                    </div>
                  </div>

                  {/* Total Progress Bar */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-positive to-emerald-400 transition-all duration-500"
                        style={{ width: `${paidPercentage}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground font-medium">
                      {loan.paidInstallments}/{loan.totalInstallments}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Krediyi Düzenle</DialogTitle>
            </DialogHeader>
            <LoanForm onSubmit={handleEdit} submitLabel="Kaydet" />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Krediyi Sil</AlertDialogTitle>
              <AlertDialogDescription>
                "{selectedLoan?.name}" kredisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

export default LoansPage;
