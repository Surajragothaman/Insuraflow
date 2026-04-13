import {
  Search, FileText, Link2, Building2, CheckSquare,
  Award, PenLine, Receipt, DollarSign, Download, XCircle,
  RotateCcw, TrendingDown, Megaphone, RefreshCw, FileSignature, BadgeCheck,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
export type Status = "pending" | "extracted" | "approved" | "paused" | "failed" | "submitted";

export interface ExtractedField {
  key: string;
  label: string;
  group: string;
}

export interface SopApp {
  slug: string;
  name: string;
  description: string;
  sopSources: string[];
  approach: "Hybrid" | "CUA";
  platforms: string[];
  processSteps: string[];
  extractedFields: ExtractedField[];
  emailSubjectExamples: string[];
}

export interface ProcessCategory {
  slug: string;
  name: string;
  icon: typeof Search;
  apps: SopApp[];
}

export interface MockTask {
  id: string;
  sender: string;
  subject: string;
  clientName: string;
  policyNumber: string;
  status: Status;
  stage: "intake" | "actions" | "output" | "done";
  receivedAt: string;
  confidence: "high" | "low";
  amsMatch: boolean;
  extractedData: Record<string, string>;
}

// ─── Categories & Apps (aligned with wiki) ───────────────────────

export const categories: ProcessCategory[] = [
  {
    slug: "prospecting",
    name: "Prospecting / Finding New Business",
    icon: Search,
    apps: [
      {
        slug: "prospect-setup",
        name: "Prospect Setup",
        description: "Identifying and onboarding a new prospect in the AMS (Jacobson / EPIC)",
        sopSources: ["Prospect (SOP) Jacobson Updated.doc"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Applied EPIC AMS"],
        processSteps: [
          "Receive prospect request email in Outlook",
          "Client/account lookup by name or email in EPIC",
          "Create prospect record if not found",
          "Assign servicer to the account",
          "Set up new account in EPIC",
          "Notify Account Manager of completion",
        ],
        extractedFields: [
          { key: "clientName", label: "Client Name", group: "Contact Info" },
          { key: "email", label: "Email Address", group: "Contact Info" },
          { key: "phone", label: "Phone Number", group: "Contact Info" },
          { key: "address", label: "Address", group: "Contact Info" },
          { key: "businessType", label: "Business Type", group: "Business Info" },
          { key: "referralSource", label: "Referral Source", group: "Business Info" },
        ],
        emailSubjectExamples: [
          "New prospect - {company} needs commercial insurance",
          "Please set up account for {insured}",
          "New lead from referral - {company}",
        ],
      },
    ],
  },
  {
    slug: "quoting",
    name: "Quoting",
    icon: FileText,
    apps: [
      {
        slug: "vt-insurance-quotes",
        name: "VT Insurance Quotes (Aviation)",
        description: "Managing aviation/drone insurance quote files in EPIC with carrier portals",
        sopSources: ["VT Insurance Quotes - SOP.docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Applied EPIC AMS", "Aviation Carrier Portals (Avemco, USAIG)"],
        processSteps: [
          "Receive quote request from producer with PDF documentation",
          "Search for existing account in EPIC (avoid duplicates)",
          "Create new account if needed — enter producer info, servicing details",
          "Add policy line with description, effective/expiry dates",
          "Add producer in Pr/Br commissions",
          "Enter aircraft section data from PDF",
          "Add Additional Insured information",
          "Generate quote document from EPIC template (Word format)",
          "Edit embedded Excel with coverage details",
          "Attach quote to EPIC and send to Account Manager",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Account Info" },
          { key: "aircraftType", label: "Aircraft Type", group: "Aircraft" },
          { key: "tailNumber", label: "Tail Number", group: "Aircraft" },
          { key: "pilotName", label: "Pilot Name", group: "Aircraft" },
          { key: "hullValue", label: "Hull Value", group: "Coverage" },
          { key: "liabilityLimit", label: "Liability Limit", group: "Coverage" },
          { key: "effectiveDate", label: "Effective Date", group: "Policy" },
          { key: "expirationDate", label: "Expiration Date", group: "Policy" },
        ],
        emailSubjectExamples: [
          "Quote request - {insured} - Aviation coverage",
          "New drone policy quote for {company}",
          "Renewal quote - {insured} - Hull & Liability",
        ],
      },
      {
        slug: "bop-quoting",
        name: "BOP Quoting (Chubb Marketplace)",
        description: "Creating Business Owner's Policy quotes via Chubb Marketplace portal — fully CUA",
        sopSources: ["SOP - BOP Quoting.docx"],
        approach: "CUA",
        platforms: ["Chubb Marketplace Portal"],
        processSteps: [
          "Receive quote request from AM via Outlook",
          "Log in to Chubb Marketplace portal",
          "Check Appetite — enter business description, NAICS code, state, revenue",
          "Start New Quote — enter business details and primary risk location",
          "Enter Classification Details (business description, annual revenue)",
          "Answer Eligibility Questions (underwriting)",
          "Select Lines of Business to insure",
          "Enter loss history (if any)",
          "Set Coverage and Policy Limits",
          "Enter Building Settings (deductible, construction, sq footage, BPP)",
          "Add optional coverages (Equipment Breakdown, EPLI, Privacy Liability)",
          "Add Additional Interests (AI, Loss Payable, PNC)",
          "Click 'Quote Product' to generate premium",
          "Go to Quote Summary — send to AM for review",
        ],
        extractedFields: [
          { key: "businessName", label: "Business Name", group: "Business Info" },
          { key: "naicsCode", label: "NAICS Code", group: "Business Info" },
          { key: "state", label: "Primary State", group: "Business Info" },
          { key: "annualRevenue", label: "Annual Revenue", group: "Business Info" },
          { key: "riskAddress", label: "Risk Location Address", group: "Location" },
          { key: "constructionType", label: "Construction Type", group: "Building" },
          { key: "squareFootage", label: "Square Footage", group: "Building" },
          { key: "lobs", label: "Lines of Business", group: "Coverage" },
        ],
        emailSubjectExamples: [
          "BOP quote request - {company}",
          "Need Chubb BOP quote for {insured}",
        ],
      },
      {
        slug: "quote-sheets-rater",
        name: "Quote Sheets & EPIC Rater Entry",
        description: "Pulling DOMO leads, completing quote sheets, entering in EPIC Rater for home/condo insurance",
        sopSources: ["Flatworld Workflow for Quote Sheets and Epic Rater Entry.docx"],
        approach: "Hybrid",
        platforms: ["DOMO (REST API)", "Applied EPIC Rater", "Realtor Sites (Redfin, Zillow, Realtor.com)"],
        processSteps: [
          "Pull DOMO leads (twice daily: 11 AM and 3 PM EST)",
          "Identify opportunities: 'Movement Insurance Quote' = YES or 'Opt In' AND Loan Purpose = New Purchase",
          "Check EPIC to see if quote already completed",
          "Complete Quote Sheet — top half from DOMO, bottom half from realtor sites",
          "Enter in EPIC Rater — Policy Type: HOME (HO3) or CONDOMINIUM (HO6)",
          "Calculate Dwelling Coverage: HO3 = $200/sq ft; HO6 = $100K dwelling + $50K contents",
          "Set effective date = Requested Close date from DOMO",
        ],
        extractedFields: [
          { key: "borrowerName", label: "Borrower Name", group: "Lead Info" },
          { key: "propertyAddress", label: "Property Address", group: "Property" },
          { key: "squareFeet", label: "Square Feet", group: "Property" },
          { key: "yearBuilt", label: "Year Built", group: "Property" },
          { key: "occupancyType", label: "Occupancy Type", group: "Property" },
          { key: "closeDate", label: "Requested Close Date", group: "Lead Info" },
          { key: "dwellingCoverage", label: "Dwelling Coverage", group: "Coverage" },
          { key: "policyType", label: "Policy Type (HO3/HO6)", group: "Coverage" },
        ],
        emailSubjectExamples: [
          "DOMO lead - {borrower} - {address}",
          "New purchase quote - {property}",
        ],
      },
    ],
  },
  {
    slug: "application",
    name: "Application",
    icon: FileSignature,
    apps: [
      {
        slug: "acord-apps",
        name: "ACORD Applications (Homewell)",
        description: "Creating ACORD 125/126/140 applications and Statement of Values using TAM + ICE 247",
        sopSources: ["Accord Apps SOP (Homewell).docx"],
        approach: "Hybrid",
        platforms: ["TAM AMS", "ICE 247 / TitlePro Portal", "Microsoft Outlook", "Excel"],
        processSteps: [
          "Receive email with property/contact information for ACORD app and SOV",
          "Search property profile in ICE 247/TitlePro by address",
          "Download property PDF and save to share drive",
          "Create Statement of Values (SOV) in Excel — Named Insured, Address, Limits, etc.",
          "In TAM: create insured record → add prospect → fill contact details",
          "Open ACORD 125 (General Application) — fill Policy Info, Named Insured, Inspection Contact",
          "Fill Description of Location, Annual Revenue, Building Area, Year Built",
          "Open ACORD 126 (GL Section) — Agency Bill, Hazard Schedule",
          "Open ACORD 140 (Property Section) — Coverages, Construction, Premises",
          "Save, print, and email Producer with Property Profile + ACORD App + SOV",
        ],
        extractedFields: [
          { key: "insuredName", label: "Named Insured", group: "Contact" },
          { key: "mailingAddress", label: "Mailing Address", group: "Contact" },
          { key: "propertyAddress", label: "Property Address", group: "Location" },
          { key: "annualRevenue", label: "Annual Revenue", group: "Business" },
          { key: "buildingArea", label: "Total Building Area", group: "Building" },
          { key: "yearBuilt", label: "Year Built", group: "Building" },
          { key: "constructionType", label: "Construction Type", group: "Building" },
          { key: "stories", label: "Number of Stories", group: "Building" },
          { key: "occupancy", label: "Occupancy %", group: "Building" },
          { key: "propertyLimits", label: "Property Limits", group: "Coverage" },
        ],
        emailSubjectExamples: [
          "ACORD Application needed - {insured} - {address}",
          "SOV + Application for {property}",
        ],
      },
    ],
  },
  {
    slug: "binding",
    name: "Binding",
    icon: Link2,
    apps: [
      {
        slug: "binder-request",
        name: "Binder Request (HawkSoft)",
        description: "Processing binder requests from mortgage servicers — requires authorization form before proceeding",
        sopSources: ["SOP-Binder Request.docx"],
        approach: "Hybrid",
        platforms: ["HawkSoft AMS", "Carrier Portals", "Email/Fax"],
        processSteps: [
          "Check incoming binder requests (email, fax, HawkSoft task)",
          "Verify required documents: Insured Authorization Form + Estimated Closing Date",
          "If missing: contact servicer — do NOT proceed without authorization",
          "Review authorization form and verify all request details",
          "Cross-check in HawkSoft + carrier portal: insured name, property, policy#, mortgage details",
          "Update Additional Interest (mortgagee) in HawkSoft",
          "Generate Binder document in HawkSoft",
          "Review binder for accuracy",
          "Send to requestor and document in HawkSoft",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Request" },
          { key: "propertyAddress", label: "Property Address", group: "Request" },
          { key: "policyNumber", label: "Policy Number", group: "Request" },
          { key: "mortgagee", label: "Mortgagee/Servicer", group: "Mortgage" },
          { key: "closingDate", label: "Estimated Closing Date", group: "Mortgage" },
          { key: "authFormReceived", label: "Authorization Form", group: "Compliance" },
        ],
        emailSubjectExamples: [
          "Binder request - {insured} - {address}",
          "Mortgage binder needed - {servicer} - Policy #{policyNum}",
        ],
      },
      {
        slug: "coi-binder-vt",
        name: "Producer COI/Binder (VT Insurance)",
        description: "Downloading and filling out state-specific COI templates for producers using Adobe + EPIC",
        sopSources: ["COI_Binder_Application_ SOP.docx"],
        approach: "Hybrid",
        platforms: ["Applied EPIC AMS", "Adobe Acrobat", "OneDrive", "Microsoft Outlook"],
        processSteps: [
          "Review emails for COI requirements — identify state and deadlines",
          "Attach email and PDF documents to EPIC",
          "Locate prefilled COI template from OneDrive (VT Insurance > Certs > Prefill State Templates)",
          "Download correct state template, open in Adobe Acrobat",
          "Refer to binder for policy details",
          "Fill all required fields: producer name, carrier, policy numbers, coverage dates, limits, cert holder",
          "Double-check completeness and accuracy",
          "Save as COI_[State]_[Prefill]_[COI].pdf",
          "Upload to EPIC under policy attachments",
          "Send completed COI via Outlook",
        ],
        extractedFields: [
          { key: "producerName", label: "Producer Name", group: "Producer" },
          { key: "state", label: "State", group: "Producer" },
          { key: "carrierName", label: "Carrier", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "effectiveDate", label: "Effective Date", group: "Policy" },
          { key: "expirationDate", label: "Expiration Date", group: "Policy" },
          { key: "coverageLimits", label: "Coverage Limits", group: "Coverage" },
          { key: "certHolder", label: "Certificate Holder", group: "Holder" },
        ],
        emailSubjectExamples: [
          "COI needed - {producer} - {state}",
          "Producer certificate request - {state}",
        ],
      },
    ],
  },
  {
    slug: "policy-setup",
    name: "Policy Setup & Data Entry",
    icon: Building2,
    apps: [
      {
        slug: "policy-setup-ams360",
        name: "Policy Setup (AMS360 / Jacobson)",
        description: "Setting up new policies in AMS360 for the Jacobson agency",
        sopSources: ["Policy Setup (SOP) Jacobson.docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Vertafore AMS360"],
        processSteps: [
          "Receive policy setup request email in Outlook",
          "Login to AMS360 → Customer Center",
          "Search for customer by name or policy number",
          "If not found: create new customer (name, address, contact info)",
          "Go to Policy Tab → Add New Policy",
          "Enter: Policy Type (LOB), Carrier, Policy Number, Effective/Expiry Dates",
          "Configure Billing/Payment info and Primary Service Group",
          "Enter Coverage Details, Limits/Deductibles, Premium, Commission",
          "Create Activity (Type: Policy/New Business)",
          "Send confirmation email to Account Manager",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Customer" },
          { key: "address", label: "Address", group: "Customer" },
          { key: "policyType", label: "Policy Type (LOB)", group: "Policy" },
          { key: "carrier", label: "Carrier", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "effectiveDate", label: "Effective Date", group: "Policy" },
          { key: "expiryDate", label: "Expiry Date", group: "Policy" },
          { key: "premium", label: "Premium", group: "Financials" },
          { key: "commission", label: "Commission", group: "Financials" },
        ],
        emailSubjectExamples: [
          "Policy setup - {insured} - {carrier}",
          "New business - please set up in AMS360",
        ],
      },
      {
        slug: "policy-issue",
        name: "Policy Issue Verification (EPIC)",
        description: "Post-setup verification: confirming policy details in EPIC match master report, then issuing",
        sopSources: ["Policy issue.docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Applied EPIC AMS", "Excel (Master Report)"],
        processSteps: [
          "Check email for policy issuance instruction — confirm name, type, date",
          "Cross-check with Master Report: Assigned Date and Process Date",
          "In EPIC: verify Assigned Date, policy line, policy type",
          "Open policy → cross-check Effective Date, Policy Number, Carrier from email checklist",
          "Right-click policy → Issue/Not Issue Policy → Finish",
          "Wait for stage to change to 'Issued'",
          "Open Activities → Verify/Issue task → change status to 'Completed' + add note",
          "Close the activity on the policy line → Save",
          "Update Master Report: status = 'Issued', add Issued Date",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "policyType", label: "Policy Type", group: "Policy" },
          { key: "carrier", label: "Carrier", group: "Policy" },
          { key: "effectiveDate", label: "Effective Date", group: "Policy" },
          { key: "assignedDate", label: "Assigned Date", group: "Tracking" },
          { key: "processDate", label: "Process Date", group: "Tracking" },
        ],
        emailSubjectExamples: [
          "Please issue policy - {insured} - {carrier}",
          "Policy ready for issuance - {policyNum}",
        ],
      },
      {
        slug: "data-entry-qq",
        name: "Data Entry (QQ Catalyst)",
        description: "Bulk policy migration into QQ Catalyst from Excel database — uses Gmail, not Outlook",
        sopSources: ["SOP - Data Entry Policy.docx"],
        approach: "Hybrid",
        platforms: ["QQ Catalyst", "Gmail", "Excel"],
        processSteps: [
          "Ensure QQ Catalyst and Gmail access credentials are functional",
          "Receive Excel database from client with policy details",
          "Navigate to Contacts → New Contact → enter business name and details",
          "Open contact → Policies → New Policy",
          "Input: Line of Business, start/end dates, policy number, estimated premium",
          "Go to Policy Action → Issue Policy",
          "Fill in: Carrier, MGA/Wholesaler, billing type, Producer, financing info",
          "Add carrier fees and financial information",
          "Save and issue the policy → Finish",
          "Review all inputted details for accuracy",
        ],
        extractedFields: [
          { key: "clientName", label: "Client Name", group: "Contact" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "renewalDate", label: "Renewal Date", group: "Policy" },
          { key: "carrier", label: "Carrier/MGA", group: "Policy" },
          { key: "lob", label: "Line of Business", group: "Policy" },
          { key: "premium", label: "Estimated Premium", group: "Financials" },
          { key: "billingType", label: "Billing Type", group: "Financials" },
          { key: "producer", label: "Producer", group: "Assignment" },
        ],
        emailSubjectExamples: [
          "Policy data entry batch - {count} records",
          "Excel database for QQ Catalyst migration",
        ],
      },
    ],
  },
  {
    slug: "policy-checking",
    name: "Policy Checking",
    icon: CheckSquare,
    apps: [
      {
        slug: "policy-checking",
        name: "Policy Checking (EPIC)",
        description: "Verifying renewal details against policy documents — 15+ field categories checked in EPIC",
        sopSources: ["SOP - Policy Checking.docx", "SOP Policy Checking1.docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Applied EPIC AMS", "Carrier Portals", "Excel (Renewal Sheet)"],
        processSteps: [
          "Receive email from Producer/AM with attached renewal sheet",
          "Login to EPIC → search insured account",
          "Download renewal document from EPIC or carrier portal",
          "Compare: Servicing/Billing — Policy Number, Effective Date, Premium/Commission",
          "Compare: Lines of Business — policy line, billing type, issuing company",
          "Compare: Applicant — Named Insured, mailing address, business type",
          "Compare: Other Named Insured — name, address, phone, email",
          "Compare: Premises — property locations match policy",
          "Compare: Forms & Endorsements — form numbers, names, edition dates",
          "Compare: Property details — construction, stories, year built, wind class",
          "Compare: General Liability — claims-made vs occurrence, all limits",
          "Compare: Hazards — codes, descriptions, premium basis, exposure rates",
          "If discrepancies: right-click → Endorse/Revise (activity code CHGE)",
          "Record all discrepancies in renewal sheet (Excel)",
          "Email renewal sheet to AM with noted differences",
        ],
        extractedFields: [
          { key: "insuredName", label: "Named Insured", group: "Account" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "effectiveDate", label: "Effective Date", group: "Policy" },
          { key: "carrier", label: "Carrier", group: "Policy" },
          { key: "premium", label: "Total Premium", group: "Financials" },
          { key: "billingType", label: "Billing Type", group: "Financials" },
          { key: "glAggregate", label: "GL Aggregate Limit", group: "GL Coverage" },
          { key: "glOccurrence", label: "GL Each Occurrence", group: "GL Coverage" },
          { key: "discrepanciesFound", label: "Discrepancies Found", group: "Results" },
        ],
        emailSubjectExamples: [
          "Policy checking - {insured} - {carrier} renewal",
          "Renewal sheet attached - {lookupCode} - {insured}",
        ],
      },
    ],
  },
  {
    slug: "certificates",
    name: "Certificate of Insurance / EOI",
    icon: Award,
    apps: [
      {
        slug: "coi-issuance",
        name: "COI / EOI Issuance",
        description: "Generating Certificates of Insurance via EPIC/CSR24 with WC (NYSIF) and DBL (LIDAC) handling",
        sopSources: [
          "Certificate_of_Insurance_SOP.docx",
          "Certificate_of_Insurance_SOP CSR24 Process.docx",
          "SOP Apex COI.docx",
          "EOI SOP (Jacobson).docx",
          "Certificate Review Checklist.docx",
        ],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Applied EPIC AMS", "CSR24 Portal", "NYSIF Portal", "LIDAC", "Vertafore AMS360"],
        processSteps: [
          "Email intake — identify insured name, requestor type (AM, insured, third-party holder), request type (standard, AI, vendor credentialing, EOI, missing cert, updated)",
          "Account lookup in AMS (EPIC or AMS360)",
          "Servicer check — verify who is responsible before processing",
          "Navigate to Proof of Insurance → Certificates → locate master template",
          "IF NO MASTER TEMPLATE → CSR24 fallback: open CSR24 tab from EPIC → Proofs → find current master → verify policies match EPIC → add holder → enter DOP → preview → issue",
          "Select policies per email requirements (AI, PNC, WOS)",
          "If WC with NYSIF: exit EPIC → login to ww3.nysif.com → locate by policy# → add holder → create cert (or request via carrier email if no credentials)",
          "If DBL requested: exit EPIC → login to LIDAC → Cert of Compliance → enter holder → submit (or request via carrier email)",
          "Add certificate holder (name, address, project details)",
          "Enter Description of Operations with requested verbiage",
          "Check holder details — verify AI, PNC, WOS boxes",
          "Issue Single Holder → generate certificate PDF",
          "QA CHECKLIST (10 items): correct description? unnecessary language removed? endorsements attached? no form# errors for AI? limits for all coverages? no duplicate policy entries? Inland Marine/AD&D complete? Project ID updated? AI endorsement attached? WOS checked?",
          "If endorsement is pending → WAIT for carrier confirmation before issuing (TAT: same business day standard, after endorsement confirmation if endorsements needed)",
          "Save PDF → email to requestor with WC/DBL certs attached",
          "Archive: drag-and-drop email to EPIC Attachments",
        ],
        extractedFields: [
          { key: "certificateHolder", label: "Certificate Holder", group: "Holder Info" },
          { key: "holderAddress", label: "Holder Address", group: "Holder Info" },
          { key: "insuredName", label: "Insured Name", group: "Insured Info" },
          { key: "projectName", label: "Project/Job Name", group: "Holder Info" },
          { key: "glPolicyNumber", label: "GL Policy Number", group: "GL Coverage" },
          { key: "glInsurer", label: "GL Insurer", group: "GL Coverage" },
          { key: "glLimits", label: "GL Limits", group: "GL Coverage" },
          { key: "autoPolicyNumber", label: "Auto Policy Number", group: "Auto Coverage" },
          { key: "wcPolicyNumber", label: "WC Policy Number", group: "WC Coverage" },
          { key: "wcCarrier", label: "WC Carrier", group: "WC Coverage" },
          { key: "umbPolicyNumber", label: "Umbrella Policy Number", group: "Umbrella" },
          { key: "additionalInsured", label: "Additional Insured?", group: "Requirements" },
          { key: "pnc", label: "Primary & Non-Contributory?", group: "Requirements" },
          { key: "wos", label: "Waiver of Subrogation?", group: "Requirements" },
          { key: "descriptionOfOps", label: "Description of Operations", group: "Requirements" },
        ],
        emailSubjectExamples: [
          "Certificate holder addition - {holder}",
          "COI request - {insured}",
          "Additional insured request - {holder}",
          "Evidence of Insurance - {insured}",
          "Updated COI needed - {insured}",
          "Missing Certificate of Insurance",
        ],
      },
      {
        slug: "csr24-admin",
        name: "CSR24 / Apex Admin",
        description: "Portal administration — template setup, client access, document visibility, cert generation in CSR24",
        sopSources: [
          "Apex SOP - Account Management - CSR24 Cert Generation - Walkthrough - V1.0 - 10.29.2025.docx",
          "Apex SOP - Account Management - CSR24 Template Setup - Walkthrough - V1.0 - 10.29.2025.docx",
          "Apex SOP - Account Management - Making Docs Available in CSR24 - Walkthrough - V1.0 - 10.29.25.docx",
          "Apex SOP - Account Management - Granting Client Access to Apex Client Portal - Walkthrough - V1.0 - 10.29.25.docx",
          "Apex SOP - Account Management - Processing Certificate Requests from Account Managers - Walkthrough - V1.0 - 11.04.25.docx",
        ],
        approach: "CUA",
        platforms: ["Applied EPIC AMS", "Applied CSR24 Portal"],
        processSteps: [
          "Receive request (cert generation, template setup, client access, or doc visibility)",
          "In EPIC: open client policy → Links → CSR24 Sign-On",
          "For Cert Generation: select template → add holder → apply AI wording → add recipients → preview → submit",
          "For Template Setup: confirm policy Issued → retrieve endorsements → create template in CSR24 → link policies → attach endorsements",
          "For Client Access: Contacts → Client Portal Account → Create Account → enter email → Save",
          "For Doc Visibility: upload document → check 'Client Access' checkbox → select folder → Finish",
          "For AM Cert Requests: create CERT activity → assign to AM → attach request → issue via CSR24",
          "Document the action in EPIC activity log",
        ],
        extractedFields: [
          { key: "clientName", label: "Client Name", group: "Account" },
          { key: "taskType", label: "Task Type", group: "Request" },
          { key: "certHolder", label: "Certificate Holder", group: "Cert Generation" },
          { key: "projectName", label: "Project Name", group: "Cert Generation" },
          { key: "templateName", label: "Template Name", group: "Template Setup" },
          { key: "contactEmail", label: "Contact Email", group: "Client Access" },
          { key: "documentName", label: "Document Name", group: "Doc Visibility" },
        ],
        emailSubjectExamples: [
          "Certificate Request - {client} - {project}",
          "Please set up CSR24 access for {client}",
          "Template needed for {client}",
        ],
      },
    ],
  },
  {
    slug: "endorsements",
    name: "Endorsements / Policy Changes",
    icon: PenLine,
    apps: [
      {
        slug: "endorsement-epic",
        name: "Endorsements (EPIC)",
        description: "Processing mailing address changes — CHGR activity in EPIC, carrier submission (online or email)",
        sopSources: ["SOP Endorsement.docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Applied EPIC AMS", "Carrier Portals (Starwind, AmTrust, etc.)"],
        processSteps: [
          "Receive change request email from Account Manager",
          "Login to EPIC → locate insured by lookup code/policy#/name",
          "Cross-check address: EPIC account detail vs email request",
          "If mismatch: update address → 'Apply Address to Other Items'",
          "Check Activities tab for existing CHGR activity — create new if needed",
          "Determine carrier type: online (submit on carrier site) or offline (email)",
          "For online carriers: submit change directly on carrier website",
          "For offline carriers: find underwriter email → send formatted change request",
          "Right-click policy → Endorse/Revise → set effective date → create CHGR activity",
          "Drag-and-drop sent email to CHGR activity attachments",
          "Set follow-up: 2 attempts to get endorsement doc, then escalate to AM",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Account" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "currentAddress", label: "Current Address", group: "Change" },
          { key: "newAddress", label: "New Address", group: "Change" },
          { key: "carrierName", label: "Carrier", group: "Carrier" },
          { key: "carrierType", label: "Online/Offline", group: "Carrier" },
          { key: "effectiveDate", label: "Effective Date of Change", group: "Change" },
        ],
        emailSubjectExamples: [
          "Address change - {insured} - all policies",
          "Endorsement request - {insured} - new mailing address",
        ],
      },
      {
        slug: "mortgagee-update",
        name: "Mortgagee Update (HawkSoft)",
        description: "Updating lender/mortgagee information on policies via HawkSoft and carrier portals",
        sopSources: ["SOP-Mortgagee Update.docx"],
        approach: "Hybrid",
        platforms: ["HawkSoft AMS", "Carrier Portals"],
        processSteps: [
          "Check daily emails, carrier portals, and HawkSoft tasks for mortgagee update requests",
          "Verify request details: insured name, policy number, requested mortgagee",
          "Verify policy is active on carrier portal + HawkSoft",
          "Compare existing mortgagee — if different bank, get insured confirmation",
          "Collect mortgagee details: lender name, loan number, mortgagee clause, mailing address",
          "Process mortgagee update on carrier portal",
          "Submit endorsement request → download updated Declaration Page",
          "Update HawkSoft with new mortgagee information",
          "Send updated Dec Page to requestor",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "currentMortgagee", label: "Current Mortgagee", group: "Current" },
          { key: "newMortgagee", label: "New Mortgagee/Lender", group: "Update" },
          { key: "loanNumber", label: "Loan Number", group: "Update" },
          { key: "mortgageeClause", label: "Mortgagee Clause", group: "Update" },
          { key: "mortgageeAddress", label: "Mortgagee Address", group: "Update" },
        ],
        emailSubjectExamples: [
          "Mortgagee update - {insured} - new lender: {lender}",
          "Lender change request - Policy #{policyNum}",
        ],
      },
    ],
  },
  {
    slug: "invoicing",
    name: "Invoicing & Billing",
    icon: Receipt,
    apps: [
      {
        slug: "invoicing-stern",
        name: "Invoicing (Partner XE / Stern)",
        description: "Creating invoices for new business, renewals, and endorsements in Partner XE",
        sopSources: ["Invoicing Process SOP (Stern).docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Applied Partner XE"],
        processSteps: [
          "Receive invoice request email from AM/Producer/Underwriter/Carrier",
          "Verify: insured name, policy number, invoice type, premium amount",
          "Login to Partner XE → Search/Find Client → open correct account",
          "Open Policy → verify policy number, term, carrier",
          "Navigate to Accounting/Billing → Open Client Ledger → review premium details",
          "Create Invoice: Add Invoice/Transaction → select type (Agency Bill/Direct Bill)",
          "Choose category: New Business / Renewal / Endorsement",
          "Enter invoice amount, due date, additional details",
          "Review, save, and close",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Client" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "invoiceType", label: "Invoice Type", group: "Invoice" },
          { key: "category", label: "Category (New/Renewal/Endorsement)", group: "Invoice" },
          { key: "premiumAmount", label: "Premium Amount", group: "Invoice" },
          { key: "billingType", label: "Billing Type (Agency/Direct)", group: "Invoice" },
          { key: "dueDate", label: "Due Date", group: "Invoice" },
        ],
        emailSubjectExamples: [
          "Invoice request - {insured} - {carrier}",
          "Renewal billing - {insured} - ${amount}",
        ],
      },
    ],
  },
  {
    slug: "payment",
    name: "Payment & Commission",
    icon: DollarSign,
    apps: [
      {
        slug: "payment-processing",
        name: "Payment Processing",
        description: "Downloading payment receipts from carriers and following up on open payment activities",
        sopSources: ["Payment Receipts SOP (Jacobson).docx", "Payment follow-up SOP (MI).docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Vertafore AMS360", "Applied EPIC AMS", "Carrier Portals"],
        processSteps: [
          "Receive payment confirmation or follow-up trigger",
          "Login to carrier portal → find policy → download payment receipt",
          "Login to AMS → search by account name or policy number",
          "Log payment receipt and attach document to policy in AMS",
          "For follow-ups: check All Open Activities in EPIC → select payment task",
          "Review activity details → check policies and attachments",
          "Upload documentation → reassign task to Calling IDs for follow-up",
          "Update follow-up date with notes → close task when resolved",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "paymentAmount", label: "Payment Amount", group: "Payment" },
          { key: "paymentDate", label: "Payment Date", group: "Payment" },
          { key: "invoiceRef", label: "Invoice Reference", group: "Payment" },
          { key: "carrier", label: "Carrier", group: "Payment" },
        ],
        emailSubjectExamples: [
          "Payment confirmation - {insured} - {carrier}",
          "Payment follow-up needed - {insured}",
        ],
      },
      {
        slug: "commission-entry",
        name: "Direct Bill Commission Entry (EPIC GL)",
        description: "Entering carrier commission statements into EPIC General Ledger — monthly deadline, no exceptions",
        sopSources: ["Direct Bill Commission Manual Entry 2.docx"],
        approach: "Hybrid",
        platforms: ["Applied EPIC AMS (GL/Commission module)"],
        processSteps: [
          "Check EPIC Home for assigned DBCO activities",
          "Open DBCO activity → Access → Attachments → view commission statement",
          "Go to General Ledger → Reconciliation → Direct Bill Commissions → click '+'",
          "Select company/broker code (e.g., MICCO1 or APPAUND-01)",
          "Enter description: '[Company] – Direct Bill Commission Received – [MONTH YEAR]'",
          "Click DETAIL → Filtered Policies list populates (if missing, call Francine)",
          "For each transaction: select policy → verify correct policy year",
          "Enter: Trans code DBIM, verify Agcy Com %, enter Commission Amount",
          "Verify producer commission %: Standard 50%/20%, Frank 45%/25%, Barry 40%/40%, Jason 0%",
          "Click FINISH per transaction → verify total matches statement",
          "Close statement (Suspended status) → note to Francine: 'Please review, associate and finalize'",
        ],
        extractedFields: [
          { key: "companyName", label: "Company/Broker Name", group: "Statement" },
          { key: "companyCode", label: "Company Code", group: "Statement" },
          { key: "statementMonth", label: "Statement Month", group: "Statement" },
          { key: "totalCommission", label: "Total Commission Amount", group: "Financials" },
          { key: "transactionCount", label: "Transaction Count", group: "Statement" },
          { key: "policyYear", label: "Policy Year", group: "Details" },
        ],
        emailSubjectExamples: [
          "DBCO activity assigned - {company} commission statement",
          "Commission statement received - {carrier} - {month}",
        ],
      },
    ],
  },
  {
    slug: "carrier-downloads",
    name: "Carrier Downloads",
    icon: Download,
    apps: [
      {
        slug: "carrier-downloads",
        name: "Carrier Downloads",
        description: "Pulling cancellation and renewal documents from carrier portals (Liberty Mutual, Utica) with MFA",
        sopSources: ["Carrier Downloads SOP.docx"],
        approach: "Hybrid",
        platforms: ["Applied EPIC AMS", "Liberty Mutual Portal", "Utica Portal", "Other Carrier Portals"],
        processSteps: [
          "Login to carrier portal with credentials (MFA via email code)",
          "For Cancellations: click 'All Recent Activity' → 'Billing' tab",
          "Click policy number → 'Account Activity' → find cancellation document",
          "Click 'View Notice' → verify: document type, insured name, cancellation type (non-pay), due date",
          "Save document: Desktop → Carrier docs → [Processed Date] folder",
          "Login to EPIC → drag-and-drop document to Unrouted folder",
          "Assign to Account Manager for review → Finish",
          "For Renewals: click 'Recent Transactions' → filter by processed date",
          "Click policy number where transaction = 'Renewal'",
          "Verify: insured name, policy number, policy period → download and attach to EPIC",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "documentType", label: "Document Type", group: "Document" },
          { key: "carrier", label: "Carrier", group: "Document" },
          { key: "cancellationDate", label: "Cancellation Date", group: "Cancellation" },
          { key: "cancellationType", label: "Cancellation Type", group: "Cancellation" },
        ],
        emailSubjectExamples: [
          "Carrier download - {carrier} - cancellation notices",
          "Renewal docs from {carrier} - {date}",
        ],
      },
    ],
  },
  {
    slug: "cancellation",
    name: "Cancellation",
    icon: XCircle,
    apps: [
      {
        slug: "cancellation-xnp",
        name: "Cancellation Notice XNP (HawkSoft)",
        description: "Daily XNP (non-payment) cancellation notice review, insured notification, and follow-up in HawkSoft",
        sopSources: ["SOP – Cancellation notice (XNP).docx"],
        approach: "Hybrid",
        platforms: ["HawkSoft AMS", "Carrier Portals", "Microsoft Outlook", "Excel (Production Report)"],
        processSteps: [
          "Review daily XNP notices from carrier portals, email, HawkSoft tasks",
          "Record: insured name, policy#, carrier, minimum amount due, cancellation date",
          "Open carrier-specific cancellation email template",
          "Update template with insured details and payment instructions",
          "Verify line of business: Personal Lines or Commercial Lines",
          "Personal Lines: send to insured, CC Account Manager",
          "Commercial Lines: send to insured, CC AM + Producer",
          "Create XNP Cancellation Log in HawkSoft",
          "Create follow-up task: PL = 2 days after cancellation; CL = 5 days before",
          "Update Production Report",
          "On follow-up date: check carrier portal → confirm Active/Reinstated or Cancelled",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Notice" },
          { key: "policyNumber", label: "Policy Number", group: "Notice" },
          { key: "carrier", label: "Carrier", group: "Notice" },
          { key: "minimumDue", label: "Minimum Amount Due", group: "Notice" },
          { key: "cancellationDate", label: "Cancellation Effective Date", group: "Notice" },
          { key: "lineOfBusiness", label: "Line of Business (PL/CL)", group: "Classification" },
          { key: "followUpDate", label: "Follow-Up Date", group: "Tracking" },
        ],
        emailSubjectExamples: [
          "Cancellation notice - {insured} - {carrier} - Non-Payment",
          "XNP notice - Policy #{policyNum}",
        ],
      },
      {
        slug: "cancellation-epic",
        name: "Cancellation Processing (EPIC)",
        description: "Processing cancellations in EPIC from Excel lists — includes shell-add procedure and PNOC triage",
        sopSources: ["CANCELLATION SOP.docx", "Holden PNOC SOP.docx"],
        approach: "Hybrid",
        platforms: ["Applied EPIC AMS", "Microsoft Outlook", "Excel", "Liberty Mutual Portal"],
        processSteps: [
          "Receive Excel cancellation list from AM or review notice",
          "Login to EPIC → locate insured by policy#/name",
          "Check policy status: active or already cancelled",
          "If already cancelled: Shell Add — renew to next term, set premium=$0, status=Cancelled General",
          "For PNOC: determine notice type — True Cancellation (urgent) vs Pending (future date)",
          "Identify billing type: D=Direct Bill, A=Agency Bill",
          "Direct Bill: research on carrier portal (invoices, payment history)",
          "Agency Bill: create Urgent activity, review Receivables + Daily Cash Report",
          "Execute cancellation action in EPIC → select reason, date, method",
          "Activity code: ESCX (Empty Shell Cancellation) → Finish",
          "Issue Cancellation Activity → verify 'Cancelled General' status",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "cancellationDate", label: "Cancellation Date", group: "Cancellation" },
          { key: "cancellationType", label: "Type (XNP/PNOC/True Cancel)", group: "Cancellation" },
          { key: "billingType", label: "Billing Type (D/A)", group: "Billing" },
          { key: "carrier", label: "Carrier", group: "Policy" },
          { key: "reason", label: "Cancellation Reason", group: "Cancellation" },
        ],
        emailSubjectExamples: [
          "Cancellation list - {month} - Movement Insurance",
          "PNOC - {insured} - {carrier}",
          "Notice of cancellation - {insured}",
        ],
      },
    ],
  },
  {
    slug: "reinstatements",
    name: "Reinstatements",
    icon: RotateCcw,
    apps: [
      {
        slug: "reinstatement",
        name: "Reinstatement Processing (HawkSoft)",
        description: "Documenting policy reinstatements after XNP cancellation — closing follow-up tasks in HawkSoft",
        sopSources: ["SOP – Reinstatement Notice.docx"],
        approach: "Hybrid",
        platforms: ["HawkSoft AMS", "Carrier Portals", "Microsoft Outlook"],
        processSteps: [
          "Review reinstatement notices daily from carrier portals, email, HawkSoft tasks",
          "Verify minimum amount due was paid (carrier notice/portal/documentation)",
          "Confirm carrier has officially issued reinstatement notice — do NOT close without formal confirmation",
          "Verify: policy number, named insured, reinstatement date, policy status = Active/Reinstated",
          "Open existing XNP Cancellation Log in HawkSoft",
          "Add reinstatement note: 'Policy reinstated effective [date]. Minimum amount paid.'",
          "Close XNP follow-up task using reinstatement note as documentation",
          "Verify policy status on carrier portal shows Active/Reinstated",
          "Update Production Report: policy#, insured, carrier, reinstatement date, status",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "carrier", label: "Carrier", group: "Policy" },
          { key: "reinstatementDate", label: "Reinstatement Date", group: "Reinstatement" },
          { key: "amountPaid", label: "Amount Paid", group: "Reinstatement" },
          { key: "policyStatus", label: "Policy Status", group: "Verification" },
        ],
        emailSubjectExamples: [
          "Reinstatement notice - {insured} - {carrier}",
          "Policy reinstated - {policyNum}",
        ],
      },
    ],
  },
  {
    slug: "loss-runs",
    name: "Loss Runs",
    icon: TrendingDown,
    apps: [
      {
        slug: "loss-runs",
        name: "Loss Runs (EPIC + OKTA)",
        description: "Requesting 5-year loss run history from carrier portals via OKTA SSO for renewal preparation",
        sopSources: ["SOP Loss Runs.docx"],
        approach: "Hybrid",
        platforms: ["Applied EPIC AMS", "OKTA SSO", "Carrier Portals (Starwind, etc.)", "Microsoft Outlook"],
        processSteps: [
          "Receive monthly accounts list email from AMs (Excel)",
          "Locate insured in EPIC by name or policy number",
          "Order Loss Runs — Method A (Online): login via OKTA → carrier portal → search policy → Claims/Loss Runs → download",
          "Order Loss Runs — Method B (Email): send formal request to carrier (e.g., lossruns@amwins.com)",
          "Include in request: insured name, policy number, policy period",
          "Verify downloaded report: Named Insured, Valuation Date, Effective Date, Policy Number",
          "Create loss run request activity in EPIC",
          "Attach loss run documents to policy in EPIC",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Account" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "carrier", label: "Carrier", group: "Policy" },
          { key: "policyPeriod", label: "Policy Period", group: "Policy" },
          { key: "requestMethod", label: "Request Method (Online/Email)", group: "Request" },
          { key: "valuationDate", label: "Valuation Date", group: "Report" },
        ],
        emailSubjectExamples: [
          "Monthly loss runs list - {month}",
          "Loss run request - {insured} - {carrier}",
        ],
      },
    ],
  },
  {
    slug: "renewal-marketing",
    name: "Renewal Marketing",
    icon: Megaphone,
    apps: [
      {
        slug: "renewal-marketing",
        name: "Renewal Marketing & Summaries",
        description: "Creating marketed submissions (150-175 days) and processing renewal summaries (120 days) before expiration",
        sopSources: ["SOP Renewal Marketing.docx", "SOP - Processing Renewal Summaries 2.docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "SharePoint", "Applied EPIC AMS"],
        processSteps: [
          "MARKETING (150–175 days): Receive monthly renewal marketing sheets via email",
          "Update Renewal Tracker in SharePoint",
          "Account lookup by lookup code in EPIC → retrieve policy lines and expiration dates",
          "Apply ±45 day window — only include policy lines within 45 days of master expiration",
          "Select master account using priority: PROP > XWIN > CWIN > BWIN > WRAP > PKG (if multiple PROP lines, PROP takes priority)",
          "Only create master if PROP line or GL-S line exists (PROP has priority over GL-S)",
          "Create Master Marketing Submission in EPIC (Policies → Marketed → Add) — name: '[Expiry Date] Renewal Marketing'",
          "Add activity: '[Date] Master Marketing Submission' → assign to AM",
          "Create OFFR activity for standalone policies without PROP/GL-S (WC-S, Flood)",
          "SUMMARIES (120 days): Read renewal tracker from SharePoint → identify 120-day accounts",
          "Verify billing type in EPIC Transactions: CFIN code = Agency Bill, no CFIN = Direct Bill",
          "Check for ENDT code in transactions — if present, download endorsement documents from Attachments",
          "Pull documents with 18-month filter: policy copy, endorsements, invoices",
          "Initiate renewal: Actions → Renew → update year, set policy# to TBD, clear premiums, status to REN",
          "Complete RPOL activity (status: Closed/Successful)",
          "Validate Additional Interests: compare AI list with certificate holders — remove mismatches (holder in AI but not on certs → remove)",
          "Generate renewal summary document",
        ],
        extractedFields: [
          { key: "accountName", label: "Account Name", group: "Account" },
          { key: "lookupCode", label: "Lookup Code", group: "Account" },
          { key: "expirationDate", label: "Expiration Date", group: "Policy" },
          { key: "masterLine", label: "Master Policy Line", group: "Marketing" },
          { key: "billingType", label: "Billing Type (Agency/Direct)", group: "Billing" },
          { key: "daysToExpiry", label: "Days to Expiry", group: "Timing" },
        ],
        emailSubjectExamples: [
          "Renewal marketing sheet - {month}",
          "120-day renewal summaries due",
        ],
      },
    ],
  },
  {
    slug: "renewal-processing",
    name: "Renewal Processing",
    icon: RefreshCw,
    apps: [
      {
        slug: "renewal-epic",
        name: "Renewal Processing (EPIC)",
        description: "Executing renewals in EPIC — renew action, RPOL activity, coverage updates, accounting activity",
        sopSources: ["4. RENEWALS SOP.docx"],
        approach: "Hybrid",
        platforms: ["Microsoft Outlook", "Applied EPIC AMS"],
        processSteps: [
          "Receive email from AM with policy declaration page and invoice (optional)",
          "Locate insured in EPIC by name or policy number",
          "Open renewal policy document from email — confirm correct policy",
          "Select policy → Actions → 'Renew' → activity code RPOL → set dates to next term",
          "Click Finish → update policy coverages per renewal document",
          "Create accounting activity (if agency bill — notify accounting team to bill per invoice)",
          "Attach email and documents to respective policy in EPIC",
          "Respond to AM confirming renewal + accounting activity created",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "carrier", label: "Carrier", group: "Policy" },
          { key: "newEffective", label: "New Effective Date", group: "Renewal" },
          { key: "newExpiry", label: "New Expiry Date", group: "Renewal" },
          { key: "premium", label: "Renewal Premium", group: "Financials" },
          { key: "billingType", label: "Billing Type", group: "Financials" },
        ],
        emailSubjectExamples: [
          "Renewal - {insured} - {carrier} - please process",
          "Policy declaration + invoice - {insured}",
        ],
      },
      {
        slug: "renewal-qq",
        name: "Renewal Processing (QQ Catalyst)",
        description: "Renewing policies in QQ Catalyst from Gmail + Excel tracker — different AMS from EPIC",
        sopSources: ["SOP - Policy Renewal.docx"],
        approach: "Hybrid",
        platforms: ["QQ Catalyst", "Gmail", "Excel"],
        processSteps: [
          "Login to Gmail → review daily for renewal notices and carrier documents",
          "Download renewal documents/attachments",
          "Review renewal request: extract insured name, policy#, dates, carrier, premium, coverage changes",
          "Open QQ Catalyst → locate client → open policy",
          "Update policy record: dates, premium, carrier, coverage details",
          "Enter LOB-specific coverage fields",
          "Save and verify all inputted details",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Policy" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "carrier", label: "Carrier/MGA", group: "Policy" },
          { key: "renewalDate", label: "Renewal Effective Date", group: "Renewal" },
          { key: "premium", label: "Renewal Premium", group: "Financials" },
          { key: "coverageChanges", label: "Coverage Changes", group: "Renewal" },
        ],
        emailSubjectExamples: [
          "Renewal notice - {insured} - {carrier}",
          "Policy renewal due - {policyNum}",
        ],
      },
    ],
  },
  {
    slug: "renewal-proposal",
    name: "Renewal Proposal",
    icon: FileSignature,
    apps: [
      {
        slug: "renewal-proposal",
        name: "Renewal Proposals (EPIC / Charity One)",
        description: "Creating renewal proposals from marketed submissions using EPIC's Demand & Proposal feature",
        sopSources: ["Proposal SOP (Charity One).docx"],
        approach: "Hybrid",
        platforms: ["Applied EPIC AMS"],
        processSteps: [
          "Receive quote, billing type, binding conditions, and broker fee from AM",
          "Locate insured in EPIC",
          "Check Activity tab — if no 'Show Activity', proceed",
          "Go to Policies → Marketed → find relevant submission (e.g., 2026/27)",
          "Click 'Demand and Proposal'",
          "Select template: Agency Bill → 'Updated Proposal', Direct Bill → 'Updated Proposal (Direct Bill)', WC → 'Updated Workers Compensation Proposal'",
          "Enter description: [Carrier] – [LOB] – Proposal → set folder to Proposals",
          "Add activity code SHOW → add AM instructions in notes → Finish",
          "Word document generated → review coverages, locations, issuing company, policy term (annual)",
          "Copy/paste bind conditions from AM into Bind Conditions section",
          "Enter Premium Summary per quote → save",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Account" },
          { key: "carrier", label: "Carrier", group: "Proposal" },
          { key: "lob", label: "Line of Business", group: "Proposal" },
          { key: "billingType", label: "Billing Type (Agency/Direct/WC)", group: "Proposal" },
          { key: "premium", label: "Premium", group: "Financials" },
          { key: "brokerFee", label: "Broker Fee", group: "Financials" },
          { key: "bindConditions", label: "Bind Conditions", group: "Proposal" },
        ],
        emailSubjectExamples: [
          "Proposal needed - {insured} - {carrier}",
          "Renewal proposal - {carrier} – {lob}",
        ],
      },
    ],
  },
  {
    slug: "renewal-certificates",
    name: "Renewal Certificates",
    icon: BadgeCheck,
    apps: [
      {
        slug: "renewal-certs",
        name: "Renewal Certificates (Partner XE / Stern)",
        description: "Generating ACORD 25 & 28 certificates for renewed policies in Partner XE",
        sopSources: ["Renewal Certificates Processing (SOP) Stern.docx"],
        approach: "Hybrid",
        platforms: ["Applied Partner XE", "Microsoft Outlook"],
        processSteps: [
          "Receive certificate request in Outlook from AM/Producer/Insured/Bank",
          "Login to Partner XE → Search/Find Client → open correct account",
          "Open Policy → check status and term → select active policy",
          "Navigate to documents → locate renewal policy for limits update",
          "Navigate to Certificates → select EOP (ACORD 28) or COI (ACORD 25) per request",
          "Update certificate: Date, Carrier, Policy#, Eff dates, Location, Loan#, Property limits",
          "Enter certificate holder (Bank), Broker signature",
          "Print/Save certificate to system",
          "Draft email in Outlook with certificate template → attach certs → send",
        ],
        extractedFields: [
          { key: "insuredName", label: "Insured Name", group: "Client" },
          { key: "policyNumber", label: "Policy Number", group: "Policy" },
          { key: "carrier", label: "Carrier", group: "Policy" },
          { key: "certType", label: "Certificate Type (EOP/COI)", group: "Certificate" },
          { key: "bankName", label: "Bank/Holder Name", group: "Holder" },
          { key: "loanNumber", label: "Loan Number", group: "Holder" },
          { key: "propertyLimits", label: "Property Limits", group: "Coverage" },
          { key: "location", label: "Location", group: "Coverage" },
        ],
        emailSubjectExamples: [
          "Renewal cert request - {insured} - {bank}",
          "ACORD 25/28 needed - {insured} renewal",
        ],
      },
    ],
  },
];

