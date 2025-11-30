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
    const { recipe, variationType } = await req.json();
    
    if (!recipe || !variationType) {
      return new Response(
        JSON.stringify({ error: 'Recipe and variation type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create prompt based on variation type
    const variationPrompts = {
      'low-carb': 'Adapte esta receita para ser low carb (baixo carboidrato). Substitua ingredientes ricos em carboidratos por alternativas low carb.',
      'vegana': 'Transforme esta receita em uma versão vegana. Substitua todos os ingredientes de origem animal por alternativas veganas.',
      'pre-treino': 'Adapte esta receita para ser ideal como refeição pré-treino, com mais carboidratos complexos e proteína moderada.',
      'pos-treino': 'Transforme esta receita em uma refeição pós-treino perfeita, rica em proteínas e carboidratos para recuperação muscular.',
      'zero-acucar': 'Adapte esta receita para ser zero açúcar. Substitua todos os açúcares por adoçantes naturais ou elimine quando possível.',
      'proteica': 'Crie uma versão mais proteica desta receita, aumentando significativamente o conteúdo de proteínas.'
    };

    const prompt = `${variationPrompts[variationType as keyof typeof variationPrompts]}

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

    console.log('Generating variation:', { variationType, recipeTitle: recipe.title });

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
        variation_type: variationType,
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