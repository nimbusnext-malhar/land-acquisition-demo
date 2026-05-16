// Per-project document corpora, ownership chains, validation, RAG chunks,
// chat scripts and Government-API states. Each project's data is unique so
// the workspace, RAG pipeline, chatbot and validation pages do NOT mix.

// ============================================================================
// PROJECT 1 — MMRDA-2026-0142  (Conditional, 92.7% — Bhiwandi rural)
// ============================================================================
const P1_DOCUMENTS = [
  {
    id: "p1-712", name: "7/12 Extract — Survey 247/3B", type: "7/12 Extract",
    pages: 2, status: "Indexed", confidence: 96, uploadedAt: "12 Jan 2026 · 09:14",
    chunks: 24, meta: { khateNo: "1184", area: "4.86 Ha", crop: "Paddy / Vegetable" },
    ocr: `महाराष्ट्र शासन — महसूल विभाग
सात-बारा उतारा | गाव: खारबाव | तालुका: भिवंडी | जिल्हा: ठाणे
सर्व्हे क्रमांक / गट क्रमांक: 247/3B
खातेदार: सदानंद कृष्ण पाटील
क्षेत्र: 4.8600 हेक्टर
पीक: भात, भाजीपाला
खाते क्रमांक: 1184
नोंदणी दिनांक: 17/03/2018
इतर हक्क: कोणतेही नाहीत`,
  },
  { id: "p1-pcard", name: "Property Card", type: "Property Card",
    pages: 1, status: "Indexed", confidence: 94, uploadedAt: "12 Jan 2026 · 09:16",
    chunks: 11, meta: { cts: "CTS 14/2A", ward: "Bhiwandi-NMC W-3" },
    ocr: "PROPERTY CARD\nCTS No: 14/2A | Ward: Bhiwandi-NMC W-3\nHolder: Sadanand Krushna Patil\nArea: 4.8600 Ha | Tenure: Occupancy Class-I\nLast Mutation: M.E. 4421 dated 03-09-2022 (Inheritance)",
  },
  { id: "p1-aadhaar", name: "Aadhaar — S. K. Patil", type: "Aadhaar",
    pages: 1, status: "Verified", confidence: 99, uploadedAt: "12 Jan 2026 · 09:18",
    chunks: 4, meta: { uid: "XXXX-XXXX-3142", dob: "11-08-1962" },
    ocr: "Government of India\nUnique Identification Authority of India\nName: Sadanand Krushna Patil\nDOB: 11-08-1962 | Male\nUID: XXXX XXXX 3142",
  },
  { id: "p1-saledeed", name: "Sale Deed — 1998", type: "Sale Deed",
    pages: 12, status: "Indexed", confidence: 89, uploadedAt: "12 Jan 2026 · 09:22",
    chunks: 86, meta: { regNo: "BHI-1998-2147", subRegistrar: "Bhiwandi" },
    ocr: "Indenture of Sale dated 14th day of August, 1998…\nVendor: Krushna Tukaram Patil (deceased 2021)\nVendee: Sadanand Krushna Patil\nConsideration: ₹4,80,000\nRegistered at Sub-Registrar Bhiwandi, BHI-1998-2147",
  },
  { id: "p1-mutation", name: "Mutation Record — M.E. 4421", type: "Mutation",
    pages: 3, status: "Indexed", confidence: 91, uploadedAt: "12 Jan 2026 · 09:24",
    chunks: 18, meta: { mutEntry: "M.E. 4421", date: "03-09-2022", reason: "Inheritance" },
    ocr: "Mutation Entry M.E. 4421 dated 03-09-2022\nReason: Inheritance on death of Krushna Tukaram Patil (10-04-2021)\nNew Holder: Sadanand Krushna Patil\nCertified by Talathi, Saja Kharbav.",
  },
  { id: "p1-ec", name: "Encumbrance Certificate", type: "Encumbrance",
    pages: 4, status: "Flagged", confidence: 82, uploadedAt: "12 Jan 2026 · 09:27",
    chunks: 22, meta: { ecPeriod: "2014–2026", banks: "Bank of Maharashtra" },
    ocr: "Encumbrance Certificate (Form 22)\nPeriod: 01-01-2014 to 12-01-2026\nEntry 1 of 1: Equitable Mortgage in favour of Bank of Maharashtra,\nLoan A/c BOM-AGRI-77821, ₹18,50,000 — partial repayment outstanding ₹4,12,000.",
  },
];

const P1_OWNERSHIP_CHAIN = [
  { year: "1962", owner: "Tukaram Vithoba Patil", event: "Original Holder (Pre-Independence Patta)", status: "ok" },
  { year: "1985", owner: "Krushna Tukaram Patil", event: "Inheritance — M.E. 1182", status: "ok" },
  { year: "1998", owner: "Sadanand Krushna Patil", event: "Sale Deed BHI-1998-2147", status: "ok" },
  { year: "2014", owner: "Sadanand Krushna Patil", event: "Equitable Mortgage — BOM-AGRI-77821", status: "warn" },
  { year: "2022", owner: "Sadanand Krushna Patil", event: "Mutation M.E. 4421 — Father's Estate", status: "ok" },
  { year: "2026", owner: "—", event: "MMRDA Acquisition Notice u/s 11", status: "info" },
];

const P1_VALIDATION_CHECKS = [
  { id: "owner-match",   label: "Owner Name Match (7/12 ↔ Aadhaar ↔ PAN)", pass: true,  detail: "Sadanand K. Patil — exact across 3 sources" },
  { id: "survey-match",  label: "Survey Number Consistency",                pass: true,  detail: "247/3B identical in 7/12, Property Card, Sale Deed" },
  { id: "mutation-chain", label: "Mutation Chain Complete (1962→2022)",     pass: true,  detail: "5 of 5 entries traceable" },
  { id: "encumbrance",   label: "No Active Encumbrance",                    pass: false, detail: "Active mortgage with Bank of Maharashtra (₹4.12L outstanding)" },
  { id: "aadhaar",       label: "Aadhaar Verified (UIDAI)",                 pass: true,  detail: "Demographic match — 99.4%" },
  { id: "noc",           label: "Required NOCs Filed",                      pass: false, detail: "Tehsildar NOC pending; Forest Dept. NOC not required" },
  { id: "tax-dues",      label: "Property Tax — No Dues",                   pass: true,  detail: "Cleared up to FY 2025-26" },
];

