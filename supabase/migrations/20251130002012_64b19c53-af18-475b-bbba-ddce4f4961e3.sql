-- Add variation_data column to favorites table to store variation details when favorited
ALTER TABLE favorites 
ADD COLUMN variation_data JSONB;

-- Add comment to explain the structure
COMMENT ON COLUMN favorites.variation_data IS 'Stores the AI-generated variation data (title, ingredients, instructions, tips, variation_type) when user favorites a variation. Only populated when is_variation is true.';