"""Post-training evaluation: prints metrics and writes plots to models/plots/."""
from __future__ import annotations

import json
from pathlib import Path

import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import ConfusionMatrixDisplay, confusion_matrix
from sklearn.model_selection import train_test_split

from train import DATA_PATH, FEATURES, TARGET, MODELS_DIR

PLOTS = MODELS_DIR / "plots"
PLOTS.mkdir(parents=True, exist_ok=True)


def main() -> None:
    bundle = joblib.load(MODELS_DIR / "model.pkl")
    model, scaler, labels = bundle["model"], bundle["scaler"], bundle["labels"]
    df = pd.read_csv(DATA_PATH).dropna()

    # Correlation heatmap
    plt.figure(figsize=(8, 6))
    sns.heatmap(df[FEATURES].corr(), annot=True, cmap="Greens")
    plt.title("Feature correlation")
    plt.tight_layout()
    plt.savefig(PLOTS / "correlation_heatmap.png", dpi=150)
    plt.close()

    # Accuracy comparison
    metrics = json.loads((MODELS_DIR / "metrics.json").read_text())
    names = list(metrics["results"].keys())
    accs = [metrics["results"][n]["accuracy"] for n in names]
    plt.figure(figsize=(8, 4))
    sns.barplot(x=names, y=accs, palette="Greens_d")
    plt.ylabel("Accuracy")
    plt.title("Model accuracy comparison")
    plt.xticks(rotation=20)
    plt.tight_layout()
    plt.savefig(PLOTS / "accuracy_comparison.png", dpi=150)
    plt.close()

    # Feature importance (Random Forest / Decision Tree only)
    if hasattr(model, "feature_importances_"):
        plt.figure(figsize=(7, 4))
        sns.barplot(x=FEATURES, y=model.feature_importances_, palette="Greens_d")
        plt.title(f"Feature importance — {bundle['name']}")
        plt.tight_layout()
        plt.savefig(PLOTS / "feature_importance.png", dpi=150)
        plt.close()

    # Confusion matrix
    X = df[FEATURES].values
    y = df[TARGET].values
    _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    preds = model.predict(scaler.transform(X_test))
    cm = confusion_matrix(y_test, preds, labels=labels)
    fig, ax = plt.subplots(figsize=(10, 9))
    ConfusionMatrixDisplay(cm, display_labels=labels).plot(ax=ax, xticks_rotation=90, cmap="Greens")
    plt.title("Confusion matrix")
    plt.tight_layout()
    plt.savefig(PLOTS / "confusion_matrix.png", dpi=150)
    plt.close()

    # Prediction distribution
    plt.figure(figsize=(9, 4))
    sns.countplot(x=preds, order=labels, palette="Greens_d")
    plt.xticks(rotation=90)
    plt.title("Predicted crop distribution (test set)")
    plt.tight_layout()
    plt.savefig(PLOTS / "prediction_distribution.png", dpi=150)
    plt.close()

    print(f"Plots written to {PLOTS}")


if __name__ == "__main__":
    main()
