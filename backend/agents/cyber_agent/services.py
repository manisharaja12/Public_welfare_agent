"""
Cyber Agent — Service Layer
Rule-based logic now; Gemini integration added later via TODO markers.
"""
import logging
from typing import Optional

from .constants import (
    PasswordStrength,
    ScamType,
    ThreatLevel,
)
from .database import (
    db_dashboard_stats,
    db_get_activity_log,
    db_get_history,
    db_save_scan,
)
from .schemas import (
    BreachCheckRequest,
    PasswordCheckRequest,
    ScamDetectRequest,
    URLScanRequest,
)
from .utils import (
    detect_scam_patterns,
    extract_url_features,
    is_common_password,
    password_entropy,
)
from .validators import (
    validate_non_empty,
    validate_page_params,
    validate_url,
)

logger = logging.getLogger("cyber_agent.services")

# ── Static Tips (TODO: Replace with Gemini-generated tips) ───────────────────

_TIPS = [
    {"id": 1, "category": "Password", "tip": "Use a unique password for every account."},
    {"id": 2, "category": "Password", "tip": "Enable two-factor authentication wherever possible."},
    {"id": 3, "category": "Phishing", "tip": "Never click links in unsolicited emails or SMS."},
    {"id": 4, "category": "Phishing", "tip": "Check the sender's email address carefully before responding."},
    {"id": 5, "category": "Privacy", "tip": "Review app permissions regularly and revoke unnecessary access."},
    {"id": 6, "category": "Privacy", "tip": "Avoid sharing personal information on public Wi-Fi."},
    {"id": 7, "category": "Scam", "tip": "Legitimate organisations never ask for OTPs over the phone."},
    {"id": 8, "category": "Scam", "tip": "If an offer sounds too good to be true, it probably is."},
    {"id": 9, "category": "Device", "tip": "Keep your operating system and apps updated."},
    {"id": 10, "category": "Device", "tip": "Install a reputable antivirus and keep it updated."},
    {"id": 11, "category": "Password", "tip": "Avoid using keyboard patterns like 'qwerty' or 'asdf' in passwords."},
    {"id": 12, "category": "Scam", "tip": "Verify UPI recipient name before confirming any payment."},
    {"id": 13, "category": "Privacy", "tip": "Use a VPN when connecting to public Wi-Fi networks."},
    {"id": 14, "category": "Email", "tip": "Do not open email attachments from unknown senders."},
    {"id": 15, "category": "Malware", "tip": "Keep your antivirus software updated and run regular scans."},
    {"id": 16, "category": "Social Media", "tip": "Enable two-factor authentication on all social media accounts."},
    {"id": 17, "category": "Phishing", "tip": "Hover over links before clicking to preview the actual URL."},
    {"id": 18, "category": "Scam", "tip": "Report cyber fraud immediately to the national helpline: 1930."},
    {"id": 19, "category": "Device", "tip": "Regularly back up important data to an offline or encrypted cloud."},
    {"id": 20, "category": "Password", "tip": "Use a password manager like Bitwarden or 1Password for unique passwords."},
]


# ── URL Scan ─────────────────────────────────────────────────────────────────

