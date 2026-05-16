// Mock dataset for MMRDA AI Land Acquisition & Title Validation Platform
// All data is fictional and for demo purposes only.

export const KPIS = [
  { id: "active-projects", label: "Active Projects", value: 47, delta: "+8 this quarter", icon: "FolderKanban" },
  { id: "documents-uploaded", label: "Documents Indexed", value: 1284, delta: "+312 this week", icon: "FileText" },
  { id: "titles-cleared", label: "Titles Cleared", value: 318, delta: "+24 this month", icon: "ShieldCheck" },
  { id: "pending-legal", label: "Pending Legal Review", value: 29, delta: "5 escalated", icon: "Scale" },
  { id: "api-status", label: "Gov API Validation", value: "98.4%", delta: "All systems online", icon: "Network" },
  { id: "ai-confidence", label: "Avg AI Confidence", value: "92.7%", delta: "Yavi.ai RAG", icon: "Sparkles" },
];

export const ZONE_CHART = [
  { zone: "Thane",     cleared: 42, disputed: 6,  pending: 12 },
  { zone: "Navi Mumbai", cleared: 58, disputed: 9,  pending: 18 },
  { zone: "Kalyan",    cleared: 31, disputed: 11, pending: 14 },
  { zone: "Vasai-Virar", cleared: 24, disputed: 4,  pending: 9 },
  { zone: "Panvel",    cleared: 39, disputed: 7,  pending: 11 },
  { zone: "Bhiwandi",  cleared: 22, disputed: 13, pending: 16 },
];

export const TITLE_PIE = [
  { name: "Clear",       value: 318, color: "#10B981" },
  { name: "Conditional", value: 84,  color: "#F59E0B" },
  { name: "Disputed",    value: 41,  color: "#EF4444" },
];

export const VERIFICATION_TREND = [
  { day: "Mon", verified: 184, flagged: 12 },
  { day: "Tue", verified: 212, flagged: 18 },
  { day: "Wed", verified: 198, flagged: 9  },
  { day: "Thu", verified: 241, flagged: 21 },
  { day: "Fri", verified: 267, flagged: 14 },
  { day: "Sat", verified: 138, flagged: 7  },
  { day: "Sun", verified: 96,  flagged: 4  },
];

export const PROJECTS = [
  {
    id: "MMRDA-2026-0142",
    name: "Virar–Alibaug Multimodal Corridor — Phase 2",
    village: "Kharbav", taluka: "Bhiwandi", district: "Thane",
    surveyNumber: "247/3B",
    landType: "Agricultural (Class-1)",
    acquisitionType: "Section 11 — RFCTLARR Act, 2013",
    officer: "Adv. Rohini Deshmukh",
    area: "4.86 Hectares", areaHa: 4.86,
    rrZone: "Zone-7 / Bhiwandi NMC", rrRate: 38500000, // ₹/Ha
    fsi: 1.1, usage: "Agricultural", urbanRural: "rural",
    createdOn: "12 Jan 2026",
    ownerName: "Sadanand Krushna Patil",
    ownerNameMr: "सदानंद कृष्ण पाटील",
    ownerAadhaar: "XXXX-XXXX-3142", ownerPan: "AKLPP9821C",
    coOwners: ["Sushila S. Patil", "Mahesh S. Patil"],
    status: "Conditional", confidence: 92.7,
    docsCount: 6, chunksCount: 165,
    progress: 72,
    nextAction: "Mortgage discharge — Bank of Maharashtra",
  },
  {
    id: "MMRDA-2026-0098",
    name: "Mumbai Trans Harbour Link — Bridge Approach",
    village: "Chirner", taluka: "Uran", district: "Raigad",
    surveyNumber: "184/2A",
    landType: "Non-Agricultural",
    acquisitionType: "Section 11 — RFCTLARR Act, 2013",
    officer: "Mr. Anil Bhonsle",
    area: "2.34 Hectares", areaHa: 2.34,
    rrZone: "Zone-3 / Uran-Raigad", rrRate: 56200000,
    fsi: 1.5, usage: "Mixed (Industrial + Residential)", urbanRural: "rural",
    createdOn: "04 Dec 2025",
    ownerName: "Bharat Vasant Naik",
    ownerNameMr: "भरत वसंत नाईक",
    ownerAadhaar: "XXXX-XXXX-9087", ownerPan: "BVNPK4571D",
    coOwners: [],
    status: "Clear", confidence: 96.4,
    docsCount: 7, chunksCount: 198,
    progress: 95,
    nextAction: "Disbursement scheduled — 05 Mar 2026",
  },
  {
    id: "MMRDA-2026-0117",
    name: "Versova–Bandra Sea Link — RoW Acquisition",
    village: "Andheri (W)", taluka: "Andheri", district: "Mumbai Suburban",
    surveyNumber: "CTS 442/B",
    landType: "Urban Residential",
    acquisitionType: "Section 11 — RFCTLARR Act, 2013",
    officer: "Ms. Priya Joshi",
    area: "0.62 Hectares", areaHa: 0.62,
    rrZone: "Zone-1 / Andheri-W (K-W)", rrRate: 412800000,
    fsi: 2.7, usage: "Urban Residential", urbanRural: "urban",
    createdOn: "21 Nov 2025",
    ownerName: "Estate of Late Hormuz F. Mistry",
    ownerNameMr: "—",
    ownerAadhaar: "—", ownerPan: "AAFFM1284Z",
    coOwners: ["Cyrus H. Mistry", "Pervin Mistry"],
    status: "Disputed", confidence: 71.2,
    docsCount: 9, chunksCount: 287,
    progress: 38,
    nextAction: "Heir succession dispute — Bombay HC 4421/2025",
  },
];

