import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Clock, ChefHat, Lightbulb, Loader2, Sparkles, Carrot, Leaf, Zap, Dumbbell, Ban, Drumstick } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { recipeImages } from "@/assets/recipes";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  prep_time: number;
  ingredients: string[];
  instructions: string[];
  tips: string | null;
  protein?: number;
  carbs?: number;
  calories?: number;
  servings?: number;
}

interface RecipeVariation {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tips: string;
  variation_type: string;
  prep_time: number;
  protein?: number;
  carbs?: number;
  calories?: number;
  servings?: number;
}

const variationTypes = [
  { id: 'low-carb', label: 'Low Carb', icon: Carrot, color: 'text-orange-500' },
  { id: 'vegana', label: 'Vegana', icon: Leaf, color: 'text-green-500' },
  { id: 'pre-treino', label: 'Pré-treino', icon: Zap, color: 'text-yellow-500' },
  { id: 'pos-treino', label: 'Pós-treino', icon: Dumbbell, color: 'text-blue-500' },
  { id: 'zero-acucar', label: 'Zero Açúcar', icon: Ban, color: 'text-red-500' },
  { id: 'proteica', label: 'Proteica', icon: Drumstick, color: 'text-amber-600' },
];

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingVariation, setGeneratingVariation] = useState(false);
  const [currentVariation, setCurrentVariation] = useState<RecipeVariation | null>(null);
  const [showVariationDialog, setShowVariationDialog] = useState(false);
  const [favoriteVariationLoading, setFavoriteVariationLoading] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);
  const navigate = useNavigate();
  
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
      toast.error("Erro ao carregar receita: " + error.message);
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
        .eq("is_variation", false)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  };

  const toggleVariationSelection = (variationId: string) => {
    setSelectedVariations(prev => 
      prev.includes(variationId) 
        ? prev.filter(id => id !== variationId)
        : [...prev, variationId]
    );
  };

  const generateVariation = async () => {
    if (!recipe || selectedVariations.length === 0) {
      toast.error("Selecione ao menos uma variação");
      return;
    }

    setGeneratingVariation(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe-variation', {
        body: { recipe, variationTypes: selectedVariations }
      });

      if (error) throw error;

      setCurrentVariation(data);
      setShowVariationDialog(true);
      setSelectedVariations([]);
      toast.success("Variação criada com sucesso!");
    } catch (error: any) {
      console.error('Error generating variation:', error);
      toast.error("Erro ao gerar variação: " + (error.message || "Tente novamente mais tarde"));
    } finally {
      setGeneratingVariation(false);
    }
  };

  const favoriteVariation = async () => {
    if (!user || !currentVariation || !recipe) return;

    setFavoriteVariationLoading(true);
    try {
      // Add unique ID to variation data to avoid duplicate key errors
      const variationWithId = {
        ...currentVariation,
        unique_id: `${recipe.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const { error } = await supabase
        .from("favorites")
        .insert([{
          user_id: user.id,
          recipe_id: recipe.id,
          is_variation: true,
          variation_data: variationWithId as any
        }]);

      if (error) throw error;

      toast.success("Variação favoritada!");
      setShowVariationDialog(false);
      setCurrentVariation(null);
    } catch (error: any) {
      toast.error("Erro ao favoritar variação: " + error.message);
    } finally {
      setFavoriteVariationLoading(false);
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
        toast.success("Removido dos favoritos");
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, recipe_id: recipeId });

        if (error) throw error;
        setIsFavorite(true);
        toast.success("Adicionado aos favoritos!");
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
        {recipe.image_url && recipeImages[recipe.image_url.split('/').pop() || ''] ? (
          <img
            src={recipeImages[recipe.image_url.split('/').pop() || '']}
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
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{recipe.prep_time} min</span>
            </div>
            
            {recipe.servings && (
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{recipe.servings} porções</span>
              </div>
            )}
          </div>

          {(recipe.calories || recipe.protein || recipe.carbs) && (
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
              {recipe.calories && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recipe.calories}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
              )}
              {recipe.protein && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recipe.protein}g</p>
                  <p className="text-xs text-muted-foreground">Proteínas</p>
                </div>
              )}
              {recipe.carbs && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recipe.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carboidratos</p>
                </div>
              )}
            </div>
          )}
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
          <Card className="glass-card p-6 bg-secondary/10 border-secondary/20 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold mb-2">Dicas</h2>
                <p className="text-sm">{recipe.tips}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="glass-card p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Gerar Variação com IA</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Selecione uma ou mais opções para criar sua variação personalizada
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {variationTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedVariations.includes(type.id)
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onClick={() => toggleVariationSelection(type.id)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-lg bg-muted/50 ${selectedVariations.includes(type.id) ? 'bg-primary/20' : ''}`}>
                      <IconComponent className={`w-6 h-6 ${type.color}`} />
                    </div>
                    <span className="text-xs font-medium text-center">{type.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            onClick={generateVariation}
            disabled={generatingVariation || selectedVariations.length === 0}
            className="w-full gradient-primary"
          >
            {generatingVariation ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Gerando variação...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Variação ({selectedVariations.length} selecionada{selectedVariations.length !== 1 ? 's' : ''})
              </>
            )}
          </Button>
        </Card>
      </div>

      <Dialog open={showVariationDialog} onOpenChange={setShowVariationDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {currentVariation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {currentVariation.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  {currentVariation.variation_type && (
                    <Badge variant="secondary" className="mb-2">
                      {currentVariation.variation_type.split(',').map(v => 
                        variationTypes.find(t => t.id === v.trim())?.label || v
                      ).join(' + ')}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">{currentVariation.description}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{currentVariation.prep_time} min</span>
                  </div>
                  {currentVariation.servings && (
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-primary" />
                      <span>{currentVariation.servings} porções</span>
                    </div>
                  )}
                </div>

                {(currentVariation.calories || currentVariation.protein || currentVariation.carbs) && (
                  <div className="grid grid-cols-3 gap-2 p-3 bg-secondary/10 rounded-lg">
                    {currentVariation.calories && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{currentVariation.calories}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                    )}
                    {currentVariation.protein && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{currentVariation.protein}g</p>
                        <p className="text-xs text-muted-foreground">Proteínas</p>
                      </div>
                    )}
                    {currentVariation.carbs && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{currentVariation.carbs}g</p>
                        <p className="text-xs text-muted-foreground">Carboidratos</p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="font-bold mb-2">Ingredientes</h3>
                  <ul className="space-y-1">
                    {currentVariation.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Modo de Preparo</h3>
                  <ol className="space-y-2">
                    {currentVariation.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm flex gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">
                          {index + 1}
                        </span>
                        <p className="flex-1">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {currentVariation.tips && (
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm mb-1">Dica</h3>
                        <p className="text-sm">{currentVariation.tips}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={favoriteVariation}
                  disabled={favoriteVariationLoading}
                  className="w-full gradient-primary"
                >
                  {favoriteVariationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Salvar nos Favoritos
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}