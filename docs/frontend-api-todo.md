# Frontend API TODO

Ce document liste les routes actuellement manquantes ou desynchronisees entre le frontend et le backend, ainsi que les actions a faire ensuite cote front.

## Resume

En l etat, le frontend consomme surtout des routes sous `/api/data/*`, alors que le backend expose des routes metier sous :
- `/api/recipes`
- `/api/ingredients`
- `/api/sport-programs`
- `/api/sport-sessions`
- `/api/sport-exercises`
- `/api/sport-equipment`

Pour eviter les pages vides, des donnees d exemple temporaires sont maintenant injectees cote front quand ces routes echouent.

## Routes a corriger

## POST /api/users/login

Etat : route non exposee dans le backend actuel.

Impact front :
- Login page
- AuthService

Ce qu il faut faire ensuite cote front :
- Garder une gestion d erreur claire tant que la route n existe pas.
- Quand la route backend sera disponible, verifier le format de reponse exact du user connecte.
- Ajouter un vrai typage `AuthenticatedUser` dans le front.

## GET /api/data/recipes

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/recipes

Impact front :
- Recipes page
- Admin manage recipes tab

Ce qu il faut faire ensuite cote front :
- Remplacer l appel vers `/api/data/recipes` par `/api/recipes`.
- Ajouter une couche de mapping DTO si le backend change le format plus tard.
- Supprimer le fallback demo une fois la route validee.

## GET /api/data/recipes/:id

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/recipes/:id

Impact front :
- Recipe detail page

Ce qu il faut faire ensuite cote front :
- Pointer vers `/api/recipes/:id`.
- Verifier si la reponse contient bien les ingredients associes.
- Si la reponse ne contient que la recette simple, prevoir un agregat front ou une route backend enrichie.

## GET /api/data/food

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/ingredients

Impact front :
- Ingredients page
- Admin manage ingredients tab

Point important :
- Le composant Ingredients attend actuellement des champs `food_*`.
- Le backend semble plutot retourner des champs `ingredient_*`.

Ce qu il faut faire ensuite cote front :
- Remplacer l appel par `/api/ingredients`.
- Corriger le mapping du composant Ingredients pour lire `ingredient_name`, `ingredient_energy_100g`, `ingredient_protein_100g`, `ingredient_carbohydrate_100g`, `ingredient_fats_100g`.
- Centraliser cette transformation dans un mapper front dedie.

## GET /api/data/exercises

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/sport-exercises

Impact front :
- Exercises page
- Admin manage exercises tab

Point important :
- Le composant Exercises attend actuellement `exercise_name`, `exercise_target_muscles`, `exercise_instructions`.
- Le backend semble plutot retourner `sport_exercise_name`, `sport_exercise_muscle_group`, `sport_exercise_instruction`.

Ce qu il faut faire ensuite cote front :
- Remplacer l appel par `/api/sport-exercises`.
- Corriger le mapping de donnees dans la page Exercises.
- Ajouter des interfaces TypeScript `SportExerciseDto` et `ExerciseCardViewModel`.

## GET /api/data/programs

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/sport-programs

Impact front :
- Sport programs page
- Admin manage programs tab

Ce qu il faut faire ensuite cote front :
- Remplacer l appel par `/api/sport-programs`.
- Verifier le niveau de detail renvoye dans la liste.
- Conserver un mapper front pour transformer les enums backend en labels UI.

## GET /api/data/programs/:id

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/sport-programs/:id

Impact front :
- Program detail page

Ce qu il faut faire ensuite cote front :
- Remplacer l appel par `/api/sport-programs/:id`.
- Verifier si la route detail renvoie aussi les sessions du programme.
- Si non, prevoir soit une seconde requete front, soit une route detail enrichie cote backend.

## GET /api/data/sessions

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/sport-sessions

Impact front :
- Sport sessions page
- Admin manage sessions tab

Ce qu il faut faire ensuite cote front :
- Remplacer l appel par `/api/sport-sessions`.
- Completer le mapping si la liste ne retourne pas encore la duree, les calories ou le programme.
- Definir les champs optionnels en front au lieu de supposer qu ils existent.

## GET /api/data/sessions/:id

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/sport-sessions/:id

Impact front :
- Session detail page

Ce qu il faut faire ensuite cote front :
- Remplacer l appel par `/api/sport-sessions/:id`.
- Verifier si les exercices et le materiel associe sont inclus.
- Si la route detail est minimale, construire un resolver front ou demander une route detail enrichie.

## GET /api/data/equipment

Etat : route consommee par le front mais non exposee sous cette forme.

Equivalent backend actuel :
- GET /api/sport-equipment

Impact front :
- Equipment page
- Admin manage equipment tab

Point important :
- La page Equipment lit `equipment_name` alors que le backend semble plutot renvoyer `sport_equipment_name`.

Ce qu il faut faire ensuite cote front :
- Remplacer l appel par `/api/sport-equipment`.
- Corriger le mapping front pour gerer `sport_equipment_name`.
- Ajouter une interface TypeScript dediee au DTO equipment.

## POST /api/data/:entity

Etat : route generique non exposee dans le backend.

Impact front :
- Admin manage create flow potentiel

Ce qu il faut faire ensuite cote front :
- Remplacer la logique generique par une table de mapping explicite par entite.
- Exemple : `recipes -> /api/recipes`, `programs -> /api/sport-programs`.
- Ajouter une fonction `resolveEntityEndpoint(entity)` au lieu de concatener `/data/${entity}`.

## PUT /api/data/:entity/:id

Etat : route generique non exposee dans le backend.

Impact front :
- Admin manage edit flow

Ce qu il faut faire ensuite cote front :
- Remplacer la logique generique par un mapping par entite.
- Gerer les payloads differents selon la ressource.
- Ajouter des formulaires ou adaptateurs de payload si necessaire.

## DELETE /api/data/:entity/:id

Etat : route generique non exposee dans le backend.

Impact front :
- Admin manage delete flow

Ce qu il faut faire ensuite cote front :
- Remplacer la logique generique par un mapping par entite.
- Afficher un message d erreur plus explicite si la suppression n est pas supportee.

## Ce qui a ete fait temporairement

Le frontend utilise maintenant des donnees d exemple temporaires quand les routes ci-dessus echouent.

Fichiers concernes :
- `src/app/services/api-fallback.data.ts`
- `src/app/services/api.service.ts`

## Priorites conseillees cote front

1. Remplacer tous les appels `/api/data/*` par les vraies routes backend exposees.
2. Ajouter des interfaces DTO TypeScript pour chaque ressource backend.
3. Ajouter des mappers front pour convertir les DTO backend en modeles UI.
4. Corriger les cas de desynchronisation de noms de champs : ingredients, exercises, equipment.
5. Remplacer l admin CRUD generique par un mapping explicite par entite.
6. Supprimer les fallbacks demo une fois chaque route validee une par une.