// Backward compatibility — primary demo project
export const PROJECT = PROJECTS[0];

// NOTE: DOCUMENTS / OWNERSHIP_CHAIN / VALIDATION_CHECKS / RISK_FLAGS / GOV_APIS /
// SAMPLE_CHUNKS / CHAT_RESPONSES / FALLBACK_CHAT now live per-project in
// /src/data/projectData.js — accessed via useProjectData() hook.

export const PIPELINE_NODES = [
  { id: "upload",    label: "Document Upload",    sub: "6 docs · 23 pages",    icon: "Upload" },
  { id: "ocr",       label: "OCR Extraction",     sub: "Marathi + English",    icon: "ScanText" },
  { id: "metadata",  label: "Metadata Extraction", sub: "47 entities tagged",  icon: "Tags" },
  { id: "chunking",  label: "Chunking",           sub: "165 chunks (512 tok)", icon: "Boxes" },
  { id: "embedding", label: "Embeddings",         sub: "768-dim · text-emb-3", icon: "Binary" },
  { id: "vector",    label: "Yavi.ai Vector Store", sub: "Indexed · cosine",   icon: "Database" },
  { id: "search",    label: "Semantic Search",    sub: "Top-K = 8",            icon: "Search" },
  { id: "rules",     label: "Rules Engine",       sub: "27 title rules",       icon: "GitBranch" },
  { id: "decision",  label: "AI Decision",        sub: "Confidence 92.7%",     icon: "Sparkles" },
];

// Scripted chatbot — shared suggested prompts (responses live per-project in projectData.js)
export const SUGGESTED_PROMPTS = [
  "Is the title clear?",
  "Which documents are missing?",
  "Is there any mortgage on the property?",
  "Show mutation history.",
  "Does Aadhaar match ownership?",
  "Why is the title conditional?",
];

export const SIDEBAR_NAV = [
  { to: "/dashboard",    label: "Dashboard",       icon: "LayoutDashboard" },
  { to: "/projects",     label: "Projects",        icon: "FolderKanban" },
  { to: "/workspace",    label: "Workspace",       icon: "Briefcase" },
  { to: "/rag-pipeline", label: "RAG Pipeline",    icon: "Workflow" },
  { to: "/chatbot",      label: "AI Chatbot",      icon: "Bot" },
  { to: "/validation",   label: "Title Validation", icon: "ShieldCheck" },
  { to: "/workflow",     label: "Workflow",        icon: "GitBranch" },
  { to: "/valuation",    label: "Valuation",       icon: "Calculator" },
  { to: "/reports",      label: "Reports",         icon: "FileBarChart" },
  { to: "/legal",        label: "Legal Review",    icon: "Scale", disabled: true },
  { to: "/settings",     label: "Settings",        icon: "Settings", disabled: true },
];

