-- Inserir 8 categorias de receitas
INSERT INTO recipe_categories (name, description, image_url) VALUES
('Doces sem fugir da dieta', 'Sobremesas deliciosas e saudáveis que você pode comer sem culpa', '/src/assets/categories/doces-fit.jpg'),
('Refeições completas pra comer despreocupado', 'Pratos balanceados com proteína, carboidrato e vegetais para suas refeições principais', '/src/assets/categories/refeicoes-completas.jpg'),
('Café da manhã para aguentar o dia', 'Opções nutritivas e energéticas para começar o dia com tudo', '/src/assets/categories/cafe-manha.jpg'),
('Lanches rápidos e saudáveis', 'Petiscos práticos para matar a fome entre as refeições', '/src/assets/categories/lanches-rapidos.jpg'),
('Jantares leves e nutritivos', 'Refeições leves e nutritivas perfeitas para o final do dia', '/src/assets/categories/jantares-leves.jpg'),
('Pratos proteicos pós-treino', 'Refeições ricas em proteína para recuperação muscular', '/src/assets/categories/proteicos.jpg'),
('Saladas criativas e saborosas', 'Saladas coloridas e nutritivas que são verdadeiras refeições', '/src/assets/categories/saladas.jpg'),
('Sobremesas fit irresistíveis', 'Sobremesas saudáveis e deliciosas para matar a vontade de doce', '/src/assets/categories/sobremesas-fit.jpg');

-- Categoria 1: Doces sem fugir da dieta
INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Brownie Proteico', 'Brownie úmido e rico em proteína feito com whey protein', 30,
ARRAY['200g farinha de aveia', '2 scoops whey chocolate', '3 ovos', '100ml leite desnatado', '50g cacau em pó', '80g chocolate 70%', 'Adoçante a gosto'],
ARRAY['Preaqueça o forno a 180°C', 'Misture todos os ingredientes secos', 'Adicione os ovos e o leite', 'Derreta o chocolate e adicione à massa', 'Despeje em forma untada', 'Asse por 25 minutos'],
'Use whey de boa qualidade para melhor sabor. Não asse demais para manter úmido.',
'/src/assets/recipes/brownie-proteico.jpg'
FROM recipe_categories WHERE name = 'Doces sem fugir da dieta';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Muffin de Banana', 'Muffins fofos feitos com farinha de aveia e banana', 25,
ARRAY['3 bananas maduras', '2 ovos', '150g farinha de aveia', '1 colher de sopa fermento', '50ml óleo de coco', 'Canela a gosto'],
ARRAY['Amasse as bananas em um bowl', 'Adicione os ovos e misture', 'Acrescente a farinha e o fermento', 'Adicione o óleo de coco', 'Distribua em forminhas de muffin', 'Asse a 180°C por 20 minutos'],
'Quanto mais maduras as bananas, mais doce ficará.',
'/src/assets/recipes/muffin-banana.jpg'
FROM recipe_categories WHERE name = 'Doces sem fugir da dieta';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Mousse de Chocolate Fit', 'Mousse cremoso e proteico feito com abacate', 10,
ARRAY['2 abacates maduros', '3 colheres de sopa cacau em pó', '100ml leite de coco', 'Adoçante a gosto', 'Raspas de chocolate 70%'],
ARRAY['Bata todos os ingredientes no liquidificador', 'Ajuste a doçura com adoçante', 'Despeje em taças', 'Leve à geladeira por 1 hora', 'Decore com raspas de chocolate'],
'O abacate dá cremosidade sem alterar o sabor do chocolate.',
'/src/assets/recipes/mousse-chocolate.jpg'
FROM recipe_categories WHERE name = 'Doces sem fugir da dieta';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Cookie de Pasta de Amendoim', 'Cookies macios com pedaços de chocolate', 20,
ARRAY['200g pasta de amendoim integral', '1 ovo', '80g farinha de aveia', '50g chocolate 70% picado', 'Adoçante a gosto'],
ARRAY['Misture a pasta de amendoim com o ovo', 'Adicione a farinha e o adoçante', 'Incorpore o chocolate picado', 'Faça bolinhas e achate', 'Asse a 180°C por 12 minutos'],
'Não asse demais para manter a textura macia.',
'/src/assets/recipes/cookie-amendoim.jpg'
FROM recipe_categories WHERE name = 'Doces sem fugir da dieta';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Brigadeiro de Coco', 'Brigadeiro fit com cobertura de coco ralado', 15,
ARRAY['1 lata leite de coco', '2 colheres de sopa cacau em pó', '50g coco ralado', 'Adoçante a gosto'],
ARRAY['Misture o leite de coco com o cacau', 'Leve ao fogo baixo mexendo sempre', 'Adicione o adoçante', 'Cozinhe até desgrudar da panela', 'Deixe esfriar e enrole', 'Passe no coco ralado'],
'Deixe esfriar bem antes de enrolar para melhor consistência.',
'/src/assets/recipes/brigadeiro-coco.jpg'
FROM recipe_categories WHERE name = 'Doces sem fugir da dieta';

