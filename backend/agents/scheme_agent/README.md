# Government Scheme Agent — AI Public Welfare Multi-Agent System

AI-powered FastAPI microservice that recommends government schemes to citizens based on their profile using Google Gemini and a rule-based eligibility engine.

---

## Tech Stack
- **FastAPI** — REST API framework
- **MongoDB + Motor** — Async database
- **JWT + Passlib** — Authentication & password hashing
- **Google Gemini API** — AI eligibility explanations
- **Pydantic v2** — Request/response validation
- **Scikit-learn / Pandas** — (available for ML extensions)

---

## Folder Structure
```
scheme_agent/
├── main.py                     ← FastAPI app entry point + DB seeder
├── requirements.txt
├── .env.example
└── app/
    ├── core/
    │   ├── config.py           ← Pydantic settings
    │   ├── database.py         ← MongoDB connection + indexes
    │   └── security.py         ← JWT creation & verification
    ├── models/                 ← MongoDB document shapes
    ├── schemas/                ← Pydantic request/response schemas
    ├── services/               ← Business logic layer
    │   ├── auth_service.py
    │   ├── profile_service.py
    │   ├── scheme_service.py
    │   ├── recommendation_service.py
    │   ├── saved_service.py
    │   └── admin_service.py
    ├── routers/                ← FastAPI route handlers
    ├── ai/
    │   ├── gemini_client.py    ← Google Gemini integration
    │   └── eligibility_engine.py ← Weighted scoring engine
    ├── middleware/
    │   └── logging.py          ← Request/response logger
    └── utils/
        ├── helpers.py          ← MongoDB doc serialiser
        └── logger.py           ← Logging setup
```

---

## Setup

### 1. Create virtual environment
```bash
cd backend/agents/scheme_agent
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment
```bash
copy .env.example .env       # Windows
cp .env.example .env         # Linux/Mac
```
Edit `.env` and set:
- `MONGODB_URL` — your MongoDB connection string
- `JWT_SECRET_KEY` — a strong random secret
- `GEMINI_API_KEY` — your Google Gemini API key

### 4. Run the server
```bash
uvicorn main:app --reload --port 8001
```

API docs available at: **http://localhost:8001/docs**

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register citizen |
| POST | `/api/auth/login` | ❌ | Login & get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/profile` | ✅ | Create citizen profile |
| PUT | `/api/profile` | ✅ | Update profile |
| GET | `/api/profile` | ✅ | Get profile |
| DELETE | `/api/profile` | ✅ | Delete profile |
| GET | `/api/schemes` | ✅ | List all schemes |
| GET | `/api/schemes/search?q=` | ✅ | Full-text search |
| GET | `/api/schemes/{id}` | ✅ | Get scheme by ID |
| POST | `/api/recommend` | ✅ | Get AI recommendations |
| GET | `/api/history` | ✅ | Recommendation history |
| POST | `/api/saved` | ✅ | Save a scheme |
| GET | `/api/saved` | ✅ | Get saved schemes |
| DELETE | `/api/saved/{id}` | ✅ | Remove saved scheme |
| GET | `/api/notifications` | ✅ | Get notifications |
| POST | `/api/admin/schemes` | 🔐 Admin | Add scheme |
| PUT | `/api/admin/schemes/{id}` | 🔐 Admin | Update scheme |
| DELETE | `/api/admin/schemes/{id}` | 🔐 Admin | Delete scheme |
| GET | `/api/admin/users` | 🔐 Admin | List all users |
| GET | `/api/admin/analytics` | 🔐 Admin | Analytics data |

---

## MongoDB Collections
| Collection | Purpose |
|------------|---------|
| `users` | Citizen accounts |
| `citizen_profiles` | Detailed citizen profiles |
| `government_schemes` | All scheme data |
| `recommendations` | AI recommendation results (cached) |
| `recommendation_history` | History log |
| `saved_schemes` | User favourites |
| `notifications` | User notifications |
| `admin_logs` | Admin action audit trail |

---

## How Recommendations Work
1. Citizen completes their profile (age, income, category, etc.)
2. `POST /api/recommend` triggers the engine
3. All active schemes are fetched from MongoDB
4. Each scheme is scored using the **weighted eligibility engine** (`ai/eligibility_engine.py`)
5. Schemes scoring ≥ 30% are passed to **Google Gemini** for a human-readable explanation
6. Results are sorted by score, cached, and returned
7. A notification is pushed to the citizen

---

## Making a User Admin
```javascript
// In MongoDB shell
db.users.updateOne({ email: "admin@gov.in" }, { $set: { role: "admin" } })
```

---

## Integration with Other Agents
This service uses the shared `public_welfare_db` MongoDB database.
Other agents (jobs, complaints, emergency, cyber, chatbot) connect to the same DB.
The frontend React app calls this service at `http://localhost:8001`.