const P1_RISK_FLAGS = [
  { id: "mortgage", level: "high",   label: "Active mortgage detected",        source: "Encumbrance Certificate", icon: "AlertTriangle" },
  { id: "co-owner", level: "medium", label: "Co-owners not co-signing notice", source: "Sale Deed §3, Mutation 4421", icon: "Users" },
  { id: "noc",      level: "medium", label: "Tehsildar NOC pending",           source: "Workflow Tracker", icon: "FileWarning" },
];

const P1_GOV_APIS = [
  { id: "mahabhulekh", name: "MahaBhulekh", desc: "7/12 + 8A Land Records",    status: "verified", latency: 184, lastSync: "2 min ago", result: "Survey 247/3B — record matched", endpoint: "/v3/khasra/lookup" },
  { id: "uidai",       name: "UIDAI Verification", desc: "Aadhaar Demographic Auth", status: "verified", latency: 312, lastSync: "5 min ago", result: "Aadhaar XXXX-3142 — demographic match 99.4%", endpoint: "/v2/auth/demographic" },
  { id: "pan",         name: "NSDL PAN Validation", desc: "Income Tax Dept.",        status: "verified", latency: 221, lastSync: "5 min ago", result: "AKLPP9821C — Active, name matched", endpoint: "/api/pan/validate" },
  { id: "igrs",        name: "IGRS Property Reg.",   desc: "Sub-Registrar Bhiwandi", status: "verified", latency: 401, lastSync: "11 min ago", result: "Deed BHI-1998-2147 — registered", endpoint: "/igrs/deed/lookup" },
  { id: "ec",          name: "Encumbrance Registry", desc: "Form 22 — IGRS",         status: "warning",  latency: 528, lastSync: "12 min ago", result: "Active mortgage entry — Bank of Maharashtra", endpoint: "/igrs/encumbrance" },
  { id: "gis",         name: "MMRDA GIS Atlas",      desc: "Cadastral + Zoning",     status: "verified", latency: 162, lastSync: "1 min ago", result: "Boundaries match cadastral layer", endpoint: "/gis/parcel" },
];

const P1_CHUNKS = [
  { id: "p1-ch-018", source: "7/12 Extract — pg.1",     text: "खातेदार: सदानंद कृष्ण पाटील | क्षेत्र: 4.8600 हेक्टर | सर्व्हे क्रमांक: 247/3B", score: 0.94 },
  { id: "p1-ch-042", source: "Sale Deed 1998 — §2",     text: "…the Vendor doth hereby convey absolutely unto the Vendee all that piece of agricultural land bearing Survey No. 247/3B…", score: 0.91 },
  { id: "p1-ch-077", source: "Encumbrance Cert. — pg.3", text: "Equitable mortgage in favour of Bank of Maharashtra, Loan A/c BOM-AGRI-77821, outstanding ₹4,12,000…", score: 0.88 },
  { id: "p1-ch-103", source: "Mutation M.E. 4421",      text: "Inheritance on death of Krushna Tukaram Patil (10-04-2021); new holder: Sadanand Krushna Patil.", score: 0.86 },
  { id: "p1-ch-129", source: "Property Card",           text: "CTS 14/2A | Tenure: Occupancy Class-I | Last Mutation: M.E. 4421 dated 03-09-2022.", score: 0.83 },
];

const P1_CHAT = [
  { keys: ["title clear", "is the title", "clear"],
    answer: "Based on semantic retrieval across the 6 indexed documents, the title is **Conditional**. Owner identity, survey number, and mutation chain all reconcile cleanly, but an active equitable mortgage with Bank of Maharashtra (outstanding ₹4,12,000) is recorded against the parcel. Recommend conditional acquisition contingent on mortgage discharge.",
    confidence: 92,
    citations: [
      { doc: "Encumbrance Certificate", chunk: "p1-ch-077", line: "Equitable mortgage in favour of Bank of Maharashtra…" },
      { doc: "7/12 Extract",           chunk: "p1-ch-018", line: "खातेदार: सदानंद कृष्ण पाटील | क्षेत्र: 4.8600 हेक्टर" },
    ],
  },
  { keys: ["mortgage", "encumbrance", "loan"],
    answer: "Yes — an **active equitable mortgage** is on record with Bank of Maharashtra (Loan A/c BOM-AGRI-77821). Original principal ₹18.5L, currently outstanding ₹4.12L. The mortgage was created in 2014 and has not been discharged in the EC up to 12 Jan 2026.",
    confidence: 96,
    citations: [{ doc: "Encumbrance Certificate", chunk: "p1-ch-077", line: "Loan A/c BOM-AGRI-77821, outstanding ₹4,12,000" }],
  },
  { keys: ["missing", "documents", "noc"],
    answer: "Two items are missing or pending in the workflow: (1) **Tehsildar NOC** has been requested but not yet uploaded, and (2) **Mortgage discharge letter** from Bank of Maharashtra is required before final clearance. Forest Department NOC is not applicable for this Class-1 agricultural parcel.",
    confidence: 88,
    citations: [
      { doc: "Workflow Tracker",          chunk: "wf-04",     line: "Tehsildar NOC — status: pending" },
      { doc: "Encumbrance Certificate",   chunk: "p1-ch-077", line: "outstanding ₹4,12,000" },
    ],
  },
  { keys: ["mutation", "chain", "history"],
    answer: "The mutation chain is complete from 1962 → 2022 (5 entries): original patta to Tukaram V. Patil → inheritance to Krushna T. Patil (1985, M.E. 1182) → sale to Sadanand K. Patil (1998, BHI-1998-2147) → equitable mortgage (2014) → inheritance mutation M.E. 4421 (2022). All entries are reconciled with the Property Card.",
    confidence: 94,
    citations: [
      { doc: "Mutation Record", chunk: "p1-ch-103", line: "Inheritance on death of Krushna Tukaram Patil" },
      { doc: "Sale Deed 1998",  chunk: "p1-ch-042", line: "Vendor doth hereby convey absolutely unto the Vendee…" },
    ],
  },
  { keys: ["aadhaar", "uidai", "match"],
    answer: "Aadhaar **XXXX-XXXX-3142** belongs to *Sadanand Krushna Patil* (DOB 11-08-1962). UIDAI demographic auth returned **99.4% match** against the name on the 7/12 extract and Sale Deed. PAN AKLPP9821C is also Active and reconciles.",
    confidence: 97,
    citations: [
      { doc: "Aadhaar — S. K. Patil", chunk: "p1-ch-aad",  line: "UID: XXXX XXXX 3142 | Sadanand Krushna Patil" },
      { doc: "UIDAI API",             chunk: "api-uidai",  line: "Demographic match 99.4%" },
    ],
  },
  { keys: ["conditional", "why"],
    answer: "Title is flagged **Conditional** because the rules engine triggered rule R-14 (active encumbrance) and rule R-22 (NOC pending). All identity & ownership rules passed. Once the mortgage is discharged and Tehsildar NOC is filed, the title will auto-promote to **Clear**.",
    confidence: 91,
    citations: [
      { doc: "Rules Engine", chunk: "rule-R14", line: "If active mortgage exists → status = Conditional" },
      { doc: "Rules Engine", chunk: "rule-R22", line: "If NOC pending → status = Conditional" },
    ],
  },
];

