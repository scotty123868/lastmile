import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Bot, User } from 'lucide-react';
import { useCompany } from '../data/CompanyContext';

/* ── Types ───────────────────────────────────────────────── */

interface TableData {
  headers: string[];
  rows: string[][];
}

interface MessageContent {
  text?: string;
  table?: TableData;
  list?: string[];
}

interface Message {
  role: 'user' | 'ai';
  content: MessageContent[];
}

interface CompanyChat {
  messages: Message[];
  suggestions: string[];
}

/* ── Company-specific conversations ──────────────────────── */

const chatData: Record<string, CompanyChat> = {
  meridian: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'Where are the biggest savings opportunities across our operating companies?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top 5 savings opportunities** identified across Meridian's four operating companies, ranked by projected annual impact:" },
          {
            table: {
              headers: ['Opportunity', 'OpCo', 'Annual Savings', 'Department', 'Automation Level'],
              rows: [
                ['Invoice reconciliation automation', 'MeridianFlow', '$420K', 'Finance', '87% automatable'],
                ['Field report digitization', 'ClearPath Services', '$340K', 'Operations', '92% automatable'],
                ['Vendor duplicate elimination', 'Meridian HQ', '$280K', 'Procurement', '78% automatable'],
                ['Equipment tracking consolidation', 'SummitWorks', '$195K', 'Asset Mgmt', '65% automatable'],
                ['Cross-OpCo compliance reporting', 'All entities', '$165K', 'Compliance', '71% automatable'],
              ],
            },
          },
          { text: 'The **total addressable savings** across these five initiatives is **$1.4M annually**. Invoice reconciliation at MeridianFlow is the highest-confidence opportunity given the volume of manual matching currently performed.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What about our data infrastructure gaps?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "I've identified **3 critical data infrastructure gaps** that are limiting AI effectiveness across Meridian's portfolio:" },
          {
            list: [
              "**No unified general ledger** \u2014 Each OpCo runs a separate GL (QuickBooks, Sage, NetSuite), making cross-entity reporting manual. This costs an estimated **18 hours per week** in reconciliation time and delays board reporting by 5\u20137 days.",
              "**Disconnected field service systems** \u2014 ClearPath and SummitWorks use different dispatch platforms with no shared data layer. Technician utilization tracking is fragmented, hiding an estimated **$220K in scheduling inefficiency**.",
              '**Manual equipment tracking** \u2014 Asset records exist in spreadsheets across 3 of 4 OpCos. No unified asset registry means duplicate purchases go undetected. Last quarter alone, **$47K in redundant equipment** was purchased across entities.',
            ],
          },
          { text: 'Addressing the GL unification first would unlock the most downstream value, enabling automated cross-OpCo reporting and vendor consolidation analysis.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What would the implementation timeline look like for the field service automation?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's a **realistic implementation timeline** for field service automation across ClearPath Services and SummitWorks. I've broken this into four phases based on dependency mapping and change management capacity:" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. Foundation', 'Weeks 1\u20134', 'Unified dispatch data model', 'Single technician database live', '$45K'],
                ['2. Core Automation', 'Weeks 5\u201310', 'Auto-dispatch + route optimization', 'First AI-routed work orders', '$120K'],
                ['3. Field Integration', 'Weeks 11\u201316', 'Mobile app + real-time tracking', 'Technicians on unified platform', '$95K'],
                ['4. Optimization', 'Weeks 17\u201320', 'Predictive scheduling + cross-OpCo load balancing', 'Full automation live', '$60K'],
              ],
            },
          },
          { text: 'The critical path runs through **Phase 1** \u2014 without a unified technician database, the dispatch AI has no shared context between ClearPath and SummitWorks. Currently, 34 technicians are certified across both OpCos but are only dispatched within their home entity, creating **an estimated 22% utilization gap** on cross-trained skills.' },
          { text: 'I recommend a **parallel workstream** approach: start Phase 1 data unification immediately while running a 2-week pilot of AI-assisted dispatch with ClearPath\'s Columbus team (their highest-volume region at 180 work orders/week). This gives you real performance data before the full rollout and builds internal champions. The total investment of **$320K** yields a projected **$340K annual savings** from field report digitization alone, with the dispatch optimization adding another **$195K** \u2014 putting you at a **7.2-month payback period**.' },
        ],
      },
    ],
    suggestions: [
      'Show cross-OpCo data gaps',
      'Compare vendor consolidation options',
      "What's our AI readiness?",
      'Generate Q1 board report',
    ],
  },
  oakwood: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'How can AI improve our claims processing?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's a breakdown of **AI-driven improvements** across Oakwood's claims workflow, with projected time and cost savings:" },
          {
            table: {
              headers: ['Workflow Stage', 'Current State', 'AI-Enhanced State', 'Time Savings', 'Annual Cost Savings'],
              rows: [
                ['Claims intake', '45 min manual entry', '8 min auto-extract', '82% reduction', '$680K'],
                ['Fraud detection', 'Rules-based, 12% catch rate', 'ML scoring, 34% catch rate', '3x detection', '$520K'],
                ['Adjuster routing', 'Manual assignment', 'Skill + load balancing', '60% faster', '$310K'],
                ['Documentation review', '25 min per claim', '6 min AI-assisted', '76% reduction', '$410K'],
              ],
            },
          },
          { text: "The **total projected savings is $1.92M annually**. Claims intake automation has the fastest payback at **6 weeks** given Oakwood's current volume of 2,400 claims per month. The fraud detection improvement alone would have caught an additional **$3.2M in fraudulent claims** last year based on historical data." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What compliance risks should I be aware of?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "I've analyzed Oakwood's compliance posture across **3 key risk areas** with current gap assessments:" },
          {
            list: [
              '**Rate cap monitoring** \u2014 Currently tracked via quarterly manual audits. 2 states updated rate caps in the last 90 days that haven\'t been reflected in your pricing engine. Gap: **14 policies priced above cap** in Florida, representing **$89K in potential regulatory exposure**.',
              "**Fraud flagging documentation** \u2014 SIU referral documentation is incomplete for 23% of flagged claims. State regulators require full audit trails. Your current system doesn't auto-generate the required narratives, creating **$340K in annual compliance risk**.",
              '**Claims documentation completeness** \u2014 NAIC Model Audit Rule requires full documentation within 30 days. Currently, **11% of claims exceed this window**, up from 8% last quarter. The primary bottleneck is adjuster note standardization.',
            ],
          },
          { text: 'I recommend prioritizing **rate cap monitoring automation** first \u2014 it has the highest regulatory risk and the simplest technical implementation. An automated feed from state insurance commission databases would eliminate the manual audit gap entirely.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How would the claims automation handle the AS/400 legacy system integration?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Great question \u2014 the AS/400 is the **single biggest integration challenge** in Oakwood's stack, but it's solvable without a full rip-and-replace. Here's the integration architecture I'd recommend:" },
          {
            list: [
              "**API wrapper layer via IBM i Access Client Solutions** \u2014 Rather than touching the AS/400's RPG programs directly, we deploy a lightweight REST API wrapper that exposes read/write endpoints for the 14 most-used policy admin screens. This approach has been proven at 3 comparable P&C carriers. The wrapper translates modern JSON payloads into the 5250 data stream the AS/400 expects, meaning **zero changes to existing RPG code**.",
              "**Event-driven sync with Guidewire ClaimCenter** \u2014 Currently, claims adjusters alt-tab between ClaimCenter and a green-screen terminal 40\u201360 times per day. The integration layer captures AS/400 policy data changes as events and pushes them to ClaimCenter in near-real-time (sub-3-second latency). This eliminates **82% of the manual data re-entry** that's causing the 45-minute intake bottleneck.",
              "**Staged migration path** \u2014 The API wrapper isn't just a band-aid \u2014 it becomes your migration scaffold. As policy admin functions move to a modern platform (Guidewire PolicyCenter or Duck Creek), the wrapper routes traffic to the new system transparently. This lets you migrate **one policy type at a time** instead of a big-bang cutover that would freeze underwriting for 6\u20138 weeks.",
            ],
          },
          { text: "The total integration cost is approximately **$180K over 12 weeks**, with the API wrapper delivering value by week 6. The key risk is AS/400 job queue capacity during peak claims periods \u2014 I'd recommend a load test in the first 2 weeks to validate that the wrapper doesn't impact batch processing windows. Three of Oakwood's competitors attempted full AS/400 replacements in the last 3 years; two went over budget by 200%+ and one rolled back entirely. The wrapper approach avoids that risk while still delivering **$680K in annual claims intake savings** from day one." },
        ],
      },
    ],
    suggestions: [
      'Analyze claims cycle time',
      'Show fraud detection ROI',
      'Compare legacy vs modern stack',
      'Generate compliance report',
    ],
  },
  pinnacle: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'Where can AI help our clinical workflows?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top clinical AI opportunities** for Pinnacle Healthcare, with projected time savings per provider:" },
          {
            table: {
              headers: ['Clinical Area', 'Current Process', 'AI Opportunity', 'Time Saved / Provider / Day', 'Annual Value'],
              rows: [
                ['Prior authorization', 'Manual form completion', 'Auto-populate from chart data', '42 min', '$380K'],
                ['Clinical notes', 'Post-visit documentation', 'Ambient AI scribe', '68 min', '$290K'],
                ['Patient scheduling', 'Manual optimization', 'Predictive no-show + backfill', '25 min', '$185K'],
                ['Billing coding', 'Manual code selection', 'AI-suggested CPT/ICD codes', '18 min', '$145K'],
              ],
            },
          },
          { text: "The **total time savings is 153 minutes per provider per day** across these four areas. Prior authorization is the highest-value target \u2014 your providers currently spend an average of **42 minutes per auth request**, and Pinnacle processes approximately **340 auth requests per week**. Ambient AI scribing has the highest provider satisfaction impact, with early adopters reporting a **4.2/5 satisfaction score** vs 2.8 without." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How does our adoption compare to industry benchmarks?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's how Pinnacle's AI adoption stacks up against **industry benchmarks** by department:" },
          {
            list: [
              "**Providers (81% adoption)** \u2014 You're **11 points above** the industry average of 70%. Strong Epic integration and your clinical champion program are driving this. Top performers are in cardiology (94%) and primary care (88%). Orthopedics lags at 62%.",
              '**Administrative staff (74% adoption)** \u2014 This is **6 points above** the industry average of 68%. Scheduling and registration teams are leading adoption. The gap is in referral coordination (51%) where staff report the current tools require too many manual steps.',
              '**Billing department (68% adoption)** \u2014 This is **at parity** with the industry average of 67%. Coding teams have embraced AI-suggested codes, but claims follow-up is still heavily manual. Payer-specific rules complexity is the primary barrier cited by billing staff.',
            ],
          },
          { text: "Overall, Pinnacle's **weighted adoption rate of 76%** places you in the **top quartile** of similar-sized healthcare systems. The biggest opportunity is closing the billing gap \u2014 moving billing from 68% to the provider-level 81% would unlock an estimated **$145K in additional annual efficiency**." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What compliance considerations should we plan for with clinical AI deployment?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Clinical AI deployment at Pinnacle requires navigating **four distinct regulatory frameworks** simultaneously. Here's the compliance landscape with specific action items for each:" },
          {
            table: {
              headers: ['Framework', 'Requirement', 'Current Gap', 'Risk Level', 'Remediation Timeline'],
              rows: [
                ['HIPAA \u00A7164.312', 'AI model access audit trails', 'No logging on inference calls', 'High', '4 weeks'],
                ['FDA 21 CFR Part 11', 'Clinical decision support validation', 'No model validation protocol', 'High', '8 weeks'],
                ['CMS Interoperability Rule', 'Patient access to AI-derived insights', 'Portal lacks AI transparency', 'Medium', '6 weeks'],
                ['State medical board', 'AI-assisted diagnosis disclosure', 'No patient consent workflow', 'Medium', '3 weeks'],
                ['Joint Commission', 'Clinical AI governance committee', 'No formal AI oversight body', 'Low', '2 weeks'],
              ],
            },
          },
          { text: "The **highest-priority gap** is HIPAA audit logging for AI inference calls. Every time the ambient scribe processes a patient encounter or the prior auth system pulls chart data, that access must be logged with the same rigor as a human EMR access event. Currently, your Epic instance logs user logins but has **no visibility into API-level AI data access** \u2014 this is the most common finding in recent OCR audits of healthcare AI deployments." },
          { text: "I recommend standing up a **Clinical AI Governance Committee** in the first 2 weeks \u2014 this is low-effort but signals regulatory seriousness and gives you a decision-making body for the harder items. The committee should include your CMIO, compliance officer, a practicing physician champion, and your IT security lead. For the FDA pathway, Pinnacle's clinical AI tools likely qualify as **Class II Clinical Decision Support** under the 2023 guidance, which means you need a quality management system but **not** full 510(k) clearance, saving approximately **$400K and 12 months** compared to the device pathway." },
        ],
      },
    ],
    suggestions: [
      'Show Epic integration status',
      'Analyze provider time savings',
      'Compare to industry benchmarks',
      'Generate clinical AI roadmap',
    ],
  },
  atlas: {
    messages: [
      {
        role: 'user',
        content: [{ text: "What's the ROI potential for predictive maintenance?" }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **predictive maintenance ROI analysis** across Atlas Manufacturing's four plants:" },
          {
            table: {
              headers: ['Plant', 'Current Downtime (hrs/mo)', 'Projected Downtime', 'Maintenance Cost Reduction', 'Parts Inventory Savings'],
              rows: [
                ['Columbus OH', '47 hrs', '18 hrs', '$340K/yr', '$95K/yr'],
                ['Louisville KY', '62 hrs', '24 hrs', '$480K/yr', '$120K/yr'],
                ['Grand Rapids MI', '35 hrs', '14 hrs', '$260K/yr', '$72K/yr'],
                ['Chattanooga TN', '51 hrs', '20 hrs', '$390K/yr', '$88K/yr'],
              ],
            },
          },
          { text: 'The **total projected savings is $1.85M annually** in maintenance costs plus **$375K in parts inventory reduction**. Louisville has the highest ROI potential due to its older equipment fleet \u2014 62% of CNC machines are past their 8-year service mark, making them prime candidates for vibration analysis and thermal monitoring. The **payback period across all four plants is 4.2 months** based on a $480K implementation cost.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How should we prioritize across our divisions?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's my **recommended prioritization** across Atlas's four divisions, based on readiness scores and expected first-phase impact:" },
          {
            list: [
              "**1. Precision Components (Readiness: 87/100)** \u2014 Highest data maturity with SAP integration already in place. IoT sensor coverage at 72%. **Recommended first phase:** Predictive maintenance + quality inspection AI. Expected 90-day impact: **$420K savings**, 31% downtime reduction.",
              "**2. Metal Fabrication (Readiness: 74/100)** \u2014 Strong floor-level data collection but fragmented across shift systems. **Recommended first phase:** Cross-shift production optimization + scrap reduction ML. Expected 90-day impact: **$310K savings**, 18% scrap reduction.",
              "**3. Assembly Operations (Readiness: 68/100)** \u2014 Good workforce data but limited equipment telemetry. **Recommended first phase:** Workforce scheduling optimization + throughput prediction. Expected 90-day impact: **$240K savings**, 12% throughput increase.",
              "**4. Procurement & Logistics (Readiness: 55/100)** \u2014 Most manual processes, vendor data scattered across systems. **Recommended first phase:** Vendor consolidation analysis + demand forecasting. Expected 90-day impact: **$185K savings**, but requires 6-week data cleanup sprint first.",
            ],
          },
          { text: 'Starting with **Precision Components** gives you a visible win within 90 days that builds internal credibility. The SAP integration there also creates reusable connectors for the other divisions. I recommend running Precision Components and Metal Fabrication in **parallel tracks** to maximize Year 1 impact.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How does the predictive maintenance system integrate with our existing Siemens IoT setup?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Atlas already has a solid IoT foundation with **Siemens MindSphere** \u2014 the integration path is more about unlocking what you have than building from scratch. Here's how the predictive maintenance layer connects to your existing Siemens infrastructure:" },
          {
            list: [
              "**MindSphere API integration via Open Edge Computing** \u2014 Your 4 plants currently push sensor data to MindSphere for monitoring, but only Columbus is using the predictive analytics modules. The other 3 plants are essentially using MindSphere as an expensive data logger. By enabling the **Predictive Learning API** across all plants, you gain access to the vibration signature models that MindSphere has been passively training on your equipment data for the past 18 months \u2014 **$340K worth of model training you've already paid for but aren't using**.",
              "**SCADA bridge for legacy equipment** \u2014 Chattanooga and Grand Rapids have 38 CNC machines running Siemens SINUMERIK 840D controllers that predate MindSphere. These machines output data via OPC-UA but aren't connected to the cloud platform. A **Siemens Industrial Edge** device at each plant (approximately $12K per plant) bridges these legacy controllers into MindSphere, adding 38 machines to the predictive maintenance pool without any PLC reprogramming.",
              "**SAP PM integration for work order automation** \u2014 The real unlock is closing the loop between MindSphere predictions and SAP Plant Maintenance. Currently, when a Columbus technician sees a MindSphere alert, they manually create a PM work order in SAP. The integration automates this: MindSphere anomaly detection triggers an SAP PM notification with pre-populated failure mode, recommended parts, and estimated repair time. This cuts the **alert-to-action time from 4.2 hours to 12 minutes**.",
            ],
          },
          { text: "The total integration cost is approximately **$185K** (edge devices, API licensing, SAP connector development), with a **3.8-month payback** based on the Louisville plant alone. I'd recommend starting with Louisville's CNC fleet because it has the highest downtime cost ($480K/yr) and the oldest equipment \u2014 meaning the predictive models will catch more failures. One important caveat: your current MindSphere contract covers 180 asset licenses but you'll need approximately **260 licenses** once all plants are connected. I'd recommend negotiating the expansion as part of a multi-year renewal \u2014 Siemens typically offers **25\u201330% volume discounts** at the 250+ tier." },
        ],
      },
    ],
    suggestions: [
      'Show IoT sensor coverage',
      'Compare plant efficiency',
      'Analyze procurement savings',
      'Generate manufacturing AI plan',
    ],
  },
  northbridge: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'Where are the biggest cross-OpCo procurement savings?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **cross-OpCo procurement consolidation analysis** across Northbridge's 12 operating companies:" },
          {
            table: {
              headers: ['Category', 'OpCos Involved', 'Current Spend', 'Duplicate Suppliers', 'Consolidation Savings'],
              rows: [
                ['Titanium alloys', 'Aerospace, Energy', '$18.4M', '3 suppliers (same product)', '$2.1M'],
                ['Industrial bearings', 'All manufacturing OpCos', '$8.2M', '7 suppliers', '$1.4M'],
                ['IT infrastructure', '12 OpCos', '$24.8M', '14 separate contracts', '$3.8M'],
                ['Professional services', '8 OpCos', '$12.6M', '22 overlapping firms', '$1.8M'],
                ['Lab consumables', 'Health Sciences, Aerospace', '$4.2M', '4 suppliers', '$680K'],
              ],
            },
          },
          { text: 'The **total addressable procurement savings is $9.8M annually**. IT infrastructure consolidation has the fastest payback because all 12 OpCos are already on overlapping Microsoft and SAP contracts that can be consolidated into enterprise agreements. The titanium alloy opportunity is particularly striking \u2014 Aerospace and Energy are buying the same Ti-6Al-4V alloy from the same supplier at a **22% price variance**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What about financial consolidation opportunities?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "I've analyzed Northbridge's **financial consolidation landscape** across all 12 operating companies:" },
          {
            list: [
              '**ERP fragmentation is the #1 blocker** \u2014 You have 8 SAP S/4HANA instances, 3 SAP ECC instances, and 1 Oracle EBS. No harmonized chart of accounts exists, which means monthly close takes **12 business days** and requires 840 manual journal entries for intercompany eliminations.',
              '**Intercompany transaction volume is massive** \u2014 Last quarter alone, there were **$428M in intercompany transactions** across 12 entities. Currently, 14% of elimination entries require manual adjustment due to classification mismatches between OpCo GL systems.',
              '**Currency translation adds complexity** \u2014 4 foreign-currency entities (Japan, UK, Germany, Canada) require month-end translation. Current process uses mid-month rates manually updated in spreadsheets, introducing an estimated **$1.2M in translation variance** per quarter.',
            ],
          },
          { text: 'Implementing **SAP Central Finance** as a consolidation layer would reduce close time to **3 business days**, automate 96% of intercompany eliminations, and eliminate the manual FX rate process entirely. Projected savings: **$3.2M annually** in finance labor plus **$4.8M in faster decision-making** from real-time consolidated visibility.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How do we roll this out across 12 operating companies without disrupting operations?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Rolling AI transformation across 12 OpCos simultaneously would be a recipe for failure. Here's the **phased rollout strategy** I recommend, designed to minimize operational disruption while maximizing cross-OpCo learning:" },
          {
            table: {
              headers: ['Wave', 'OpCos', 'Timeline', 'Focus Area', 'Projected Savings'],
              rows: [
                ['Wave 1 (Pilot)', 'Northbridge Aerospace, Financial', 'Months 1\u20134', 'Procurement + finance consolidation', '$2.8M'],
                ['Wave 2 (Scale)', 'Energy, Health Sciences, 2 manufacturing', 'Months 4\u20138', 'Full AI operating system', '$4.2M'],
                ['Wave 3 (Expand)', 'Remaining 4 manufacturing OpCos', 'Months 8\u201312', 'Predictive maintenance + supply chain', '$3.6M'],
                ['Wave 4 (Optimize)', 'All 12 OpCos cross-optimization', 'Months 12\u201316', 'Cross-OpCo AI synergies', '$5.1M'],
              ],
            },
          },
          { text: "**Wave 1 starts with Aerospace and Financial** because they have the highest data maturity (readiness scores of 82 and 79 respectively) and the most to gain from procurement consolidation \u2014 the titanium alloy price variance alone is worth $2.1M. Critically, these two OpCos also have the strongest IT teams, which means they can absorb the integration workload without pulling resources from production. Each wave builds on the previous one's connectors and playbooks." },
          { text: "The key to avoiding disruption is the **\"shadow mode\" deployment pattern**: every AI system runs in parallel with existing processes for 2\u20133 weeks before cutover. During shadow mode, the AI generates recommendations but humans continue making decisions the old way. This builds trust, catches edge cases, and gives each OpCo's team time to adapt. At Northbridge's scale, I'd also recommend a **dedicated transformation office** (3\u20134 FTEs) that travels between OpCos during each wave, carrying lessons learned and standardized playbooks. The total program investment is approximately **$4.2M over 16 months**, yielding **$15.7M in cumulative savings** by month 16 \u2014 a **3.7x return** on the transformation investment." },
        ],
      },
    ],
    suggestions: [
      'Show cross-OpCo duplicates',
      'Analyze maintenance fleet ROI',
      'Compare OpCo AI readiness',
      'Generate board transformation report',
    ],
  },
  estonia: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'How can AI improve citizen services through X-Road?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's how **AI-enhanced X-Road** can transform citizen services across Estonia's digital government:" },
          {
            table: {
              headers: ['Service Area', 'Current Process', 'AI-Enhanced Process', 'Processing Time', 'Annual Impact'],
              rows: [
                ['Tax assessment', 'Semi-automated with manual review', 'AI auto-assessment with anomaly flagging', '14 days \u2192 48 hrs', '\u20AC4.2M'],
                ['Benefits eligibility', 'Manual cross-ministry checks', 'Real-time X-Road data stitching + AI rules', '10 days \u2192 24 hrs', '\u20AC3.8M'],
                ['Healthcare records', 'Batch integration, provider-specific', 'Real-time HL7 FHIR with AI normalization', '3 weeks \u2192 2 days', '\u20AC3.4M'],
                ['Procurement compliance', 'Manual threshold checking', 'AI-driven contract analysis + threshold alerts', '5 days \u2192 4 hrs', '\u20AC2.1M'],
              ],
            },
          },
          { text: "The **total projected savings is \u20AC13.5M annually** across these four areas. Estonia's existing X-Road infrastructure gives you a massive advantage \u2014 the data exchange backbone is already in place. The key investment is adding an **AI inference layer** on top of X-Road that can process cross-ministry queries and apply ML models in real-time while maintaining Estonia's privacy-by-design principles." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What is the current state of tax compliance automation?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **tax compliance automation assessment** for the Tax & Revenue Board (EMTA):" },
          {
            list: [
              '**Pre-filled returns are 92% complete** \u2014 Estonia already leads globally in pre-filled tax returns via X-Road integration with employers, banks, and registries. The remaining 8% requires manual input for foreign income, crypto assets, and non-standard deductions.',
              '**AI auto-assessment handles 93% of standard returns** \u2014 Returns with only employment income, bank interest, and standard deductions are fully auto-assessed. The 7% requiring manual review are primarily cases with investment income, property transactions, or cross-border income.',
              "**Cross-reference accuracy is 97.8%** \u2014 X-Road data stitching catches income discrepancies between Tax Board and Social Insurance Board records. Last quarter, AI flagged **\u20AC2.4M in potential underreporting** that manual processes would have missed. However, 12% of flags were false positives due to timing differences in employer reporting.",
            ],
          },
          { text: "The primary opportunity is in **reducing false positive rates** from 12% to under 3% using improved ML models trained on historical resolution data. This would save EMTA tax officers an estimated **4,200 hours annually** in unnecessary case reviews and improve citizen experience by reducing incorrect audit notices." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How does this integrate with the existing X-Road infrastructure?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Estonia's X-Road is the **ideal backbone for AI integration** \u2014 its decentralized, API-first architecture means AI services can be deployed as new X-Road service providers without modifying existing ministry systems. Here's the integration architecture:" },
          {
            table: {
              headers: ['Layer', 'Component', 'Integration Point', 'Data Flow', 'Status'],
              rows: [
                ['Identity', 'eID / Smart-ID', 'Authentication gateway', 'Citizen \u2192 AI service auth', 'Ready (no changes needed)'],
                ['Data Exchange', 'X-Road Security Server', 'New AI subsystem registration', 'Ministry data \u2192 AI inference', '4 weeks to configure'],
                ['AI Inference', 'AI Processing Layer (new)', 'X-Road service provider', 'Queries \u2192 ML models \u2192 results', '8 weeks to deploy'],
                ['Audit', 'X-Road message log', 'Existing audit infrastructure', 'All AI decisions logged', 'Ready (automatic)'],
                ['Privacy', 'Data Tracker (Andmejalgija)', 'Citizen data usage portal', 'Citizens see AI access to their data', '3 weeks to extend'],
              ],
            },
          },
          { text: "The **critical architectural advantage** is that X-Road already solves the two hardest problems in government AI: secure data exchange and citizen consent. Every X-Road query is logged, timestamped, and attributable \u2014 meaning the AI audit trail comes for free. When the AI tax assessment service queries a citizen's employment records from the Social Insurance Board and bank data from Eesti Pank, those queries flow through the same X-Road security servers that handle 1.2 billion queries per year today. The citizen can see exactly which AI service accessed their data through the existing Andmejalgija (Data Tracker) portal." },
          { text: "The new **AI Processing Layer** registers as a standard X-Road subsystem under RIA's governance. This means it inherits X-Road's existing security model: TLS 1.3 mutual authentication, message-level signing, and the operational monitoring that RIA already manages. I recommend deploying the AI layer in the **Government Cloud (Riigipilv)** infrastructure to keep data sovereign. The total integration timeline is **10\u201312 weeks** for the first two AI services (tax assessment and benefits eligibility), with each subsequent service taking only **3\u20134 weeks** because the X-Road registration pattern is reusable. Estimated cost: **\u20AC2.8M for the platform**, with each ministry paying **\u20AC180K\u2013\u20AC340K** for their specific AI service development." },
        ],
      },
    ],
    suggestions: [
      'Show X-Road AI integration plan',
      'Analyze ministry adoption rates',
      'Compare to EU digital benchmarks',
      'Generate digital government roadmap',
    ],
  },
  'nb-aerospace': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the key opportunities for Northbridge Aerospace?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **key AI-driven opportunities** for Northbridge Aerospace, ranked by projected annual impact across certification, compliance, and maintenance operations:" },
          {
            table: {
              headers: ['Opportunity', 'Current State', 'AI-Enhanced State', 'Annual Savings', 'Confidence'],
              rows: [
                ['Flight certification automation', '14-month manual review cycle', 'AI-assisted doc generation + gap analysis', '$3.2M', 'High'],
                ['AS9100 compliance monitoring', 'Quarterly manual audits', 'Continuous AI-driven compliance scanning', '$1.8M', 'High'],
                ['Supplier quality scoring', 'Spreadsheet-based vendor reviews', 'Real-time ML quality prediction', '$2.4M', 'Medium'],
                ['Predictive maintenance for aircraft', 'Scheduled interval-based maintenance', 'Condition-based with sensor fusion AI', '$4.1M', 'High'],
                ['Parts traceability automation', 'Manual serialization tracking', 'AI-powered digital thread', '$1.2M', 'Medium'],
              ],
            },
          },
          { text: 'The **total addressable savings is $12.7M annually**. Predictive maintenance for the aircraft fleet represents the single largest opportunity given the current fleet of 340 active airframes. Flight certification automation has the fastest payback at **4.8 months** because the existing documentation backlog is creating $3.2M in delayed revenue from aircraft awaiting certification clearance.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'Can you go deeper on AS9100 compliance monitoring?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's a detailed breakdown of **AS9100 compliance automation** opportunities across Northbridge Aerospace's operations:" },
          {
            list: [
              "**Automated nonconformance detection** \u2014 AI scans production records, inspection logs, and supplier data in real-time against AS9100 Rev D requirements. Currently, nonconformances are caught an average of **18 days after occurrence**. AI monitoring reduces this to **under 4 hours**, preventing cascading quality escapes that cost an average of **$420K per incident**.",
              "**Document control automation** \u2014 AS9100 requires rigorous document version control across 2,400+ controlled documents. Your current system relies on manual review cycles that consume **320 hours per month**. AI-powered document lifecycle management can reduce this to **45 hours per month** while improving version accuracy from 94% to 99.7%.",
              "**Risk-based audit scheduling** \u2014 Instead of fixed quarterly audits, AI analyzes process performance data to dynamically schedule audits where risk is highest. This shifts from **blanket coverage to targeted assurance**, reducing total audit hours by 40% while catching **2.3x more findings** in high-risk areas.",
              "**Supplier flow-down verification** \u2014 AS9100 requires quality requirements to flow down to sub-tier suppliers. AI automatically verifies that purchase orders, contracts, and supplier quality agreements contain required flow-down clauses. Currently, **8% of POs are missing required flow-downs**, creating audit liability.",
            ],
          },
          { text: 'Addressing **nonconformance detection first** delivers the highest ROI because each quality escape that reaches a customer triggers an average **$420K in containment costs** plus potential AS9100 certification risk. Last year, 3 late-detected nonconformances resulted in **$1.26M in total remediation costs**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What does the implementation plan look like for the predictive maintenance system?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **phased implementation plan** for deploying predictive maintenance across Northbridge Aerospace's fleet of 340 airframes. The plan accounts for FAA regulatory requirements and existing MRO workflows:" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. Data Foundation', 'Weeks 1\u20136', 'Sensor data pipeline + historical maintenance ingestion', 'Unified fleet health data lake live', '$680K'],
                ['2. Model Development', 'Weeks 7\u201314', 'Failure prediction models for top 5 component families', 'First predictive alerts validated against actuals', '$1.2M'],
                ['3. MRO Integration', 'Weeks 15\u201322', 'Work order automation + parts pre-positioning', 'Predictive work orders flowing to MRO systems', '$850K'],
                ['4. Fleet-Wide Rollout', 'Weeks 23\u201330', 'All 340 airframes on predictive monitoring', 'Full fleet condition-based maintenance live', '$920K'],
              ],
            },
          },
          { text: "The **critical path runs through Phase 1** \u2014 the sensor data pipeline must ingest data from 6 different avionics bus architectures (ARINC 429, ARINC 664, MIL-STD-1553B, CAN bus, discrete sensors, and ACARS downlink). Currently, only 38% of the fleet transmits health data to ground systems in real-time; the remaining 62% relies on post-flight data downloads. Closing this gap is essential before ML models can generate reliable predictions." },
          { text: "I recommend starting Phase 2 model development with the **APU and landing gear component families** \u2014 these account for 44% of unscheduled maintenance events and have the richest historical failure data (18,000+ maintenance records over 5 years). The FAA's AC 43-218 advisory circular provides a clear pathway for predictive maintenance programs, but you'll need to submit a **revised maintenance program** to your FSDO for approval before transitioning any airframe from interval-based to condition-based maintenance. Budget **6\u20138 weeks** for FSDO review. Total program investment of **$3.65M** yields projected savings of **$4.1M annually**, achieving payback in **10.7 months**." },
        ],
      },
    ],
    suggestions: [
      'Show fleet health dashboard',
      'Analyze AS9100 audit gaps',
      'Compare supplier quality scores',
      'Generate certification timeline',
    ],
  },
  'nb-energy': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the key opportunities for Northbridge Energy?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top AI opportunities** for Northbridge Energy across grid operations, pipeline management, and renewable integration:" },
          {
            table: {
              headers: ['Opportunity', 'Current State', 'AI-Enhanced State', 'Annual Savings', 'Risk Reduction'],
              rows: [
                ['Grid optimization', 'Manual load balancing with SCADA alerts', 'AI-driven demand forecasting + auto-balancing', '$5.8M', '34% fewer outages'],
                ['SCADA modernization', 'Legacy HMI with manual alarm triage', 'ML-powered alarm prioritization + anomaly detection', '$2.4M', '52% faster response'],
                ['Pipeline integrity management', 'Calendar-based inline inspections', 'AI-predicted corrosion + risk-prioritized inspection', '$3.6M', '28% fewer incidents'],
                ['Renewable integration', 'Manual curtailment decisions', 'AI forecasting for wind/solar + battery dispatch', '$4.2M', '18% more renewable capture'],
                ['Regulatory compliance automation', 'Manual NERC/FERC reporting', 'Automated evidence collection + report generation', '$1.1M', '90% fewer late filings'],
              ],
            },
          },
          { text: 'The **total addressable savings is $17.1M annually**. Grid optimization is the highest-impact opportunity because Northbridge Energy currently operates 14 substations with manual load balancing, resulting in **an average of 847 minutes of unplanned downtime per year** \u2014 well above the industry benchmark of 520 minutes. AI-driven demand forecasting alone could reduce this by 34%, translating to **$5.8M in avoided outage costs and deferred capital expenditure**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'Tell me more about the SCADA modernization opportunity.' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's a detailed analysis of **SCADA modernization** opportunities for Northbridge Energy's control center operations:" },
          {
            list: [
              "**Alarm rationalization via ML** \u2014 Your current SCADA system generates an average of **4,200 alarms per day** across 14 substations, but operators report that 68% are nuisance alarms or redundant cascades. ML-based alarm clustering and suppression can reduce actionable alarms to **under 800 per day**, allowing operators to focus on genuine threats. Industry data shows this alone reduces operator response time by **52%**.",
              "**Predictive equipment health scoring** \u2014 By feeding transformer oil analysis data, load history, and ambient temperature into gradient-boosted models, the system can predict transformer failures **6\u20138 weeks in advance** vs. the current 2\u20133 day warning window from DGA monitors. This shifts maintenance from reactive to predictive for your **$420M transformer fleet**.",
              "**Automated switching sequence validation** \u2014 Currently, operators manually verify switching orders against one-line diagrams. AI-assisted validation can check proposed switching sequences against real-time system topology in **under 3 seconds**, eliminating the human verification step that averages **12 minutes per sequence** and has produced **4 mis-switching events** in the past 18 months.",
              "**Cybersecurity anomaly detection** \u2014 NERC CIP-005 requires monitoring of electronic security perimeters. AI behavioral analysis of SCADA network traffic can identify anomalous patterns **47x faster** than signature-based IDS systems, reducing mean detection time from **18 hours to 23 minutes** for sophisticated threats.",
            ],
          },
          { text: 'I recommend starting with **alarm rationalization** because it delivers immediate operator relief and requires no changes to field equipment \u2014 it operates entirely on existing SCADA historian data. The 4 mis-switching events from the past 18 months cost an estimated **$1.8M in equipment damage and regulatory penalties**, making switching validation the highest-risk item to address.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How would we implement the grid optimization system across all substations?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **grid optimization implementation roadmap** for deploying AI-driven load management across Northbridge Energy's 14 substations:" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. Data Integration', 'Weeks 1\u20136', 'SCADA historian + AMI + weather data pipeline', 'Unified grid data platform operational', '$420K'],
                ['2. Demand Forecasting', 'Weeks 7\u201312', 'ML demand models for all 14 substations', 'Day-ahead forecasting accuracy >94%', '$680K'],
                ['3. Auto-Balancing Pilot', 'Weeks 13\u201320', '3 substations with AI-assisted load switching', 'First autonomous load transfers executed', '$1.1M'],
                ['4. Full Grid Rollout', 'Weeks 21\u201328', 'All 14 substations on AI optimization', 'Grid-wide autonomous optimization live', '$850K'],
              ],
            },
          },
          { text: "The **critical dependency is Phase 1 data integration** \u2014 your 14 substations currently use 3 different SCADA platforms (GE iFIX at 6 sites, Schneider ClearSCADA at 5 sites, and Siemens WinCC at 3 sites). The AI optimization layer needs a unified data model across all three, which requires deploying an **OPC-UA aggregation server** at each substation to normalize telemetry into a common schema." },
          { text: "For Phase 3, I recommend piloting at the **Westfield, Riverside, and Industrial Park substations** \u2014 they represent your three highest-load facilities and are already on the GE iFIX platform, simplifying initial integration. The pilot substations alone account for **42% of total grid throughput**, so the demand forecasting models trained there will transfer well to the remaining 11 sites. NERC requires that any automated load management system maintain **N-1 contingency compliance** at all times, so the AI system must include hard constraints that prevent any optimization action that would violate reliability standards. Total program investment of **$3.05M** yields projected annual savings of **$5.8M** \u2014 a **6.3-month payback period**." },
        ],
      },
    ],
    suggestions: [
      'Show grid reliability metrics',
      'Analyze pipeline inspection ROI',
      'Compare renewable integration options',
      'Generate NERC compliance report',
    ],
  },
  'nb-financial': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the key opportunities for Northbridge Financial?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top AI opportunities** for Northbridge Financial across compliance, risk, and trading operations:" },
          {
            table: {
              headers: ['Opportunity', 'Current State', 'AI-Enhanced State', 'Annual Savings', 'Efficiency Gain'],
              rows: [
                ['AML/KYC automation', 'Manual case review, 72-hr avg turnaround', 'AI triage + auto-decisioning for low-risk', '$4.8M', '65% faster onboarding'],
                ['Regulatory reporting', 'Manual data aggregation across 8 systems', 'Automated data lineage + report generation', '$2.2M', '80% less manual effort'],
                ['Risk modeling enhancement', 'Monthly batch model runs', 'Real-time streaming risk with ML overlays', '$6.4M', '12x faster recalculation'],
                ['Trading desk efficiency', 'Manual pre-trade compliance checks', 'AI-powered real-time compliance screening', '$3.1M', '94% auto-cleared trades'],
                ['Client reporting automation', 'Manual quarterly report assembly', 'AI-generated narrative + data visualization', '$1.5M', '70% time reduction'],
              ],
            },
          },
          { text: 'The **total addressable savings is $18.0M annually**. Risk modeling enhancement has the largest single impact at **$6.4M** because the current monthly batch cycle means risk exposures are calculated on stale data for 20+ business days per month. Moving to real-time streaming risk with ML overlays would have flagged **$42M in excess concentration risk** that went undetected for 3 weeks during last quarter\'s market volatility event.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'Can you dive deeper into the AML/KYC automation opportunity?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the detailed breakdown of **AML/KYC automation** opportunities at Northbridge Financial:" },
          {
            list: [
              "**AI-powered transaction monitoring** \u2014 Your current rules-based AML system generates **12,400 alerts per month** with a false positive rate of 94%. ML models trained on 5 years of SAR filing data can reduce false positives to **under 35%** while maintaining a 99.2% detection rate for true suspicious activity. This eliminates **$3.2M in wasted analyst time** reviewing non-productive alerts.",
              "**Automated KYC document extraction** \u2014 New client onboarding currently requires manual review of an average of **28 documents per entity** (articles of incorporation, beneficial ownership declarations, sanctions screening results). NLP-powered document extraction can auto-populate 85% of KYC fields, reducing onboarding time from **72 hours to 8 hours** for standard-risk clients.",
              "**Dynamic risk scoring** \u2014 Instead of static risk tiers reviewed annually, ML models continuously update client risk scores based on transaction patterns, adverse media, and network analysis. This approach detected **14 high-risk clients** in a backtest that the static model missed entirely, representing **$28M in potential regulatory exposure**.",
              "**Automated SAR narrative generation** \u2014 When suspicious activity is confirmed, analysts spend an average of **4.2 hours drafting SAR narratives**. AI-generated draft narratives with auto-populated transaction timelines and entity relationship maps reduce this to **45 minutes per filing**, with analyst review for accuracy.",
            ],
          },
          { text: 'The **highest-priority item is transaction monitoring** \u2014 the 94% false positive rate is not only consuming analyst capacity but creating \"alert fatigue\" that increases the risk of missing genuine suspicious activity. FinCEN\'s recent enforcement actions show a clear trend toward penalizing institutions with **demonstrably inefficient AML programs**, making this both a cost savings and a regulatory risk reduction initiative.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What would the implementation plan look like for the full AML/KYC transformation?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **phased implementation plan** for transforming Northbridge Financial's AML/KYC operations with AI, designed to maintain regulatory compliance throughout the transition:" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. Data & Model Foundation', 'Months 1\u20133', 'Historical SAR data ingestion + ML model training', 'Transaction monitoring model validated at 99.2% detection', '$1.4M'],
                ['2. Shadow Mode Deployment', 'Months 3\u20135', 'AI runs parallel to existing rules engine', 'AI matches or exceeds rules engine on all test scenarios', '$680K'],
                ['3. Phased Cutover', 'Months 5\u20138', 'AI primary for low/medium risk; rules for high-risk', 'Alert volume reduced by 60% with no detection loss', '$920K'],
                ['4. Full Automation', 'Months 8\u201311', 'AI primary across all risk tiers + auto-SAR drafting', 'End-to-end AML/KYC automation live', '$1.1M'],
              ],
            },
          },
          { text: "The **shadow mode in Phase 2 is non-negotiable** from a regulatory perspective. OCC and FinCEN examiners expect documented evidence that any new AML model has been validated against the existing system before it takes over decisioning. During shadow mode, every AI decision is compared against the rules engine output, and any discrepancies are reviewed by senior analysts. This creates the **model validation documentation** that your next BSA/AML exam will require." },
          { text: "I recommend engaging your **primary regulator early** \u2014 ideally before Phase 2 begins. OCC has signaled increasing openness to ML-based AML systems, but they want to see robust model governance: documented training data, bias testing, ongoing monitoring, and human-in-the-loop for high-risk decisions. The total investment of **$4.1M over 11 months** yields projected annual savings of **$4.8M** in direct costs, with an additional **$6.4M in risk-adjusted value** from improved detection rates and reduced regulatory exposure. That puts the fully-loaded payback at **5.3 months** when you factor in regulatory risk reduction." },
        ],
      },
    ],
    suggestions: [
      'Show AML alert analytics',
      'Analyze trading desk latency',
      'Compare risk model accuracy',
      'Generate regulatory readiness report',
    ],
  },
  'nb-health': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the key opportunities for Northbridge Health Sciences?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top AI opportunities** for Northbridge Health Sciences across clinical trials, regulatory compliance, and manufacturing operations:" },
          {
            table: {
              headers: ['Opportunity', 'Current State', 'AI-Enhanced State', 'Annual Savings', 'Time Acceleration'],
              rows: [
                ['Clinical trial acceleration', '18-month avg enrollment cycle', 'AI site selection + patient matching', '$8.2M', '35% faster enrollment'],
                ['FDA compliance automation', 'Manual 21 CFR Part 11 evidence collection', 'Continuous compliance monitoring + auto-documentation', '$3.4M', '60% less audit prep'],
                ['Batch record review', '48-hr manual review per batch', 'AI-assisted deviation detection + auto-review', '$4.6M', '82% faster release'],
                ['Pharmacovigilance', 'Manual ICSR processing, 8-day avg turnaround', 'NLP-powered adverse event extraction + auto-triage', '$5.1M', '70% faster case processing'],
                ['Lab data integrity', 'Manual ALCOA+ compliance checks', 'AI-driven data integrity monitoring', '$1.8M', '95% real-time coverage'],
              ],
            },
          },
          { text: 'The **total addressable savings is $23.1M annually**. Clinical trial acceleration has the highest strategic value because every month of enrollment delay costs an estimated **$2.3M in deferred revenue** for a typical Phase III trial. Northbridge currently has 6 active Phase III trials \u2014 a 35% enrollment acceleration would compress the portfolio timeline by an average of **6.3 months**, unlocking **$86.9M in accelerated market access** across the pipeline.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'Can you elaborate on the batch record review automation?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the detailed breakdown of **batch record review automation** for Northbridge Health Sciences' manufacturing operations:" },
          {
            list: [
              "**AI-powered deviation detection** \u2014 Current batch records average **340 pages per batch** across 4 manufacturing sites. Quality reviewers manually check each page for out-of-spec results, missing signatures, and documentation gaps. AI scanning can flag deviations in **under 12 minutes** vs. the current **48-hour manual review**, catching 99.4% of true deviations while reducing false flags by 62%.",
              "**Automated right-first-time analysis** \u2014 ML models trained on 3 years of batch history can predict which process parameters are most likely to cause deviations before the batch is complete. Your current right-first-time rate is **87%** \u2014 predictive intervention during manufacturing can push this to **94%**, avoiding an estimated **$2.8M in rework and batch failures** annually.",
              "**Electronic batch record integration** \u2014 2 of your 4 manufacturing sites still use paper batch records that are scanned to PDF for review. OCR + NLP extraction can digitize these records with 99.7% accuracy, but the real opportunity is migrating to a fully electronic batch record (EBR) system that feeds AI review directly. This eliminates the **18-hour transcription delay** between batch completion and review initiation.",
              "**Review-by-exception workflow** \u2014 FDA guidance supports risk-based batch review approaches. AI can classify batch records into three tiers: auto-release (no deviations, all parameters nominal), expedited review (minor flags requiring QA confirmation), and full review (significant deviations). Based on historical data, **64% of your batches would qualify for auto-release**, freeing QA reviewers to focus on the 8% that have genuine quality concerns.",
            ],
          },
          { text: 'The **highest-impact starting point is AI-powered deviation detection** applied to your existing batch records. This requires no changes to manufacturing processes and delivers immediate value by reducing the **48-hour review bottleneck** that is currently the #1 cause of batch release delays. Last quarter, delayed batch releases resulted in **$1.4M in backorder costs** across 3 key products.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What is the implementation roadmap for the pharmacovigilance AI system?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **implementation roadmap** for deploying AI-powered pharmacovigilance across Northbridge Health Sciences' safety operations, fully compliant with FDA 21 CFR 314.80 and ICH E2B(R3) requirements:" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. NLP Model Training', 'Months 1\u20133', 'Train adverse event extraction models on 5 years of ICSRs', 'Model achieves >95% entity extraction accuracy', '$1.8M'],
                ['2. Intake Automation', 'Months 3\u20135', 'Automated ICSR intake from all sources (MedWatch, calls, literature)', 'AI auto-triages 80% of incoming cases', '$1.2M'],
                ['3. Signal Detection', 'Months 5\u20138', 'ML-powered disproportionality analysis + emerging signal detection', 'First AI-detected signal validated by safety team', '$2.1M'],
                ['4. End-to-End Automation', 'Months 8\u201311', 'Auto-generated narratives + regulatory submission prep', 'Full case processing time under 48 hours', '$1.4M'],
              ],
            },
          },
          { text: "The **critical regulatory constraint is ICH E2B(R3) compliance** \u2014 every AI-processed ICSR must produce a valid E2B(R3) XML submission to FDA's FAERS database. The NLP models in Phase 1 must be trained to extract MedDRA-coded adverse events, suspect drugs, and patient demographics with the same accuracy as human case processors. Your current team processes **2,800 ICSRs per quarter** with an 8-day average turnaround; the AI system targets **48-hour turnaround** while maintaining the same coding accuracy." },
          { text: "I recommend running Phase 2 with a **human-in-the-loop validation layer** for the first 6 months post-deployment \u2014 every AI-triaged case gets a senior safety scientist review before regulatory submission. This builds the validation dataset FDA will want to see during your next BIMO inspection and satisfies 21 CFR Part 11 requirements for electronic record reliability. The signal detection module in Phase 3 is the strategic game-changer: by analyzing adverse event patterns across your full portfolio in real-time rather than quarterly batch analysis, you can detect emerging safety signals **4\u20136 weeks earlier** than the current process. Total program investment of **$6.5M over 11 months** yields projected annual savings of **$5.1M** in direct costs plus an estimated **$12M in risk-adjusted value** from earlier signal detection and faster regulatory response. Payback period: **8.4 months** on direct savings alone." },
        ],
      },
    ],
    suggestions: [
      'Show clinical trial pipeline',
      'Analyze batch release metrics',
      'Compare pharmacovigilance KPIs',
      'Generate FDA readiness assessment',
    ],
  },
  'ee-finance': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the key opportunities for the Ministry of Finance?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top AI opportunities** for Estonia's Ministry of Finance across tax administration, fiscal transparency, and EU compliance:" },
          {
            table: {
              headers: ['Opportunity', 'Current State', 'AI-Enhanced State', 'Annual Savings', 'Citizen Impact'],
              rows: [
                ['Tax processing automation', '92% pre-filled returns, 8% manual', 'AI auto-completes 97% of returns', '\u20AC4.8M', '1.2M citizens faster refunds'],
                ['Fiscal transparency dashboards', 'Quarterly PDF-based reporting', 'Real-time AI-powered fiscal analytics', '\u20AC1.6M', 'Live public budget tracking'],
                ['Budget optimization', 'Historical trend-based allocation', 'ML-driven predictive budget modeling', '\u20AC8.2M', 'Better resource allocation'],
                ['EU compliance automation', 'Manual ESA2010 reporting', 'Automated data mapping + validation', '\u20AC2.1M', 'Zero late submissions'],
                ['Tax fraud detection', 'Rules-based VAT cross-checks', 'Graph neural network analysis', '\u20AC12.4M', 'Fairer tax burden'],
              ],
            },
          },
          { text: 'The **total addressable impact is \u20AC29.1M annually**. Tax fraud detection via graph neural networks represents the single largest opportunity \u2014 Estonia\'s current rules-based VAT cross-checking catches an estimated **68% of carousel fraud schemes**, but graph analysis of company relationships, transaction patterns, and beneficial ownership networks can push detection to **91%**. The additional \u20AC12.4M in recovered revenue would fund the entire AI transformation program **3.4x over**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'Tell me more about the tax processing automation improvements.' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the detailed analysis of **tax processing automation** enhancements for EMTA (Tax & Customs Board):" },
          {
            list: [
              "**Crypto and digital asset auto-classification** \u2014 The remaining 8% of returns requiring manual input are increasingly driven by cryptocurrency transactions, DeFi income, and NFT sales. AI models trained on blockchain transaction patterns can auto-classify **92% of crypto income events** and pre-fill the appropriate tax forms, reducing the manual input gap from 8% to under 3%. This affects an estimated **47,000 taxpayers** who reported crypto income last year.",
              "**Intelligent refund risk scoring** \u2014 Currently, refund claims over \u20AC5,000 trigger a manual review that takes an average of **14 business days**. ML-based risk scoring can auto-approve low-risk refunds (estimated 78% of volume) within **48 hours** while routing high-risk claims for detailed review. This accelerates refunds for **184,000 taxpayers annually** while maintaining fraud detection effectiveness.",
              "**Cross-border income reconciliation** \u2014 Estonia's e-Residency program and EU freedom of movement create complex cross-border income scenarios. AI-powered reconciliation between X-Road data, EU tax information exchange (DAC7), and Finnish/Latvian tax authority data can auto-resolve **85% of cross-border discrepancies** that currently require manual case officer review, saving **6,200 officer-hours annually**.",
              "**Natural language tax guidance** \u2014 Deploy an AI assistant on the EMTA portal that answers taxpayer questions in Estonian, Russian, and English with **legally accurate, citation-backed guidance**. This would deflect an estimated **340,000 annual call center inquiries** (42% of current volume), saving \u20AC1.8M in contact center costs while providing 24/7 citizen support.",
            ],
          },
          { text: 'The **highest-priority item is intelligent refund risk scoring** because it directly improves citizen experience while reducing manual workload. Estonia already leads the EU in tax automation \u2014 pushing the pre-fill rate from 92% to 97% would make Estonia the **first country globally** to achieve near-full automation of personal income tax processing.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How would we implement the budget optimization AI system?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **implementation plan** for deploying AI-driven budget optimization across Estonia's Ministry of Finance, integrated with the existing SAP-based state financial management system:" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. Data Integration', 'Months 1\u20133', 'Connect all ministry budget systems via X-Road to central data lake', 'Unified fiscal data platform with 10 years of history', '\u20AC680K'],
                ['2. Predictive Models', 'Months 3\u20136', 'ML models for revenue forecasting + expenditure prediction', 'Revenue forecast accuracy improves from 94% to 98.5%', '\u20AC920K'],
                ['3. Scenario Engine', 'Months 6\u20139', 'What-if simulation engine for budget allocation trade-offs', 'Ministers can model policy impacts in real-time', '\u20AC1.1M'],
                ['4. Automated Reporting', 'Months 9\u201312', 'Auto-generated EU fiscal reports + public transparency dashboard', 'ESA2010 and Stability Programme reports auto-generated', '\u20AC540K'],
              ],
            },
          },
          { text: "The **data integration phase leverages Estonia's unique advantage** \u2014 X-Road already connects all government systems, so the data pipeline can be built using existing secure data exchange infrastructure rather than building new integrations from scratch. The key challenge is harmonizing budget classification schemas across 11 ministries that use slightly different coding structures within the SAP system." },
          { text: "Phase 3 is the **strategic game-changer** for policymakers. Instead of relying on static spreadsheet models during budget negotiations, ministers could use the scenario engine to ask questions like 'What happens to education outcomes if we shift \u20AC50M from infrastructure to teacher salaries?' and get ML-backed projections within minutes. The model draws on **10 years of cross-ministry outcome data** to project second-order effects that traditional budgeting misses entirely. Total investment of **\u20AC3.24M over 12 months** is projected to identify **\u20AC8.2M in annual budget optimization opportunities** through better allocation \u2014 a **2.5x return** in the first year. I recommend starting the program in Q3 to align with the annual budget preparation cycle for the following fiscal year." },
        ],
      },
    ],
    suggestions: [
      'Show tax automation metrics',
      'Analyze VAT fraud patterns',
      'Compare EU fiscal benchmarks',
      'Generate budget optimization scenarios',
    ],
  },
  'ee-social': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the key opportunities for the Ministry of Social Affairs?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top AI opportunities** for Estonia's Ministry of Social Affairs across benefits administration, health records, and social services:" },
          {
            table: {
              headers: ['Opportunity', 'Current State', 'AI-Enhanced State', 'Annual Savings', 'Citizen Impact'],
              rows: [
                ['Benefits processing automation', 'Semi-automated with 5-day avg processing', 'AI auto-eligibility with real-time X-Road checks', '\u20AC3.6M', '420K beneficiaries faster payouts'],
                ['Health records via TEHIK', 'Fragmented provider records, batch sync', 'Real-time AI-normalized HL7 FHIR integration', '\u20AC4.2M', 'Unified patient view for 1.3M citizens'],
                ['Social services digitization', 'Paper-based case management in 79 municipalities', 'AI-powered case routing + outcome prediction', '\u20AC2.8M', '34% faster case resolution'],
                ['Disability assessment automation', '12-week manual assessment cycle', 'AI-assisted functional assessment + evidence review', '\u20AC1.9M', '65% faster determination'],
                ['Predictive social risk modeling', 'Reactive intervention after crisis', 'ML early warning for at-risk populations', '\u20AC5.4M', '28% fewer emergency interventions'],
              ],
            },
          },
          { text: 'The **total addressable impact is \u20AC17.9M annually**. Predictive social risk modeling has the highest societal value \u2014 by analyzing anonymized patterns across X-Road data (employment status changes, healthcare utilization, benefits claims), the system can identify individuals at risk of homelessness, long-term unemployment, or health deterioration **8\u201312 weeks before crisis points**, enabling proactive intervention that costs **\u20AC2,400 per case** vs. **\u20AC18,000 per emergency intervention**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'Can you elaborate on the TEHIK health records integration?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the detailed analysis of **TEHIK health records AI integration** for Estonia's national health information system:" },
          {
            list: [
              "**Real-time HL7 FHIR normalization** \u2014 TEHIK currently receives health data from 42 healthcare providers using a mix of HL7 v2, CDA, and proprietary formats. AI-powered FHIR transformation can normalize incoming records in **real-time** vs. the current **72-hour batch cycle**, ensuring that a patient visiting Tartu University Hospital can have their Tallinn GP records available immediately. This eliminates **an estimated 14,000 duplicate diagnostic tests annually** costing \u20AC2.8M.",
              "**AI-powered clinical decision support** \u2014 With unified patient records, AI can provide real-time alerts to clinicians: drug interaction warnings, missed screening reminders, and chronic disease management recommendations. Estonian physicians currently miss **23% of guideline-recommended screenings** due to fragmented records. AI integration projects a reduction to **under 6%**, improving population health outcomes across all 1.3 million citizens.",
              "**Automated e-Prescription optimization** \u2014 Estonia's e-Prescription system processes 8 million prescriptions annually. AI analysis of prescription patterns, patient histories, and pharmacogenomic data can flag potential adverse interactions **before dispensing**, reducing adverse drug events by an estimated **34%**. Current adverse drug event costs to the Estonian healthcare system: **\u20AC42M annually**.",
              "**Population health analytics** \u2014 Aggregated, anonymized TEHIK data fed through ML models can identify emerging disease trends, predict flu season timing and severity, and optimize vaccine distribution. During the last flu season, vaccine distribution was misallocated across 4 counties, resulting in **\u20AC680K in wasted doses** and shortages in 2 high-need areas.",
            ],
          },
          { text: 'I recommend prioritizing **HL7 FHIR normalization** first because it is the foundational enabler for all other health AI services. TEHIK already has the governance framework for health data exchange \u2014 the AI layer operates within existing consent and privacy rules established under Estonia\'s Health Services Organisation Act. The duplicate test elimination alone (\u20AC2.8M savings) would cover **the first 18 months of implementation costs**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What is the implementation plan for the benefits processing automation?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **implementation plan** for deploying AI-powered benefits processing automation across Estonia's social protection system, integrated with X-Road and the Social Insurance Board (SKA):" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. Eligibility Engine', 'Months 1\u20133', 'AI rules engine connected to X-Road data sources (EMTA, EHIS, TT\u00D6R)', 'Real-time eligibility checks for 12 benefit types', '\u20AC520K'],
                ['2. Auto-Processing Pilot', 'Months 3\u20135', 'Auto-approve low-complexity claims (family benefits, pensions)', 'Same-day processing for 65% of new claims', '\u20AC380K'],
                ['3. Complex Case AI', 'Months 5\u20138', 'ML-assisted assessment for disability, unemployment, housing benefits', 'AI recommendation accuracy >92% vs. human decisions', '\u20AC740K'],
                ['4. Proactive Benefits', 'Months 8\u201311', 'AI identifies eligible citizens not claiming benefits they qualify for', 'Proactive outreach to 28,000 under-claiming citizens', '\u20AC460K'],
              ],
            },
          },
          { text: "The **Phase 1 eligibility engine leverages X-Road's real-time data exchange** to replace batch-processed eligibility checks. Currently, when a citizen applies for unemployment benefits, SKA queries EMTA (tax records), T\u00F6\u00F6tukassa (employment history), and EHIS (health insurance status) via X-Road \u2014 but the queries run in a nightly batch, adding **3\u20135 days to processing time**. Real-time X-Road queries with AI-driven eligibility rules can return a determination in **under 4 hours** for straightforward cases." },
          { text: "Phase 4 is particularly impactful from a social equity perspective. Analysis of X-Road data shows an estimated **28,000 Estonian residents** are likely eligible for benefits they are not claiming \u2014 primarily elderly citizens eligible for supplementary pension benefits and single parents qualifying for enhanced family support. AI proactive outreach through the eesti.ee portal and Riigi Teataja notifications could recover **\u20AC14M in unclaimed annual benefits** for vulnerable populations. Total implementation investment of **\u20AC2.1M over 11 months** yields projected annual savings of **\u20AC3.6M** in administrative costs plus **\u20AC14M in social impact** through proactive benefits delivery \u2014 representing one of the highest social-return-on-investment opportunities in Estonia's digital government portfolio." },
        ],
      },
    ],
    suggestions: [
      'Show benefits processing metrics',
      'Analyze TEHIK integration status',
      'Compare social services digitization',
      'Generate disability assessment roadmap',
    ],
  },
  'ee-economic': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the key opportunities for the Ministry of Economic Affairs?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top AI opportunities** for Estonia's Ministry of Economic Affairs across e-Residency, trade facilitation, and business services:" },
          {
            table: {
              headers: ['Opportunity', 'Current State', 'AI-Enhanced State', 'Annual Savings', 'Economic Impact'],
              rows: [
                ['e-Residency scaling', '108K e-residents, manual vetting backlog', 'AI risk scoring + auto-approval for low-risk applicants', '\u20AC2.8M', '3x faster onboarding'],
                ['Trade facilitation', 'Manual customs declarations, 4-day avg clearance', 'AI-powered risk-based clearance + auto-classification', '\u20AC4.1M', '85% cleared in <4 hrs'],
                ['Business registry modernization', 'Semi-automated registration, 1-day processing', 'AI instant validation + fraud detection', '\u20AC1.6M', '15-minute company formation'],
                ['Export market intelligence', 'Manual trade analysis reports', 'AI-driven market opportunity scoring for Estonian SMEs', '\u20AC3.2M', '\u20AC180M in facilitated exports'],
                ['Regulatory sandbox automation', 'Manual application review for innovation permits', 'AI-assessed sandbox eligibility + monitoring', '\u20AC920K', '60% faster approvals'],
              ],
            },
          },
          { text: 'The **total addressable impact is \u20AC12.6M in direct savings** plus an estimated **\u20AC180M in facilitated export growth**. e-Residency scaling is the flagship opportunity \u2014 the program currently has a **4-week application backlog** with 108,000 active e-residents contributing **\u20AC84M annually** to Estonia\'s economy. AI-powered vetting could process applications in **48 hours** instead of 30 days, potentially doubling the active e-resident base to 200,000+ within 2 years and generating an additional **\u20AC76M in annual economic contribution**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'Can you go deeper on the e-Residency scaling opportunity?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the detailed analysis of **e-Residency scaling** through AI-powered processing:" },
          {
            list: [
              "**AI risk scoring for applicant vetting** \u2014 Currently, every e-Residency application undergoes manual background checks across PEP databases, sanctions lists, and law enforcement registries. AI risk scoring can auto-approve **72% of applications** (those from low-risk jurisdictions with clean backgrounds) within **48 hours**, while flagging the remaining 28% for enhanced due diligence. This reduces the average processing time from **30 days to 3 days** across all applications.",
              "**Automated document verification** \u2014 Applicants submit identity documents from **180+ countries** in dozens of formats. AI-powered document authentication can verify passport MRZ data, check for tampering artifacts, and cross-reference against INTERPOL stolen document databases in **under 90 seconds** per application, replacing a manual process that currently takes **45 minutes per application**.",
              "**Predictive churn modeling** \u2014 32% of e-residents become inactive within 18 months. ML models analyzing business activity patterns, banking connections, and service usage can identify at-risk e-residents **6 weeks before churn** and trigger personalized re-engagement campaigns. Reducing churn by 40% would retain **\u20AC8.4M in annual economic contribution**.",
              "**Smart service marketplace matching** \u2014 New e-residents often struggle to find service providers (accountants, banks, legal advisors). AI matching based on business type, jurisdiction, and service needs can connect e-residents with verified service providers within **24 hours of approval**, reducing the time-to-first-transaction from **42 days to 8 days**.",
            ],
          },
          { text: 'The **highest-priority item is AI risk scoring** because the 4-week backlog is the #1 complaint from prospective e-residents and the primary bottleneck to program growth. Estonia\'s e-Residency team currently has **12 case officers** processing an average of **1,400 applications per month**. AI auto-approval would allow the same team to handle **4,000+ applications per month** without additional headcount, supporting the government\'s target of **200,000 active e-residents by 2028**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What does the implementation plan look like for the trade facilitation AI?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **implementation plan** for deploying AI-powered trade facilitation across Estonia's customs and trade infrastructure, integrated with the EU Single Window and X-Road:" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. Data Unification', 'Months 1\u20133', 'Connect MTA customs, port systems, and EU TARIC database via X-Road', 'Unified trade data platform with 5 years of declarations', '\u20AC480K'],
                ['2. Risk-Based Clearance', 'Months 3\u20136', 'ML models for shipment risk scoring + auto-clearance rules', '85% of low-risk shipments cleared in <4 hours', '\u20AC720K'],
                ['3. Smart Classification', 'Months 6\u20139', 'AI-powered HS code classification + valuation verification', 'Auto-classification accuracy >96% across 8,000 HS codes', '\u20AC540K'],
                ['4. EU Integration', 'Months 9\u201312', 'Connect to EU Import Control System 2 (ICS2) + AI pre-arrival processing', 'Full EU Single Window AI integration live', '\u20AC680K'],
              ],
            },
          },
          { text: "The **Phase 2 risk-based clearance model** is the core value driver. Estonia processes approximately **1.2 million customs declarations annually**, and the current rules-based system subjects 35% to manual inspection. ML analysis of historical declaration data, trader compliance history, and commodity risk profiles can identify the **85% of shipments that are genuinely low-risk** and clear them automatically, while concentrating inspection resources on the **15% with the highest risk scores**. This approach aligns with the EU's Authorised Economic Operator (AEO) framework and the World Customs Organization's SAFE Framework." },
          { text: "Phase 4 integration with the **EU Import Control System 2 (ICS2)** is strategically critical \u2014 the EU is mandating pre-arrival safety and security data for all shipments entering the EU by 2025. Estonia's AI system can be an **early mover advantage**, processing pre-arrival data faster than other member states and making Estonian ports more attractive for trade routing. The total investment of **\u20AC2.42M over 12 months** yields projected annual savings of **\u20AC4.1M** in customs processing costs, with an additional estimated **\u20AC28M in economic value** from faster trade throughput making Estonia a more competitive trade gateway. I recommend aligning Phase 1 with the MTA's existing IT modernization roadmap to share infrastructure costs." },
        ],
      },
    ],
    suggestions: [
      'Show e-Residency growth metrics',
      'Analyze trade facilitation KPIs',
      'Compare business registry benchmarks',
      'Generate export intelligence report',
    ],
  },
  'ee-ria': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the key opportunities for RIA?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top AI opportunities** for RIA (Information System Authority) across X-Road, cybersecurity, and national IT infrastructure:" },
          {
            table: {
              headers: ['Opportunity', 'Current State', 'AI-Enhanced State', 'Annual Savings', 'Security Impact'],
              rows: [
                ['X-Road AI layer', '1.2B queries/yr, rules-based routing', 'AI-optimized routing + predictive scaling', '\u20AC3.8M', '99.99% uptime target'],
                ['Cybersecurity automation', 'SOC with manual threat triage', 'AI-powered threat detection + auto-response', '\u20AC5.2M', '85% faster incident response'],
                ['National IT infrastructure optimization', 'Static resource allocation across Riigipilv', 'AI-driven dynamic workload management', '\u20AC4.1M', '40% better resource utilization'],
                ['Digital identity fraud detection', 'Rules-based eID anomaly checks', 'Behavioral biometric AI + device fingerprinting', '\u20AC2.4M', '94% fraud detection rate'],
                ['Government cloud cost optimization', 'Manual capacity planning', 'ML-predicted demand + auto-scaling', '\u20AC1.8M', '35% infrastructure cost reduction'],
              ],
            },
          },
          { text: 'The **total addressable impact is \u20AC17.3M annually**. Cybersecurity automation is the highest-priority opportunity because Estonia faces an estimated **4,200 significant cyber incidents per month** targeting government infrastructure. The current SOC team of 28 analysts manually triages alerts with a **mean time to detect (MTTD) of 4.2 hours**. AI-powered threat detection can reduce MTTD to **under 12 minutes** while handling the alert volume that would otherwise require doubling the SOC team at a cost of **\u20AC3.4M in additional headcount**.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'Tell me more about the X-Road AI layer opportunity.' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the detailed analysis of the **X-Road AI layer** enhancement for Estonia's core digital infrastructure:" },
          {
            list: [
              "**AI-optimized query routing** \u2014 X-Road currently processes **1.2 billion queries per year** across 900+ services using static routing rules. AI analysis of query patterns, service response times, and dependency chains can dynamically route queries to the fastest available service instance, reducing average response time from **340ms to under 120ms**. During peak periods (tax filing season, election registration), AI routing can prevent the **service degradation events** that affected 3 major services last year.",
              "**Predictive auto-scaling** \u2014 X-Road security servers are provisioned with static capacity that is sized for peak load, resulting in **62% average over-provisioning**. ML models trained on 3 years of traffic patterns can predict demand surges **4\u20136 hours in advance** and auto-scale security server capacity, reducing infrastructure costs by **\u20AC1.4M annually** while improving reliability during genuine demand spikes.",
              "**Service health prediction** \u2014 X-Road connects 900+ government services, and a failure in one service can cascade to dependent services. AI dependency mapping and health prediction can identify services **likely to fail within the next 4 hours** based on error rate trends, response time degradation, and resource utilization patterns. This enables preemptive failover before citizens experience any service disruption.",
              "**Data quality monitoring** \u2014 AI can continuously validate the quality and consistency of data flowing through X-Road, flagging anomalies like sudden changes in record formats, unexpected null values, or statistical outliers that may indicate data corruption or unauthorized modifications. Currently, data quality issues are only detected when a consuming service fails, resulting in an average **14-hour detection delay**.",
            ],
          },
          { text: 'The **highest-priority item is predictive auto-scaling** because it delivers immediate cost savings while improving reliability. X-Road is the backbone of Estonia\'s digital society \u2014 every eID authentication, every tax filing, every healthcare record access flows through this infrastructure. The **62% over-provisioning** represents \u20AC1.4M in wasted compute that AI can reclaim while actually improving uptime from 99.95% to the **99.99% target** set in the national digital strategy.' },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What is the implementation roadmap for the cybersecurity automation platform?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **implementation roadmap** for deploying AI-powered cybersecurity automation across RIA's national cyber defense operations, aligned with the EU NIS2 Directive requirements:" },
          {
            table: {
              headers: ['Phase', 'Timeline', 'Scope', 'Key Milestone', 'Investment'],
              rows: [
                ['1. Threat Intelligence Integration', 'Months 1\u20133', 'Aggregate feeds from NATO CCDCOE, EU-CERT, and national sensors', 'Unified threat intelligence platform with AI correlation', '\u20AC1.2M'],
                ['2. AI Detection Engine', 'Months 3\u20136', 'ML models for network anomaly detection + endpoint behavioral analysis', 'MTTD reduced from 4.2 hours to <15 minutes', '\u20AC1.8M'],
                ['3. Automated Response', 'Months 6\u20139', 'SOAR playbooks with AI-driven containment actions', 'Auto-containment of 70% of common attack patterns', '\u20AC1.4M'],
                ['4. Predictive Defense', 'Months 9\u201312', 'AI threat prediction + proactive vulnerability management', 'Predict and pre-patch 60% of exploited vulnerabilities', '\u20AC980K'],
              ],
            },
          },
          { text: "The **Phase 1 threat intelligence integration is the critical foundation** \u2014 Estonia's unique position hosting the **NATO Cooperative Cyber Defence Centre of Excellence (CCDCOE)** gives RIA access to threat intelligence that most national CERTs don't have. The AI correlation engine will fuse NATO threat feeds, EU-CERT alerts, RIA's own sensor network, and private sector threat sharing from Estonia's 400+ critical infrastructure operators into a single knowledge graph that identifies **coordinated attack campaigns** across multiple vectors." },
          { text: "Phase 3 automated response requires careful calibration given the sensitivity of government systems. I recommend a **tiered automation model**: Tier 1 threats (known malware, brute force, credential stuffing) receive **fully automated containment** within 30 seconds. Tier 2 threats (novel attack patterns, lateral movement indicators) receive **AI-recommended actions** with SOC analyst confirmation. Tier 3 threats (nation-state APT indicators, zero-day exploitation) trigger **immediate escalation** to the senior incident response team with AI-generated context packages. This tiered approach ensures that the **4,200 monthly incidents** are handled proportionally \u2014 the 85% that are Tier 1 are automated away, freeing the SOC team to focus on the sophisticated threats that require human judgment. Total investment of **\u20AC5.38M over 12 months** yields projected annual savings of **\u20AC5.2M** in SOC operational costs plus an estimated **\u20AC18M in avoided breach impact** based on Estonia's historical incident cost data. Given the current geopolitical threat landscape, I recommend accelerating Phase 1 to begin immediately, running in parallel with Phase 2 procurement." },
        ],
      },
    ],
    suggestions: [
      'Show X-Road performance metrics',
      'Analyze cyber threat landscape',
      'Compare Riigipilv utilization',
      'Generate NIS2 compliance assessment',
    ],
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

