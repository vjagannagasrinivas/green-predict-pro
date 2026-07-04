"""Load model.pkl and expose a ``predict`` helper used by the Flask API."""
from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import numpy as np

MODEL_PATH = Path(__file__).parent / "models" / "model.pkl"

_bundle: dict[str, Any] | None = None


def _load() -> dict[str, Any]:
    global _bundle
    if _bundle is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"{MODEL_PATH} not found. Run `python train.py` first."
            )
        _bundle = joblib.load(MODEL_PATH)
    return _bundle


def predict(payload: dict[str, float]) -> dict[str, Any]:
    bundle = _load()
    model, scaler, features, labels = (
        bundle["model"],
        bundle["scaler"],
        bundle["features"],
        bundle["labels"],
    )
    row = np.array([[float(payload[f]) for f in features]])
    row_s = scaler.transform(row)
    pred = model.predict(row_s)[0]

    runners: list[dict[str, float]] = []
    confidence = 1.0
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(row_s)[0]
        pairs = sorted(zip(labels, proba), key=lambda p: p[1], reverse=True)
        confidence = float(pairs[0][1])
        runners = [{"crop": c, "confidence": float(p)} for c, p in pairs[1:4]]

    return {
        "crop": str(pred),
        "confidence": confidence,
        "runnerUps": runners,
        "model": bundle.get("name", "unknown"),
    }