const P1_FALLBACK = {
  answer: "I've searched the indexed corpus via Yavi.ai semantic retrieval. The closest matches relate to ownership and the active encumbrance on Survey 247/3B. Could you rephrase or pick one of the suggested prompts?",
  confidence: 71,
  citations: [{ doc: "7/12 Extract", chunk: "p1-ch-018", line: "Survey 247/3B" }],
};

// ============================================================================
// PROJECT 2 — MMRDA-2026-0098  (Clear, 96.4% — MTHL Bridge Approach, Uran)
// ============================================================================
const P2_DOCUMENTS = [
  { id: "p2-712", name: "7/12 Extract — Survey 184/2A", type: "7/12 Extract",
    pages: 2, status: "Indexed", confidence: 98, uploadedAt: "04 Dec 2025 · 11:08",
    chunks: 28, meta: { khateNo: "907", area: "2.34 Ha", crop: "Saline / Bunded" },
    ocr: `महाराष्ट्र शासन — महसूल विभाग
सात-बारा उतारा | गाव: चिरनेर | तालुका: उरण | जिल्हा: रायगड
सर्व्हे क्रमांक / गट क्रमांक: 184/2A
खातेदार: भरत वसंत नाईक
क्षेत्र: 2.3400 हेक्टर
पीक: खार बंधारी (Saline-bunded, NA-pending)
खाते क्रमांक: 907
नोंदणी दिनांक: 22/06/2018
इतर हक्क: कोणतेही नाहीत`,
  },
  { id: "p2-pcard", name: "Property Card — Chirner",  type: "Property Card",
    pages: 1, status: "Indexed", confidence: 95, uploadedAt: "04 Dec 2025 · 11:09",
    chunks: 12, meta: { gpRecord: "GP/Chirner/184", landUse: "NA — Mixed (proposed)" },
    ocr: "PROPERTY CARD — Gram Panchayat Chirner\nGP Ref: GP/Chirner/184 | Holder: Bharat Vasant Naik\nArea: 2.3400 Ha | Tenure: Occupancy Class-I\nLast Mutation: M.E. 2087 dated 12-04-2018 (Survey re-numbering)",
  },
  { id: "p2-aadhaar", name: "Aadhaar — B. V. Naik",   type: "Aadhaar",
    pages: 1, status: "Verified", confidence: 99, uploadedAt: "04 Dec 2025 · 11:10",
    chunks: 4, meta: { uid: "XXXX-XXXX-9087", dob: "07-02-1971" },
    ocr: "Government of India\nUnique Identification Authority of India\nName: Bharat Vasant Naik\nDOB: 07-02-1971 | Male\nUID: XXXX XXXX 9087",
  },
  { id: "p2-saledeed", name: "Consolidation Deed — 2010", type: "Sale Deed",
    pages: 9, status: "Indexed", confidence: 93, uploadedAt: "04 Dec 2025 · 11:13",
    chunks: 64, meta: { regNo: "URN-2010-0871", subRegistrar: "Uran" },
    ocr: "Deed of Consolidation dated 17 February 2010\nVendors: Smt. Sushila V. Naik (sister), Shri Manohar V. Naik (brother)\nVendee: Bharat Vasant Naik\nConsideration: ₹11,40,000 (combined)\nRegistered at Sub-Registrar Uran, URN-2010-0871",
  },
  { id: "p2-mutation", name: "Mutation Record — M.E. 2087", type: "Mutation",
    pages: 2, status: "Indexed", confidence: 94, uploadedAt: "04 Dec 2025 · 11:15",
    chunks: 14, meta: { mutEntry: "M.E. 2087", date: "12-04-2018", reason: "Survey re-numbering" },
    ocr: "Mutation Entry M.E. 2087 dated 12-04-2018\nReason: District-level survey re-numbering (Old 184 → 184/2A)\nHolder: Bharat Vasant Naik\nCertified by Talathi, Saja Chirner.",
  },
  { id: "p2-ec", name: "Encumbrance Certificate",       type: "Encumbrance",
    pages: 3, status: "Indexed", confidence: 96, uploadedAt: "04 Dec 2025 · 11:18",
    chunks: 16, meta: { ecPeriod: "2010–2025", banks: "—" },
    ocr: "Encumbrance Certificate (Form 22)\nPeriod: 01-01-2010 to 04-12-2025\nNIL ENTRIES — No mortgage, lien, lis pendens or charge recorded.",
  },
  { id: "p2-noc", name: "Forest Dept. NOC — granted",   type: "NOC",
    pages: 5, status: "Verified", confidence: 97, uploadedAt: "04 Dec 2025 · 11:22",
    chunks: 20, meta: { nocRef: "MFD/RGD/NOC/2024/0418", date: "18-09-2024" },
    ocr: "Maharashtra Forest Department\nRef: MFD/RGD/NOC/2024/0418 dated 18-09-2024\nNo-Objection granted for transfer of Survey 184/2A, Chirner village, Uran tehsil — outside notified forest boundary as per FRA-2006 cadastral overlay.",
  },
];