def scan_url(payload: URLScanRequest) -> dict:
    url = validate_url(payload.url)
    features = extract_url_features(url)

    risk_score = 0.0
    reasons: list[str] = []

    if features["has_ip"]:
        risk_score += 30
        reasons.append("URL uses an IP address instead of a domain name.")
    if features["suspicious_tld"]:
        risk_score += 20
        reasons.append("Domain uses a suspicious TLD.")
    if features["has_at_symbol"]:
        risk_score += 15
        reasons.append("URL contains @ symbol.")
    if features["excessive_hyphens"]:
        risk_score += 5
        reasons.append("Excessive hyphens in domain name.")
    if features["suspicious_keywords"]:
        risk_score += min(len(features["suspicious_keywords"]) * 5, 20)
        reasons.append(f"Suspicious keywords found: {', '.join(features['suspicious_keywords'])}.")
    if not features["uses_https"]:
        risk_score += 5
        reasons.append("URL does not use HTTPS.")

    # TODO: Enhance with Gemini threat intelligence and VirusTotal API
    risk_score = min(risk_score, 100.0)

    if risk_score >= 70:
        threat_level = ThreatLevel.CRITICAL
        recommendation = "Do NOT visit this URL. It shows strong indicators of a phishing or malicious site."
    elif risk_score >= 50:
        threat_level = ThreatLevel.HIGH
        recommendation = "Avoid this URL. Proceed only if you are certain of its legitimacy."
    elif risk_score >= 30:
        threat_level = ThreatLevel.MEDIUM
        recommendation = "Exercise caution before visiting this URL."
    elif risk_score >= 10:
        threat_level = ThreatLevel.LOW
        recommendation = "URL appears mostly safe but stay alert."
    else:
        threat_level = ThreatLevel.SAFE
        recommendation = "URL appears safe."

    result = {
        "url": url,
        "risk_score": round(risk_score, 1),
        "threat_level": threat_level,
        "reasons": reasons or ["No suspicious indicators found."],
        "recommendation": recommendation,
    }
    db_save_scan("url_scan", url, result)
    logger.info("URL scan completed: %s → %s", url, threat_level)
    return result


# ── Password Checker ─────────────────────────────────────────────────────────

def check_password(payload: PasswordCheckRequest) -> dict:
    pwd = payload.password
    suggestions: list[str] = []
    score = 0

    if len(pwd) >= 8:
        score += 20
    else:
        suggestions.append("Use at least 8 characters.")

    if len(pwd) >= 12:
        score += 10

    if any(c.islower() for c in pwd):
        score += 15
    else:
        suggestions.append("Add lowercase letters.")

    if any(c.isupper() for c in pwd):
        score += 15
    else:
        suggestions.append("Add uppercase letters.")

    if any(c.isdigit() for c in pwd):
        score += 15
    else:
        suggestions.append("Add numbers.")

    if any(not c.isalnum() for c in pwd):
        score += 20
    else:
        suggestions.append("Add special characters (e.g. @, #, !).")

    if is_common_password(pwd):
        score = max(score - 40, 0)
        suggestions.append("This is a commonly used password. Choose something unique.")

    entropy = password_entropy(pwd)
    if entropy > 60:
        score = min(score + 5, 100)

    # Crack time estimate
    if score >= 80:
        crack_time = "Centuries"
    elif score >= 60:
        crack_time = "Years"
    elif score >= 40:
        crack_time = "Months"
    elif score >= 20:
        crack_time = "Days"
    else:
        crack_time = "Minutes or less"

    if score >= 80:
        strength = PasswordStrength.VERY_STRONG
    elif score >= 60:
        strength = PasswordStrength.STRONG
    elif score >= 40:
        strength = PasswordStrength.FAIR
    elif score >= 20:
        strength = PasswordStrength.WEAK
    else:
        strength = PasswordStrength.VERY_WEAK

    result = {
        "strength": strength,
        "score": score,
        "suggestions": suggestions,
        "estimated_crack_time": crack_time,
    }
    db_save_scan("password_check", "***", result)
    return result


# ── Scam Detection ────────────────────────────────────────────────────────────

def detect_scam(payload: ScamDetectRequest) -> dict:
    message = validate_non_empty(payload.message, "message")
    scam_type_str, highlighted_words, confidence = detect_scam_patterns(message)

    is_scam = confidence >= 0.3
    scam_type = ScamType(scam_type_str) if scam_type_str != "None" else ScamType.NONE

    if is_scam:
        recommendation = (
            f"This message shows signs of a {scam_type_str} scam. "
            "Do not respond, click any links, or share personal information."
        )
    else:
        recommendation = "No strong scam indicators detected. Stay cautious with unsolicited messages."

    # TODO: Replace rule-based detection with Gemini NLP analysis
    result = {
        "scam_type": scam_type,
        "confidence": confidence,
        "highlighted_words": highlighted_words,
        "recommendation": recommendation,
        "is_scam": is_scam,
    }
    db_save_scan("scam_detect", message[:100], result)
    logger.info("Scam scan: type=%s confidence=%.2f", scam_type, confidence)
    return result