-- Categoria 2: Refeições completas
INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Frango Grelhado com Batata Doce', 'Peito de frango suculento com batata doce assada', 40,
ARRAY['2 peitos de frango', '2 batatas doces médias', '200g brócolis', 'Azeite', 'Temperos a gosto'],
ARRAY['Tempere o frango e deixe marinar', 'Corte as batatas em rodelas', 'Grelhe o frango por 6 minutos de cada lado', 'Asse as batatas a 200°C por 30 minutos', 'Cozinhe o brócolis no vapor', 'Monte o prato'],
'Deixe o frango marinando por pelo menos 30 minutos para melhor sabor.',
'/src/assets/recipes/frango-batata-doce.jpg'
FROM recipe_categories WHERE name = 'Refeições completas pra comer despreocupado';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Salmão com Quinoa e Legumes', 'Filé de salmão grelhado sobre quinoa tricolor', 35,
ARRAY['2 filés de salmão', '150g quinoa', '1 abobrinha', '1 cenoura', '1 pimentão', 'Limão', 'Azeite'],
ARRAY['Cozinhe a quinoa conforme embalagem', 'Tempere o salmão com limão e sal', 'Grelhe o salmão por 4 minutos de cada lado', 'Refogue os legumes picados', 'Misture os legumes à quinoa', 'Sirva o salmão sobre a quinoa'],
'Não cozinhe demais o salmão para manter suculento.',
'/src/assets/recipes/salmao-quinoa.jpg'
FROM recipe_categories WHERE name = 'Refeições completas pra comer despreocupado';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Bowl de Carne com Arroz', 'Bowl nutritivo com carne moída e vegetais', 30,
ARRAY['300g carne moída magra', '150g arroz integral', '1 abacate', '1 cenoura', 'Alface', 'Tomate cereja'],
ARRAY['Cozinhe o arroz integral', 'Refogue a carne com temperos', 'Corte os vegetais', 'Monte o bowl com arroz na base', 'Adicione a carne e os vegetais', 'Finalize com abacate fatiado'],
'Use carne magra para refeição mais saudável.',
'/src/assets/recipes/bowl-carne.jpg'
FROM recipe_categories WHERE name = 'Refeições completas pra comer despreocupado';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Macarrão Integral com Frango', 'Massa integral com frango e molho de tomate', 25,
ARRAY['200g macarrão integral', '2 peitos de frango', '400g tomates', '2 dentes alho', 'Manjericão', 'Azeite'],
ARRAY['Cozinhe o macarrão al dente', 'Corte o frango em cubos e tempere', 'Refogue o alho no azeite', 'Adicione os tomates picados', 'Acrescente o frango', 'Misture com o macarrão e manjericão'],
'Não cozinhe demais a massa para manter a textura.',
'/src/assets/recipes/macarrao-frango.jpg'
FROM recipe_categories WHERE name = 'Refeições completas pra comer despreocupado';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Risoto de Camarão Light', 'Risoto cremoso com camarões e aspargos', 40,
ARRAY['300g camarões limpos', '200g arroz arbóreo', '1 maço aspargos', '1 litro caldo de legumes', 'Queijo parmesão', 'Vinho branco'],
ARRAY['Refogue o arroz no azeite', 'Adicione vinho branco', 'Vá adicionando o caldo aos poucos', 'Refogue os camarões separadamente', 'Cozinhe os aspargos', 'Misture tudo e finalize com parmesão'],
'Adicione o caldo gradualmente mexendo sempre.',
'/src/assets/recipes/risoto-camarao.jpg'
FROM recipe_categories WHERE name = 'Refeições completas pra comer despreocupado';

