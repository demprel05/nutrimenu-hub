import { useEffect, useState, useRef } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { User, LogOut, Sun, Moon, Loader2, Save, Camera, Pencil, MessageCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }

    // Check current theme
    const htmlElement = document.documentElement;
    setIsDarkMode(!htmlElement.classList.contains("light"));
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
      setIsDarkMode(data.theme === "dark");

      // Apply theme
      if (data.theme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Selecione uma imagem válida", variant: "destructive" });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Imagem muito grande (máx 2MB)", variant: "destructive" });
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Add timestamp to force refresh
      const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;
      setAvatarUrl(urlWithTimestamp);

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlWithTimestamp })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast({ title: "Foto atualizada!" });
    } catch (error: any) {
      toast({ title: "Erro ao enviar foto", variant: "destructive" });
      console.error("Upload error:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;

    setUploadingAvatar(true);
    try {
      // Remove from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.webp`, `${user.id}/avatar.jpeg`]);

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl("");
      toast({ title: "Foto removida!" });
    } catch (error: any) {
      toast({ title: "Erro ao remover foto", variant: "destructive" });
      console.error("Remove avatar error:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "Perfil salvo!" });
      loadProfile();
    } catch (error: any) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast({ title: "Senhas não coincidem", variant: "destructive" });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: "Mínimo 6 caracteres", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({ title: "Senha alterada!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({ title: "Erro ao alterar senha", variant: "destructive" });
    }
  };

  const toggleTheme = async () => {
    if (!user) return;

    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);

    // Apply theme immediately
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ theme: newTheme })
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating theme:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Perfil</h1>
        </div>

        {/* User Info */}
        <Card className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Ícone de edição sempre visível */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background hover:scale-110 transition-transform">
                      {uploadingAvatar ? (
                        <Loader2 className="w-3.5 h-3.5 text-primary-foreground animate-spin" />
                      ) : (
                        <Pencil className="w-3.5 h-3.5 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="glass-card border-border">
                  <DropdownMenuItem 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {avatarUrl && (
                    <DropdownMenuItem 
                      onClick={handleRemoveAvatar}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full gradient-primary"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Nome
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Alterar Senha</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={!newPassword || !confirmPassword}
              className="w-full"
              variant="outline"
            >
              Alterar Senha
            </Button>
          </div>
        </Card>

        {/* Theme Toggle */}
        <Card className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">
                  {isDarkMode ? "Modo escuro" : "Modo claro"}
                </p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
          </div>
        </Card>

        {/* Suporte WhatsApp */}
        <Card className="glass-card p-6 mb-6">
          <a
            href="https://wa.me/5599984214034"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium">Suporte</p>
              <p className="text-sm text-muted-foreground">(99) 98421-4034</p>
            </div>
          </a>
        </Card>

        {/* Sign Out */}
        <Button
          onClick={signOut}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}