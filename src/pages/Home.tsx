import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search, Clock, ChefHat, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { recipeImages } from "@/assets/recipes";

const categories = [
  "Low carb",
  "Veganas",
  "Proteicas",
  "Pré-treino",
  "Pós-treino",
  "Zero açúcar",
];

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  prep_time: number | null;
  ingredients: string[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [quickRecipes, setQuickRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuick, setLoadingQuick] = useState(true);
  const navigate = useNavigate();

  // Load quick recipes on mount
  useEffect(() => {
    loadQuickRecipes();
  }, []);

  // Search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchRecipes(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadQuickRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, description, image_url, prep_time, ingredients")
        .lte("prep_time", 15)
        .limit(4);

      if (error) throw error;
      setQuickRecipes(data || []);
    } catch (error) {
      console.error("Error loading quick recipes:", error);
    } finally {
      setLoadingQuick(false);
    }
  };

  const searchRecipes = async (query: string) => {
    setLoading(true);
    try {
      // Busca por título ou descrição
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, description, image_url, prep_time, ingredients")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      
      // Filtra também por ingredientes (busca no array)
      const queryLower = query.toLowerCase();
      const filteredByIngredients = (data || []).filter((recipe) => {
        // Verifica se já foi encontrado por título/descrição
        const titleMatch = recipe.title?.toLowerCase().includes(queryLower);
        const descMatch = recipe.description?.toLowerCase().includes(queryLower);
        
        // Verifica ingredientes
        const ingredientMatch = recipe.ingredients?.some((ing: string) =>
          ing.toLowerCase().includes(queryLower)
        );
        
        return titleMatch || descMatch || ingredientMatch;
      });
      
      // Se não encontrou nada por título/descrição, busca só por ingredientes em todas as receitas
      if (filteredByIngredients.length === 0) {
        const { data: allRecipes } = await supabase
          .from("recipes")
          .select("id, title, description, image_url, prep_time, ingredients");
        
        const ingredientResults = (allRecipes || []).filter((recipe) =>
          recipe.ingredients?.some((ing: string) =>
            ing.toLowerCase().includes(queryLower)
          )
        ).slice(0, 10);
        
        setSearchResults(ingredientResults);
      } else {
        setSearchResults(filteredByIngredients.slice(0, 10));
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-br from-primary/20 via-background to-background flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg4djhoLTh6bTAgMTZoOHY4aC04em0wIDE2aDh2OGgtOHptMCAxNmg4djhoLTh6bTAgMTZoOHY4aC04em0wIDE2aDh2OGgtOHptMCAxNmg4djhoLTh6bTE2LTE0NGg4djhoLTh6bTAgMTZoOHY4aC04em0wIDE2aDh2OGgtOHptMCAxNmg4djhoLTh6bTAgMTZoOHY4aC04em0wIDE2aDh2OGgtOHptMCAxNmg4djhoLTh6bTE2LTE0NGg4djhoLTh6bTAgMTZoOHY4aC04em0wIDE2aDh2OGgtOHptMCAxNmg4djhoLTh6bTAgMTZoOHY4aC04em0wIDE2aDh2OGgtOHptMCAxNmg4djhoLTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="text-center z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            SaborFit - Receitas
          </h1>
          <p className="text-muted-foreground text-lg">
            Cozinhe saudável, viva melhor
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Search Bar */}
        <Card className="glass-card p-4 mb-8 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Busque por ingredientes ou categorias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-background/50 border-border/50 h-12 text-base"
            />
          </div>
        </Card>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Categorias Fitness</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="gradient-secondary text-foreground px-4 py-2 cursor-pointer hover:opacity-80 transition-smooth"
                onClick={() => navigate("/recipes")}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {loading ? "Buscando..." : `Resultados para "${searchQuery}"`}
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : searchResults.length === 0 ? (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Nenhuma receita encontrada</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="glass-card overflow-hidden cursor-pointer hover:scale-[1.02] transition-smooth group"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
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
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-smooth">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {recipe.prep_time} min
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Recipes */}
        {!searchQuery && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Receitas Rápidas</h2>
              <span className="text-sm text-muted-foreground">(até 15 min)</span>
            </div>
            
            {loadingQuick ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : quickRecipes.length === 0 ? (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Nenhuma receita rápida disponível</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="glass-card overflow-hidden cursor-pointer hover:scale-[1.02] transition-smooth group"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
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
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-smooth">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pronta em {recipe.prep_time} minutos
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}