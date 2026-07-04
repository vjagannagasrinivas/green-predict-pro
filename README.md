# OptiCrop — Smart Agricultural Production Optimization Engine

OptiCrop recommends the most suitable crop for a farm plot from **7 soil &
climate signals** (N, P, K, temperature, humidity, pH, rainfall) using a
scikit-learn classifier trained on the public Crop Recommendation dataset.

This repo ships two independently-deployable parts:

| Part | Stack | Location |
| --- | --- | --- |
| **Web app** — landing, auth, recommendation UI | React 19 + TypeScript + TanStack Start + Tailwind v4 + shadcn/ui + Lovable Cloud (Supabase) auth | root of the repo |
| **ML backend** — training + Flask REST API | Python 3.12, scikit-learn, pandas, numpy, matplotlib, seaborn | `backend/` |

The frontend calls the Flask API when `VITE_ML_API_URL` is set. Without it,
the UI stays fully functional through an on-device fallback classifier that
mirrors the same 22-crop dataset — so you can demo the full flow immediately.

## Screens shipping in v1

- Landing page — hero, features, how-it-works, CTA
- Email/password authentication (Lovable Cloud)
- Crop recommendation form + result card (crop, confidence, season, soil,
  water/fertilizer plan, growing tips, expected yield, runner-ups)

Future-ready modules (disease detection, market prices, weather API, IoT,
multi-language) are called out in the roadmap section of the site footer.

## Run the web app

```bash
bun install
bun run dev
```

Open the URL Vite prints. Sign up with any email + password.

Optional — point at the real ML API:

```bash
echo "VITE_ML_API_URL=http://localhost:5000" >> .env
```

## Run the ML backend

See [`backend/README.md`](./backend/README.md) for the full pipeline
(dataset, training, evaluation, Docker).

## Deployment notes

- **Web app** — deploy from Lovable, or `bun run build` to any Node/Edge host.
  Lovable Cloud (auth + database) is already wired via `.env`.
- **ML API** — `docker build -t opticrop-api ./backend && docker run -p 5000:5000 opticrop-api`,
  then set `VITE_ML_API_URL` on the frontend host to the API's public URL.

## Roadmap

Crop disease detection · leaf image upload · live weather API · market price
& yield prediction · fertilizer / irrigation AI · IoT & satellite integration ·
farmer chatbot · voice assistant · multi-language.
