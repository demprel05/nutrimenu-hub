import { useEffect, useState, useRef } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { StickyNote, Plus, Pencil, Trash2, Loader2, ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface Note {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  color: string | null;
  created_at: string;
}

const noteColors = [
  { id: 'orange', bg: 'bg-orange-500/10', border: 'border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.3)]', label: 'Laranja' },
  { id: 'green', bg: 'bg-green-500/10', border: 'border-green-500/50 shadow-[0_0_12px_rgba(34,197,94,0.3)]', label: 'Verde' },
  { id: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]', label: 'Azul' },
  { id: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]', label: 'Roxo' },
  { id: 'pink', bg: 'bg-pink-500/10', border: 'border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.3)]', label: 'Rosa' },
  { id: 'red', bg: 'bg-red-500/10', border: 'border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]', label: 'Vermelho' },
];

const getColorClasses = (colorId: string | null) => {
  const color = noteColors.find(c => c.id === colorId) || noteColors[0];
  return { bg: color.bg, border: color.border };
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", image_url: "", color: "orange" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({ title: "Erro ao carregar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Selecione uma imagem válida", variant: "destructive" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Imagem muito grande (máx 5MB)", variant: "destructive" });
      return;
    }

    setUploadingImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('note-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('note-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);
      toast({ title: "Imagem adicionada!" });
    } catch (error: any) {
      toast({ title: "Erro ao enviar imagem", variant: "destructive" });
      console.error("Upload error:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image_url: "" });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingNote) {
        const { error } = await supabase
          .from("notes")
          .update({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url || null,
            color: formData.color,
          })
          .eq("id", editingNote.id);

        if (error) throw error;
        toast({ title: "Anotação atualizada!" });
      } else {
        const { error } = await supabase.from("notes").insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url || null,
          color: formData.color,
        });

        if (error) throw error;
        toast({ title: "Anotação criada!" });
      }

      setIsDialogOpen(false);
      setFormData({ title: "", content: "", image_url: "", color: "orange" });
      setImagePreview(null);
      setEditingNote(null);
      loadNotes();
    } catch (error: any) {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Anotação excluída" });
      loadNotes();
    } catch (error: any) {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || "",
      image_url: note.image_url || "",
      color: note.color || "orange",
    });
    setImagePreview(note.image_url || null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
    setFormData({ title: "", content: "", image_url: "", color: "orange" });
    setImagePreview(null);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <StickyNote className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Anotações</h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary glow-primary">
                <Plus className="w-5 h-5 mr-2" />
                Nova
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? "Editar Anotação" : "Nova Anotação"}
                </DialogTitle>
                <DialogDescription>
                  Crie anotações sobre suas receitas favoritas
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Título da anotação"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Escreva sua anotação aqui..."
                    rows={4}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Imagem (opcional)</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <ImagePlus className="w-6 h-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Escolher da galeria</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <Label>Cor do Card</Label>
                  <div className="flex gap-3">
                    {noteColors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.id })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          color.id === 'orange' ? 'bg-orange-500' :
                          color.id === 'green' ? 'bg-green-500' :
                          color.id === 'blue' ? 'bg-blue-500' :
                          color.id === 'purple' ? 'bg-purple-500' :
                          color.id === 'pink' ? 'bg-pink-500' :
                          'bg-red-500'
                        } ${
                          formData.color === color.id 
                            ? 'ring-2 ring-offset-2 ring-offset-background ring-white scale-110' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 gradient-primary">
                    {editingNote ? "Atualizar" : "Criar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {notes.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <StickyNote className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Você ainda não tem anotações
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="gradient-primary"
            >
              Criar Primeira Anotação
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map((note) => {
              const colorClasses = getColorClasses(note.color);
              return (
                <Card 
                  key={note.id} 
                  className={`overflow-hidden group border-2 ${colorClasses.bg} ${colorClasses.border} transition-all hover:scale-[1.02]`}
                >
                  {note.image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={note.image_url}
                        alt={note.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{note.title}</h3>
                    {note.content && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {note.content}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(note)}
                        className="flex-1"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}