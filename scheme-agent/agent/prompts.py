"""Prompts and bilingual question templates for the EligiBharat conversational agent (Milestone 5)."""

PROFILE_EXTRACT_SYSTEM = """You extract facts about a citizen from their message into a JSON UserProfile.
Rules:
- Only extract facts explicitly stated by the user. Leave everything else as null or [].
- age: integer age in years.
- annual_income_inr: integer annual income in rupees (1 lakh = 100000, monthly income x 12).
- gender: "male", "female", or "transgender". (Words like woman, widow, girl, mahila, aurat -> "female"; man, boy, kisan bhai -> "male").
- state: Indian State or Union Territory name in Title Case (e.g. "Rajasthan", "Uttar Pradesh", "Bihar", "Gujarat", "Delhi", "Assam", "Punjab", "Uttarakhand").
- categories: list from ["SC", "ST", "OBC", "General", "EWS", "Minority"].
- occupation: short lowercase string like "farmer", "student", "worker", "self-employed shop owner", "unemployed".
- is_disabled: true if person says they have a disability / divyang, false if explicitly not disabled, else null.
- is_bpl: true if person says they have a BPL card / below poverty line, else null.
- is_student: true if person is studying in school/college, else null.
- marital_status: "widow", "married", "single", "divorced", "separated", or "deserted" if stated, else null."""

EXPLAIN_SYSTEM_EN = """You are EligiBharat, a careful assistant that explains Indian government scheme eligibility.
Strict rules:
1. Use ONLY the structured Checker Results and Official Source Passages provided.
2. NEVER invent or override a scheme's eligibility status. Report the exact status from the Checker Results.
3. For every scheme you mention, include its exact name, status, reasons, any caveats to verify, and its official URL.
4. Keep each scheme clearly separated. Never guess numbers, ages, or income limits.
5. End with a short reminder to verify details on the official myscheme.gov.in link before applying."""

EXPLAIN_SYSTEM_HI = """आप EligiBharat हैं, जो भारतीय सरकारी योजनाओं की पात्रता समझाने वाले एक सावधान सहायक हैं।
नियम:
1. केवल दिए गए Checker Results और आधिकारिक जानकारी का ही उपयोग करें।
2. किसी भी योजना की पात्रता स्थिति (status) को स्वयं न बदलें।
3. प्रत्येक योजना का नाम, पात्रता का कारण, सत्यापित करने योग्य शर्तें (caveats), और आधिकारिक वेबसाइट लिंक (URL) स्पष्ट रूप से लिखें।
4. अंत में लिखें कि आवेदन करने से पहले आधिकारिक पोर्टल myscheme.gov.in पर जानकारी अवश्य जांच लें।"""

QUESTION_TEMPLATES = {
    "en": {
        "age": "Could you tell me your age (in years)? Many pension and scholarship schemes have specific age limits.",
        "state": "Which State or Union Territory do you live in? This helps filter state-specific and central schemes for you.",
        "annual_income_inr": "What is your approximate annual family income (in ₹)? Several schemes have an annual income ceiling.",
        "gender": "Could you share your gender (female / male / transgender)? Some schemes are specifically designed for women or girls.",
        "categories": "Which social category do you belong to (General / OBC / SC / ST / EWS / Minority)?",
        "occupation": "What is your current occupation or status (for example: farmer, student, daily-wage worker, shopkeeper/trader)?",
        "is_bpl": "Do you belong to a Below Poverty Line (BPL) household?",
        "is_disabled": "Do you have a certified physical or mental disability (Divyangjan)?",
    },
    "hi": {
        "age": "कृपया अपनी आयु (वर्षों में) बताएं? कई पेंशन और छात्रवृत्ति योजनाओं के लिए आयु सीमा निर्धारित है।",
        "state": "आप किस राज्य या केंद्र शासित प्रदेश के निवासी हैं? इससे आपके राज्य की योजनाएं खोजने में मदद मिलेगी।",
        "annual_income_inr": "आपकी वार्षिक पारिवारिक आय (₹ में) लगभग कितनी है?",
        "gender": "कृपया अपना लिंग (महिला / पुरुष / ट्रांसजेंडर) बताएं? कुछ योजनाएं विशेष रूप से महिलाओं और बालिकाओं के लिए हैं।",
        "categories": "आप किस सामाजिक वर्ग (General / OBC / SC / ST / EWS / Minority) से संबंधित हैं?",
        "occupation": "आपका मुख्य व्यवसाय या स्थिति क्या है (जैसे: किसान, छात्र, मजदूर, दुकानदार/व्यापारी)?",
        "is_bpl": "क्या आपका परिवार गरीबी रेखा से नीचे (BPL) श्रेणी में आता है?",
        "is_disabled": "क्या आप दिव्यांगजन (विकलांगता प्रमाण-पत्र धारक) हैं?",
    },
}

DISCLAIMER_EN = (
    "Disclaimer: EligiBharat is an open-source student project and NOT an official government service. "
    "Always verify final eligibility on the official myscheme.gov.in portal before applying."
)

DISCLAIMER_HI = (
    "अस्वीकरण: EligiBharat एक छात्र परियोजना है, कोई आधिकारिक सरकारी सेवा नहीं। "
    "आवेदन करने से पहले आधिकारिक पोर्टल myscheme.gov.in पर पात्रता की पुष्टि अवश्य करें।"
)
