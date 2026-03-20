# HealthAI Coach — Frontend Administration

Interface d'administration Angular pour la plateforme **HealthAI Coach**.  
Permet de visualiser les indicateurs clés (métriques utilisateurs, nutrition, fitness, KPIs business) et de valider la qualité des données avant mise en production.

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| Angular | 20 | Framework front-end |
| Angular Material | 20 | Composants UI (sidebar, cards, toolbar) |
| TypeScript | 5.9 | Langage |
| Docker | — | Conteneurisation |

## Structure des pages

| Route | Page | Description |
|---|---|---|
| `/admin/user-metrics` | Métriques Utilisateurs | Répartition par âge, objectifs, progression |
| `/admin/nutrition` | Analyses Nutritionnelles | Apports caloriques, macronutriments, tendances |
| `/admin/fitness` | Statistiques Fitness | Exercices, intensité, progression collective |
| `/admin/kpi` | KPIs Business | Rétention, conversion, MRR, engagement |
| `/admin/data-check` | Validation des données | Contrôle qualité avant insertion en BDD |

## Palette de couleurs (admin)

La palette d'administration utilise désormais une **thématique vert olive** (teintes de vert/gris) définie via les variables SCSS du thème Angular.

Les valeurs de référence (tokens de couleur) sont centralisées dans les fichiers de thème SCSS, par exemple :

- Palette principale : variables `primary` basées sur un vert olive
- Palette accent : variables `accent` en vert plus vif
- Palette d'avertissement : variables `warn` en tons chauds

Pour la liste complète et à jour des couleurs, se référer aux variables définies dans les fichiers SCSS du thème (ex. `src/styles` / fichier de thème Angular).

## Lancement en développement

### Avec Docker (recommandé)

```bash
# Depuis la racine du projet MSPR
docker compose up -d --build frontend
```

L'application est accessible sur **http://localhost:4200**.

### Sans Docker

```bash
cd healthAI-frontend
npm install
ng serve
```

## Grafana (à venir)

Les graphiques actuels sont des **données d'exemple en dur**.  
Ils seront remplacés par des **panels Grafana embarqués en iframe** connectés à la base PostgreSQL via le service `grafana_monitoring` (port 3000).