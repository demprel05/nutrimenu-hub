import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categoryImages } from "@/assets/categories";

interface RecipeCategory {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

export default function Recipes() {
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("recipe_categories")
        .select("*")
        .order("created_at");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar categorias",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Receitas</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="glass-card overflow-hidden cursor-pointer hover:scale-[1.02] transition-smooth group"
              onClick={() => navigate(`/recipes/${category.id}`)}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                {category.image_url && categoryImages[category.image_url.split('/').pop() || ''] ? (
                  <img
                    src={categoryImages[category.image_url.split('/').pop() || '']}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary/50" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-smooth">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}