-- Categoria 3: Café da manhã
INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Panqueca Proteica', 'Panquecas fofas ricas em proteína', 15,
ARRAY['2 ovos', '1 banana', '1 scoop whey baunilha', '1 colher fermento', 'Frutas vermelhas', 'Mel'],
ARRAY['Amasse a banana', 'Misture com os ovos', 'Adicione o whey e fermento', 'Aqueça uma frigideira antiaderente', 'Despeje a massa formando discos', 'Vire quando bolhas aparecerem', 'Sirva com frutas e mel'],
'Use fogo baixo para não queimar.',
'/src/assets/recipes/panqueca-proteica.jpg'
FROM recipe_categories WHERE name = 'Café da manhã para aguentar o dia';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Aveia Overnight', 'Aveia deixada de molho durante a noite', 5,
ARRAY['80g aveia em flocos', '200ml leite', '1 colher chia', 'Frutas variadas', 'Mel', 'Castanhas'],
ARRAY['Misture aveia com leite e chia', 'Deixe na geladeira durante a noite', 'Pela manhã adicione as frutas', 'Regue com mel', 'Finalize com castanhas picadas'],
'Prepare na noite anterior para economizar tempo.',
'/src/assets/recipes/aveia-overnight.jpg'
FROM recipe_categories WHERE name = 'Café da manhã para aguentar o dia';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Tapioca Recheada', 'Tapioca crocante recheada com queijo e peito de peru', 10,
ARRAY['4 colheres goma de tapioca', 'Queijo branco', 'Peito de peru', 'Tomate', 'Orégano'],
ARRAY['Aqueça uma frigideira antiaderente', 'Polvilhe a tapioca formando um disco', 'Espere hidratar', 'Adicione queijo e peru', 'Dobre ao meio', 'Deixe dourar'],
'Não deixe muito tempo no fogo para não ressecar.',
'/src/assets/recipes/tapioca-recheada.jpg'
FROM recipe_categories WHERE name = 'Café da manhã para aguentar o dia';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Ovos Mexidos com Vegetais', 'Ovos mexidos cremosos com legumes', 10,
ARRAY['3 ovos', '1 tomate', '1 abobrinha', 'Cebola', 'Pão integral', 'Azeite'],
ARRAY['Pique os vegetais', 'Refogue no azeite', 'Bata os ovos', 'Despeje sobre os vegetais', 'Mexa delicadamente', 'Sirva com pão torrado'],
'Desligue o fogo antes dos ovos ficarem completamente secos.',
'/src/assets/recipes/ovos-mexidos.jpg'
FROM recipe_categories WHERE name = 'Café da manhã para aguentar o dia';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Bowl de Açaí', 'Açaí gelado com granola e frutas', 5,
ARRAY['200g polpa de açaí', '1 banana', 'Granola', 'Morango', 'Mirtilo', 'Mel'],
ARRAY['Bata o açaí com metade da banana', 'Despeje em uma tigela', 'Cubra com granola', 'Adicione as frutas fatiadas', 'Regue com mel'],
'Use açaí sem açúcar para opção mais saudável.',
'/src/assets/recipes/bowl-acai.jpg'
FROM recipe_categories WHERE name = 'Café da manhã para aguentar o dia';

