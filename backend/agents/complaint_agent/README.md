# Complaint Agent

FastAPI backend for the **Citizen Complaint** module of the AI Public Welfare Multi-Agent System.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/complaints` | Submit a new complaint |
| GET | `/complaints` | List complaints (filter + paginate) |
| GET | `/complaints/{id}` | Get complaint by ID |
| PUT | `/complaints/{id}` | Update complaint details |
| DELETE | `/complaints/{id}` | Delete a complaint |
| PATCH | `/complaints/status` | Update complaint status |
| GET | `/complaints/dashboard` | Dashboard statistics |
| GET | `/complaints/search?q=` | Full-text search |

## Categories
Road Damage · Garbage · Water Leakage · Street Light · Drainage · Electricity · Traffic · Public Property · Illegal Dumping · Other

## Status Flow
Submitted → Assigned → Under Review → In Progress → Resolved → Closed / Rejected

## Priority Levels
Low · Medium · High · Critical

## TODO
- [ ] Connect MongoDB Atlas via Motor async driver (`database.py`)
- [ ] Enable JWT authentication enforcement (`security.py`)
- [ ] Add Gemini AI for auto-categorisation and priority suggestion
