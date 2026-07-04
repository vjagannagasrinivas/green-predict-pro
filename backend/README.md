# OptiCrop — Python ML backend

Flask REST API serving a scikit-learn crop-recommendation model. The frontend
in this repo will call it whenever `VITE_ML_API_URL` is set; otherwise it uses
an on-device fallback classifier so the UI stays fully functional.

## Layout

```
backend/
├── app.py              # Flask REST API (POST /predict, GET /model-info)
├── train.py            # Training pipeline (KNN, LR, DT, RF, NB, SVM)
├── predict.py          # Reusable inference helper
├── evaluation.py       # Plots: heatmap, feature importance, confusion matrix
├── requirements.txt
├── Dockerfile
├── .env.example
├── dataset/            # Drop Crop_recommendation.csv here
└── models/             # model.pkl, metrics.json, plots/  (generated)
```

## 1. Install

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## 2. Data

Download the [Crop Recommendation dataset](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset)
and place `Crop_recommendation.csv` in `backend/dataset/`.

## 3. Train

```bash
python train.py
```

Trains six classifiers, prints accuracy for each, saves the best one as
`models/model.pkl`, and writes per-model metrics to `models/metrics.json`.

## 4. Evaluate

```bash
python evaluation.py
```

Produces `models/plots/` with correlation heatmap, feature importance, model
accuracy comparison, confusion matrix and prediction distribution.

## 5. Serve

```bash
python app.py               # dev
# or
gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

## 6. Point the frontend at it

Add to the project root `.env`:

```
VITE_ML_API_URL=http://localhost:5000
```

Restart the Vite dev server. The result card will now show
`Model source: Flask + scikit-learn API`.

## Docker

```bash
docker build -t opticrop-api ./backend
docker run --rm -p 5000:5000 opticrop-api
```