// ─── Helper functions ────────────────────────────────────────────

export function getCategoryBySlug(slug: string): ProcessCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAppBySlug(categorySlug: string, appSlug: string): SopApp | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.apps.find((a) => a.slug === appSlug);
}

// ─── Deterministic pseudo-random ─────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ─── Mock Tasks ──────────────────────────────────────────────────

const firstNames = ["Sarah", "James", "Maria", "David", "Emily", "Robert", "Lisa", "Michael", "Jennifer", "Thomas"];
const lastNames = ["Johnson", "Williams", "Brown", "Davis", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Moore"];
const companies = ["Acme Corp", "Global Industries", "Summit Holdings", "Pinnacle Group", "Atlas Enterprises", "Beacon LLC", "Crestview Inc", "Delta Partners", "Elite Services", "Frontier Co"];
const carriers = ["Liberty Mutual", "Travelers", "Hartford", "Chubb", "AmTrust", "Starwind", "NYSIF", "State Farm", "Zurich", "AIG"];

function generateTaskId(index: number): string {
  return `T-${String(index + 1).padStart(3, "0")}`;
}

const statusPool: Status[] = ["pending", "extracted", "approved", "paused", "failed", "submitted"];
const stageForStatus: Record<Status, MockTask["stage"]> = {
  pending: "intake",
  extracted: "intake",
  approved: "actions",
  paused: "intake",
  failed: "intake",
  submitted: "done",
};

export function generateMockTasks(appSlug: string, count: number = 12): MockTask[] {
  const rand = seededRandom(hashString(appSlug));
  const app = categories.flatMap((c) => c.apps).find((a) => a.slug === appSlug);

  return Array.from({ length: count }, (_, i) => {
    const status = statusPool[Math.floor(rand() * statusPool.length)];
    const firstName = firstNames[Math.floor(rand() * firstNames.length)];
    const lastName = lastNames[Math.floor(rand() * lastNames.length)];
    const company = companies[Math.floor(rand() * companies.length)];
    const carrier = carriers[Math.floor(rand() * carriers.length)];
    const policyNum = Math.floor(100000 + rand() * 900000);
    const daysBack = Math.floor(rand() * 30);
    const receivedDate = new Date(2026, 3, 7);
    receivedDate.setDate(receivedDate.getDate() - daysBack);

    // Use app-specific email subject examples if available
    const subjectTemplates = app?.emailSubjectExamples || [`${appSlug.replace(/-/g, " ")} request - ${company}`];
    const template = subjectTemplates[Math.floor(rand() * subjectTemplates.length)];
    const subject = template
      .replace("{company}", company)
      .replace("{insured}", `${firstName} ${lastName}`)
      .replace("{holder}", company)
      .replace("{carrier}", carrier)
      .replace("{policyNum}", `POL-${policyNum}`)
      .replace("{address}", "123 Main St")
      .replace("{state}", "NY")
      .replace("{month}", "April 2026")
      .replace("{amount}", `$${Math.floor(rand() * 50000)}`)
      .replace("{lender}", "Chase Bank")
      .replace("{bank}", "Wells Fargo")
      .replace("{producer}", `${firstName} Agency`)
      .replace("{borrower}", `${firstName} ${lastName}`)
      .replace("{property}", "123 Oak Lane")
      .replace("{client}", company)
      .replace("{project}", "Phase II Construction")
      .replace("{lob}", "PKG")
      .replace("{date}", "04/07/2026")
      .replace("{count}", "25")
      .replace("{servicer}", "LoanCare LLC")
      .replace("{lookupCode}", `${company.substring(0, 5).toUpperCase()}01`);

    // Generate extracted data based on app fields
    const extractedData: Record<string, string> = {};
    if (app?.extractedFields) {
      for (const field of app.extractedFields) {
        if (field.key === "insuredName" || field.key === "clientName" || field.key === "borrowerName" || field.key === "accountName") {
          extractedData[field.key] = `${firstName} ${lastName}`;
        } else if (field.key === "policyNumber") {
          extractedData[field.key] = `POL-${policyNum}`;
        } else if (field.key === "carrier" || field.key === "carrierName" || field.key === "wcCarrier") {
          extractedData[field.key] = carrier;
        } else if (field.key === "premium" || field.key === "premiumAmount" || field.key === "totalCommission" || field.key === "paymentAmount" || field.key === "minimumDue") {
          extractedData[field.key] = `$${(Math.floor(rand() * 50000) + 1000).toLocaleString()}`;
        } else if (field.key.includes("Date") || field.key.includes("date")) {
          const d = new Date(2026, Math.floor(rand() * 12), Math.floor(rand() * 28) + 1);
          extractedData[field.key] = d.toLocaleDateString("en-US");
        } else if (field.key === "certificateHolder" || field.key === "certHolder" || field.key === "bankName" || field.key === "newMortgagee") {
          extractedData[field.key] = company;
        } else if (field.key.includes("address") || field.key.includes("Address")) {
          extractedData[field.key] = `${Math.floor(rand() * 9999)} ${["Main", "Oak", "Elm", "Pine", "Cedar"][Math.floor(rand() * 5)]} St, ${["New York", "Dallas", "Chicago", "Miami", "Denver"][Math.floor(rand() * 5)]}`;
        } else if (field.key === "additionalInsured" || field.key === "pnc" || field.key === "wos" || field.key === "authFormReceived") {
          extractedData[field.key] = rand() > 0.5 ? "Yes" : "No";
        } else {
          extractedData[field.key] = `[${field.label}]`;
        }
      }
    }

    return {
      id: generateTaskId(i),
      sender: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, "")}.com`,
      subject,
      clientName: `${firstName} ${lastName}`,
      policyNumber: `POL-${policyNum}`,
      status,
      stage: stageForStatus[status],
      receivedAt: receivedDate.toISOString(),
      confidence: rand() > 0.3 ? "high" : "low",
      amsMatch: rand() > 0.2,
      extractedData,
    };
  });
}

// ─── Category stats ──────────────────────────────────────────────

export function getCategoryStats(category: ProcessCategory) {
  const totalApps = category.apps.length;
  const seed = hashString(category.slug);
  const openItems = (seed % 12) + 2;
  const pausedItems = Math.floor(openItems * 0.2);
  return { totalApps, openItems, pausedItems };
}
