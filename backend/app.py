"""OptiCrop Flask REST API — serves the trained model to the frontend."""
from __future__ import annotations

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from predict import predict as run_predict

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGINS", "*").split(",")}})

REQUIRED = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
METRICS_PATH = Path(__file__).parent / "models" / "metrics.json"


@app.get("/")
def health():
    return {"status": "ok", "service": "OptiCrop API"}


@app.post("/predict")
def predict_endpoint():
    payload = request.get_json(silent=True) or {}
    missing = [f for f in REQUIRED if f not in payload]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
    try:
        result = run_predict(payload)
        return jsonify(result)
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:  # noqa: BLE001
        return jsonify({"error": f"Prediction failed: {e}"}), 500


@app.get("/model-info")
def model_info():
    if METRICS_PATH.exists():
        return jsonify(json.loads(METRICS_PATH.read_text()))
    return jsonify({"error": "No metrics — run `python train.py`."}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=False)
