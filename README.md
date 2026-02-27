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
| `/user-metrics` | Métriques Utilisateurs | Répartition par âge, objectifs, progression |
| `/nutrition` | Analyses Nutritionnelles | Apports caloriques, macronutriments, tendances |
| `/fitness` | Statistiques Fitness | Exercices, intensité, progression collective |
| `/kpi` | KPIs Business | Rétention, conversion, MRR, engagement |
| `/data-check` | Validation des données | Contrôle qualité avant insertion en BDD |

## Palette de couleurs (admin)

```
#aedef3 — primary-100 (clair)
#5dbde6 — primary-200
#3280ab — primary-300
#154c70 — primary-400
#0b2638 — primary-500 (foncé)
```

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