-- Corrigir caminhos das imagens das categorias (remover /src do início)
UPDATE recipe_categories 
SET image_url = REPLACE(image_url, '/src/assets/', '/assets/')
WHERE image_url LIKE '/src/assets/%';

-- Corrigir caminhos das imagens das receitas (remover /src do início)
UPDATE recipes 
SET image_url = REPLACE(image_url, '/src/assets/', '/assets/')
WHERE image_url LIKE '/src/assets/%';