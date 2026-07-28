import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import connect_db, close_db
from app.middleware.logging import RequestLoggingMiddleware
from app.utils.logger import setup_logging
from app.routers import auth, profile, schemes, recommend, saved, admin

setup_logging(settings.DEBUG)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    await connect_db()
    await _seed_schemes_if_empty()
    yield
    await close_db()
    logger.info("Application shutdown complete")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Government Scheme Recommendation Agent — Part of the Public Welfare Multi-Agent System",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── Middleware ─────────────────────────────────────────────────
# NOTE: FastAPI applies middlewares in reverse order of registration.
# RequestLoggingMiddleware is added last so it runs outermost (first on request).
# CORSMiddleware must be registered before logging so it wraps every response.
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Global exception handler ───────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers={"Access-Control-Allow-Origin": "*"},
    )


# ── Routers ────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(schemes.router)
app.include_router(recommend.router)
app.include_router(saved.router)
app.include_router(admin.router)


# ── Health check ───────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "version": settings.APP_VERSION,
    }


# ── Seed data ──────────────────────────────────────────────────
async def _seed_schemes_if_empty():
    """Seed the database with real Indian government schemes on first run."""
    from app.core.database import get_db, SCHEMES_COL
    db = get_db()
    if await db[SCHEMES_COL].count_documents({}) > 0:
        return

    logger.info("Seeding government schemes...")
    from datetime import datetime, timezone

    schemes = [
        {
            "name": "PM Kisan Samman Nidhi",
            "slug": "pm-kisan-samman-nidhi",
            "description": "Direct income support of ₹6,000 per year to small and marginal farmers in three equal instalments.",
            "category": "Agriculture",
            "tags": ["farmer", "income support", "agriculture", "central"],
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "eligibility_criteria": {
                "citizen_types": ["Farmer"],
                "max_annual_income": 200000,
                "occupation_types": ["Farmer", "Agriculture"],
            },
            "benefits": [
                "₹6,000 per year in 3 instalments of ₹2,000",
                "Direct bank transfer (DBT)",
                "No middlemen involved",
            ],
            "required_documents": ["Aadhaar Card", "Land Records", "Bank Account Details", "Mobile Number"],
            "application_process": [
                "Visit pmkisan.gov.in",
                "Click on 'New Farmer Registration'",
                "Enter Aadhaar number and state",
                "Fill in land and bank details",
                "Submit and await verification",
            ],
            "official_website": "https://pmkisan.gov.in",
            "apply_link": "https://pmkisan.gov.in/RegistrationForm.aspx",
            "last_date": "Ongoing",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "PM Awas Yojana (Urban)",
            "slug": "pm-awas-yojana-urban",
            "description": "Housing for All mission providing affordable housing to urban poor including EWS, LIG, and MIG categories.",
            "category": "Housing",
            "tags": ["housing", "urban", "home loan", "subsidy", "central"],
            "ministry": "Ministry of Housing and Urban Affairs",
            "eligibility_criteria": {
                "max_annual_income": 1800000,
                "categories": ["General", "SC", "ST", "OBC", "EWS"],
                "citizen_types": ["BPL", "Unemployed", "Salaried", "Self Employed"],
            },
            "benefits": [
                "Interest subsidy up to 6.5% on home loans",
                "Subsidy up to ₹2.67 lakh for EWS/LIG",
                "Pucca house with basic amenities",
            ],
            "required_documents": ["Aadhaar Card", "Income Certificate", "Bank Account", "Property Documents", "Caste Certificate (if applicable)"],
            "application_process": [
                "Visit pmaymis.gov.in",
                "Select 'Citizen Assessment'",
                "Choose applicable category",
                "Fill Aadhaar-linked form",
                "Submit to local ULB for verification",
            ],
            "official_website": "https://pmaymis.gov.in",
            "apply_link": "https://pmaymis.gov.in",
            "last_date": "31 December 2024",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "Ayushman Bharat PM-JAY",
            "slug": "ayushman-bharat-pmjay",
            "description": "World's largest health insurance scheme providing ₹5 lakh per family per year for secondary and tertiary hospitalisation.",
            "category": "Health",
            "tags": ["health", "insurance", "hospital", "BPL", "central"],
            "ministry": "Ministry of Health and Family Welfare",
            "eligibility_criteria": {
                "max_annual_income": 100000,
                "categories": ["SC", "ST", "OBC", "General"],
                "citizen_types": ["BPL", "Farmer", "Unemployed"],
            },
            "benefits": [
                "₹5 lakh health cover per family per year",
                "Cashless treatment at empanelled hospitals",
                "Covers pre and post hospitalisation",
                "No cap on family size",
            ],
            "required_documents": ["Aadhaar Card", "Ration Card", "Income Certificate", "SECC Data Verification"],
            "application_process": [
                "Visit pmjay.gov.in or call 14555",
                "Check eligibility using Aadhaar/ration card",
                "Get Ayushman card from CSC or hospital",
                "Use card at any empanelled hospital",
            ],
            "official_website": "https://pmjay.gov.in",
            "apply_link": "https://beneficiary.nha.gov.in",
            "last_date": "Ongoing",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "PM Scholarship Scheme",
            "slug": "pm-scholarship-scheme",
            "description": "Scholarship for wards of ex-servicemen and ex-coast guard personnel for professional degree courses.",
            "category": "Education",
            "tags": ["scholarship", "student", "education", "central"],
            "ministry": "Ministry of Defence",
            "eligibility_criteria": {
                "min_age": 17,
                "max_age": 25,
                "citizen_types": ["Student"],
                "min_education": "Higher Secondary",
                "max_annual_income": 600000,
            },
            "benefits": [
                "₹2,500/month for boys",
                "₹3,000/month for girls",
                "For 1st year to final year of professional courses",
            ],
            "required_documents": ["Aadhaar Card", "Ex-Serviceman Certificate", "Marksheets", "Bank Account", "College Admission Letter"],
            "application_process": [
                "Visit ksb.gov.in",
                "Register with ex-serviceman details",
                "Fill scholarship application form",
                "Upload required documents",
                "Submit before deadline",
            ],
            "official_website": "https://ksb.gov.in",
            "apply_link": "https://ksb.gov.in/scholarship.htm",
            "last_date": "31 October 2025",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "PM MUDRA Yojana",
            "slug": "pm-mudra-yojana",
            "description": "Micro-finance loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises.",
            "category": "Finance",
            "tags": ["loan", "entrepreneur", "business", "MSME", "central"],
            "ministry": "Ministry of Finance",
            "eligibility_criteria": {
                "citizen_types": ["Entrepreneur", "Self Employed", "Unemployed"],
                "max_annual_income": 1000000,
            },
            "benefits": [
                "Shishu: Loans up to ₹50,000",
                "Kishore: Loans ₹50,001 to ₹5 lakh",
                "Tarun: Loans ₹5 lakh to ₹10 lakh",
                "No collateral required for Shishu & Kishore",
            ],
            "required_documents": ["Aadhaar Card", "PAN Card", "Business Plan", "Bank Statements", "Address Proof"],
            "application_process": [
                "Visit mudra.org.in",
                "Choose loan category (Shishu/Kishore/Tarun)",
                "Apply at nearest bank or NBFC",
                "Submit business plan and documents",
                "Loan disbursed after verification",
            ],
            "official_website": "https://mudra.org.in",
            "apply_link": "https://udyamimitra.in",
            "last_date": "Ongoing",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "Startup India Scheme",
            "slug": "startup-india-scheme",
            "description": "Government initiative to build a strong ecosystem for nurturing innovation and startups in India.",
            "category": "Entrepreneurship",
            "tags": ["startup", "entrepreneur", "innovation", "tax benefit", "central"],
            "ministry": "Ministry of Commerce and Industry",
            "eligibility_criteria": {
                "citizen_types": ["Entrepreneur"],
                "min_age": 18,
                "min_education": "Graduate",
            },
            "benefits": [
                "Tax exemption for 3 years",
                "80% rebate on patent filing fees",
                "Fast-track patent examination",
                "Self-certification under labour laws",
                "₹10,000 crore Fund of Funds",
            ],
            "required_documents": ["Aadhaar Card", "PAN Card", "Company Registration", "Business Plan", "DPIIT Recognition Certificate"],
            "application_process": [
                "Visit startupindia.gov.in",
                "Register your startup",
                "Apply for DPIIT recognition",
                "Upload incorporation certificate and other docs",
                "Receive recognition number",
            ],
            "official_website": "https://startupindia.gov.in",
            "apply_link": "https://startupindia.gov.in/content/sih/en/startupgov/startup-recognition-page.html",
            "last_date": "Ongoing",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "Skill India Mission (PMKVY)",
            "slug": "skill-india-pmkvy",
            "description": "PM Kaushal Vikas Yojana — free skill training and certification for Indian youth to enhance employability.",
            "category": "Skill Development",
            "tags": ["skill", "training", "youth", "employment", "certificate", "central"],
            "ministry": "Ministry of Skill Development and Entrepreneurship",
            "eligibility_criteria": {
                "min_age": 15,
                "max_age": 45,
                "citizen_types": ["Unemployed", "Student", "Salaried"],
                "max_annual_income": 500000,
            },
            "benefits": [
                "Free skill training in 300+ job roles",
                "Government-recognised certification",
                "Monetary reward on certification",
                "Placement assistance",
            ],
            "required_documents": ["Aadhaar Card", "Educational Certificates", "Bank Account", "Passport Photo"],
            "application_process": [
                "Visit pmkvyofficial.org",
                "Find nearest training centre",
                "Enrol in preferred skill course",
                "Complete training and assessment",
                "Receive NSQF-aligned certificate",
            ],
            "official_website": "https://pmkvyofficial.org",
            "apply_link": "https://www.skillindia.gov.in",
            "last_date": "Ongoing",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "Beti Bachao Beti Padhao",
            "slug": "beti-bachao-beti-padhao",
            "description": "Scheme to address declining child sex ratio and promote welfare and education of the girl child.",
            "category": "Women & Child",
            "tags": ["women", "girl child", "education", "welfare", "central"],
            "ministry": "Ministry of Women and Child Development",
            "eligibility_criteria": {
                "gender": ["female"],
                "max_age": 18,
                "citizen_types": ["Student", "Woman"],
            },
            "benefits": [
                "Sukanya Samriddhi Account with high interest",
                "Educational scholarships for girls",
                "Awareness and protection programs",
                "Conditional cash transfers",
            ],
            "required_documents": ["Birth Certificate", "Aadhaar Card", "Parent's ID Proof", "Bank Account"],
            "application_process": [
                "Visit wcd.nic.in",
                "Open Sukanya Samriddhi Account at post office or bank",
                "Register girl child details",
                "Deposit minimum ₹250/year",
            ],
            "official_website": "https://wcd.nic.in",
            "apply_link": "https://wcd.nic.in/bbbp-schemes",
            "last_date": "Ongoing",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "Indira Gandhi National Old Age Pension",
            "slug": "ignoaps-senior-citizen-pension",
            "description": "Monthly pension for BPL senior citizens aged 60 years and above under the National Social Assistance Programme.",
            "category": "Social Welfare",
            "tags": ["pension", "senior citizen", "old age", "BPL", "central"],
            "ministry": "Ministry of Rural Development",
            "eligibility_criteria": {
                "min_age": 60,
                "max_annual_income": 100000,
                "citizen_types": ["Senior Citizen", "BPL"],
            },
            "benefits": [
                "₹200/month for age 60–79 (central share)",
                "₹500/month for age 80+ (central share)",
                "States add additional top-up",
                "Direct bank transfer",
            ],
            "required_documents": ["Aadhaar Card", "Age Proof", "BPL Card", "Bank Account", "Income Certificate"],
            "application_process": [
                "Visit nsap.nic.in",
                "Apply at Gram Panchayat or Block office",
                "Submit age and income proof",
                "Verification by local authority",
                "Pension credited monthly to bank account",
            ],
            "official_website": "https://nsap.nic.in",
            "apply_link": "https://nsap.nic.in",
            "last_date": "Ongoing",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
        {
            "name": "National Disability Welfare Scheme",
            "slug": "national-disability-welfare-scheme",
            "description": "Comprehensive welfare support for persons with disabilities including pension, education aid, and assistive devices.",
            "category": "Disability Welfare",
            "tags": ["disability", "pension", "assistive devices", "welfare", "central"],
            "ministry": "Ministry of Social Justice and Empowerment",
            "eligibility_criteria": {
                "requires_disability": True,
                "max_annual_income": 250000,
                "citizen_types": ["Differently Abled"],
            },
            "benefits": [
                "Monthly disability pension",
                "Free assistive devices (wheelchair, hearing aid, etc.)",
                "Scholarship for disabled students",
                "Skill training and employment support",
            ],
            "required_documents": ["Aadhaar Card", "Disability Certificate (40%+)", "Income Certificate", "Bank Account"],
            "application_process": [
                "Visit disabilityaffairs.gov.in",
                "Obtain disability certificate from CMO",
                "Apply at District Social Welfare Office",
                "Submit all documents",
                "Await verification and approval",
            ],
            "official_website": "https://disabilityaffairs.gov.in",
            "apply_link": "https://disabilityaffairs.gov.in/content/page/schemes.php",
            "last_date": "Ongoing",
            "is_central": True,
            "state": None,
            "is_active": True,
            "created_by": "system",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
    ]

    await db[SCHEMES_COL].insert_many(schemes)
    logger.info("Seeded %d government schemes", len(schemes))
