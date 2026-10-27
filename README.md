# Nutrient Tracker

A web app that turns a plain-English description of a meal — *"a whole grain bread with peanut butter jam"* — into tracked nutritional data, measures it against a daily goal calculated from your body metrics, and suggests recipes to fill the gap.

Built in four days for the Monash DeepNeuron On-Hit application (Stage 2).

![The tracker with a day's meals logged](screenshot-02-tracker.png)

## The problem

Existing calorie trackers only recognise standard, pre-indexed meals. If you cook for yourself, portions and ingredients vary, so the numbers you get back carry enough doubt to be useless. The reverse problem is just as awkward: once you know you're 40g of protein short for the day, working out what to actually cook is its own chore.

This app attacks both ends — freeform natural-language input so arbitrary meals can be logged, and goal-aware recipe suggestions so the remaining gap is actionable.

## Features

**Nutrient measurement** — Free-text meal input parsed into structured nutrition data (calories, protein, carbs, fats) via the Nutritionix natural-language endpoint, with a confirmation step before anything is persisted.

**Nutrient tracking** — Meals grouped into breakfast/lunch/dinner by timestamp, accumulated against a daily target. Targets are derived from the Mifflin-St Jeor equation using gender, weight, height, age and activity level, then adjusted by a ±500 kcal goal offset and split into macronutrient ratios (35/45/20 for weight gain, 30/45/25 for weight loss). A per-day history shows which targets were met.

**Nutrient suggestion** — Queries Spoonacular for recipes matching the macronutrient shortfall remaining in the day, which can be logged back as a meal in one click.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Angular 19 | Strongest familiarity, so the four-day budget went to features rather than learning a framework |
| Backend | Node.js + Express | Minimal ceremony for what is mostly API orchestration and CRUD |
| Database | MongoDB + Mongoose | Meals and days are self-contained documents with no relational joins worth modelling; Mongoose schemas still enforce structure |
| External | Nutritionix, Spoonacular | Nutritionix for freeform language parsing; Spoonacular for nutrient-targeted recipe search |

A web app rather than a desktop or CLI tool, primarily so reviewers could use it with no local setup — and because Express makes outbound API calls and database access cheap to wire together.

The full reasoning, including the day-by-day milestone log and the decisions that were reversed, is in [Design Rationale.md](Design%20Rationale.md).

## Architecture

```
backend/
  App.js              Express entry point, static hosting of the built frontend
  router/             Endpoint definitions, split by concern
  controllers/        Request handling, nutrition maths, external API calls
  model/              Mongoose schemas: User, Meal, Day
frontend/
  src/app/            Angular application
```

Routes and controllers are split along the two things the app actually does: database operations (`/api/database`) and external API operations (`/api/external-api`). The `Day` model was not in the original design — it was added once the history feature made it clear that per-day state needed somewhere to live that wasn't the user document.

## Running locally

### With Docker (recommended)

Brings up the app and MongoDB together — no local MongoDB install needed.

```bash
cp .env.example .env     # add your Nutritionix and Spoonacular keys
docker compose up --build
```

Open `http://localhost:3100`. Set `PORT` in `.env` to use a different port.

### Without Docker

Requires Node.js 18+ and a running MongoDB instance (local, or an Atlas connection string).

```bash
cp .env.example backend/.env    # add your keys and MONGODB_URI

cd frontend && npm install && npm run build
cd ../backend && npm install && npm start
```

Open `http://localhost:8080`.

For frontend development with hot reload, run `npm start` in `frontend/` instead and it will serve on `http://localhost:4200`.

API keys are free-tier from [Nutritionix](https://www.nutritionix.com/business/api) and [Spoonacular](https://spoonacular.com/food-api).

## Known limitations

Being honest about what this does and doesn't do:

- **Single user.** There is no authentication, and queries resolve the user with an unfiltered `findOne()`. Supporting multiple users would mean adding auth and scoping every query by user ID.
- **Day advancement is manual.** A "next day" button rolls the tracker over rather than a scheduled job.
- **Suggestions are macro-driven only.** Spoonacular is queried on protein/carb/fat targets with no cuisine or dietary filtering.
- **No request validation.** Request bodies are trusted and passed straight into the Mongoose models.
- **Test coverage is minimal.** The spec files are still CLI scaffolding; the nutrition calculations are the obvious first thing to cover.

## Attribution

Freeform meal parsing by [Nutritionix](https://www.nutritionix.com/business/api). Recipe suggestions by [Spoonacular](https://spoonacular.com/food-api).
