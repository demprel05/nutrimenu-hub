import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipe, variationTypes } = await req.json();
    
    if (!recipe || !variationTypes || !Array.isArray(variationTypes) || variationTypes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Recipe and at least one variation type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create prompt based on variation types
    const variationPrompts: Record<string, string> = {
      'low-carb': 'low carb (baixo carboidrato)',
      'vegana': 'vegana',
      'pre-treino': 'ideal para pré-treino (mais carboidratos complexos e proteína moderada)',
      'pos-treino': 'ideal para pós-treino (rica em proteínas e carboidratos para recuperação)',
      'zero-acucar': 'zero açúcar (sem açúcares, use adoçantes naturais)',
      'proteica': 'mais proteica (aumente significativamente o conteúdo de proteínas)'
    };

    const selectedVariations = variationTypes.map(type => variationPrompts[type]).filter(Boolean);
    const combinedVariation = selectedVariations.join(', ');

    const prompt = `Adapte esta receita para ser ${combinedVariation}. Combine todas essas características em uma única receita.

Receita original:
Título: ${recipe.title}
Ingredientes: ${recipe.ingredients.join(', ')}
Instruções: ${recipe.instructions.join(' ')}
${recipe.description ? `Descrição: ${recipe.description}` : ''}

Gere uma variação completa no formato JSON com:
- title: título adaptado da receita
- description: breve descrição (máximo 2 frases)
- ingredients: array de ingredientes (liste cada ingrediente como string)
- instructions: array de passos de preparo (cada passo como string)
- tips: dica única e específica para esta variação (máximo 2 frases)
- protein: quantidade aproximada de proteínas em gramas por porção (número decimal)
- carbs: quantidade aproximada de carboidratos em gramas por porção (número decimal)
- calories: quantidade aproximada de calorias por porção (número inteiro)
- servings: quantidade de porções que a receita rende (número inteiro)

IMPORTANTE: Calcule as informações nutricionais de forma realista baseada nos ingredientes.
Seja criativo mas mantenha a essência da receita original. Use linguagem simples e direta.`;

    console.log('Generating variation:', { variationTypes, recipeTitle: recipe.title });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um chef especializado em receitas fitness. Sempre responda APENAS com JSON válido, sem texto adicional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Muitas requisições. Tente novamente em alguns instantes.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'Créditos insuficientes. Contate o administrador.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('Failed to generate variation');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI response:', content);

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const variation = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!variation.title || !variation.ingredients || !variation.instructions) {
      throw new Error('Missing required fields in variation');
    }

    console.log('Variation generated successfully:', variation.title);

    return new Response(
      JSON.stringify({
        ...variation,
        variation_type: variationTypes.join(','),
        prep_time: recipe.prep_time
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error generating variation:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate variation' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});