const P2_OWNERSHIP_CHAIN = [
  { year: "1968", owner: "Vasant Madhav Naik",   event: "Original Patta — saline land allotment",     status: "ok" },
  { year: "1992", owner: "Vasant Madhav Naik",   event: "FSI Class-I conferment under Sec. 36",         status: "ok" },
  { year: "2002", owner: "Heirs of Vasant Naik", event: "Inheritance — joint estate (3 heirs)",          status: "ok" },
  { year: "2010", owner: "Bharat Vasant Naik",   event: "Consolidation Deed — buy-out of co-heirs",      status: "ok" },
  { year: "2018", owner: "Bharat Vasant Naik",   event: "Mutation M.E. 2087 — survey re-numbering",      status: "ok" },
  { year: "2024", owner: "Bharat Vasant Naik",   event: "Forest Dept. NOC granted — outside FRA layer",  status: "ok" },
  { year: "2026", owner: "—",                    event: "MMRDA Acquisition Notice u/s 11 — disbursement", status: "info" },
];

const P2_VALIDATION_CHECKS = [
  { id: "owner-match",    label: "Owner Name Match (7/12 ↔ Aadhaar ↔ PAN)", pass: true, detail: "Bharat V. Naik — exact across 3 sources" },
  { id: "survey-match",   label: "Survey Number Consistency",                pass: true, detail: "184/2A consistent across all 7 docs" },
  { id: "mutation-chain", label: "Mutation Chain Complete (1968→2018)",      pass: true, detail: "6 of 6 entries traceable, all certified" },
  { id: "encumbrance",    label: "No Active Encumbrance",                    pass: true, detail: "EC clean — NIL entries 2010–2025" },
  { id: "aadhaar",        label: "Aadhaar Verified (UIDAI)",                 pass: true, detail: "Demographic match — 99.6%" },
  { id: "noc",            label: "Required NOCs Filed",                      pass: true, detail: "Forest Dept. NOC granted; Tehsildar NOC on file" },
  { id: "tax-dues",       label: "Property Tax — No Dues",                   pass: true, detail: "GP Chirner cleared up to FY 2025-26" },
];

const P2_RISK_FLAGS = [
  { id: "saline",      level: "low", label: "Saline-bunded category — pre-NA conversion",    source: "7/12 — pīk column",         icon: "Waves" },
  { id: "disbursement", level: "low", label: "Disbursement schedule pending finance approval", source: "Workflow — final stage",   icon: "Clock" },
];

const P2_GOV_APIS = [
  { id: "mahabhulekh", name: "MahaBhulekh", desc: "7/12 + 8A Land Records",      status: "verified", latency: 158, lastSync: "1 min ago",  result: "Survey 184/2A — record matched",          endpoint: "/v3/khasra/lookup" },
  { id: "uidai",       name: "UIDAI Verification", desc: "Aadhaar Demographic Auth", status: "verified", latency: 287, lastSync: "3 min ago",  result: "Aadhaar XXXX-9087 — match 99.6%",          endpoint: "/v2/auth/demographic" },
  { id: "pan",         name: "NSDL PAN Validation",  desc: "Income Tax Dept.",      status: "verified", latency: 198, lastSync: "3 min ago",  result: "BVNPK4571D — Active, name matched",        endpoint: "/api/pan/validate" },
  { id: "igrs",        name: "IGRS Property Reg.",    desc: "Sub-Registrar Uran",    status: "verified", latency: 342, lastSync: "8 min ago",  result: "Deed URN-2010-0871 — registered",          endpoint: "/igrs/deed/lookup" },
  { id: "ec",          name: "Encumbrance Registry",  desc: "Form 22 — IGRS",         status: "verified", latency: 411, lastSync: "9 min ago",  result: "NIL entries — no liens",                  endpoint: "/igrs/encumbrance" },
  { id: "gis",         name: "MMRDA GIS Atlas",       desc: "Cadastral + FRA overlay", status: "verified", latency: 174, lastSync: "30 sec ago", result: "Outside notified forest boundary",       endpoint: "/gis/parcel" },
];

const P2_CHUNKS = [
  { id: "p2-ch-007", source: "7/12 Extract — pg.1",         text: "खातेदार: भरत वसंत नाईक | क्षेत्र: 2.3400 हेक्टर | सर्व्हे क्रमांक: 184/2A — चिरनेर, उरण", score: 0.96 },
  { id: "p2-ch-031", source: "Consolidation Deed 2010 — §1", text: "…the Vendors do hereby release, convey and assign their respective undivided shares unto the sole Vendee Bharat Vasant Naik…", score: 0.92 },
  { id: "p2-ch-058", source: "Encumbrance Cert. — pg.2",     text: "NIL ENTRIES — no mortgage, lien, lis pendens or charge recorded between 01-01-2010 and 04-12-2025.", score: 0.94 },
  { id: "p2-ch-074", source: "Forest Dept. NOC",             text: "No-Objection granted — Survey 184/2A is outside notified forest boundary as per FRA-2006 cadastral overlay.", score: 0.91 },
  { id: "p2-ch-095", source: "Mutation M.E. 2087",           text: "Mutation reason: district survey re-numbering (Old 184 → 184/2A). Holder unchanged: Bharat Vasant Naik.", score: 0.87 },
];

