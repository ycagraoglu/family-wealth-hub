import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/finance';
import { users } from '@/data/mockData';
import { User as UserIcon, Mail, Lock, Shield, Save, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  // Simulating current user as the first user (Admin)
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: 'ahmet@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: currentUser.avatar || '👨‍💼'
  });

  const [isEditing, setIsEditing] = useState(false);

  const avatarOptions = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '🧑‍💼', '👤', '🧑', '👦', '👧'];

  const handleSaveProfile = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Hata', description: 'Ad alanı boş bırakılamaz', variant: 'destructive' });
      return;
    }

    setCurrentUser(prev => ({
      ...prev,
      name: formData.name,
      avatar: formData.avatar
    }));

    toast({ title: 'Başarılı', description: 'Profil bilgileri güncellendi' });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!formData.currentPassword) {
      toast({ title: 'Hata', description: 'Mevcut şifrenizi girin', variant: 'destructive' });
      return;
    }
    if (!formData.newPassword) {
      toast({ title: 'Hata', description: 'Yeni şifre girin', variant: 'destructive' });
      return;
    }
    if (formData.newPassword.length < 6) {
      toast({ title: 'Hata', description: 'Şifre en az 6 karakter olmalıdır', variant: 'destructive' });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast({ title: 'Hata', description: 'Şifreler eşleşmiyor', variant: 'destructive' });
      return;
    }

    // Reset password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    toast({ title: 'Başarılı', description: 'Şifreniz başarıyla değiştirildi' });
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Yönetici';
      case 'member': return 'Üye';
      case 'kid': return 'Çocuk';
      default: return role;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Profil Ayarları</h1>
          <p className="text-muted-foreground">Hesap bilgilerinizi yönetin</p>
        </div>

        {/* Profile Card */}
        <Card className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-4xl">
                {formData.avatar}
              </div>
              {isEditing && (
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute -bottom-1 -right-1 rounded-full w-8 h-8"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{getRoleLabel(currentUser.role)}</span>
              </div>
            </div>
            <Button 
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'İptal' : 'Düzenle'}
            </Button>
          </div>

          {isEditing && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Avatar Seç
                </h3>
                <div className="flex flex-wrap gap-3">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all",
                        formData.avatar === avatar 
                          ? "bg-primary/20 ring-2 ring-primary scale-110" 
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Profile Info */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Kişisel Bilgiler
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ad Soyad</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Shield className="w-4 h-4 text-primary" />
                <span>{getRoleLabel(currentUser.role)}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  (Rol değişikliği için yöneticiye başvurun)
                </span>
              </div>
            </div>

            {isEditing && (
              <Button className="w-full" onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Değişiklikleri Kaydet
              </Button>
            )}
          </div>
        </Card>

        {/* Password Card */}
        <Card className="glass-card p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Şifre Değiştir
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mevcut Şifre</Label>
              <Input 
                type="password"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="bg-secondary border-border"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Yeni Şifre</Label>
                <Input 
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Yeni Şifre (Tekrar)</Label>
                <Input 
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <Button variant="secondary" onClick={handleChangePassword}>
              <Lock className="w-4 h-4 mr-2" />
              Şifreyi Güncelle
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