# ── Tips ─────────────────────────────────────────────────────────────────────

def get_tips(category: Optional[str] = None) -> dict:
    tips = _TIPS if not category else [t for t in _TIPS if t["category"].lower() == category.lower()]
    return {"tips": tips}


# ── Categories ────────────────────────────────────────────────────────────────

_CATEGORIES = [
    {"id": "password", "title": "Password Security", "description": "Learn how to create and manage strong, unique passwords to protect your accounts.", "severity": "High", "prevention_tips": ["Use 12+ character passwords", "Never reuse passwords", "Use a password manager"], "icon": "lock", "filter_tag": "Password"},
    {"id": "phishing", "title": "Phishing", "description": "Recognise deceptive emails, SMS, and websites designed to steal your credentials.", "severity": "Critical", "prevention_tips": ["Verify sender addresses", "Never click suspicious links", "Check URLs before entering data"], "icon": "fish", "filter_tag": "Email"},
    {"id": "email", "title": "Email Security", "description": "Protect your inbox from spam, malware attachments, and business email compromise.", "severity": "High", "prevention_tips": ["Enable spam filters", "Don't open unknown attachments", "Use email encryption"], "icon": "mail", "filter_tag": "Email"},
    {"id": "qr", "title": "QR Scam", "description": "Fraudulent QR codes redirect victims to phishing sites or trigger unauthorised payments.", "severity": "High", "prevention_tips": ["Preview QR URLs before opening", "Never scan QR codes from strangers", "Use a QR scanner with URL preview"], "icon": "qr", "filter_tag": "Scam"},
    {"id": "otp", "title": "OTP Scam", "description": "Scammers trick you into sharing one-time passwords to hijack your accounts or authorise transactions.", "severity": "Critical", "prevention_tips": ["Never share OTPs with anyone", "Banks never ask for OTPs", "Hang up on suspicious callers"], "icon": "key", "filter_tag": "Banking"},
    {"id": "banking", "title": "Banking Fraud", "description": "Online banking scams including fake apps, vishing calls, and UPI fraud.", "severity": "Critical", "prevention_tips": ["Download apps only from official stores", "Enable transaction alerts", "Use virtual cards for online shopping"], "icon": "bank", "filter_tag": "Banking"},
    {"id": "malware", "title": "Malware", "description": "Malicious software including viruses, ransomware, spyware, and trojans that compromise your device.", "severity": "High", "prevention_tips": ["Keep software updated", "Use reputable antivirus", "Avoid pirated software"], "icon": "bug", "filter_tag": "Malware"},
    {"id": "social", "title": "Social Media Safety", "description": "Protect your identity and privacy on social platforms from impersonation and data harvesting.", "severity": "Medium", "prevention_tips": ["Set profiles to private", "Don't overshare personal info", "Enable login alerts"], "icon": "users", "filter_tag": "Social Media"},
    {"id": "wifi", "title": "Public Wi-Fi", "description": "Unsecured public networks expose your data to eavesdropping and man-in-the-middle attacks.", "severity": "Medium", "prevention_tips": ["Use a VPN on public Wi-Fi", "Avoid banking on public networks", "Forget networks after use"], "icon": "wifi", "filter_tag": "Privacy"},
    {"id": "privacy", "title": "Privacy Protection", "description": "Control what personal data apps and websites collect and how it is used.", "severity": "Medium", "prevention_tips": ["Review app permissions", "Use private browsing", "Opt out of data sharing"], "icon": "shield", "filter_tag": "Privacy"},
]


