# 🔐 BreachWatch – Real-Time Data Leak Monitor

> A real-time system that scrapes public sources for leaked credentials and secrets, classifies potential threats using machine learning, and alerts users with explainable context via dashboards and bot notifications.

---

## 📌 Overview

**BreachWatch** is a proof-of-concept data leak detection engine that simulates the scanning of public repositories (like Pastebin dumps, GitHub gists, forums) to:
- Detect sensitive leaks (emails, passwords, AWS keys, tokens)
- Classify real threats vs noise using ML models
- Visualize alerts in a real-time dashboard (Streamlit)
- Optionally send alerts via Telegram or Email

### 👨‍💻 Built for:
- Students and researchers in InfoSec/DS
- Internal SecOps automation for startups
- Demo-ready cybersecurity projects

---

## 🧠 Features

✅ Scrapes public dump sites (mocked or real)  
✅ Uses regex + ML/NLP to detect credential patterns  
✅ Classifies threat level: 🔴 High / 🟡 Medium / 🟢 Low  
✅ Real-time dashboard in Streamlit  
✅ Telegram/Email alert system for flagged leaks  
✅ Explainable ML (SHAP) for transparency

---

## 📸 Screenshots

![Dashboard](assets/dashboard.png)
> Live dashboard showing detected threats with timestamps, source type, and ML confidence score.

---

## ⚙️ Tech Stack

| Layer | Tools/Libs |
|-------|------------|
| Language | Python 3.10 |
| Scraping | `requests`, `BeautifulSoup`, `asyncio` |
| ML | `scikit-learn`, `XGBoost`, `SHAP` |
| NLP | `spaCy`, `regex`, `nltk` |
| Dashboard | `Streamlit`, `Plotly`, `Pandas` |
| Alerting | `python-telegram-bot`, `smtplib` |
| Logging | `loguru`, `SQLite` |
| Optional | Docker, HuggingFace Spaces (deployment)

---

## 🧩 System Architecture

```mermaid
graph TD
A[Scraper Engine] --> B{Content Extractor}
B --> C[Regex Filter + Tokenizer]
C --> D[ML Classifier (Threat Detection)]
D --> E[Threat Log DB]
E --> F[Streamlit Dashboard]
D --> G[Alert System (Telegram/Email)]
```

---

## 📂 Folder Structure

```
breachwatch/
│
├── src/
│   ├── scraper.py         # Scrapes public sites
│   ├── parser.py          # Extracts data, cleans text
│   ├── detector.py        # Regex + ML classification
│   ├── notifier.py        # Telegram/Email alerting
│   └── dashboard.py       # Streamlit dashboard app
│
├── models/
│   └── leak_classifier.pkl  # Trained ML model
│
├── data/
│   ├── mock_dumps/         # Simulated leak files
│   └── logs.db             # SQLite DB of leaks
│
├── assets/
│   └── dashboard.png       # Screenshots & media
│
├── .env                    # API keys & secrets (gitignored)
├── requirements.txt
├── README.md
└── run.sh
```

---

## 📊 Dataset & Training

### 🔹 Dataset:
- Simulated leak dumps: Pastebin-style entries, GitHub commits, token pastes
- Labelled manually as: `Real Leak`, `False Positive`, `Noise`

### 🔹 Features:
- Presence of emails/usernames
- Patterns like `AKIA[0-9A-Z]{16}` (AWS), `ghp_.*` (GitHub PAT)
- Contextual keywords: “password=”, “token=”, etc.

### 🔹 Model:
- **XGBoost binary classifier** trained on text+pattern features
- Accuracy: **92.1%**
- Integrated **SHAP** for explainability (see why a leak was flagged)

---

## 🚀 How to Run

### 1. Clone the repo
```bash
git clone https://github.com/hreger/BreachWatch.git
cd breachwatch
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set up `.env`
```env
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
SMTP_EMAIL=xxx
SMTP_PASS=xxx
```

### 4. Run the scraper
```bash
python src/scraper.py
```

### 5. Launch the dashboard
```bash
streamlit run src/dashboard.py
```

---

## 📬 Telegram Alerts (Optional)

Set up a Telegram bot via [@BotFather](https://t.me/BotFather). Add your `BOT_TOKEN` and `CHAT_ID` in the `.env`.

```bash
python src/notifier.py
```

---

## 🧪 Test Cases

```bash
pytest tests/
```

Includes:
- Regex edge case testing  
- Scraper mocks  
- Classifier predictions  
- Alert send simulations

---

## 💡 Future Improvements

- Integrate with real-time GitHub API commit streams
- Deploy to cloud with Docker + FastAPI backend
- Extend to support more leak formats (JSON, ZIP, encoded)
- Add user dashboard login (auth)

---

## 🧠 Learnings

- Data security doesn’t need to be passive — automation matters  
- Regex + ML can catch more than humans alone  
- Explainable AI builds trust in alerts  
- Real-time dashboards > static PDFs in SOC teams

---

## 🧾 License

MIT License. Educational use only. Don’t use it for anything shady. You're better than that.

---

## 🙌 Acknowledgments

Inspired by:
- GitGuardian's open alerts
- Pastebin OSINT community
- XGBoost + SHAP for making ML explainable

---

## 🤝 Connect

**Author**: P Sanjeev Pradeep  
📧 clashersanjeev@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/p-sanjeev-pradeep) • [GitHub](https://github.com/hreger)

---

## ⭐ If you like this project...
- Star the repo 🌟
- Share feedback  
- Drop a DM for collab ideas 🚀
