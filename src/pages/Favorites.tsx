import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Heart, Loader2, ChefHat, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

interface FavoriteRecipe {
  id: string;
  recipe_id: string;
  recipes: {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    prep_time: number;
    category_id: string;
    recipe_categories: {
      name: string;
    };
  };
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          recipe_id,
          recipes (
            id,
            title,
            description,
            image_url,
            prep_time,
            category_id,
            recipe_categories (
              name
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar favoritos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      toast({ title: "Removido dos favoritos" });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Group favorites by category
  const groupedFavorites = favorites.reduce((acc, fav) => {
    const categoryName = fav.recipes.recipe_categories.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(fav);
    return acc;
  }, {} as Record<string, FavoriteRecipe[]>);

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
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold">Favoritos</h1>
        </div>

        {favorites.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Você ainda não tem receitas favoritas
            </p>
            <Button
              onClick={() => navigate("/recipes")}
              className="gradient-primary"
            >
              Explorar Receitas
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFavorites).map(([categoryName, items]) => (
              <div key={categoryName}>
                <h2 className="text-xl font-bold mb-4">{categoryName}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((favorite) => (
                    <Card
                      key={favorite.id}
                      className="glass-card overflow-hidden cursor-pointer hover:scale-[1.01] transition-smooth group"
                      onClick={() => navigate(`/recipe/${favorite.recipes.id}`)}
                    >
                      <div className="flex gap-4">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 relative overflow-hidden">
                          {favorite.recipes.image_url ? (
                            <img
                              src={favorite.recipes.image_url}
                              alt={favorite.recipes.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ChefHat className="w-12 h-12 text-primary/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold mb-1 group-hover:text-primary transition-smooth">
                              {favorite.recipes.title}
                            </h3>
                            {favorite.recipes.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {favorite.recipes.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{favorite.recipes.prep_time} min</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => removeFavorite(favorite.id, e)}
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}