const P2_CHAT = [
  { keys: ["title clear", "is the title", "clear"],
    answer: "Yes — title is **Clear** with confidence 96.4%. All 7 indexed documents reconcile: owner identity, survey number, mutation chain (6 entries 1968→2018), encumbrance certificate (NIL), and Forest Dept. NOC are all green. The parcel is ready for compensation disbursement.",
    confidence: 96,
    citations: [
      { doc: "Encumbrance Certificate", chunk: "p2-ch-058", line: "NIL ENTRIES — no mortgage, lien, lis pendens or charge recorded" },
      { doc: "Forest Dept. NOC",        chunk: "p2-ch-074", line: "outside notified forest boundary as per FRA-2006" },
    ],
  },
  { keys: ["mortgage", "encumbrance", "loan", "lien"],
    answer: "There are **no mortgages or encumbrances** on this parcel. The Form-22 Encumbrance Certificate covers 2010–2025 with NIL entries. IGRS endpoint also returned a clean response.",
    confidence: 97,
    citations: [{ doc: "Encumbrance Certificate", chunk: "p2-ch-058", line: "NIL ENTRIES — no mortgage, lien, lis pendens or charge recorded" }],
  },
  { keys: ["noc", "forest", "missing", "documents"],
    answer: "All required NOCs are filed. The **Forest Department NOC** (MFD/RGD/NOC/2024/0418, dated 18-09-2024) confirms the parcel is outside the notified forest boundary per FRA-2006. Tehsildar NOC is also on record. Nothing is missing — the workflow is at the disbursement-scheduling stage.",
    confidence: 95,
    citations: [{ doc: "Forest Dept. NOC", chunk: "p2-ch-074", line: "MFD/RGD/NOC/2024/0418 dated 18-09-2024" }],
  },
  { keys: ["mutation", "chain", "history"],
    answer: "Mutation chain is complete: original 1968 patta to Vasant M. Naik → 1992 Class-I conferment → 2002 inheritance to 3 heirs → **2010 Consolidation Deed** (Bharat bought out his sister and brother) → 2018 mutation M.E. 2087 (survey re-numbering only). All 6 entries are talathi-certified.",
    confidence: 94,
    citations: [
      { doc: "Consolidation Deed 2010", chunk: "p2-ch-031", line: "Vendors do hereby release, convey and assign…" },
      { doc: "Mutation M.E. 2087",     chunk: "p2-ch-095", line: "district survey re-numbering (Old 184 → 184/2A)" },
    ],
  },
  { keys: ["aadhaar", "uidai", "match"],
    answer: "Aadhaar **XXXX-XXXX-9087** belongs to *Bharat Vasant Naik* (DOB 07-02-1971). UIDAI demographic auth returned **99.6% match** against the 7/12 extract and Consolidation Deed. PAN BVNPK4571D is Active and reconciles.",
    confidence: 98,
    citations: [
      { doc: "Aadhaar — B. V. Naik", chunk: "p2-ch-aad", line: "UID: XXXX XXXX 9087 | Bharat Vasant Naik" },
      { doc: "UIDAI API",            chunk: "api-uidai", line: "Demographic match 99.6%" },
    ],
  },
];

const P2_FALLBACK = {
  answer: "I've searched the indexed corpus for MTHL Bridge Approach (Survey 184/2A, Chirner). The closest matches relate to the consolidation deed and the Forest Dept. NOC. Could you rephrase or pick one of the suggested prompts?",
  confidence: 78,
  citations: [{ doc: "7/12 Extract", chunk: "p2-ch-007", line: "Survey 184/2A — Chirner, Uran" }],
};

