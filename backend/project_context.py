"""Per-project RAG corpus context for the Yavi.ai live LLM chat endpoint.

Compact text bundles (concatenated OCR + ownership chain + validation findings)
keyed by project ID, plus the citation-eligible chunk index. Mirrors the data
in /app/frontend/src/data/projectData.js but compressed for inclusion in the
system prompt.
"""
from typing import Dict, List, TypedDict


class ProjectChunk(TypedDict):
    id: str
    source: str
    text: str


class ProjectContext(TypedDict):
    name: str
    location: str
    survey: str
    status: str
    confidence: float
    corpus: str
    chunks: List[ProjectChunk]


PROJECT_CONTEXT: Dict[str, ProjectContext] = {
    # ----------------------------------------------------------------------
    "MMRDA-2026-0142": {
        "name": "Virar–Alibaug Multimodal Corridor — Phase 2",
        "location": "Kharbav village, Bhiwandi taluka, Thane district",
        "survey": "Survey 247/3B",
        "status": "Conditional",
        "confidence": 92.7,
        "corpus": """\
[7/12 EXTRACT — Survey 247/3B, Kharbav, Bhiwandi, Thane]  (Marathi)
खातेदार (Holder): सदानंद कृष्ण पाटील (Sadanand Krushna Patil)
क्षेत्र (Area): 4.8600 हेक्टर | पीक (Crop): भात, भाजीपाला
खाते क्रमांक: 1184 | Other rights: none recorded.

[PROPERTY CARD] CTS 14/2A, Ward Bhiwandi-NMC W-3
Holder: Sadanand Krushna Patil | Area: 4.8600 Ha | Tenure: Occupancy Class-I (freehold)
Last mutation: M.E. 4421 dated 03-09-2022 (inheritance).

[AADHAAR] Sadanand Krushna Patil | DOB 11-08-1962 | UID XXXX-XXXX-3142
[PAN]    AKLPP9821C — Active.

[SALE DEED dated 14-Aug-1998, registered BHI-1998-2147 at Sub-Registrar Bhiwandi]
Vendor: Krushna Tukaram Patil (father; deceased 10-04-2021)
Vendee: Sadanand Krushna Patil (son)
Consideration: ₹4,80,000.

[MUTATION ENTRY M.E. 4421, dated 03-09-2022, certified by Talathi Saja Kharbav]
Reason: inheritance on death of Krushna Tukaram Patil.
New recorded holder: Sadanand Krushna Patil.

[ENCUMBRANCE CERTIFICATE Form-22, period 01-01-2014 → 12-01-2026]
ACTIVE equitable mortgage in favour of Bank of Maharashtra
Loan A/c BOM-AGRI-77821 | Original principal ₹18,50,000 | OUTSTANDING ₹4,12,000.
No other liens, lis pendens or charges.

[OWNERSHIP CHAIN]
1962 Tukaram V. Patil (original patta, pre-Independence)
1985 Krushna T. Patil (inheritance, M.E. 1182)
1998 Sadanand K. Patil (Sale Deed BHI-1998-2147)
2014 Equitable mortgage created (BoM AGRI-77821)
2022 Sadanand K. Patil (Mutation M.E. 4421 — father's estate)
2026 MMRDA Acquisition Notice u/s 11 RFCTLARR Act, 2013.

[CO-OWNERS]  Sushila S. Patil and Mahesh S. Patil have NOT co-signed the acquisition notice.

[VALIDATION FINDINGS]
- Owner identity match (7/12 ↔ Aadhaar ↔ PAN ↔ Sale Deed): 99.4% — PASS
- Survey number consistency (247/3B): 100% across 6 docs — PASS
- Mutation chain complete (5/5 entries 1962→2022) — PASS
- No active encumbrance: FAIL (active BoM mortgage ₹4.12L outstanding)
- Aadhaar UIDAI verification: 99.4% — PASS
- Required NOCs filed: FAIL (Tehsildar NOC pending; Forest Dept. NOC not applicable)
- Property tax — no dues: PASS (cleared up to FY 2025-26)
- Title status: CONDITIONAL (92.7% confidence)
- Risk flags: HIGH = active mortgage; MEDIUM = co-owners not co-signing, Tehsildar NOC pending.
- AI recommendation: discharge mortgage with BoM and file Tehsildar NOC; title will then auto-promote to CLEAR.

[GOVERNMENT API STATUS]
- MahaBhulekh: VERIFIED (Survey 247/3B matched)
- UIDAI:       VERIFIED (Aadhaar XXXX-3142 demographic match 99.4%)
- NSDL PAN:    VERIFIED (AKLPP9821C active)
- IGRS Bhiwandi: VERIFIED (Deed BHI-1998-2147 registered)
- Encumbrance Registry: WARNING (active mortgage entry)
- MMRDA GIS Atlas: VERIFIED (boundaries match cadastral layer)
""",
        "chunks": [
            {"id": "p1-ch-018", "source": "7/12 Extract — pg.1",      "text": "खातेदार: सदानंद कृष्ण पाटील | क्षेत्र: 4.8600 हेक्टर | सर्व्हे क्रमांक: 247/3B"},
            {"id": "p1-ch-042", "source": "Sale Deed 1998 — §2",      "text": "the Vendor doth hereby convey absolutely unto the Vendee all that piece of agricultural land bearing Survey No. 247/3B"},
            {"id": "p1-ch-077", "source": "Encumbrance Cert. — pg.3", "text": "Equitable mortgage in favour of Bank of Maharashtra, Loan A/c BOM-AGRI-77821, outstanding ₹4,12,000"},
            {"id": "p1-ch-103", "source": "Mutation M.E. 4421",       "text": "Inheritance on death of Krushna Tukaram Patil (10-04-2021); new holder: Sadanand Krushna Patil"},
            {"id": "p1-ch-129", "source": "Property Card",            "text": "CTS 14/2A | Tenure: Occupancy Class-I | Last Mutation: M.E. 4421 dated 03-09-2022"},
            {"id": "p1-ch-aad", "source": "Aadhaar — S. K. Patil",    "text": "UID: XXXX XXXX 3142 | Sadanand Krushna Patil | DOB 11-08-1962"},
        ],
    },
    # ----------------------------------------------------------------------
    "MMRDA-2026-0098": {
        "name": "Mumbai Trans Harbour Link — Bridge Approach",
        "location": "Chirner village, Uran taluka, Raigad district",
        "survey": "Survey 184/2A",
        "status": "Clear",
        "confidence": 96.4,
        "corpus": """\
[7/12 EXTRACT — Survey 184/2A, Chirner, Uran, Raigad]  (Marathi)
खातेदार (Holder): भरत वसंत नाईक (Bharat Vasant Naik)
क्षेत्र (Area): 2.3400 हेक्टर | पीक: खार बंधारी (saline-bunded, NA-pending)
खाते क्रमांक: 907 | Other rights: none recorded.

[PROPERTY CARD — Gram Panchayat Chirner]
GP Ref GP/Chirner/184 | Holder Bharat V. Naik | Area 2.3400 Ha | Tenure Occupancy Class-I.
Last mutation: M.E. 2087 dated 12-04-2018 (survey re-numbering only).

[AADHAAR] Bharat Vasant Naik | DOB 07-02-1971 | UID XXXX-XXXX-9087
[PAN]    BVNPK4571D — Active.

[CONSOLIDATION DEED dated 17-Feb-2010, registered URN-2010-0871 at Sub-Registrar Uran]
Vendors: Smt. Sushila V. Naik (sister) and Shri Manohar V. Naik (brother).
Vendee: Bharat Vasant Naik (sole, post buy-out of co-heirs).
Consideration: ₹11,40,000 (combined).

[MUTATION ENTRY M.E. 2087, dated 12-04-2018, certified by Talathi Saja Chirner]
Reason: District-level survey re-numbering (Old 184 → 184/2A). Holder unchanged.

[ENCUMBRANCE CERTIFICATE Form-22, period 01-01-2010 → 04-12-2025]
NIL ENTRIES — no mortgage, lien, lis pendens or charge recorded.

[FOREST DEPARTMENT NOC — Ref MFD/RGD/NOC/2024/0418, dated 18-09-2024]
No-Objection granted for transfer of Survey 184/2A — outside notified forest boundary
as per FRA-2006 cadastral overlay.

[OWNERSHIP CHAIN]
1968 Vasant Madhav Naik (original saline-land patta)
1992 Vasant M. Naik (FSI Class-I conferment u/s 36)
2002 Heirs of Vasant Naik (joint estate, 3 heirs)
2010 Bharat V. Naik (Consolidation Deed URN-2010-0871, buy-out of co-heirs)
2018 Bharat V. Naik (Mutation M.E. 2087 — survey re-numbering)
2024 Bharat V. Naik (Forest Dept. NOC granted)
2026 MMRDA Acquisition Notice u/s 11 — disbursement scheduled 05-Mar-2026.

[VALIDATION FINDINGS]
- Owner identity match: 99.6% — PASS
- Survey 184/2A consistency: 100% across 7 docs — PASS
- Mutation chain (6/6 entries 1968→2018): 100% — PASS
- No active encumbrance: PASS (NIL EC entries 2010–2025)
- Aadhaar UIDAI verification: 99.6% — PASS
- Required NOCs filed: PASS (Forest Dept. NOC granted; Tehsildar NOC on file)
- Property tax — no dues: PASS (GP Chirner cleared up to FY 2025-26)
- Title status: CLEAR (96.4% confidence) — ready for compensation disbursement.
- Risk flags: LOW = saline-bunded category (pre-NA conversion); LOW = disbursement schedule pending finance approval.

[GOVERNMENT API STATUS] All 6 endpoints VERIFIED — MahaBhulekh, UIDAI, NSDL PAN, IGRS Uran, Encumbrance Registry (NIL), MMRDA GIS Atlas (outside forest boundary).
""",
        "chunks": [
            {"id": "p2-ch-007", "source": "7/12 Extract — pg.1",          "text": "खातेदार: भरत वसंत नाईक | क्षेत्र: 2.3400 हेक्टर | सर्व्हे क्रमांक: 184/2A — चिरनेर, उरण"},
            {"id": "p2-ch-031", "source": "Consolidation Deed 2010 — §1", "text": "the Vendors do hereby release, convey and assign their respective undivided shares unto the sole Vendee Bharat Vasant Naik"},
            {"id": "p2-ch-058", "source": "Encumbrance Cert. — pg.2",     "text": "NIL ENTRIES — no mortgage, lien, lis pendens or charge recorded between 01-01-2010 and 04-12-2025"},
            {"id": "p2-ch-074", "source": "Forest Dept. NOC",             "text": "No-Objection granted — Survey 184/2A is outside notified forest boundary as per FRA-2006 cadastral overlay"},
            {"id": "p2-ch-095", "source": "Mutation M.E. 2087",           "text": "Mutation reason: district survey re-numbering (Old 184 → 184/2A). Holder unchanged: Bharat Vasant Naik"},
            {"id": "p2-ch-aad", "source": "Aadhaar — B. V. Naik",         "text": "UID: XXXX XXXX 9087 | Bharat Vasant Naik | DOB 07-02-1971"},
        ],
    },
    # ----------------------------------------------------------------------
    "MMRDA-2026-0117": {
        "name": "Versova–Bandra Sea Link — Right of Way Acquisition",
        "location": "Andheri (West), Mumbai Suburban district",
        "survey": "CTS 442/B",
        "status": "Disputed",
        "confidence": 71.2,
        "corpus": """\
[TITLE DEED — Conveyance dated 04-Jan-1962, registered BBY-1962-1184 at Sub-Registrar Bandra-W]
Vendor: Bombay Suburban Improvement Trust.
Vendee: Hormuz Faramji Mistry (Parsi gentleman; now deceased — 2023).
Property: CTS 442/B, Andheri (West) — leasehold-to-freehold conversion.
Area: 0.6200 Ha. Consideration: ₹78,000.

[PROPERTY CARD] CTS 442/B, Ward K-W, Andheri (West)
Holder of record: Hormuz Faramji Mistry (DECEASED per HC PROBATE/4421/2024).
Tenure: Freehold (post-1962). Last mutation: PENDING (caveat dated 11-11-2025).

[PROBATE PETITION CIVIL/2024/PROBATE/4421 — Bombay High Court, filed 12-08-2024]
In re: Estate of Late Hormuz Faramji Mistry.
Petitioner: Cyrus Hormuz Mistry (son), seeking probate of Will dated 03-06-2018.
Respondent / Caveator: Pervin Faramji Mistry (sister of deceased).
Status: CONTESTED. Will challenged for due execution; matter referred to evidence stage.

[WILL dated 03-06-2018]  (DISPUTED)
Bequeaths CTS 442/B absolutely unto son Cyrus H. Mistry. Witnesses: F. Cooper, R. Daruwala.
Authenticity contested by sister Pervin Mistry — see HC Suit 4421/2025.

[AADHAAR — heir 1] Cyrus Hormuz Mistry  | DOB 19-04-1978 | UID XXXX-XXXX-2841 — verified
[AADHAAR — heir 2] Pervin Faramji Mistry | DOB 08-12-1955 | UID XXXX-XXXX-7314 — verified
[PAN]              AAFFM1284Z (Estate PAN — flagged 'deceased holder' by NSDL)

[ENCUMBRANCE CERTIFICATE Form-22, period 01-01-2010 → 21-11-2025]
Entry 1: Caveat under Sec. 148-A CPC filed by Pervin Mistry, dated 11-11-2025.
Entry 2: LIS PENDENS — Bombay HC Suit 4421/2025, dated 18-11-2025 (CTS 442/B).

[LITIGATION NOTICE — Bombay HC Suit 4421/2025, filed 18-11-2025]
Plaintiff: Pervin Faramji Mistry.
Defendants: (1) Cyrus Hormuz Mistry  (2) MMRDA.
Prayer: Declaration that Will dated 03-06-2018 is null and void;
INJUNCTION restraining acquisition until succession is judicially decided.

[CAVEAT FILING dated 11-11-2025, Bombay HC]
Caveator: Pervin F. Mistry. Notice required before any ex-parte order regarding CTS 442/B.

[OWNERSHIP CHAIN]
1962 Hormuz F. Mistry (BBY-1962-1184 — leasehold to freehold)
1985 Hormuz F. Mistry (FSI revision DCR Sec. 33(1) certified)
2018 Hormuz F. Mistry executed disputed Will
2023 Hormuz F. Mistry deceased
2024 Cyrus H. Mistry (claim) — Probate Petition CIVIL/2024/PROBATE/4421 filed (contested)
2025 DISPUTED — Caveat 11-11-2025 + HC Suit 4421/2025 filed 18-11-2025
2026 MMRDA notice — partial overlap with disputed plot.

[VALIDATION FINDINGS]
- Owner identity match: 82.0% — REVIEW (recorded holder deceased; heir identity contested).
- Survey/CTS consistency: 100% — PASS (CTS 442/B uniform).
- Mutation chain complete (1962→2025): 61.0% — REVIEW (post-2023 mutation PENDING).
- No active encumbrance: 12.0% — REVIEW (Caveat + Lis Pendens active).
- Aadhaar UIDAI verification (both heirs): PASS.
- Required NOCs filed: 0% — REVIEW (cannot file NOCs until succession resolved).
- Property tax — no dues: PASS (cleared up to FY 2024-25).
- Title status: DISPUTED (71.2% confidence) — acquisition BLOCKED.
- Risk flags: HIGH = heir succession dispute, HIGH = Lis Pendens recorded against parcel,
  MEDIUM = Caveat — notice required, MEDIUM = partial parcel overlap with proposed RoW.
- AI recommendation: either (a) carve out disputed plot and proceed with the rest of
  the alignment, or (b) deposit compensation in court under Sec. 31(2) RFCTLARR Act, 2013,
  pending HC outcome.

[GOVERNMENT API STATUS]
- MahaBhulekh: WARNING (holder field 'deceased' — mutation pending)
- UIDAI:       VERIFIED (Cyrus + Pervin both verified)
- NSDL PAN:    WARNING (Estate PAN — 'deceased holder' flag)
- IGRS Bandra: VERIFIED (Title Deed BBY-1962-1184 genuine)
- Encumbrance Registry: ERROR (Caveat + Lis Pendens active)
- MMRDA GIS Atlas: WARNING (partial parcel falls inside proposed RoW alignment).
""",
        "chunks": [
            {"id": "p3-ch-014", "source": "Title Deed 1962 — pg.3",        "text": "Vendee: Hormuz Faramji Mistry (Parsi gentleman). Conveyed CTS 442/B, Andheri (West), area 0.6200 Ha — leasehold to freehold."},
            {"id": "p3-ch-091", "source": "Probate Order 2024 — pg.6",     "text": "Will dated 03-06-2018 challenged by Pervin Mistry on grounds of due execution; matter referred to evidence stage."},
            {"id": "p3-ch-128", "source": "HC Suit 4421/2025 — Prayer",     "text": "Plaintiff prays for declaration that Will dated 03-06-2018 is null and void; injunction restraining acquisition until succession decided."},
            {"id": "p3-ch-152", "source": "Encumbrance Cert. — pg.4",       "text": "Entry 2: Lis Pendens — Bombay HC Suit 4421/2025 dated 18-11-2025 (CTS 442/B)."},
            {"id": "p3-ch-187", "source": "Caveat 11-11-2025",              "text": "Caveator: Pervin Mistry — notice required before any ex-parte order regarding CTS 442/B."},
            {"id": "p3-ch-aad1", "source": "Aadhaar — Cyrus H. Mistry",     "text": "UID: XXXX XXXX 2841 | Cyrus Hormuz Mistry | DOB 19-04-1978"},
            {"id": "p3-ch-aad2", "source": "Aadhaar — Pervin Mistry",        "text": "UID: XXXX XXXX 7314 | Pervin Faramji Mistry | DOB 08-12-1955"},
        ],
    },
}


