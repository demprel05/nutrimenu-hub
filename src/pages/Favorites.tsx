import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Heart, Loader2, ChefHat, Clock, Sparkles, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { recipeImages } from "@/assets/recipes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { Json } from "@/integrations/supabase/types";

interface VariationData {
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

interface FavoriteRecipe {
  id: string;
  recipe_id: string;
  is_variation: boolean;
  variation_data: Json | null;
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

const variationTypes = [
  { id: 'low-carb', label: 'Low Carb', emoji: '🥗' },
  { id: 'vegana', label: 'Vegana', emoji: '🌱' },
  { id: 'pre-treino', label: 'Pré-treino', emoji: '💪' },
  { id: 'pos-treino', label: 'Pós-treino', emoji: '🏋️' },
  { id: 'zero-acucar', label: 'Zero Açúcar', emoji: '🚫' },
  { id: 'proteica', label: 'Proteica', emoji: '🍗' },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingVariation, setGeneratingVariation] = useState(false);
  const [currentVariation, setCurrentVariation] = useState<VariationData | null>(null);
  const [showVariationDialog, setShowVariationDialog] = useState(false);
  const [favoriteVariationLoading, setFavoriteVariationLoading] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);
  const [selectedRecipeForVariation, setSelectedRecipeForVariation] = useState<{ recipe_id: string, variation: VariationData } | null>(null);
  const [isViewingFavoritedVariation, setIsViewingFavoritedVariation] = useState(false);
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
          is_variation,
          variation_data,
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

  const toggleVariationSelection = (variationId: string) => {
    setSelectedVariations(prev => 
      prev.includes(variationId) 
        ? prev.filter(id => id !== variationId)
        : [...prev, variationId]
    );
  };

  const openVariationDialog = (recipeId: string, variation: VariationData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRecipeForVariation({ recipe_id: recipeId, variation });
    setSelectedVariations([]);
    setShowVariationDialog(true);
  };

  const generateVariationFromVariation = async () => {
    if (!selectedRecipeForVariation || selectedVariations.length === 0) {
      toast({
        title: "Selecione ao menos uma variação",
        variant: "destructive",
      });
      return;
    }

    setGeneratingVariation(true);
    try {
      const recipeForAI = {
        ...selectedRecipeForVariation.variation,
        id: selectedRecipeForVariation.recipe_id
      };

      const { data, error } = await supabase.functions.invoke('generate-recipe-variation', {
        body: { recipe: recipeForAI, variationTypes: selectedVariations }
      });

      if (error) throw error;

      setCurrentVariation(data);
      setShowVariationDialog(false);
      setSelectedVariations([]);
      setIsViewingFavoritedVariation(false);
      
      setTimeout(() => {
        setShowVariationDialog(true);
      }, 100);
      
      toast({ title: "Nova variação criada!" });
    } catch (error: any) {
      console.error('Error generating variation:', error);
      toast({
        title: "Erro ao gerar variação",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setGeneratingVariation(false);
    }
  };

  const favoriteNewVariation = async () => {
    if (!user || !currentVariation || !selectedRecipeForVariation) return;

    setFavoriteVariationLoading(true);
    try {
      const variationWithId = {
        ...currentVariation,
        unique_id: `${selectedRecipeForVariation.recipe_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const { error } = await supabase
        .from("favorites")
        .insert([{
          user_id: user.id,
          recipe_id: selectedRecipeForVariation.recipe_id,
          is_variation: true,
          variation_data: variationWithId as any
        }]);

      if (error) throw error;

      toast({ title: "Variação favoritada!" });
      setShowVariationDialog(false);
      setCurrentVariation(null);
      setSelectedRecipeForVariation(null);
      loadFavorites();
    } catch (error: any) {
      toast({
        title: "Erro ao favoritar variação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFavoriteVariationLoading(false);
    }
  };

  // Group favorites by category (variations go to "Variações IA")
  const groupedFavorites = favorites.reduce((acc, fav) => {
    const categoryName = fav.is_variation 
      ? "Variações IA ✨" 
      : fav.recipes.recipe_categories.name;
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
                  {items.map((favorite) => {
                    const variation = favorite.variation_data as unknown as VariationData | null;
                    
                    // Get variation type label
                    const variationTypeLabels: Record<string, string> = {
                      'low-carb': 'Low Carb',
                      'vegana': 'Vegana',
                      'pre-treino': 'Pré-treino',
                      'pos-treino': 'Pós-treino',
                      'zero-acucar': 'Zero Açúcar',
                      'proteica': 'Proteica'
                    };
                    
                    const displayTitle = favorite.is_variation && variation
                      ? `${favorite.recipes.title} - ${variationTypeLabels[variation.variation_type] || variation.variation_type}`
                      : favorite.recipes.title;
                    const displayDescription = favorite.is_variation && variation
                      ? variation.description
                      : favorite.recipes.description;
                    const displayPrepTime = favorite.is_variation && variation
                      ? variation.prep_time
                      : favorite.recipes.prep_time;

                    return (
                      <Card
                        key={favorite.id}
                        className="glass-card overflow-hidden cursor-pointer hover:scale-[1.01] transition-smooth group"
                        onClick={() => {
                          if (favorite.is_variation && variation) {
                            setCurrentVariation(variation);
                            setSelectedRecipeForVariation({ recipe_id: favorite.recipe_id, variation });
                            setIsViewingFavoritedVariation(true);
                            setShowVariationDialog(true);
                          } else {
                            navigate(`/recipe/${favorite.recipes.id}`);
                          }
                        }}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 relative overflow-hidden">
                            {favorite.recipes.image_url && recipeImages[favorite.recipes.image_url.split('/').pop() || ''] ? (
                              <img
                                src={recipeImages[favorite.recipes.image_url.split('/').pop() || '']}
                                alt={displayTitle}
                                className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ChefHat className="w-12 h-12 text-primary/50" />
                              </div>
                            )}
                            {favorite.is_variation && (
                              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                ✨ IA
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold mb-1 group-hover:text-primary transition-smooth">
                                {displayTitle}
                              </h3>
                              {displayDescription && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {displayDescription}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{displayPrepTime} min</span>
                              </div>
                              <div className="flex gap-1">
                                {favorite.is_variation && variation && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => openVariationDialog(favorite.recipe_id, variation, e)}
                                  >
                                    <Sparkles className="w-4 h-4 text-primary" />
                                  </Button>
                                )}
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
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showVariationDialog && !currentVariation} onOpenChange={(open) => {
        if (!open) {
          setShowVariationDialog(false);
          setSelectedRecipeForVariation(null);
          setSelectedVariations([]);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Criar Nova Variação
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecione uma ou mais opções para criar uma nova variação desta receita
            </p>
            <div className="grid grid-cols-2 gap-3">
              {variationTypes.map((type) => (
                <div
                  key={type.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedVariations.includes(type.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleVariationSelection(type.id)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedVariations.includes(type.id)}
                      onCheckedChange={() => toggleVariationSelection(type.id)}
                    />
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-2xl">{type.emoji}</span>
                      <span className="text-xs font-medium">{type.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={generateVariationFromVariation}
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
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVariationDialog && !!currentVariation && !selectedVariations.length} onOpenChange={(open) => {
        if (!open) {
          setShowVariationDialog(false);
          setCurrentVariation(null);
          setSelectedRecipeForVariation(null);
          setIsViewingFavoritedVariation(false);
        }
      }}>
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

                {!isViewingFavoritedVariation && (
                  <Button
                    onClick={favoriteNewVariation}
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
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}