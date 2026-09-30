# PredictivePulse Prediction Methodology

> **Status:** Working documentation template. Replace every `[VALIDATE]` item with the actual methodology, data, experiments, and results used in the study before presenting this document as a factual account of the research.

## 1. Purpose

This document records the methodological basis for the prediction and market-intelligence functions of PredictivePulse. It is intended to support technical reproducibility, research reporting, governance review, and future peer-reviewed publication.

## 2. Research Question / Objective

**Primary research question:**  
[VALIDATE: Insert the exact research question approved/presented for the study.]

**Research objective(s):**
1. [VALIDATE]
2. [VALIDATE]
3. [VALIDATE]

## 3. Study Design

**Design:** [VALIDATE: e.g., experimental, observational, applied analytical, mixed-methods.]

**Study setting:** [VALIDATE]

**Study period:** [VALIDATE]

**Unit of analysis:** [VALIDATE]

**Scope of inference:** [VALIDATE: state exactly what the results can and cannot support.]

## 4. Data Strategy

### 4.1 Data sources

Document each dataset/source using:

| Field | Required entry |
|---|---|
| Dataset name | [VALIDATE] |
| Sector/domain | [VALIDATE] |
| Source organisation/publication | [VALIDATE] |
| Source URL / citation | [VALIDATE] |
| Target variable | [VALIDATE] |
| Unit | [VALIDATE] |
| Frequency | [VALIDATE] |
| Observation period | [VALIDATE] |
| Number of observations | [VALIDATE] |
| Licence / usage conditions | [VALIDATE] |
| Geographic relevance | [VALIDATE] |

### 4.2 Data preprocessing

Record the actual procedures used for:
- missing values;
- duplicate observations;
- date/time normalisation;
- unit/currency conversion;
- outlier handling;
- transformations and scaling;
- feature construction;
- joining/merging across sources.

Do not describe a preprocessing step unless it was actually performed.

## 5. Variables

| Variable role | Variable | Definition | Unit | Source | Transformation |
|---|---|---|---|---|---|
| Target | [VALIDATE] | [VALIDATE] | [VALIDATE] | [VALIDATE] | [VALIDATE] |
| Predictor | [VALIDATE] | [VALIDATE] | [VALIDATE] | [VALIDATE] | [VALIDATE] |
| Predictor | [VALIDATE] | [VALIDATE] | [VALIDATE] | [VALIDATE] | [VALIDATE] |

## 6. Prediction Models

For every model actually tested, document:

**Model name:** [VALIDATE]

**Model family:** [VALIDATE]

**Input features:** [VALIDATE]

**Target:** [VALIDATE]

**Forecast horizon:** [VALIDATE]

**Training procedure:** [VALIDATE]

**Hyperparameter selection:** [VALIDATE]

**Baseline model:** [VALIDATE]

**Reason for inclusion:** [VALIDATE]

The repository documentation currently describes an ensemble-oriented architecture including neural networks, ARIMA, linear regression, confidence intervals, factor analysis, and scenario planning. Those descriptions are implementation documentation and must not be treated as evidence that every listed model was trained or validated in the research study until experiment records confirm it.

## 7. Validation and Evaluation

Document the exact validation design used. For time-series work, explicitly state how temporal ordering was preserved.

| Evaluation item | Actual value |
|---|---|
| Train/validation/test split | [VALIDATE] |
| Rolling / walk-forward validation | [VALIDATE] |
| Baseline | [VALIDATE] |
| Primary metric | [VALIDATE] |
| Secondary metrics | [VALIDATE] |
| Confidence / uncertainty method | [VALIDATE] |
| Statistical tests | [VALIDATE] |
| Error analysis | [VALIDATE] |

Recommended reporting fields, where applicable:

- MAE
- RMSE
- MAPE or sMAPE, with caveats for zero/near-zero targets
- directional accuracy
- interval coverage
- calibration/error by forecast horizon
- performance against a simple benchmark

Only report metrics actually calculated from the experiment outputs.

## 8. Leakage and Robustness Controls

Document controls for:
- future information entering training features;
- target leakage during preprocessing;
- publication-date versus event-date alignment for news;
- revisions to official statistics;
- overlapping observations across train and test sets;
- sensitivity to alternate feature sets;
- sensitivity to alternate models or baselines.

## 9. AI / Automated System Use

Describe exactly where AI, machine learning, automation, or generative AI influenced the research process.

For each component, state:
1. tool/system used;
2. task performed;
3. inputs;
4. outputs;
5. human verification;
6. reproducibility implications.

**Generative-AI disclosure draft:**  
“Generative AI and AI-assisted tools were used for [VALIDATE: drafting / coding / literature synthesis / analysis / visualisation / other]. The authors retained responsibility for research design, verification, interpretation, and the final submitted content.”

Revise this statement to match the actual use.

## 10. Governance, Ethics and Responsible Use

Document:
- data provenance and licensing;
- privacy and confidentiality controls;
- handling of sensitive or proprietary information;
- human oversight;
- model limitations;
- risk of misleading users;
- explainability / transparency measures;
- access controls;
- auditability and logging;
- procedures for correcting erroneous outputs.

For decision-support use, distinguish clearly between:
- observed facts;
- model estimates;
- forecasts;
- generated interpretations;
- user decisions.

## 11. Reproducibility

Record:
- source datasets or archival references;
- dataset versions/date accessed;
- code repository and commit;
- software/runtime versions;
- model configuration;
- random seeds, where applicable;
- experiment identifiers;
- generated result files;
- known dependencies.

## 12. Results Record

Do not write narrative results from memory. Link each reported result to an experiment artifact.

| Result | Experiment ID / file | Metric | Value | Interpretation |
|---|---|---|---:|---|
| [VALIDATE] | [VALIDATE] | [VALIDATE] | [VALIDATE] | [VALIDATE] |

## 13. Limitations

State limitations supported by the evidence, including where relevant:
- sample size;
- historical coverage;
- data quality;
- structural breaks;
- missing variables;
- external shocks;
- model assumptions;
- generalisability;
- computational constraints.

## 14. Publication Readiness Gate

Before this document or the associated paper is submitted, verify:

- [ ] Exact research question matches the approved/presented study.
- [ ] Every dataset is traceable to a cited source.
- [ ] Observation period and sample size are verified.
- [ ] Every model listed was actually run.
- [ ] Validation design is reproducible.
- [ ] Reported metrics come from saved experiment outputs.
- [ ] Limitations match the evidence.
- [ ] Ethics/governance statement is accurate.
- [ ] AI-use disclosure matches actual use.
- [ ] Data availability statement is accurate.
- [ ] Code/data release claims are supportable.

## 15. External Publication Alignment

The August 2026 NJRST author guidelines call for enough methodological detail for another knowledgeable researcher to understand, assess, and where appropriate reproduce the study. They specifically identify research design, setting, population, sampling, instruments, data collection, software, analysis methods, quality assurance, ethics, consent, and limitations as relevant methodology elements; they also require clear disclosure when AI/ML/automated systems form part of the research method.

For the NJRST manuscript, use the final validated study record to populate the paper rather than retrofitting details after submission.

**Reference:** National Commission on Research, Science and Technology. (2026). *Namibia Journal for Research, Science and Technology: Author Guidelines* (August 2026).
