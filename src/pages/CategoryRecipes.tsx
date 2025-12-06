import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Heart, Loader2, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { recipeImages } from "@/assets/recipes";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  prep_time: number;
}

interface Category {
  name: string;
  description: string;
}

export default function CategoryRecipes() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { user } = useAuth();

  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  const loadData = async () => {
    try {
      const [categoryResult, recipesResult, favoritesResult] = await Promise.all([
        supabase
          .from("recipe_categories")
          .select("name, description")
          .eq("id", categoryId)
          .single(),
        supabase
          .from("recipes")
          .select("id, title, description, image_url, prep_time")
          .eq("category_id", categoryId),
        user
          ? supabase
              .from("favorites")
              .select("recipe_id")
              .eq("user_id", user.id)
          : Promise.resolve({ data: [] }),
      ]);

      if (categoryResult.error) throw categoryResult.error;
      if (recipesResult.error) throw recipesResult.error;

      setCategory(categoryResult.data);
      setRecipes(recipesResult.data || []);
      setFavorites(
        new Set(favoritesResult.data?.map((f: any) => f.recipe_id) || [])
      );
    } catch (error: any) {
      toast.error("Erro ao carregar receitas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const isFavorite = favorites.has(recipeId);

      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("recipe_id", recipeId);

        if (error) throw error;

        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(recipeId);
          return next;
        });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, recipe_id: recipeId });

        if (error) throw error;

        setFavorites((prev) => new Set(prev).add(recipeId));
      }
    } catch (error: any) {
      toast.error("Erro: " + error.message);
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
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/recipes")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{category?.name}</h1>
            <p className="text-sm text-muted-foreground">{category?.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="glass-card overflow-hidden cursor-pointer hover:scale-[1.01] transition-smooth group"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 relative overflow-hidden">
                  {recipe.image_url && recipeImages[recipe.image_url.split('/').pop() || ''] ? (
                    <img
                      src={recipeImages[recipe.image_url.split('/').pop() || '']}
                      alt={recipe.title}
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
                      {recipe.title}
                    </h3>
                    {recipe.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.prep_time} min</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => toggleFavorite(recipe.id, e)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(recipe.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}