-- Add nutritional information fields to recipes table
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS protein DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS carbs DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS servings INTEGER DEFAULT 1;

-- Add comment to explain the fields
COMMENT ON COLUMN recipes.protein IS 'Protein content in grams';
COMMENT ON COLUMN recipes.carbs IS 'Carbohydrate content in grams';
COMMENT ON COLUMN recipes.calories IS 'Total calories';
COMMENT ON COLUMN recipes.servings IS 'Number of servings the recipe makes';