def get_categories() -> dict:
    return {"categories": _CATEGORIES}


# ── Threats ───────────────────────────────────────────────────────────────────

_THREATS = [
    {"id": "fake-banking-app", "title": "Fake Banking Apps", "description": "Counterfeit apps mimic real banking apps to steal login credentials and OTPs.", "warning_signs": ["App not on official store", "Requests unusual permissions", "Poor reviews or new listing"], "what_to_do": ["Uninstall immediately", "Change banking passwords", "Contact your bank"], "severity": "Critical"},
    {"id": "qr-scam", "title": "QR Code Scam", "description": "Fraudulent QR codes placed over legitimate ones redirect payments to scammer accounts.", "warning_signs": ["QR code sticker placed over original", "Payment goes to unknown UPI ID", "Unsolicited QR codes via WhatsApp"], "what_to_do": ["Verify recipient before paying", "Report to cybercrime.gov.in", "Contact your bank"], "severity": "High"},
    {"id": "fake-job", "title": "Fake Job Scam", "description": "Fraudulent job offers demand registration fees or personal documents from victims.", "warning_signs": ["Upfront payment required", "Too-good-to-be-true salary", "No formal interview process"], "what_to_do": ["Never pay for a job", "Verify company on official website", "Report to police"], "severity": "High"},
    {"id": "whatsapp-scam", "title": "WhatsApp Scam", "description": "Scammers impersonate contacts or officials on WhatsApp to request money or data.", "warning_signs": ["Unknown number claiming to be family", "Urgent money requests", "Links to fake login pages"], "what_to_do": ["Call the person directly to verify", "Block and report the number", "Enable two-step verification"], "severity": "High"},
    {"id": "investment-scam", "title": "Investment Scam", "description": "Fake investment schemes promise high returns to lure victims into sending money.", "warning_signs": ["Guaranteed high returns", "Pressure to invest quickly", "Unregistered with SEBI"], "what_to_do": ["Verify with SEBI/RBI", "Never invest under pressure", "Report to cybercrime.gov.in"], "severity": "Critical"},
    {"id": "otp-scam", "title": "OTP Scam", "description": "Fraudsters pose as bank officials or government agents to extract OTPs and drain accounts.", "warning_signs": ["Caller asks for OTP", "Claims account will be blocked", "Urgency and pressure tactics"], "what_to_do": ["Hang up immediately", "Never share OTP with anyone", "Report to your bank"], "severity": "Critical"},
    {"id": "courier-scam", "title": "Courier Scam", "description": "Fake courier calls claim a parcel contains illegal items and demand payment to avoid arrest.", "warning_signs": ["Call from unknown courier company", "Threat of police action", "Demand for immediate payment"], "what_to_do": ["Hang up and verify with official courier", "Do not pay", "Report to cybercrime helpline 1930"], "severity": "High"},
    {"id": "kyc-scam", "title": "KYC Scam", "description": "Scammers send fake KYC update requests via SMS or call to steal banking credentials.", "warning_signs": ["Unsolicited KYC update request", "Link to unofficial website", "Asks for Aadhaar/PAN details"], "what_to_do": ["Visit bank branch directly", "Never click KYC links in SMS", "Report to bank immediately"], "severity": "Critical"},
]


def get_threats() -> dict:
    return {"threats": _THREATS}


# ── Daily Tip ─────────────────────────────────────────────────────────────────