// ============================================================================
// PROJECT 3 — MMRDA-2026-0117  (Disputed, 71.2% — Versova-Bandra Sea Link)
// ============================================================================
const P3_DOCUMENTS = [
  { id: "p3-titledeed", name: "Title Deed — 1962 (Mistry Estate)", type: "Title Deed",
    pages: 18, status: "Indexed", confidence: 87, uploadedAt: "21 Nov 2025 · 14:02",
    chunks: 124, meta: { regNo: "BBY-1962-1184", subRegistrar: "Bandra-W" },
    ocr: "Deed of Conveyance dated 04 January 1962\nVendor: Bombay Suburban Improvement Trust\nVendee: Hormuz Faramji Mistry (Parsi gentleman)\nProperty: CTS 442/B, Andheri (West) — leasehold-to-freehold conversion\nConsideration: ₹78,000\nRegistered at Sub-Registrar Bandra(W), BBY-1962-1184",
  },
  { id: "p3-pcard",     name: "Property Card — CTS 442/B",          type: "Property Card",
    pages: 1, status: "Indexed", confidence: 91, uploadedAt: "21 Nov 2025 · 14:03",
    chunks: 14, meta: { cts: "CTS 442/B", ward: "K-W (Andheri-W)" },
    ocr: "PROPERTY CARD\nCTS No: 442/B | Ward: K-W | Andheri (West)\nHolder: Hormuz Faramji Mistry (recorded; deceased per CIVIL/2024/PROBATE/4421)\nArea: 0.6200 Ha | Tenure: Freehold (post-1962 conversion)\nLast Mutation: PENDING — caveat dated 11-11-2025",
  },
  { id: "p3-probate",   name: "Probate Order — CIVIL/2024/PROBATE/4421", type: "Probate",
    pages: 22, status: "Flagged", confidence: 74, uploadedAt: "21 Nov 2025 · 14:08",
    chunks: 168, meta: { court: "Bombay HC", filed: "12-08-2024", status: "Contested" },
    ocr: "IN THE HIGH COURT OF JUDICATURE AT BOMBAY\nCIVIL/2024/PROBATE/4421\nIn the matter of: Estate of Late Hormuz Faramji Mistry\nPetitioner: Cyrus Hormuz Mistry (son)\nRespondent / Caveator: Pervin Mistry (sister of deceased)\nStatus: Contested. Will dated 03-06-2018 challenged for due execution; matter referred to evidence.",
  },
  { id: "p3-will",      name: "Will — disputed (03-06-2018)",        type: "Will",
    pages: 7, status: "Flagged", confidence: 68, uploadedAt: "21 Nov 2025 · 14:10",
    chunks: 48, meta: { executor: "Cyrus H. Mistry", witnesses: 2 },
    ocr: "Last Will & Testament of Hormuz Faramji Mistry\nDated: 03 June 2018 | Witnesses: 2 (Mr. F. Cooper, Mrs. R. Daruwala)\nBequeathed: CTS 442/B (Andheri-W) absolutely unto my son Cyrus H. Mistry\n[NOTE: Authenticity contested by sister Pervin Mistry — see Suit 4421/2025]",
  },
  { id: "p3-aadhaar1",  name: "Aadhaar — Cyrus H. Mistry",            type: "Aadhaar",
    pages: 1, status: "Verified", confidence: 99, uploadedAt: "21 Nov 2025 · 14:11",
    chunks: 4, meta: { uid: "XXXX-XXXX-2841", dob: "19-04-1978" },
    ocr: "Government of India — UIDAI\nName: Cyrus Hormuz Mistry\nDOB: 19-04-1978 | Male\nUID: XXXX XXXX 2841",
  },
  { id: "p3-aadhaar2",  name: "Aadhaar — Pervin Mistry (caveator)", type: "Aadhaar",
    pages: 1, status: "Verified", confidence: 99, uploadedAt: "21 Nov 2025 · 14:12",
    chunks: 4, meta: { uid: "XXXX-XXXX-7314", dob: "08-12-1955" },
    ocr: "Government of India — UIDAI\nName: Pervin Faramji Mistry\nDOB: 08-12-1955 | Female\nUID: XXXX XXXX 7314",
  },
  { id: "p3-ec",        name: "Encumbrance Certificate",              type: "Encumbrance",
    pages: 6, status: "Flagged", confidence: 79, uploadedAt: "21 Nov 2025 · 14:14",
    chunks: 32, meta: { ecPeriod: "2010–2025", flags: "Caveat + Lis Pendens" },
    ocr: "Encumbrance Certificate (Form 22)\nPeriod: 01-01-2010 to 21-11-2025\nEntry 1: Caveat filed by Pervin Mistry, dated 11-11-2025 — re. CTS 442/B.\nEntry 2: Lis Pendens — Bombay HC Suit 4421/2025 dated 18-11-2025.",
  },
  { id: "p3-suit",      name: "Litigation Notice — HC Suit 4421/2025", type: "Litigation",
    pages: 14, status: "Flagged", confidence: 76, uploadedAt: "21 Nov 2025 · 14:18",
    chunks: 92, meta: { court: "Bombay HC", suitNo: "4421/2025", filed: "18-11-2025" },
    ocr: "IN THE HIGH COURT OF JUDICATURE AT BOMBAY\nSuit No. 4421/2025\nPlaintiff: Pervin Faramji Mistry\nDefendants: (1) Cyrus Hormuz Mistry  (2) MMRDA\nPrayer: Declaration that the Will dated 03-06-2018 is null and void; injunction restraining acquisition until succession is decided.",
  },
  { id: "p3-caveat",    name: "Caveat Filing Copy",                    type: "Caveat",
    pages: 3, status: "Indexed", confidence: 88, uploadedAt: "21 Nov 2025 · 14:20",
    chunks: 18, meta: { filed: "11-11-2025", court: "Bombay HC" },
    ocr: "Caveat under Sec. 148-A CPC, dated 11-11-2025\nCaveator: Pervin Faramji Mistry\nMatter: Estate of Late Hormuz F. Mistry — CTS 442/B Andheri-W\nNotice required before any ex-parte order in the said estate.",
  },
];

const P3_OWNERSHIP_CHAIN = [
  { year: "1962", owner: "Hormuz Faramji Mistry", event: "Conveyance — leasehold-to-freehold (BBY-1962-1184)", status: "ok"   },
  { year: "1985", owner: "Hormuz Faramji Mistry", event: "FSI revision — DCR Sec. 33(1) certified",             status: "ok"   },
  { year: "2018", owner: "Hormuz Faramji Mistry", event: "Will executed (later disputed)",                       status: "warn" },
  { year: "2023", owner: "Estate of late Hormuz",  event: "Hormuz F. Mistry deceased",                            status: "info" },
  { year: "2024", owner: "Cyrus H. Mistry (claim)", event: "Probate Petition CIVIL/2024/PROBATE/4421 — contested", status: "warn" },
  { year: "2025", owner: "Disputed (Cyrus vs Pervin)", event: "Caveat (11-11) + HC Suit 4421/2025 (18-11)",       status: "bad"  },
  { year: "2026", owner: "—",                        event: "MMRDA notice — partial overlap with disputed parcel", status: "info" },
];

const P3_VALIDATION_CHECKS = [
  { id: "owner-match",    label: "Owner Name Match (Title ↔ Aadhaar ↔ Probate)", pass: false, detail: "Recorded holder deceased; heir identity contested" },
  { id: "survey-match",   label: "Survey / CTS Consistency",                       pass: true,  detail: "CTS 442/B consistent across Title Deed and Property Card" },
  { id: "mutation-chain", label: "Mutation Chain Complete (1962→2025)",            pass: false, detail: "Mutation post-2023 PENDING — probate not yet granted" },
  { id: "encumbrance",    label: "No Active Encumbrance / Caveat",                  pass: false, detail: "Caveat (11-11-2025) + Lis Pendens (18-11-2025) on record" },
  { id: "aadhaar",        label: "Aadhaar Verified for All Heirs (UIDAI)",          pass: true,  detail: "Both Cyrus (XXXX-2841) and Pervin (XXXX-7314) verified" },
  { id: "noc",            label: "Required NOCs Filed",                             pass: false, detail: "Cannot file NOCs until succession dispute is resolved" },
  { id: "tax-dues",       label: "Property Tax — No Dues",                          pass: true,  detail: "Cleared up to FY 2024-25 by deceased's estate" },
];