// Workflow stages for the Workflow screen (per active project)
export const WORKFLOW_STAGES = [
  { id: "doc-upload",    label: "Document Upload",            owner: "Acquisition Officer", sla: "1 day",   started: "12 Jan 2026 · 09:14", finished: "12 Jan 2026 · 09:31", action: "6 documents uploaded · 23 pages OCR'd" },
  { id: "ai-validation", label: "AI Validation (Yavi.ai)",    owner: "Yavi.ai RAG Engine",  sla: "instant", started: "12 Jan 2026 · 09:31", finished: "12 Jan 2026 · 09:31", action: "165 chunks indexed · confidence 92.7%" },
  { id: "api-verify",    label: "Government API Verification", owner: "System",              sla: "5 min",   started: "12 Jan 2026 · 09:31", finished: "12 Jan 2026 · 09:34", action: "6 / 6 APIs reconciled · 1 warning" },
  { id: "legal-review",  label: "Legal Review",                owner: "Adv. Rohini Deshmukh", sla: "5 days",  started: "12 Jan 2026", eta: "17 Feb 2026", action: "Reviewing encumbrance + NOC requirements" },
  { id: "survey",        label: "Survey Approval",             owner: "Ms. Priya Joshi",     sla: "7 days",  eta: "24 Feb 2026", action: "Awaiting field verification" },
  { id: "valuation",     label: "Valuation Approval",          owner: "Valuation Cell — Thane", sla: "5 days", eta: "01 Mar 2026", action: "RR-based compensation pending review" },
  { id: "final",         label: "Final Acquisition Approval",  owner: "MMRDA Commissioner",  sla: "3 days",  eta: "08 Mar 2026", action: "Sign-off & disbursement order" },
];

// Pending workflow actions per active project
export const PENDING_ACTIONS = [
  { id: "act-noc",      label: "Upload Tehsildar NOC",                 assignee: "Acquisition Officer", sla: "Due in 2 days", priority: "high"   },
  { id: "act-mortgage", label: "Obtain mortgage discharge — BoM",      assignee: "Legal Officer",       sla: "Due in 4 days", priority: "high"   },
  { id: "act-coowner",  label: "Confirm co-owner consent letters",     assignee: "Legal Officer",       sla: "Due in 6 days", priority: "medium" },
  { id: "act-survey",   label: "Schedule field survey visit",          assignee: "Survey Officer",      sla: "Due in 9 days", priority: "low"    },
];

// Reports available for export
export const REPORTS = [
  { id: "title-report",     name: "Title Validation Report", desc: "Full Yavi.ai-backed title clearance with citations and rule trace.", icon: "ShieldCheck",   pages: 24, lastGenerated: "12 Jan 2026", size: "1.8 MB" },
  { id: "risk-report",      name: "Risk Assessment Report",  desc: "Aggregated mortgage / co-owner / NOC / tax risks with severity.",   icon: "AlertTriangle", pages: 11, lastGenerated: "12 Jan 2026", size: "0.9 MB" },
  { id: "ownership-report", name: "Ownership Summary",       desc: "Mutation chain 1962→2022 with linked deeds and Aadhaar match.",      icon: "Users",         pages: 8,  lastGenerated: "11 Jan 2026", size: "0.6 MB" },
  { id: "valuation-report", name: "Valuation Report",        desc: "RR-based compensation estimate with solatium and final payable.",   icon: "Calculator",    pages: 6,  lastGenerated: "11 Jan 2026", size: "0.4 MB" },
];

// Land valuation lookup tables (Maharashtra-style Ready Reckoner)
export const LAND_CATEGORIES = [
  { value: "agri-class1",  label: "Agricultural — Class I", baseMultiplier: 1.0 },
  { value: "agri-class2",  label: "Agricultural — Class II", baseMultiplier: 0.75 },
  { value: "non-agri",     label: "Non-Agricultural",       baseMultiplier: 1.4 },
  { value: "residential",  label: "Urban Residential",      baseMultiplier: 1.6 },
  { value: "commercial",   label: "Commercial",             baseMultiplier: 2.2 },
];