-- Categoria 4: Lanches rápidos
INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Energy Balls', 'Bolinhas energéticas de tâmara e castanhas', 15,
ARRAY['200g tâmaras sem caroço', '100g castanhas variadas', '50g aveia', '2 colheres cacau', 'Coco ralado'],
ARRAY['Processe as tâmaras', 'Adicione as castanhas picadas', 'Misture aveia e cacau', 'Forme bolinhas', 'Passe no coco ralado', 'Leve à geladeira'],
'Guarde na geladeira por até uma semana.',
'/src/assets/recipes/energy-balls.jpg'
FROM recipe_categories WHERE name = 'Lanches rápidos e saudáveis';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Biscoito Integral com Cottage', 'Torradas integrais com queijo cottage', 5,
ARRAY['4 torradas integrais', '150g queijo cottage', 'Tomate cereja', 'Manjericão', 'Azeite'],
ARRAY['Torre o pão integral', 'Espalhe o cottage', 'Corte os tomates ao meio', 'Disponha sobre o cottage', 'Finalize com manjericão e azeite'],
'Use pão 100% integral para mais fibras.',
'/src/assets/recipes/biscoito-cottage.jpg'
FROM recipe_categories WHERE name = 'Lanches rápidos e saudáveis';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Banana com Pasta de Amendoim', 'Banana fatiada com pasta de amendoim', 3,
ARRAY['1 banana', '2 colheres pasta de amendoim integral', 'Chia', 'Canela'],
ARRAY['Corte a banana em rodelas', 'Espalhe a pasta de amendoim', 'Polvilhe chia', 'Finalize com canela'],
'Escolha pasta de amendoim sem açúcar adicionado.',
'/src/assets/recipes/banana-pasta-amendoim.jpg'
FROM recipe_categories WHERE name = 'Lanches rápidos e saudáveis';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Parfait de Iogurte', 'Camadas de iogurte com granola e frutas', 5,
ARRAY['200g iogurte grego', '50g granola', 'Morango', 'Mirtilo', 'Mel'],
ARRAY['Em um copo faça camadas', 'Comece com iogurte', 'Adicione granola', 'Coloque as frutas', 'Repita as camadas', 'Finalize com mel'],
'Use iogurte natural sem açúcar.',
'/src/assets/recipes/parfait-iogurte.jpg'
FROM recipe_categories WHERE name = 'Lanches rápidos e saudáveis';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Chips de Batata Doce', 'Chips crocantes assados no forno', 30,
ARRAY['2 batatas doces', 'Azeite', 'Sal', 'Páprica', 'Alecrim'],
ARRAY['Fatie as batatas bem finas', 'Tempere com azeite e especiarias', 'Disponha em assadeira', 'Asse a 200°C por 20-25 minutos', 'Vire na metade do tempo'],
'Corte bem fino para ficarem crocantes.',
'/src/assets/recipes/chips-batata-doce.jpg'
FROM recipe_categories WHERE name = 'Lanches rápidos e saudáveis';

