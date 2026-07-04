"""
OptiCrop — model training pipeline.

Trains KNN, Logistic Regression, Decision Tree, Random Forest, Gaussian Naive
Bayes and SVM on the Crop Recommendation dataset, picks the model with the
highest test-set accuracy and saves it (together with the fitted StandardScaler
and the label list) to ``models/model.pkl``.

Dataset:
    https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset
Place ``Crop_recommendation.csv`` under ``dataset/`` before running.

Usage:
    python train.py
"""
from __future__ import annotations

import json
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

ROOT = Path(__file__).parent
DATA_PATH = ROOT / "dataset" / "Crop_recommendation.csv"
MODELS_DIR = ROOT / "models"
METRICS_PATH = MODELS_DIR / "metrics.json"

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET = "label"


def load_dataset() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at {DATA_PATH}. Download the Kaggle "
            "'Crop Recommendation' dataset and drop Crop_recommendation.csv there."
        )
    df = pd.read_csv(DATA_PATH)
    df = df.dropna()
    return df


def build_models() -> dict:
    return {
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "LogisticRegression": LogisticRegression(max_iter=1000, multi_class="auto"),
        "DecisionTree": DecisionTreeClassifier(random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=200, random_state=42),
        "GaussianNB": GaussianNB(),
        "SVM": SVC(kernel="rbf", probability=True, random_state=42),
    }


def main() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    df = load_dataset()
    X = df[FEATURES].values
    y = df[TARGET].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler().fit(X_train)
    X_train_s = scaler.transform(X_train)
    X_test_s = scaler.transform(X_test)

    results = {}
    best_name, best_model, best_acc = None, None, -1.0
    for name, model in build_models().items():
        model.fit(X_train_s, y_train)
        preds = model.predict(X_test_s)
        acc = accuracy_score(y_test, preds)
        results[name] = {
            "accuracy": acc,
            "precision": precision_score(y_test, preds, average="weighted", zero_division=0),
            "recall": recall_score(y_test, preds, average="weighted", zero_division=0),
            "f1": f1_score(y_test, preds, average="weighted", zero_division=0),
        }
        print(f"{name:>20s}  acc={acc:.4f}")
        if acc > best_acc:
            best_name, best_model, best_acc = name, model, acc

    assert best_model is not None
    print(f"\nBest model: {best_name} (acc={best_acc:.4f})")
    print("\nClassification report:\n", classification_report(y_test, best_model.predict(X_test_s)))
    print("Confusion matrix:\n", confusion_matrix(y_test, best_model.predict(X_test_s)))

    labels = sorted(np.unique(y).tolist())
    joblib.dump(
        {"model": best_model, "scaler": scaler, "labels": labels, "name": best_name, "features": FEATURES},
        MODELS_DIR / "model.pkl",
    )
    METRICS_PATH.write_text(json.dumps({"best": best_name, "results": results}, indent=2))
    print(f"\nSaved → {MODELS_DIR / 'model.pkl'}")


if __name__ == "__main__":
    main()
