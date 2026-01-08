import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/finance';
import { users } from '@/data/mockData';
import { User as UserIcon, Lock, Shield, Save, Camera, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Professional photo avatars using pravatar.cc
const avatarOptions = [
  { id: 'professional-1', url: 'https://i.pravatar.cc/150?img=1' },
  { id: 'professional-2', url: 'https://i.pravatar.cc/150?img=3' },
  { id: 'professional-3', url: 'https://i.pravatar.cc/150?img=5' },
  { id: 'professional-4', url: 'https://i.pravatar.cc/150?img=7' },
  { id: 'professional-5', url: 'https://i.pravatar.cc/150?img=8' },
  { id: 'professional-6', url: 'https://i.pravatar.cc/150?img=11' },
  { id: 'professional-7', url: 'https://i.pravatar.cc/150?img=12' },
  { id: 'professional-8', url: 'https://i.pravatar.cc/150?img=13' },
  { id: 'professional-9', url: 'https://i.pravatar.cc/150?img=14' },
  { id: 'professional-10', url: 'https://i.pravatar.cc/150?img=15' },
  { id: 'professional-11', url: 'https://i.pravatar.cc/150?img=16' },
  { id: 'professional-12', url: 'https://i.pravatar.cc/150?img=17' },
];

const getAvatarUrl = (avatarId: string, customUrl?: string) => {
  if (customUrl) return customUrl;
  const found = avatarOptions.find(a => a.id === avatarId);
  if (found) return found.url;
  return `https://i.pravatar.cc/150?u=${avatarId}`;
};

const ProfilePage = () => {
  // Simulating current user as the first user (Admin)
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: 'ahmet@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatarId: 'professional-1',
    customAvatarUrl: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Hata', description: 'Dosya boyutu 5MB\'dan küçük olmalı', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          customAvatarUrl: reader.result as string,
          avatarId: '' 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCustomAvatar = () => {
    setFormData(prev => ({ ...prev, customAvatarUrl: '', avatarId: 'professional-1' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveProfile = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Hata', description: 'Ad alanı boş bırakılamaz', variant: 'destructive' });
      return;
    }

    setCurrentUser(prev => ({
      ...prev,
      name: formData.name,
      avatar: formData.avatarId
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
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center overflow-hidden ring-4 ring-background">
                <img 
                  src={getAvatarUrl(formData.avatarId, formData.customAvatarUrl)} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
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
                
                {/* Custom Avatar Upload */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Kendi Fotoğrafınızı Yükleyin</p>
                  {formData.customAvatarUrl ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <img src={formData.customAvatarUrl} alt="Custom avatar" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-muted-foreground flex-1">Yüklenen fotoğraf</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearCustomAvatar}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Label 
                      htmlFor="avatar-upload" 
                      className="flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-border bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Fotoğraf yükle (max 5MB)</span>
                    </Label>
                  )}
                  <input
                    ref={fileInputRef}
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>

                {/* Pre-built Avatars */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Hazır Avatarlar</p>
                  <ScrollArea className="h-28 rounded-md border border-border">
                    <div className="grid grid-cols-6 gap-3 p-3">
                      {avatarOptions.map(({ id, url }) => (
                        <button
                          key={id}
                          type="button"
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all overflow-hidden",
                            formData.avatarId === id && !formData.customAvatarUrl
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                              : "hover:ring-2 hover:ring-muted-foreground/50"
                          )}
                          onClick={() => setFormData(prev => ({ ...prev, avatarId: id, customAvatarUrl: '' }))}
                        >
                          <img 
                            src={url} 
                            alt="Avatar option"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
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