def build_system_prompt(project_id: str) -> str:
    """Builds the Yavi.ai system prompt grounded on a single project's corpus."""
    ctx = PROJECT_CONTEXT.get(project_id) or PROJECT_CONTEXT["MMRDA-2026-0142"]
    chunks_block = "\n".join(
        f'- {c["id"]} ({c["source"]}): "{c["text"]}"'
        for c in ctx["chunks"]
    )
    return f"""You are **Yavi.ai**, the AI title-validation assistant inside the MMRDA (Mumbai Metropolitan Region Development Authority) Land Acquisition Platform. You answer officer questions about a single active land-acquisition project, grounded ONLY on the indexed document corpus you are given below.

# ACTIVE PROJECT
- ID: {project_id}
- Name: {ctx["name"]}
- Location: {ctx["location"]} | {ctx["survey"]}
- System-determined title status: **{ctx["status"]}** ({ctx["confidence"]:.1f}% confidence)

# INDEXED DOCUMENT CORPUS
{ctx["corpus"]}

# CITATION-ELIGIBLE CHUNKS (cite by id)
{chunks_block}

# INSTRUCTIONS
1. Answer ONLY using the indexed corpus. If a question cannot be answered from the corpus, say so honestly.
2. Be concise and authoritative — max 4 sentences. Use **bold** for the most important facts (status, dates, amounts, names).
3. Always cite 1–2 chunk IDs from the list above that directly support your answer.
4. Return ONLY a single JSON object with no markdown fences, no commentary, exactly in this shape:
{{"answer": "<your answer with **bold** allowed>", "confidence": <integer 50-99>, "citations": [{{"doc": "<source>", "chunk": "<chunk id>", "line": "<short verbatim quote>"}}]}}
5. Do NOT output any text outside the JSON. No preamble, no closing remarks.
"""
