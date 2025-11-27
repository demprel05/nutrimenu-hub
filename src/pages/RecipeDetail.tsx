import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Clock, ChefHat, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Badge } from "@/components/ui/badge";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  prep_time: number;
  ingredients: string[];
  instructions: string[];
  tips: string | null;
}

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (recipeId) {
      loadRecipe();
      checkFavorite();
    }
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", recipeId)
        .single();

      if (error) throw error;
      setRecipe(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar receita",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  };

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("recipe_id", recipeId);

        if (error) throw error;
        setIsFavorite(false);
        toast({ title: "Removido dos favoritos" });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, recipe_id: recipeId });

        if (error) throw error;
        setIsFavorite(true);
        toast({ title: "Adicionado aos favoritos!" });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Receita não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="relative h-[40vh] bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ChefHat className="w-24 h-24 text-primary/50" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            onClick={toggleFavorite}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <Card className="glass-card p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
          {recipe.description && (
            <p className="text-muted-foreground mb-4">{recipe.description}</p>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{recipe.prep_time} minutos</span>
          </div>
        </Card>

        <Card className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Ingredientes</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">
                  {index + 1}
                </Badge>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Modo de Preparo</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </span>
                <p className="flex-1 pt-1">{instruction}</p>
              </li>
            ))}
          </ol>
        </Card>

        {recipe.tips && (
          <Card className="glass-card p-6 bg-secondary/10 border-secondary/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold mb-2">Dicas</h2>
                <p className="text-sm">{recipe.tips}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}