const P3_RISK_FLAGS = [
  { id: "succession", level: "high",   label: "Active heir succession dispute",     source: "HC Suit 4421/2025",  icon: "Gavel" },
  { id: "lispendens", level: "high",   label: "Lis Pendens recorded against parcel", source: "Encumbrance Cert.",  icon: "AlertOctagon" },
  { id: "caveat",     level: "medium", label: "Caveat filed — notice required",     source: "Caveat 11-11-2025",  icon: "FileWarning" },
  { id: "boundary",   level: "medium", label: "Partial parcel overlap with RoW",     source: "MMRDA GIS Atlas",    icon: "Map" },
];

const P3_GOV_APIS = [
  { id: "mahabhulekh", name: "MahaBhulekh", desc: "7/12 + Property Card",         status: "warning",  latency: 478, lastSync: "9 min ago",  result: "Holder field shows 'deceased' — mutation pending", endpoint: "/v3/khasra/lookup" },
  { id: "uidai",       name: "UIDAI Verification", desc: "Aadhaar Demographic",      status: "verified", latency: 318, lastSync: "4 min ago",  result: "Cyrus + Pervin both verified",                  endpoint: "/v2/auth/demographic" },
  { id: "pan",         name: "NSDL PAN Validation",  desc: "Income Tax Dept.",       status: "warning",  latency: 502, lastSync: "12 min ago", result: "Estate PAN AAFFM1284Z — flagged 'deceased holder'", endpoint: "/api/pan/validate" },
  { id: "igrs",        name: "IGRS Property Reg.",     desc: "Sub-Registrar Bandra",  status: "verified", latency: 612, lastSync: "21 min ago", result: "Title Deed BBY-1962-1184 — registered (genuine)",   endpoint: "/igrs/deed/lookup" },
  { id: "ec",          name: "Encumbrance Registry",   desc: "Form 22 — IGRS",         status: "error",    latency: 884, lastSync: "22 min ago", result: "Caveat + Lis Pendens active",                    endpoint: "/igrs/encumbrance" },
  { id: "gis",         name: "MMRDA GIS Atlas",        desc: "Cadastral + RoW",        status: "warning",  latency: 241, lastSync: "2 min ago",  result: "Partial parcel falls inside proposed RoW alignment", endpoint: "/gis/parcel" },
];

const P3_CHUNKS = [
  { id: "p3-ch-014", source: "Title Deed 1962 — pg.3",       text: "Vendee: Hormuz Faramji Mistry (Parsi gentleman). Conveyed CTS 442/B, Andheri (West), area 0.6200 hectares — leasehold to freehold conversion.", score: 0.93 },
  { id: "p3-ch-091", source: "Probate Order 2024 — pg.6",   text: "Will dated 03-06-2018 challenged by Pervin Mistry on grounds of due execution; matter referred to evidence stage.", score: 0.92 },
  { id: "p3-ch-128", source: "HC Suit 4421/2025 — Prayer",   text: "Plaintiff prays for declaration that Will dated 03-06-2018 is null and void; injunction restraining acquisition until succession decided.", score: 0.95 },
  { id: "p3-ch-152", source: "Encumbrance Cert. — pg.4",     text: "Entry 2: Lis Pendens — Bombay HC Suit 4421/2025 dated 18-11-2025 (CTS 442/B).", score: 0.94 },
  { id: "p3-ch-187", source: "Caveat 11-11-2025",            text: "Caveator: Pervin Mistry — notice required before any ex-parte order regarding CTS 442/B.", score: 0.88 },
];

