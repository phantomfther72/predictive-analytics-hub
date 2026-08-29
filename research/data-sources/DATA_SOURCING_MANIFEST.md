# Predictive Pulse Research Data Sourcing Manifest

## Purpose

This manifest records candidate external datasets for the National Research Symposium 2026 empirical evaluation. Sources are documented before modelling so that provenance, frequency, coverage and limitations are explicit.

## Experiment 01: Gold benchmark

### Preferred benchmark source: FRED daily gold price

- Series: `GOLDPMGBD228NLBM`
- Description: daily gold price in USD, suitable for a long-horizon forecasting experiment.
- Provider: Federal Reserve Bank of St. Louis, FRED.
- Resolution: daily.
- Coverage: long historical series, substantially exceeding the minimum 2020–2025 experimental window.
- Important limitation: this is a daily gold price series, not broker-specific XAUUSD OHLCV. The paper must therefore call this experiment a **daily gold-price forecasting benchmark**, not claim that it is a broker-specific XAUUSD feed.
- Reference: https://fred.stlouisfed.org/series/GOLDPMGBD228NLBM
- CSV endpoint documented by a secondary data reference: https://fred.stlouisfed.org/graph/fredgraph.csv?id=GOLDPMGBD228NLBM

### Alternative market-data source: Kaggle gold futures dataset

- Dataset: Gold Price Historical Data (2000–2026)
- Main file: `gold_data_daily_comprehensive_cleaned.csv`
- Reported coverage: 6,383 daily observations from August 2000 to February 2026.
- Instrument: COMEX gold futures (`GC=F`), sourced from Yahoo Finance according to the dataset description.
- Fields/features: daily OHLCV plus technical indicators.
- Use: secondary robustness dataset, not the primary benchmark unless provenance and licensing are independently verified.
- Reference: https://www.kaggle.com/datasets/hamzasamiullah/gold-price-historical-data-2000-2026/data

### XAUUSD spot-data candidate

- Provider/repository: getdata-finance XAUUSD historical data.
- Coverage reported: XAUUSD spot OHLCV from 2009 onward, with multiple timeframes.
- GitHub samples are available, while full archives are hosted by the provider.
- Use: potential later robustness experiment where broker/spot OHLCV is specifically required.
- Important limitation: the readily surfaced GitHub samples are recent-window samples, so they should not be substituted for a long historical benchmark without verifying the full archive and licensing.
- Reference: https://github.com/getdata-finance/xauusd-5m-ohlcv-metals-historical-data

## Experiment 02: Namibia/emerging-market context

### Bank of Namibia exchange-rate data

- Provider: Bank of Namibia.
- Variables of interest: NAD per USD, NAD per GBP, NAD per EUR and related exchange-rate measures.
- Resolution: daily for the published nominal exchange-rate information.
- The Bank of Namibia states that its NAD/USD, NAD/GBP and NAD/EUR rates are updated daily and uploaded at a fixed time.
- Primary source: https://www.bon.com.na/Economic-information/Statistical-information/Exchange-Rates-and-Indices.aspx

### Bank of Namibia monetary and financial statistics

- Provider: Bank of Namibia.
- Coverage: aggregated banking-sector assets/liabilities and other monetary and financial statistics.
- Resolution: monthly selected statistics are available across multiple historical years.
- Use: candidate macro-financial variables for an emerging-market decision-support experiment.
- Primary source: https://www.bon.com.na/Economic-information/Statistical-information/Monetary-and-fincancial-statistics.aspx

### Namibia CPI / inflation

- Provider: Namibia Statistics Agency.
- Dataset family: Namibia Consumer Price Index (NCPI).
- Use: inflation and price-level variables for the Namibia experiment.
- Primary source: https://nsa.org.na/document/zonal-cpis-2025-annex/

### Namibia Producer Price Index

- Provider: Namibia Statistics Agency.
- Dataset family: Producer Price Index (PPI).
- Use: producer-price and sectoral price-pressure variables.
- Primary source: https://nsa.org.na/ppi/

### World Bank Namibia indicators

- Provider: World Bank, World Development Indicators.
- Candidate variables: GDP, GDP growth, inflation, population and other internationally comparable indicators.
- The World Bank Indicators API provides programmatic access to thousands of time series and supports country, indicator and date-range queries.
- Primary documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599-indicator-api-queries
- Namibia GDP DataBank example: https://databank.worldbank.org/reports.aspx?country=NAM&series=NY.GDP.MKTP.CD&source=2

## Proposed source hierarchy

1. Official national/international statistical agencies for macroeconomic variables.
2. Central-bank data for exchange rates and monetary/financial variables.
3. FRED for transparent, well-documented benchmark series.
4. Secondary aggregators such as Kaggle only as supplementary/robustness sources after provenance checks.

## Reproducibility requirements

Before a dataset enters the final benchmark, record:

- retrieval date;
- source URL;
- series/dataset identifier;
- observation frequency;
- date range;
- unit of measurement;
- missing-value treatment;
- transformations;
- licensing/usage notes;
- checksum or immutable snapshot identifier where practical.

## Research caution

No benchmark result should be reported until the exact source snapshot used for modelling has been preserved. Current web data can be revised, extended or replaced. The experiment therefore separates **source discovery** from **final experimental dataset freezing**.
