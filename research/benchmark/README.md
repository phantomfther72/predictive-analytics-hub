# Predictive Pulse Benchmark Suite

This benchmark suite evaluates predictive models under a chronological, leakage-aware protocol. It is intended to generate empirical evidence for the National Research Symposium research documentation.

## Experimental principle

The benchmark evaluates whether candidate models improve on simple baselines when predicting a future target using only information available at the prediction timestamp.

## Required dataset

A CSV containing a `date` column and one numeric target column. The default target is `close`.

The runner automatically creates lagged and rolling features from numeric columns. Features are shifted so that future observations cannot enter the feature matrix.

## Validation protocol

- Sort observations chronologically.
- Reserve the final test fraction as an untouched test set.
- Use walk-forward validation inside the development period when selecting a model.
- Fit preprocessing/model components only on the relevant training window.
- Evaluate the selected model once on the untouched test period.

## Models

- Naive last-value baseline
- Historical-mean baseline
- Linear Regression
- Random Forest Regressor
- HistGradientBoosting Regressor

## Metrics

- MAE
- RMSE
- R²
- Directional Accuracy
- Improvement over naive baseline

## Reproducibility

Run:

```bash
pip install -r research/benchmark/requirements.txt
python research/benchmark/run_benchmark.py --data data.csv --target close --date date --output research/results
```

The generated CSV and JSON files should be treated as experimental artifacts and preserved with the dataset version, experiment date, feature configuration and code revision.

**Important:** Do not insert fabricated performance values into the symposium paper. Results should only be reported after an actual benchmark run against a documented dataset.
