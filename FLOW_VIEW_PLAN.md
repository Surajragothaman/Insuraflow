# Flow View — Plan (Wiki-Informed)

## Problem with Current Flow View

The current flow just groups categories into 4 swim lanes linearly. But the wiki reveals **real dependencies, timing constraints, and branching paths** between processes.

## Wiki-Discovered Dependencies

### Hard Dependencies (process B cannot start until process A completes)

```
Prospecting ──→ Quoting
  "Prospect must exist in AMS before quoting"

Quoting ──→ Application
  "Quote accepted → create ACORD application"

Application ──→ Binding
  "Application submitted → binder issued"

Binding ──→ Policy Setup
  "Binder issued → set up policy in AMS"

Policy Setup ──→ Policy Issue
  "Policy created → verify and issue"
  (wiki: "Post-setup verification. Policy must show as Issued.")

Policy Issue ──→ CSR24 Template Setup
  "Policy must be Issued in EPIC before CSR24 template setup"
  (wiki: "Confirm Policy Status — Policy must show as Issued")

CSR24 Template Setup ──→ COI/EOI Issuance
  "Template is a prerequisite for certificate generation"
  (wiki: "prerequisite step that must happen before certificates can be issued")

Policy Checking ──→ Endorsements
  "Discrepancies found → Endorse/Revise action"
  (wiki: "If discrepancies: right-click → Endorse/Revise")

COI with Endorsements ──→ waits for Endorsement confirmation
  (wiki: "COI with endorsements: After endorsement confirmation")

Cancellation ──→ Reinstatement
  "Reinstatement closes the XNP follow-up task"
  (wiki: "The reverse of cancellation-xnp-sop")
```

### Timed Dependencies (process starts X days before expiration)

```
Loss Runs ──→ (monthly, 5 years of history for renewal prep)

Renewal Marketing ──→ starts 150-175 days before expiration
  (wiki: "150–175 days from current date")

Renewal Summaries ──→ starts 120 days before expiration
  (wiki: "Initiated 120 days prior to policy expiration")

Renewal Processing ──→ after marketing and summaries complete

Renewal Proposal ──→ after renewal processing (uses marketed submission)

Renewal Certificates ──→ after policy renewed (needs new policy data)
```

### Parallel / On-Demand (no strict dependency — triggered by requests)

```
Certificates (COI/EOI) ── on-demand, requires active policy
Carrier Downloads ── daily/periodic, independent
Invoicing ── triggered by new business, renewal, or endorsement
Payment & Commission ── follows invoicing
```

## Revised Flow Architecture

### Phase 1: New Business Pipeline (sequential, left to right)

```
Prospecting → Quoting → Application → Binding → Policy Setup → Policy Issue
                                                                    │
                                                         CSR24 Template Setup
```

**Key insight:** This is a strict pipeline. Each step gates the next. A prospect can't be quoted until they exist in AMS. A policy can't be issued until it's set up.

### Phase 2: Active Policy Servicing (parallel, on-demand)

These run in parallel once the policy is active. No strict order between them, but they have prerequisites:

```
                    ┌─── Policy Checking ──→ Endorsements (if discrepancies)
                    │
Policy Active ──────┼─── Certificates (COI/EOI) ←── requires Endorsement confirmation (if AI requested)
                    │
                    ├─── Carrier Downloads (periodic)
                    │
                    ├─── Invoicing ──→ Payment & Commission
                    │
                    └─── Mortgagee Updates (on request)
```

**Key insight:** These are event-driven, not sequential. Show as a hub-and-spoke from "Active Policy" rather than a pipeline.

### Phase 3: Renewal Countdown (timed sequence)

```
175 days ──→ Loss Runs (5-year history for renewal prep)
             │
150 days ──→ Renewal Marketing (create marketed submissions)
             │
120 days ──→ Renewal Summaries (pull documents, initiate renewal)
             │
  0 days ──→ Renewal Processing (execute renew in AMS)
             │
             ├──→ Renewal Proposal (generate from marketed submission)
             │
             └──→ Renewal Certificates (ACORD 25/28 for renewed policy)
                    │
                    └──→ Back to "Active Policy" (lifecycle repeats)
```

**Key insight:** This is a countdown. Show it with a timeline/days indicator.

### Phase 4: Exception Branch (off the main flow)

```
Active Policy ──→ Cancellation Notice (XNP/PNOC)
                      │
                      ├──→ Payment Made ──→ Reinstatement ──→ back to Active Policy
                      │
                      └──→ No Payment ──→ Policy Cancelled (end of lifecycle)
```

**Key insight:** This branches off servicing. Reinstatement loops back.

## Visual Design

### Layout: Vertical with horizontal phases

```
┌─────────────────────────────────────────────────────────┐
│ PHASE 1: NEW BUSINESS PIPELINE                          │
│ [Prospect] → [Quote] → [App] → [Bind] → [Setup] → [Issue] │
│                                                    ↓    │
│                                           [CSR24 Setup] │
└─────────────────────────────────────────────────────────┘
                           ↓ policy active
┌─────────────────────────────────────────────────────────┐
│ PHASE 2: ACTIVE POLICY SERVICING (parallel hub)         │
│                                                         │
│      [Policy Checking] → [Endorsements]                 │
│      [Certificates] ←── endorsement confirmation        │
│      [Carrier Downloads]                                │
│      [Invoicing] → [Payment]                            │
│      [Mortgagee Updates]                                │
│                                                         │
│  ┌── EXCEPTION ──────────────────────┐                  │
│  │ [Cancellation] ↔ [Reinstatement]  │                  │
│  └───────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
                           ↓ approaching expiration
┌─────────────────────────────────────────────────────────┐
│ PHASE 3: RENEWAL COUNTDOWN                              │
│                                                         │
│ 175d [Loss Runs]                                        │
│  ↓                                                      │
│ 150d [Renewal Marketing]                                │
│  ↓                                                      │
│ 120d [Renewal Summaries]                                │
│  ↓                                                      │
│  0d  [Renewal Processing] → [Proposal] → [Renewal Certs] │
│                                              ↓          │
│                                    ↻ back to Phase 2    │
└─────────────────────────────────────────────────────────┘
```

### Interactive Elements

- **Click any node** → right panel shows pipeline (Intake/Actions/Output counts), issues, workflows, process steps
- **Hover on arrows** → tooltip showing the dependency reason from wiki (e.g., "Policy must be Issued before CSR24 template setup")
- **Renewal countdown** → show a timeline with day markers (175d, 150d, 120d, 0d)
- **Exception branch** → visually distinct (red/dashed border), shows cancellation → reinstatement loop
- **Dependency arrows** → solid = hard dependency, dashed = soft/conditional

### Data Model Addition

New field in mock-data.ts per category:

```ts
interface FlowConnection {
  from: string;       // category slug
  to: string;         // category slug  
  type: "hard" | "timed" | "conditional" | "loops-back";
  label: string;      // e.g., "policy active", "150 days before expiry"
  wikiSource: string; // which wiki page documents this
}
```

## Questions

1. Should the vertical layout scroll or fit in viewport?
2. Should Phase 2 (servicing) use a radial/hub layout or stay as a list?
3. Should the renewal countdown show actual dates (from mock data) or just the day offsets?