const P3_CHAT = [
  { keys: ["title clear", "is the title", "clear", "disputed"],
    answer: "No — title is **Disputed** (confidence 71.2%). Two active legal encumbrances are recorded against CTS 442/B: a **caveat** filed by Pervin Mistry (11-11-2025) and a **Lis Pendens** from Bombay HC Suit 4421/2025 (18-11-2025) which seeks to invalidate the 2018 Will. Acquisition cannot proceed until succession is judicially determined.",
    confidence: 88,
    citations: [
      { doc: "HC Suit 4421/2025",       chunk: "p3-ch-128", line: "injunction restraining acquisition until succession decided" },
      { doc: "Encumbrance Certificate", chunk: "p3-ch-152", line: "Lis Pendens — Bombay HC Suit 4421/2025 dated 18-11-2025" },
    ],
  },
  { keys: ["mortgage", "encumbrance", "caveat", "lis"],
    answer: "There is no mortgage, but there are **two active encumbrances**: (1) a Caveat under Sec. 148-A CPC dated 11-11-2025 by Pervin Mistry, and (2) a Lis Pendens for HC Suit 4421/2025 dated 18-11-2025. Both relate to the contested estate of the deceased holder.",
    confidence: 93,
    citations: [
      { doc: "Caveat 11-11-2025",       chunk: "p3-ch-187", line: "Caveator: Pervin Mistry" },
      { doc: "Encumbrance Certificate", chunk: "p3-ch-152", line: "Lis Pendens — Bombay HC Suit 4421/2025" },
    ],
  },
  { keys: ["heir", "succession", "will", "probate"],
    answer: "The 1962 holder, **Hormuz Faramji Mistry**, died in 2023. His son Cyrus filed a probate petition (CIVIL/2024/PROBATE/4421) relying on a Will dated 03-06-2018 bequeathing CTS 442/B to him. His sister **Pervin Mistry** filed a caveat and HC Suit 4421/2025 challenging the Will's due execution. The probate is contested and currently at evidence stage.",
    confidence: 89,
    citations: [
      { doc: "Probate Order 2024", chunk: "p3-ch-091", line: "Will dated 03-06-2018 challenged… matter referred to evidence" },
      { doc: "HC Suit 4421/2025",  chunk: "p3-ch-128", line: "declaration that Will dated 03-06-2018 is null and void" },
    ],
  },
  { keys: ["aadhaar", "uidai", "match"],
    answer: "Both heirs are UIDAI-verified: **Cyrus H. Mistry** (Aadhaar XXXX-XXXX-2841, DOB 19-04-1978) and **Pervin F. Mistry** (Aadhaar XXXX-XXXX-7314, DOB 08-12-1955). However, the recorded title-holder Hormuz F. Mistry is deceased, so MahaBhulekh and PAN both flag the holder field with a 'deceased' warning.",
    confidence: 91,
    citations: [
      { doc: "Aadhaar — Cyrus H. Mistry",  chunk: "p3-ch-aad1", line: "UID: XXXX XXXX 2841 | Cyrus Hormuz Mistry" },
      { doc: "Aadhaar — Pervin Mistry",     chunk: "p3-ch-aad2", line: "UID: XXXX XXXX 7314 | Pervin Faramji Mistry" },
    ],
  },
  { keys: ["why", "blocked", "next steps", "what to do"],
    answer: "Acquisition is **blocked** until: (1) Bombay HC decides Suit 4421/2025 on the validity of the 2018 Will, OR (2) the heirs reach a registered family settlement and the caveat is withdrawn. Until then, MMRDA can either (a) carve out the disputed plot and proceed with the rest of the alignment, or (b) deposit the compensation in court under Sec. 31(2) RFCTLARR Act.",
    confidence: 84,
    citations: [
      { doc: "HC Suit 4421/2025",  chunk: "p3-ch-128", line: "injunction restraining acquisition until succession decided" },
      { doc: "Probate Order 2024", chunk: "p3-ch-091", line: "matter referred to evidence" },
    ],
  },
];

const P3_FALLBACK = {
  answer: "I've searched the indexed corpus for the Versova-Bandra Sea Link parcel (CTS 442/B). The closest matches relate to the contested Will, the caveat, and HC Suit 4421/2025. Could you rephrase or pick one of the suggested prompts?",
  confidence: 69,
  citations: [{ doc: "HC Suit 4421/2025", chunk: "p3-ch-128", line: "Suit No. 4421/2025 — Bombay HC" }],
};

// ============================================================================
// Bundle map + helper
// ============================================================================
export const PROJECT_DATA = {
  "MMRDA-2026-0142": {
    documents: P1_DOCUMENTS, ownershipChain: P1_OWNERSHIP_CHAIN,
    validationChecks: P1_VALIDATION_CHECKS, riskFlags: P1_RISK_FLAGS,
    govApis: P1_GOV_APIS, sampleChunks: P1_CHUNKS,
    chatResponses: P1_CHAT, fallbackChat: P1_FALLBACK,
    decision: {
      headline: "Subject to mortgage discharge & Tehsildar NOC.",
      recommendation: "Legal review recommended due to active equitable mortgage with Bank of Maharashtra (₹4.12L outstanding). Once a discharge certificate and Tehsildar NOC are uploaded, the title will auto-promote to Clear.",
      stats: [
        { label: "Identity match",  value: "99.4%" },
        { label: "Survey match",    value: "100%"  },
        { label: "Mutation chain",  value: "100%"  },
        { label: "Encumbrance",     value: "78.5%", warn: true },
        { label: "NOC coverage",    value: "71.0%", warn: true },
      ],
    },
  },
  "MMRDA-2026-0098": {
    documents: P2_DOCUMENTS, ownershipChain: P2_OWNERSHIP_CHAIN,
    validationChecks: P2_VALIDATION_CHECKS, riskFlags: P2_RISK_FLAGS,
    govApis: P2_GOV_APIS, sampleChunks: P2_CHUNKS,
    chatResponses: P2_CHAT, fallbackChat: P2_FALLBACK,
    decision: {
      headline: "Title clear — ready for compensation disbursement.",
      recommendation: "All identity, survey, mutation, encumbrance, and NOC rules pass. Forest Dept. NOC is on record. Recommend proceeding to Section 19 award and disbursement schedule.",
      stats: [
        { label: "Identity match",  value: "99.6%" },
        { label: "Survey match",    value: "100%"  },
        { label: "Mutation chain",  value: "100%"  },
        { label: "Encumbrance",     value: "100%"  },
        { label: "NOC coverage",    value: "100%"  },
      ],
    },
  },
  "MMRDA-2026-0117": {
    documents: P3_DOCUMENTS, ownershipChain: P3_OWNERSHIP_CHAIN,
    validationChecks: P3_VALIDATION_CHECKS, riskFlags: P3_RISK_FLAGS,
    govApis: P3_GOV_APIS, sampleChunks: P3_CHUNKS,
    chatResponses: P3_CHAT, fallbackChat: P3_FALLBACK,
    decision: {
      headline: "Acquisition blocked — pending Bombay HC Suit 4421/2025.",
      recommendation: "Active succession dispute with caveat and Lis Pendens. Recommend either (a) carving out disputed plot and proceeding with remaining alignment, or (b) depositing compensation in court under Sec. 31(2) RFCTLARR Act, 2013, pending HC outcome.",
      stats: [
        { label: "Identity match",  value: "82.0%", warn: true },
        { label: "Survey match",    value: "100%"  },
        { label: "Mutation chain",  value: "61.0%", warn: true },
        { label: "Encumbrance",     value: "12.0%", warn: true },
        { label: "NOC coverage",    value: "0%",    warn: true },
      ],
    },
  },
};

export function getProjectData(projectId) {
  return PROJECT_DATA[projectId] || PROJECT_DATA["MMRDA-2026-0142"];
}