-- Categoria 5: Jantares leves
INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Tilápia Grelhada com Legumes', 'Peixe leve com vegetais assados', 25,
ARRAY['2 filés de tilápia', '1 abobrinha', '1 berinjela', '1 pimentão', 'Limão', 'Ervas'],
ARRAY['Tempere o peixe com limão', 'Corte os legumes em cubos', 'Tempere os legumes com azeite', 'Asse os legumes a 200°C', 'Grelhe o peixe por 3 minutos cada lado', 'Sirva juntos'],
'Não cozinhe demais o peixe para não ressecar.',
'/src/assets/recipes/tilapia-legumes.jpg'
FROM recipe_categories WHERE name = 'Jantares leves e nutritivos';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Sopa de Legumes', 'Sopa nutritiva e reconfortante', 30,
ARRAY['2 cenouras', '1 abobrinha', '1 batata', '1 tomate', 'Cebola', 'Alho', 'Caldo de legumes'],
ARRAY['Pique todos os legumes', 'Refogue cebola e alho', 'Adicione os legumes', 'Cubra com caldo', 'Cozinhe por 20 minutos', 'Tempere a gosto'],
'Deixe os legumes al dente para mais textura.',
'/src/assets/recipes/sopa-legumes.jpg'
FROM recipe_categories WHERE name = 'Jantares leves e nutritivos';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Salada de Frango', 'Salada completa com frango grelhado', 20,
ARRAY['2 peitos de frango', 'Alface', 'Tomate cereja', 'Cenoura', 'Pepino', 'Azeite', 'Limão'],
ARRAY['Grelhe o frango temperado', 'Lave e corte as folhas', 'Corte os vegetais', 'Fatie o frango', 'Monte a salada', 'Tempere com azeite e limão'],
'Deixe o frango esfriar antes de fatiar.',
'/src/assets/recipes/salada-frango.jpg'
FROM recipe_categories WHERE name = 'Jantares leves e nutritivos';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Arroz de Couve-flor', 'Arroz low carb feito com couve-flor', 15,
ARRAY['1 couve-flor', 'Cebola', 'Alho', 'Cenoura', 'Ervilha', 'Azeite'],
ARRAY['Processe a couve-flor até virar grãos', 'Refogue cebola e alho', 'Adicione cenoura e ervilha', 'Acrescente a couve-flor', 'Refogue por 5 minutos', 'Tempere a gosto'],
'Não cozinhe demais para não ficar mole.',
'/src/assets/recipes/arroz-couve-flor.jpg'
FROM recipe_categories WHERE name = 'Jantares leves e nutritivos';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Peito de Peru com Aspargos', 'Prato leve e sofisticado', 25,
ARRAY['300g peito de peru', '1 maço aspargos', 'Cogumelos', 'Alho', 'Vinho branco', 'Azeite'],
ARRAY['Tempere o peru', 'Corte os aspargos', 'Fatie os cogumelos', 'Sele o peru na frigideira', 'Asse a 180°C por 15 minutos', 'Refogue os legumes', 'Sirva junto'],
'Deixe a carne descansar antes de fatiar.',
'/src/assets/recipes/peru-aspargos.jpg'
FROM recipe_categories WHERE name = 'Jantares leves e nutritivos';

-- Categoria 6: Pratos proteicos
INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Bife com Brócolis e Arroz', 'Carne magra com acompanhamentos nutritivos', 30,
ARRAY['300g bife magro', '200g brócolis', '150g arroz integral', 'Alho', 'Limão'],
ARRAY['Cozinhe o arroz integral', 'Tempere a carne com alho e limão', 'Grelhe o bife por 3 minutos cada lado', 'Cozinhe o brócolis no vapor', 'Monte o prato'],
'Use corte magro de carne para mais proteína.',
'/src/assets/recipes/bife-brocolis.jpg'
FROM recipe_categories WHERE name = 'Pratos proteicos pós-treino';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Salada de Atum', 'Salada rica em proteína com atum', 10,
ARRAY['2 latas atum em água', 'Alface', '2 ovos cozidos', 'Tomate', 'Cebola roxa', 'Azeite'],
ARRAY['Escorra o atum', 'Cozinhe os ovos', 'Corte os vegetais', 'Monte a salada', 'Adicione o atum', 'Tempere com azeite'],
'Escolha atum em água, não em óleo.',
'/src/assets/recipes/salada-atum.jpg'
FROM recipe_categories WHERE name = 'Pratos proteicos pós-treino';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Wrap de Frango Proteico', 'Wrap integral recheado com frango', 15,
ARRAY['2 tortilhas integrais', '2 peitos de frango', 'Alface', 'Tomate', 'Queijo cottage', 'Mostarda'],
ARRAY['Grelhe o frango temperado', 'Fatie o frango', 'Espalhe cottage na tortilha', 'Adicione alface e tomate', 'Coloque o frango', 'Enrole bem apertado'],
'Aqueça a tortilha antes de enrolar.',
'/src/assets/recipes/wrap-frango.jpg'
FROM recipe_categories WHERE name = 'Pratos proteicos pós-treino';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Bowl de Cottage com Frutas', 'Refeição proteica e refrescante', 5,
ARRAY['300g queijo cottage', 'Morango', 'Mirtilo', 'Kiwi', 'Mel', 'Granola'],
ARRAY['Coloque o cottage em uma tigela', 'Corte as frutas', 'Disponha sobre o cottage', 'Adicione granola', 'Regue com mel'],
'Use cottage sem gordura para versão mais leve.',
'/src/assets/recipes/bowl-cottage.jpg'
FROM recipe_categories WHERE name = 'Pratos proteicos pós-treino';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Frango ao Pesto', 'Peito de frango com molho pesto caseiro', 25,
ARRAY['2 peitos de frango', 'Manjericão fresco', 'Alho', '50g parmesão', 'Castanhas', 'Azeite', 'Legumes grelhados'],
ARRAY['Bata o pesto no liquidificador', 'Tempere e grelhe o frango', 'Grelhe os legumes', 'Fatie o frango', 'Regue com o pesto', 'Sirva com legumes'],
'Faça o pesto fresco para melhor sabor.',
'/src/assets/recipes/frango-pesto.jpg'
FROM recipe_categories WHERE name = 'Pratos proteicos pós-treino';

