-- Drop the existing unique constraint that prevents multiple variations per recipe
ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_recipe_id_key;

-- Create a new unique constraint that allows multiple variations per recipe
-- Using a partial unique index approach: original recipes are unique by (user_id, recipe_id, is_variation=false)
-- Variations use the unique_id stored in variation_data to differentiate
CREATE UNIQUE INDEX favorites_user_recipe_original_idx ON public.favorites (user_id, recipe_id) 
WHERE (is_variation IS NULL OR is_variation = false);
