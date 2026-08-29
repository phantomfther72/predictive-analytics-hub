"""Predictive Pulse chronological benchmark runner.

Usage:
  python run_benchmark.py --data data.csv --target close --date date --output results
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


def add_features(df: pd.DataFrame, target: str) -> pd.DataFrame:
    out = df.copy()
    numeric = out.select_dtypes(include=[np.number]).columns.tolist()
    for col in numeric:
        for lag in (1, 2, 3, 5, 10):
            out[f"{col}_lag_{lag}"] = out[col].shift(lag)
        for window in (5, 10, 20):
            out[f"{col}_rollmean_{window}"] = out[col].shift(1).rolling(window).mean()
            out[f"{col}_rollstd_{window}"] = out[col].shift(1).rolling(window).std()
    return out


def metrics(y_true, y_pred, previous):
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    previous = np.asarray(previous, dtype=float)
    direction = np.sign(y_true - previous) == np.sign(y_pred - previous)
    return {
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "rmse": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "r2": float(r2_score(y_true, y_pred)),
        "directional_accuracy_pct": float(direction.mean() * 100),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--target", default="close")
    ap.add_argument("--date", default="date")
    ap.add_argument("--output", default="research/results")
    ap.add_argument("--test-fraction", type=float, default=0.20)
    args = ap.parse_args()

    raw = pd.read_csv(args.data)
    if args.date not in raw.columns or args.target not in raw.columns:
        raise ValueError(f"Dataset must contain '{args.date}' and '{args.target}' columns")
    raw[args.date] = pd.to_datetime(raw[args.date], errors="coerce")
    raw = raw.dropna(subset=[args.date, args.target]).sort_values(args.date).reset_index(drop=True)

    featured = add_features(raw, args.target)
    featured = featured.dropna(subset=[args.target]).reset_index(drop=True)
    numeric = featured.select_dtypes(include=[np.number]).columns.tolist()
    features = [c for c in numeric if c != args.target]
    featured = featured.dropna(subset=features).reset_index(drop=True)

    split = int(len(featured) * (1 - args.test_fraction))
    dev = featured.iloc[:split].copy()
    test = featured.iloc[split:].copy()

    X_dev, y_dev = dev[features], dev[args.target]
    X_test, y_test = test[features], test[args.target]

    models = {
        "linear_regression": make_pipeline(SimpleImputer(strategy="median"), StandardScaler(), LinearRegression()),
        "random_forest": make_pipeline(SimpleImputer(strategy="median"), RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1, min_samples_leaf=3)),
        "hist_gradient_boosting": make_pipeline(SimpleImputer(strategy="median"), HistGradientBoostingRegressor(random_state=42, max_iter=300, learning_rate=0.05, l2_regularization=0.1)),
    }

    previous = test[args.target].shift(1).bfill().to_numpy()
    results = []

    naive_pred = previous.copy()
    naive = metrics(y_test, naive_pred, previous)
    naive["model"] = "naive_last_value"
    results.append(naive)

    mean_pred = np.repeat(float(y_dev.mean()), len(test))
    mean_result = metrics(y_test, mean_pred, previous)
    mean_result["model"] = "historical_mean"
    results.append(mean_result)

    predictions = {}
    for name, model in models.items():
        model.fit(X_dev, y_dev)
        pred = model.predict(X_test)
        predictions[name] = pred
        result = metrics(y_test, pred, previous)
        result["model"] = name
        results.append(result)

    result_df = pd.DataFrame(results).sort_values("rmse").reset_index(drop=True)
    baseline_rmse = float(result_df.loc[result_df.model == "naive_last_value", "rmse"].iloc[0])
    result_df["rmse_improvement_vs_naive_pct"] = (1 - result_df["rmse"] / baseline_rmse) * 100

    pred_df = pd.DataFrame({
        "date": test[args.date].dt.strftime("%Y-%m-%d"),
        "actual": y_test.to_numpy(),
        "previous": previous,
        "naive_last_value": naive_pred,
        **predictions,
    })

    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    result_df.to_csv(out / "model_results.csv", index=False)
    pred_df.to_csv(out / "test_predictions.csv", index=False)
    metadata = {
        "dataset_rows": int(len(raw)),
        "modeling_rows": int(len(featured)),
        "development_rows": int(len(dev)),
        "test_rows": int(len(test)),
        "test_fraction": args.test_fraction,
        "date_column": args.date,
        "target_column": args.target,
        "feature_count": len(features),
        "features": features,
        "protocol": "chronological holdout; feature construction uses shifted historical information",
        "random_seed": 42,
    }
    (out / "experiment_metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(result_df.to_string(index=False))


if __name__ == "__main__":
    main()