_DAILY_TIPS = [
    ("Use a password manager to generate and store unique passwords for every account.", "Password"),
    ("Enable two-factor authentication on all important accounts today.", "Password"),
    ("Never share your OTP with anyone — not even bank employees.", "Scam"),
    ("Check the sender's email address carefully before clicking any link.", "Phishing"),
    ("Keep your phone's OS and apps updated to patch security vulnerabilities.", "Device"),
    ("Avoid using public Wi-Fi for banking or shopping. Use a VPN if necessary.", "Privacy"),
    ("Review which apps have access to your camera, microphone, and location.", "Privacy"),
    ("Download apps only from the official Google Play Store or Apple App Store.", "Malware"),
    ("Verify a QR code's destination URL before making any payment.", "Scam"),
    ("Back up your important data regularly to an offline or encrypted location.", "Device"),
    ("Use HTTPS websites only when entering personal or financial information.", "Phishing"),
    ("Set your social media profiles to private and limit who can see your posts.", "Privacy"),
    ("Legitimate companies will never ask for your password over phone or email.", "Phishing"),
    ("Report cyber fraud immediately to the national helpline: 1930.", "Scam"),
    ("Use a separate email address for online shopping and subscriptions.", "Email"),
]


def get_daily_tip() -> dict:
    import random
    idx = random.randint(0, len(_DAILY_TIPS) - 1)
    tip, category = _DAILY_TIPS[idx]
    return {"tip": tip, "category": category, "day_index": idx}


# ── Chat ──────────────────────────────────────────────────────────────────────

_CHAT_KB: list[tuple[list[str], str, list[str]]] = [
    (["phishing", "fake email", "fake link", "suspicious email"],
     "Phishing is a cyberattack where criminals send fake emails or messages pretending to be trusted organisations to steal your credentials or money. Always verify the sender's email address, hover over links before clicking, and never enter passwords on pages you reached via an email link.",
     ["Check sender email carefully", "Never click links in unsolicited emails", "Go directly to the website by typing the URL"]),
    (["password", "strong password", "password safety"],
     "A strong password is at least 12 characters long and combines uppercase letters, lowercase letters, numbers, and special symbols. Never reuse passwords across sites. Use a password manager like Bitwarden or 1Password to generate and store unique passwords.",
     ["Use 12+ characters", "Mix letters, numbers, symbols", "Use a password manager", "Enable 2FA"]),
    (["malware", "virus", "ransomware", "trojan", "spyware"],
     "Malware is malicious software designed to damage or gain unauthorised access to your device. Ransomware encrypts your files and demands payment. Protect yourself by keeping software updated, using reputable antivirus software, and never downloading files from untrusted sources.",
     ["Keep OS and apps updated", "Use reputable antivirus", "Avoid pirated software", "Back up data regularly"]),
    (["scam", "fraud", "fake call", "vishing"],
     "Scams often involve impersonation — fraudsters pose as bank officials, government agents, or courier companies to create urgency and extract money or personal data. Legitimate organisations never demand immediate payment or ask for OTPs over the phone.",
     ["Hang up on suspicious calls", "Verify by calling official numbers", "Never pay under pressure"]),
    (["qr", "qr code", "qr scam", "qr fraud"],
     "QR code scams involve fraudulent codes that redirect payments to scammer accounts or lead to phishing websites. Always preview the URL a QR code points to before opening it, and verify the UPI recipient name before confirming any payment.",
     ["Preview QR URL before opening", "Verify UPI recipient name", "Never scan QR codes from strangers"]),
    (["upi", "upi fraud", "payment fraud", "gpay", "phonepe"],
     "UPI fraud includes fake payment requests, screen-sharing scams, and impersonation of bank officials. Remember: receiving money never requires entering your UPI PIN. Never share your PIN or OTP, and enable transaction limits on your UPI app.",
     ["Never share UPI PIN", "Receiving money needs no PIN", "Enable transaction alerts", "Report to 1930"]),
    (["otp", "otp scam", "one time password"],
     "OTP scams involve fraudsters calling victims and posing as bank or government officials to extract one-time passwords. Once they have your OTP, they can authorise transactions or take over your account. Banks and government agencies will NEVER ask for your OTP.",
     ["Never share OTP with anyone", "Hang up immediately", "Report to your bank"]),
    (["wifi", "public wifi", "wi-fi", "hotspot"],
     "Public Wi-Fi networks are often unsecured, allowing attackers to intercept your data through man-in-the-middle attacks. Avoid accessing banking or sensitive accounts on public Wi-Fi. Use a VPN to encrypt your connection when on public networks.",
     ["Use a VPN on public Wi-Fi", "Avoid banking on public networks", "Forget networks after use"]),
    (["social media", "facebook", "instagram", "twitter", "linkedin"],
     "Social media safety involves protecting your personal information from being harvested for scams or identity theft. Set your profiles to private, be cautious about what you share, enable login alerts, and never accept friend requests from strangers.",
     ["Set profiles to private", "Enable login notifications", "Don't overshare personal info", "Use strong unique passwords"]),
    (["browser", "browser safety", "safe browsing", "https"],
     "Safe browsing means only visiting HTTPS websites when entering personal data, keeping your browser updated, using ad blockers to prevent malvertising, and being cautious about browser extensions that request broad permissions.",
     ["Look for HTTPS padlock", "Keep browser updated", "Use reputable ad blocker", "Review extension permissions"]),
]