/** Parse **bold** markdown into spans */
function renderTextWithBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-semibold">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ── Components ──────────────────────────────────────────── */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-blue flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
      </div>
      <div className="ml-2 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-ink-tertiary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatTable({ table }: { table: TableData }) {
  return (
    <div className="my-2 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="bg-surface-sunken">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold text-ink-secondary whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-t border-border-subtle"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-3 py-2 whitespace-nowrap ${
                    ci === 0 ? 'font-medium text-ink' : 'text-ink-secondary'
                  } ${/^\$[\d,.]+[KMB]?\/?\w*$/.test(cell) || /^\d+/.test(cell) ? 'tabular-nums' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isUser
            ? 'bg-blue text-white rounded-2xl rounded-br-md px-4 py-2.5'
            : 'bg-surface-raised border border-border rounded-2xl rounded-bl-md px-4 py-3'
        }`}
      >
        {message.content.map((block, bi) => {
          if (block.table) {
            return <ChatTable key={bi} table={block.table} />;
          }
          if (block.list) {
            return (
              <ol key={bi} className="my-2 space-y-2.5">
                {block.list.map((item, li) => (
                  <li key={li} className="text-[13px] leading-relaxed text-ink-secondary flex gap-2">
                    <span className="text-ink-tertiary font-medium flex-shrink-0">{li + 1}.</span>
                    <span>{renderTextWithBold(item)}</span>
                  </li>
                ))}
              </ol>
            );
          }
          if (block.text) {
            return (
              <p
                key={bi}
                className={`text-[13px] leading-relaxed ${
                  isUser ? 'text-white' : 'text-ink-secondary'
                } ${bi > 0 ? 'mt-2' : ''}`}
              >
                {renderTextWithBold(block.text)}
              </p>
            );
          }
          return null;
        })}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-surface-sunken border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5 text-ink-tertiary" strokeWidth={2} />
        </div>
      )}
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export default function Assistant() {
  const { company } = useCompany();
  const chat = chatData[company.id] || chatData.meridian;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [company.id]);

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] max-w-[960px] mx-auto">
      {/* Page header */}
      <div className="px-4 lg:px-8 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-muted flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-blue" strokeWidth={1.7} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-ink tracking-tight leading-none">Intelligence</h1>
            <p className="text-[13px] text-ink-tertiary mt-0.5">
              Conversational insights for {company.shortName}
            </p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 lg:px-8 py-4 space-y-4"
      >
        {chat.messages.map((msg, i) => (
          <MessageBubble key={`${company.id}-${i}`} message={msg} index={i} />
        ))}

        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: chat.messages.length * 0.08 + 0.3 }}
        >
          <TypingIndicator />
        </motion.div>
      </div>

      {/* Suggested questions */}
      <div className="px-4 lg:px-8 pb-3 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {chat.suggestions.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="px-3 py-1.5 text-[12px] font-medium text-blue bg-blue-muted rounded-full
                         hover:bg-blue hover:text-white transition-colors duration-150 cursor-pointer
                         border border-transparent hover:border-blue"
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="px-4 lg:px-8 pb-4 lg:pb-6 flex-shrink-0">
        <div className="flex items-center gap-2 bg-surface-raised border border-border rounded-xl px-4 py-2.5 shadow-sm">
          <input
            type="text"
            placeholder="Ask about your data..."
            className="flex-1 bg-transparent text-[13px] text-ink placeholder:text-ink-tertiary
                       outline-none border-none"
            readOnly
          />
          <button
            className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center flex-shrink-0
                       hover:bg-blue/90 transition-colors duration-150 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[11px] text-ink-tertiary text-center mt-2">
          AI responses are generated for demo purposes and may not reflect actual data.
        </p>
      </div>
    </div>
  );
}