-- Categoria 7: Saladas
INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Salada Caesar com Frango', 'Clássica salada caesar com frango grelhado', 20,
ARRAY['2 peitos de frango', 'Alface romana', '50g parmesão', 'Croutons', 'Molho caesar light', 'Limão'],
ARRAY['Grelhe o frango temperado', 'Lave e rasgue a alface', 'Fatie o frango', 'Monte a salada', 'Adicione parmesão ralado', 'Regue com molho caesar', 'Finalize com croutons'],
'Use molho caesar light para menos calorias.',
'/src/assets/recipes/salada-caesar.jpg'
FROM recipe_categories WHERE name = 'Saladas criativas e saborosas';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Salada de Quinoa', 'Salada nutritiva com quinoa e grão de bico', 25,
ARRAY['150g quinoa', '1 lata grão de bico', 'Tomate', 'Pepino', 'Cebola roxa', 'Salsinha', 'Limão', 'Azeite'],
ARRAY['Cozinhe a quinoa', 'Escorra o grão de bico', 'Pique os vegetais', 'Misture tudo em uma tigela', 'Tempere com limão e azeite', 'Adicione salsinha picada'],
'Deixe esfriar a quinoa antes de misturar.',
'/src/assets/recipes/salada-quinoa.jpg'
FROM recipe_categories WHERE name = 'Saladas criativas e saborosas';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Salada Grega', 'Salada mediterrânea com queijo feta', 10,
ARRAY['Tomate', 'Pepino', 'Cebola roxa', 'Azeitonas pretas', '100g queijo feta', 'Orégano', 'Azeite'],
ARRAY['Corte os tomates em cubos', 'Corte o pepino', 'Fatie a cebola finamente', 'Misture todos os ingredientes', 'Adicione as azeitonas', 'Cubra com queijo feta', 'Tempere com orégano e azeite'],
'Use tomates bem maduros para mais sabor.',
'/src/assets/recipes/salada-grega.jpg'
FROM recipe_categories WHERE name = 'Saladas criativas e saborosas';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Salada Caprese', 'Salada italiana com mussarela de búfala', 8,
ARRAY['2 tomates grandes', '200g mussarela de búfala', 'Manjericão fresco', 'Azeite extra virgem', 'Aceto balsâmico'],
ARRAY['Fatie os tomates', 'Fatie a mussarela', 'Intercale tomate e queijo', 'Adicione folhas de manjericão', 'Regue com azeite', 'Finalize com aceto'],
'Use ingredientes de qualidade nessa receita simples.',
'/src/assets/recipes/salada-caprese.jpg'
FROM recipe_categories WHERE name = 'Saladas criativas e saborosas';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Salada de Espinafre com Morango', 'Salada gourmet com combinação agridoce', 12,
ARRAY['Espinafre fresco', 'Morangos', 'Nozes', '50g queijo gorgonzola', 'Mel', 'Azeite', 'Limão'],
ARRAY['Lave o espinafre', 'Corte os morangos', 'Torre as nozes', 'Monte a salada', 'Esfarele o gorgonzola por cima', 'Misture mel com limão e azeite', 'Regue sobre a salada'],
'A combinação doce do morango com gorgonzola é perfeita.',
'/src/assets/recipes/salada-espinafre.jpg'
FROM recipe_categories WHERE name = 'Saladas criativas e saborosas';