_DEFAULT_ANSWER = (
    "I can help you with cybersecurity topics such as phishing, passwords, malware, scams, QR fraud, UPI fraud, ransomware, browser safety, Wi-Fi safety, and social media safety. Please ask a specific question about any of these topics.",
    "General",
    ["Stay alert online", "Keep software updated", "Report cyber crime to 1930"],
)


def get_chat_answer(payload) -> dict:
    q = payload.question.lower()
    for keywords, answer, tips in _CHAT_KB:
        if any(kw in q for kw in keywords):
            return {"answer": answer, "topic": keywords[0].title(), "tips": tips}
    return {"answer": _DEFAULT_ANSWER[0], "topic": _DEFAULT_ANSWER[1], "tips": _DEFAULT_ANSWER[2]}


# ── Security Score ────────────────────────────────────────────────────────────

_SCORE_WEIGHTS = {
    "strongPassword": 25,
    "mfa": 25,
    "updates": 20,
    "antivirus": 15,
    "backup": 15,
}

_SCORE_RECS = {
    "strongPassword": "Use a unique password of 12+ characters with mixed characters for every account.",
    "mfa": "Enable multi-factor authentication on all important accounts.",
    "updates": "Keep your operating system and all apps updated to patch security vulnerabilities.",
    "antivirus": "Install and maintain a reputable antivirus solution.",
    "backup": "Back up your important data regularly to an offline or encrypted cloud location.",
}


def get_security_score(payload) -> dict:
    answers = payload.answers
    score = sum(w for k, w in _SCORE_WEIGHTS.items() if answers.get(k, False))
    recommendations = [_SCORE_RECS[k] for k in _SCORE_WEIGHTS if not answers.get(k, False)]
    if score >= 80:
        level = "Advanced"
    elif score >= 50:
        level = "Intermediate"
    else:
        level = "Beginner"
    return {"score": score, "level": level, "recommendations": recommendations}

def get_history(scan_type: Optional[str], page: int, page_size: int) -> dict:
    page, page_size = validate_page_params(page, page_size)
    skip = (page - 1) * page_size
    data, total = db_get_history(scan_type, skip, page_size)
    return {"total": total, "page": page, "page_size": page_size, "data": data}


def get_dashboard() -> dict:
    return db_dashboard_stats()


# ── Breach Check ──────────────────────────────────────────────────────────────

_BREACH_SOURCES: list[dict] = [
    {"name": "Collection #1", "year": 2019, "data_type": "Email, Password"},
    {"name": "LinkedIn", "year": 2012, "data_type": "Email, Password"},
    {"name": "Facebook", "year": 2019, "data_type": "Email, Phone, Password"},
    {"name": "Adobe", "year": 2013, "data_type": "Email, Password, Credit Card"},
    {"name": "HaveIBeenPwned", "year": 2023, "data_type": "Email, Password"},
    {"name": "Twitter", "year": 2022, "data_type": "Email"},
    {"name": "Dropbox", "year": 2016, "data_type": "Email, Password"},
    {"name": "MyFitnessPal", "year": 2018, "data_type": "Email, Password"},
]


