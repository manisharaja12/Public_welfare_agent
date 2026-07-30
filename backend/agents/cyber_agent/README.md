# Cyber Agent

FastAPI backend for the **Cyber Safety** module of the AI Public Welfare Multi-Agent System.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/cyber/url-scan` | Phishing URL detection |
| POST | `/cyber/password` | Password strength checker |
| POST | `/cyber/scam` | Scam message detection |
| GET | `/cyber/tips` | Cyber safety tips |
| GET | `/cyber/history` | Paginated scan history |
| GET | `/cyber/dashboard` | Aggregate statistics |

## Features

### 1. Phishing URL Detection
- Rule-based risk scoring (0–100)
- Threat levels: Safe / Low / Medium / High / Critical
- Detects: IP-based URLs, suspicious TLDs, redirect patterns, phishing keywords

### 2. Password Strength Checker
- Scores 0–100 based on length, character variety, entropy
- Detects common passwords
- Returns estimated crack time

### 3. Scam Message Detection
- Supports SMS, Email, WhatsApp
- Pattern-matched scam types: Phishing, Lottery, Impersonation, Financial Fraud, Job Scam, Tech Support
- Returns confidence score and highlighted trigger words

### 4. Cyber Safety Tips
- 10 built-in tips across Password, Phishing, Privacy, Scam, Device categories
- Filterable by category

## TODO
- [ ] Connect MongoDB Atlas via Motor async driver (`database.py`)
- [ ] Integrate Gemini API for intelligent scam detection and tip generation (`services.py`)
- [ ] Enable JWT authentication enforcement (`security.py`)
- [ ] Add VirusTotal / Google Safe Browsing API for URL scanning