-- Categoria 8: Sobremesas fit
INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Iogurte Grego Congelado', 'Frozen yogurt caseiro e saudável', 5,
ARRAY['400g iogurte grego', 'Frutas vermelhas', 'Mel', 'Baunilha'],
ARRAY['Misture o iogurte com mel', 'Adicione baunilha', 'Bata as frutas vermelhas', 'Misture delicadamente', 'Despeje em forma', 'Congele por 4 horas', 'Sirva em taças'],
'Mexa a cada hora nas primeiras 3 horas para textura cremosa.',
'/src/assets/recipes/iogurte-congelado.jpg'
FROM recipe_categories WHERE name = 'Sobremesas fit irresistíveis';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Nice Cream de Banana', 'Sorvete vegano de banana', 5,
ARRAY['4 bananas congeladas', 'Cacau em pó', 'Pasta de amendoim', 'Chocolate 70% picado'],
ARRAY['Congele as bananas cortadas', 'Bata no processador até ficar cremoso', 'Adicione cacau e pasta de amendoim', 'Misture o chocolate picado', 'Sirva imediatamente'],
'Use bananas bem maduras para mais doçura natural.',
'/src/assets/recipes/nice-cream.jpg'
FROM recipe_categories WHERE name = 'Sobremesas fit irresistíveis';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Cheesecake Proteico', 'Cheesecake fit com base de aveia', 30,
ARRAY['Base: 100g aveia', '50g tâmaras', 'Recheio: 300g cream cheese light', '2 ovos', '1 scoop whey baunilha', 'Adoçante', 'Morangos'],
ARRAY['Processe aveia com tâmaras para a base', 'Forre uma forma', 'Bata o cream cheese com ovos', 'Adicione o whey', 'Despeje sobre a base', 'Asse a 160°C por 25 minutos', 'Decore com morangos'],
'Deixe esfriar completamente antes de desenformar.',
'/src/assets/recipes/cheesecake-proteico.jpg'
FROM recipe_categories WHERE name = 'Sobremesas fit irresistíveis';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Pudim de Chocolate Proteico', 'Pudim cremoso rico em proteína', 10,
ARRAY['200ml leite desnatado', '1 scoop whey chocolate', '1 colher amido de milho', 'Adoçante', 'Chantilly light'],
ARRAY['Misture todos os ingredientes', 'Leve ao fogo baixo', 'Mexa até engrossar', 'Despeje em taças', 'Leve à geladeira por 2 horas', 'Sirva com chantilly'],
'Mexa sempre para não empelotar.',
'/src/assets/recipes/pudim-proteico.jpg'
FROM recipe_categories WHERE name = 'Sobremesas fit irresistíveis';

INSERT INTO recipes (category_id, title, description, prep_time, ingredients, instructions, tips, image_url)
SELECT id, 'Pudim de Chia com Manga', 'Pudim nutritivo de chia', 10,
ARRAY['4 colheres de sopa chia', '200ml leite de coco', '1 manga', 'Mel', 'Coco ralado'],
ARRAY['Misture a chia com leite de coco', 'Adoce com mel', 'Deixe na geladeira por 4 horas', 'Corte a manga em cubos', 'Monte em potes alternando camadas', 'Finalize com coco ralado'],
'Deixe hidratar bem a chia antes de servir.',
'/src/assets/recipes/pudim-chia.jpg'
FROM recipe_categories WHERE name = 'Sobremesas fit irresistíveis';