export const RR_ZONES = [
  { value: "zone-1",  label: "Zone-1 / Andheri-W (K-W)",     rate: 412800000 },
  { value: "zone-3",  label: "Zone-3 / Uran-Raigad",         rate: 56200000  },
  { value: "zone-7",  label: "Zone-7 / Bhiwandi NMC",        rate: 38500000  },
  { value: "zone-9",  label: "Zone-9 / Vasai-Virar",         rate: 28400000  },
  { value: "zone-11", label: "Zone-11 / Kalyan-Dombivli",    rate: 31700000  },
];

export const USAGE_TYPES = [
  { value: "agricultural", label: "Agricultural" },
  { value: "residential",  label: "Residential"  },
  { value: "commercial",   label: "Commercial"   },
  { value: "industrial",   label: "Industrial"   },
  { value: "mixed",        label: "Mixed"        },
];

// ---------------------------------------------------------------------------
// Helpers for new project creation (used by NewProject.jsx)
// ---------------------------------------------------------------------------

export function getNextProjectId(projects) {
  const nums = projects
    .map((p) => parseInt((p.id || "").split("-")[2], 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 142;
  return `MMRDA-2026-${String(max + 1).padStart(4, "0")}`;
}

const OFFICER_MAP = {
  legal:       "Adv. Rohini Deshmukh",
  acquisition: "Mr. Anil Bhonsle",
  survey:      "Ms. Priya Joshi",
};

const LAND_TYPE_LABEL = {
  "agri-class1": "Agricultural (Class-1)",
  "agri-class2": "Agricultural (Class-2)",
  "non-agri":    "Non-Agricultural",
  "residential": "Urban Residential",
  "commercial":  "Commercial",
};

const LAND_TYPE_DEFAULTS = {
  "agri-class1": { rate: 38500000, zone: "Zone-7 / Bhiwandi NMC",  fsi: 1.0, usage: "Agricultural",       urbanRural: "rural" },
  "agri-class2": { rate: 28400000, zone: "Zone-9 / Vasai-Virar",   fsi: 1.0, usage: "Agricultural",       urbanRural: "rural" },
  "non-agri":    { rate: 56200000, zone: "Zone-3 / Uran-Raigad",   fsi: 1.5, usage: "Mixed",              urbanRural: "rural" },
  "residential": { rate: 412800000, zone: "Zone-1 / Andheri-W",    fsi: 2.7, usage: "Urban Residential",  urbanRural: "urban" },
  "commercial":  { rate: 412800000, zone: "Zone-1 / Andheri-W",    fsi: 3.5, usage: "Commercial",         urbanRural: "urban" },
};

export function createProjectFromForm(form, id) {
  const area = parseFloat(form.area) || 1.0;
  const rrDefaults = LAND_TYPE_DEFAULTS[form.landType] || LAND_TYPE_DEFAULTS["agri-class1"];
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return {
    id,
    name:            form.name,
    village:         form.village,
    taluka:          form.taluka || "",
    district:        form.district,
    surveyNumber:    form.surveyNumber,
    landType:        LAND_TYPE_LABEL[form.landType] || form.landType,
    acquisitionType: "Section 11 — RFCTLARR Act, 2013",
    officer:         OFFICER_MAP[form.officer] || form.officer,
    area:            `${area.toFixed(2)} Hectares`,
    areaHa:          area,
    rrZone:          rrDefaults.zone,
    rrRate:          rrDefaults.rate,
    fsi:             rrDefaults.fsi,
    usage:           rrDefaults.usage,
    urbanRural:      rrDefaults.urbanRural,
    createdOn:       today,
    ownerName:       "Pending verification",
    ownerNameMr:     "—",
    ownerAadhaar:    "—",
    ownerPan:        "—",
    coOwners:        [],
    status:          "Clear",
    confidence:      92.0,
    docsCount:       0,
    chunksCount:     0,
    progress:        5,
    nextAction:      "Upload land documents to begin AI validation",
  };
}