def check_breach(payload: BreachCheckRequest) -> dict:
    """Simulate breach check — random verdict based on email hash."""
    from .validators import validate_email
    email = validate_email(payload.email)

    # Deterministic pseudo-random check based on email hash
    email_hash = sum(ord(c) for c in email)
    is_breached = (email_hash % 3) == 0
    breach_count = (email_hash % 5) + 1 if is_breached else 0

    import random
    rng = random.Random(email_hash)
    sources = rng.sample(_BREACH_SOURCES, min(breach_count, len(_BREACH_SOURCES))) if is_breached else []

    recommendation = (
        "Your email appears in known data breaches. Immediately change the password on all accounts using this email and enable two-factor authentication."
        if is_breached
        else "No breaches found for this email. Continue using strong, unique passwords."
    )

    result = {
        "email": email,
        "is_breached": is_breached,
        "breach_count": breach_count,
        "sources": sources,
        "recommendation": recommendation,
    }
    db_save_scan("breach_check", email, result)
    logger.info("Breach check completed for %s → breached=%s", email, is_breached)
    return result


# ── Activity Log ──────────────────────────────────────────────────────────────

def get_activity_log(limit: int = 20) -> dict:
    """Retrieve recent user activity log entries."""
    activities = db_get_activity_log(limit)
    return {"activities": activities}


# ── Security Checklist ────────────────────────────────────────────────────────

_CHECKLIST = [
    {"id": "chk-1", "category": "Password", "title": "Use strong, unique passwords", "description": "Use 12+ character passwords with a mix of letters, numbers, and symbols. Never reuse passwords across accounts.", "severity": "Critical", "icon": "lock"},
    {"id": "chk-2", "category": "Password", "title": "Enable two-factor authentication", "description": "Enable MFA on all critical accounts — email, banking, social media.", "severity": "Critical", "icon": "shield"},
    {"id": "chk-3", "category": "Device", "title": "Keep software updated", "description": "Regularly update OS, apps, and browser to patch known vulnerabilities.", "severity": "High", "icon": "refresh-cw"},
    {"id": "chk-4", "category": "Device", "title": "Install antivirus", "description": "Use reputable antivirus software and run regular scans.", "severity": "High", "icon": "search"},
    {"id": "chk-5", "category": "Email", "title": "Beware of phishing emails", "description": "Never click links or open attachments in unsolicited emails. Verify the sender.", "severity": "Critical", "icon": "alert-triangle"},
    {"id": "chk-6", "category": "Privacy", "title": "Review app permissions", "description": "Check which apps have access to your camera, microphone, and location.", "severity": "Medium", "icon": "eye"},
    {"id": "chk-7", "category": "Network", "title": "Use a VPN on public Wi-Fi", "description": "Encrypt your traffic with a VPN when using public or untrusted networks.", "severity": "Medium", "icon": "wifi"},
    {"id": "chk-8", "category": "Backup", "title": "Back up important data", "description": "Regularly back up data to an offline or encrypted cloud location.", "severity": "High", "icon": "hard-drive"},
    {"id": "chk-9", "category": "Social Media", "title": "Check social media privacy", "description": "Set profiles to private and limit what personal info is visible.", "severity": "Medium", "icon": "users"},
    {"id": "chk-10", "category": "Scam", "title": "Verify offers and calls", "description": "Verify unexpected calls, emails, or offers through official channels.", "severity": "High", "icon": "phone"},
]


def get_checklist() -> dict:
    """Return the security checklist."""
    return {"checklist": _CHECKLIST, "total_count": len(_CHECKLIST), "completed_count": 0}
