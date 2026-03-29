import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Bot, User, AlertCircle } from 'lucide-react';
import { useCompany } from '../data/CompanyContext.tsx';
import PreliminaryBanner from '../components/PreliminaryBanner.tsx';
import { useAtlasChat } from '../hooks/useAtlasChat.ts';

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

interface StaticMessage {
  role: 'user' | 'ai';
  content: MessageContent[];
}

interface CompanyChat {
  messages: StaticMessage[];
  suggestions: string[];
}

/* ── Company-specific conversations ──────────────────────── */

const chatData: Record<string, CompanyChat> = {
  meridian: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'Where are the biggest savings opportunities across our divisions?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here are the **top 5 savings opportunities** identified across IndustrialsCo's seven divisions, ranked by projected annual impact:" },
          {
            table: {
              headers: ['Opportunity', 'Division', 'Annual Savings', 'Department', 'Automation Level'],
              rows: [
                ['Track defect detection automation (RailSentry + LIDAR)', 'HSI / HCC', '$1.38M', 'Rail Testing', '91% automatable'],
                ['Crew dispatch & scheduling optimization', 'HRSI', '$1.12M', 'Operations', '86% automatable'],
                ['GPS ballast train fleet utilization', 'HCC', '$940K', 'Construction', '78% automatable'],
                ['FRA safety compliance reporting', 'All divisions', '$780K', 'Compliance', '82% automatable'],
                ['Equipment maintenance cycle prediction (TAM-4 / SpeedTrax)', 'HTI / HCC', '$620K', 'Maintenance', '74% automatable'],
              ],
            },
          },
          { text: 'The **total addressable savings** across these five initiatives is **$4.84M annually**. Track defect detection at HSI is the highest-confidence opportunity \u2014 RailSentry already captures the raw data, but manual analysis creates a 6.8-hour bottleneck per corridor segment. AI classification would reduce this to under 25 minutes.' },
        ],
      },
    ],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
    ],
  },
  oakwood: {
    messages: [
      {
        role: 'user',
        content: [{ text: "What's the biggest opportunity across IndustrialsCo's divisions?" }],
      },
      {
        role: 'ai',
        content: [
          { text: "The **single biggest opportunity** is cross-division visibility. Right now, each of IndustrialsCo's seven divisions operates its own data systems independently:" },
          {
            list: [
              "**$2.8M in license waste** \u2014 Duplicate SAP, Trimble, and Workday licenses across HCC, HRSI, HSI, HTI, HTSI, and corporate. At least 320 licenses are inactive or redundant across division boundaries.",
              "**Crew and equipment sharing between HCC and HTI** \u2014 Construction crews and signal/PTC technicians often work adjacent corridors for the same Class I railroads but are dispatched independently. Cross-division crew optimization could save **$1.12M annually** and reduce mobilization time by 40%.",
              "**Track inspection intelligence consolidation** \u2014 HSI's RailSentry data, HCC's field condition reports, and HTI's signal system diagnostics each capture different aspects of track health. Unifying these into a single track intelligence platform would give Class I customers a **360-degree corridor view** no competitor can match.",
            ],
          },
          { text: "The cross-division visibility play isn't just about cost savings \u2014 it's a **competitive differentiator**. No other rail services company can offer integrated track inspection, construction, and signaling data from a single provider. That's the pitch to Class I procurement teams." },
        ],
      },
    ],
    suggestions: [
      'Show cross-division savings detail',
      'Compare division AI readiness',
      'Generate fleet utilization report',
      'Analyze crew sharing opportunities',
    ],
  },
  pinnacle: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'How does the MCP connector work with our Primavera P6?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "The MCP connector integrates with Primavera P6 through a **read-only API layer** that extracts project data without any risk to your production scheduling system:" },
          {
            list: [
              "**REST API integration via P6 EPPM Web Services** \u2014 The connector authenticates through P6's standard SOAP/REST endpoints using a read-only service account. It pulls project schedules, resource assignments, activity progress, and earned value data on a configurable sync schedule (default: every 4 hours). No write access is granted \u2014 this is a **one-way data extraction** that cannot modify schedules or assignments.",
              "**Data extraction scope** \u2014 The connector pulls WBS structures, activity durations, resource loading, cost baselines, and progress updates across all active projects. For HCC alone, that's approximately **2,400 activities across 18 active construction projects**. The data feeds into the AI's context window for crew optimization, equipment utilization analysis, and project timeline predictions.",
              "**Compliance and security** \u2014 All P6 data remains within IndustrialsCo's network perimeter. The connector runs on-premise and communicates with the AI platform via encrypted API calls. Audit logs track every data pull with timestamps, record counts, and the service account used. Your P6 admin retains full control over which projects and fields are exposed to the connector.",
            ],
          },
          { text: "The connector was designed for **zero disruption** to existing P6 workflows. Project managers continue using P6 exactly as they do today. The AI simply reads the data they're already entering and uses it to surface insights like crew conflicts, equipment idle time, and schedule risk predictions that would otherwise require hours of manual cross-referencing." },
        ],
      },
    ],
    suggestions: [
      'Show P6 data extraction details',
      'Explain read-only security model',
      'Compare integration options',
      'Generate P6 connector setup guide',
    ],
  },
  atlas: {
    messages: [
      {
        role: 'user',
        content: [{ text: "What's the AI reliability score for track inspections?" }],
      },
      {
        role: 'ai',
        content: [
          { text: "The current **AI reliability score for track inspection classification is 94.2%**, based on validation against HSI's manual review of RailSentry LIDAR data over the past 6 months. Here's how that breaks down:" },
          {
            table: {
              headers: ['Metric', 'Value', 'Industry Benchmark', 'Status'],
              rows: [
                ['Overall trust score', '94.2%', '90%+ for production use', 'Above threshold'],
                ['FRA geometry exception classification', '96.8%', '95%+ required', 'Passing'],
                ['False positive rate (flagging good track as defective)', '3.1%', '<5% target', 'Within range'],
                ['False negative rate (missing real defects)', '0.4%', '<1% critical threshold', 'Passing'],
                ['PTC signal correlation accuracy', '91.8%', 'No benchmark yet', 'Under validation'],
              ],
            },
          },
          { text: "The most significant validation event was the **PTC false positive catch** on the Northeast Corridor last month. The AI flagged a PTC signal anomaly that appeared to indicate a track circuit failure. Manual review by HSI engineers confirmed the signal was actually caused by a **rail impedance bond replacement** that hadn't been updated in the PTC database \u2014 not a genuine failure. Without the human-in-loop review, this would have triggered an unnecessary slow order affecting 14 trains." },
          { text: "Every AI classification goes through a **three-tier validation pyramid**: Tier 1 (automated cross-check against FRA 49 CFR \u00A7213 thresholds), Tier 2 (statistical anomaly detection comparing against corridor baselines), and Tier 3 (human review for any classification the AI flags as below 90% confidence). Currently, **78% of classifications clear Tier 1 automatically**, 18% require Tier 2 validation, and only 4% escalate to human review \u2014 but that 4% is where the highest-value corrections happen." },
        ],
      },
    ],
    suggestions: [
      'Show reliability testing pyramid detail',
      'Explain human-in-loop workflow',
      'Compare inspection accuracy by corridor',
      'Generate FRA compliance evidence report',
    ],
  },
  northbridge: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'Which division has the highest AI adoption?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **AI readiness ranking** across IndustrialsCo's seven divisions:" },
          {
            table: {
              headers: ['Division', 'Readiness Score', 'Key Strength', 'Primary Gap', 'Recommended First Use Case'],
              rows: [
                ['HSI (Inspections)', '42/100', 'Richest ultrasonic + LIDAR data', 'Manual analysis bottleneck', 'AI defect classification'],
                ['HRSI (Rail Services)', '38/100', 'Large crew data history', 'Legacy dispatch system', 'Crew optimization'],
                ['HTI (Signal & PTC)', '36/100', 'Signal system diagnostics', 'Fragmented data formats', 'Signal anomaly detection'],
                ['HTSI (Transit)', '35/100', 'PTC compliance data', 'Paper-based field reports', 'Digital work orders'],
                ['HCC (Construction)', '32/100', 'Primavera P6 project data', 'Field work complexity', 'Equipment utilization'],
                ['Corporate', '44/100', 'Centralized finance/HR', 'Division data silos', 'License optimization'],
              ],
            },
          },
          { text: "**HSI leads at 42** primarily because ultrasonic inspection and RailSentry LIDAR data are inherently structured and high-volume \u2014 exactly what AI models need. Their data is machine-generated, timestamped, and geolocated, making it the most AI-ready dataset in the company. **HCC trails at 32** because construction operations are inherently field-based, with crew reports often captured on paper or in disconnected mobile apps. The gap isn't about willingness \u2014 HCC's teams are eager \u2014 it's about **data capture infrastructure** in the field." },
          { text: "The biggest unlock is getting HSI and HCC data to talk to each other. HSI inspects the track, HCC builds and maintains it. Right now, when HSI flags a defect, it goes through **3 manual handoffs** before HCC receives a work order. AI-powered defect-to-work-order automation would cut this from **6.8 hours to under 25 minutes**." },
        ],
      },
    ],
    suggestions: [
      'Show division readiness details',
      'Compare data maturity by division',
      'Analyze adoption barriers',
      'Generate division AI roadmap',
    ],
  },
  estonia: {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What happens if the AI gets something wrong?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "This is one of the most important questions for any AI deployment in safety-critical rail operations. IndustrialsCo's system is designed with a **reliability testing pyramid** that catches errors before they reach production decisions:" },
          {
            table: {
              headers: ['Layer', 'What It Catches', 'Response Time', 'Example'],
              rows: [
                ['Tier 1: Automated cross-check', 'Violations of known FRA thresholds', 'Instant', 'Cross-level exceeding 49 CFR limit'],
                ['Tier 2: Statistical validation', 'Anomalies vs. corridor baselines', '< 5 min', 'Gauge reading 2 sigma outside norm'],
                ['Tier 3: Human-in-loop review', 'Low-confidence classifications', '< 2 hours', 'PTC signal anomaly with 78% confidence'],
                ['Tier 4: Post-deployment audit', 'Systematic drift or bias', 'Weekly', 'Model accuracy trending below 92%'],
              ],
            },
          },
          { text: "A real example: last quarter, the cost estimation model for an HCC ballast project predicted **$2.1M for a 12-mile corridor rehabilitation**. The Tier 2 statistical validation flagged this as **18% below the corridor baseline** for similar scope work. Human review revealed the model had failed to account for a **bridge approach transition zone** that requires specialized equipment and FRA-mandated slow orders during work. The corrected estimate was **$2.48M** \u2014 and HCC's project manager confirmed this matched their independent estimate within 2%." },
          { text: "The key principle is **\"AI recommends, humans decide\"** for any safety-critical or high-dollar output. The system is designed so that the cost of catching an error through the validation pyramid is always lower than the cost of the error reaching production. For track geometry classification, the false negative rate (missing a real defect) is **0.4%** \u2014 well below the 1% critical threshold \u2014 because the system is deliberately tuned to over-flag rather than under-flag. It's better to send an engineer to check a good piece of track than to miss a defective one." },
        ],
      },
    ],
    suggestions: [
      'Show reliability testing pyramid detail',
      'Explain human-in-loop queue process',
      'Show cost estimation correction examples',
      'Generate trust score trend report',
    ],
  },
  'nb-aerospace': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'How is CertAgent handling dual-use parts certification this quarter?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "**CertAgent** has processed **1,847 dual-use part certifications** this quarter, up 23% from Q3. Here's the breakdown by certification pathway:" },
          {
            table: {
              headers: ['Certification Type', 'Parts Processed', 'Avg. Processing Time', 'Pass Rate', 'Status'],
              rows: [
                ['ITAR/EAR dual-use classification', '612', '2.4 days', '94.1%', 'On track'],
                ['AS9100 conformance review', '489', '1.8 days', '97.3%', 'Ahead of target'],
                ['FAA PMA equivalency mapping', '401', '3.1 days', '91.6%', 'Under review'],
                ['EASA cross-certification', '345', '4.2 days', ' 88.4%', 'Needs attention'],
              ],
            },
          },
          { text: "The **EASA cross-certification** pathway is the bottleneck — processing times increased 18% due to new EU dual-use regulation updates effective January 2026. CertAgent's rule engine has been updated, but **34 parts are queued for manual review** where the AI confidence score fell below 85%. The MRO scheduling team flagged that 12 of these parts are needed for upcoming heavy maintenance checks at the Hamburg facility." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'What about the MRO schedule optimization — are we reducing aircraft downtime?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "MRO schedule optimization has been a **strong win** this quarter. The AI scheduling engine reduced average aircraft-on-ground (AOG) time by **14.2 hours per heavy check**, translating to approximately **$3.8M in recovered revenue** across the fleet:" },
          {
            list: [
              "**Predictive parts staging** — The system now pre-positions parts 72 hours before scheduled checks based on historical failure patterns. Parts availability at check start improved from 78% to **94%**, eliminating the biggest source of delays.",
              "**Crew skill matching** — AI-optimized crew assignments ensure A&P mechanics with type-specific ratings are allocated to the right checks. This reduced task reassignment during checks by **41%** and cut overtime hours by 320 hours this quarter.",
              "**Hangar slot optimization** — The scheduling algorithm now factors in paint booth availability, NDT equipment scheduling, and engine test cell bookings simultaneously. Hangar utilization improved from 71% to **83%**.",
            ],
          },
          { text: "The next milestone is integrating real-time AOG alerts from the flight operations system so the MRO scheduler can dynamically reprioritize unscheduled maintenance events without displacing planned heavy checks." },
        ],
      },
    ],
    suggestions: [
      'How does CertAgent handle dual-use parts?',
      'Show MRO schedule optimization',
      "What's our AS9100 compliance rate?",
      'Generate parts traceability report',
    ],
  },
  'nb-energy': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'Show me the grid load forecast for the next 48 hours.' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **48-hour grid load forecast** across the three managed regions. The AI model incorporates weather data, historical demand curves, and real-time SCADA telemetry:" },
          {
            table: {
              headers: ['Region', 'Current Load', 'Peak Forecast', 'Peak Time', 'Renewable Mix', 'Risk Level'],
              rows: [
                ['Northeast Grid', '14.2 GW', '18.6 GW', 'Tomorrow 5:00 PM', '34% wind/solar', 'Low'],
                ['Southeast Grid', '11.8 GW', '16.1 GW', 'Tomorrow 3:00 PM', '22% solar', 'Medium'],
                ['Western Grid', '9.4 GW', '13.9 GW', 'Today 7:00 PM', '41% wind/solar', 'Low'],
              ],
            },
          },
          { text: "The **Southeast Grid** is flagged medium risk because a cold front arriving tomorrow morning is expected to spike heating demand by **12-15%** above the seasonal baseline. OutagePredict has identified **3 substations** in the Raleigh-Durham corridor that historically experience transformer stress during rapid load increases — pre-positioning mobile transformer units is recommended." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How is the SCADA modernization progressing?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "The SCADA modernization program is **62% complete** across 847 substations. Here's the current status:" },
          {
            list: [
              "**Phase 1 complete (412 substations)** — Legacy RTUs replaced with IEC 61850-compliant intelligent electronic devices. These substations now stream real-time telemetry at 4-second intervals, up from 30-second polling. AI anomaly detection is live on all Phase 1 sites with a **92.4% accuracy rate** for fault prediction.",
              "**Phase 2 in progress (268 substations)** — Currently installing fiber-optic communication backbone and deploying edge computing nodes for local AI inference. 189 substations are online, 79 in commissioning. Target completion: Q3 2026.",
              "**Phase 3 planned (167 substations)** — Remote/rural substations requiring satellite communication upgrades. RFP issued for Starlink-based SCADA backhaul. Pilot scheduled for 8 sites in Q4 2026.",
            ],
          },
          { text: "The biggest measurable impact so far: Phase 1 substations have seen a **37% reduction in unplanned outage duration** because the AI detects incipient faults (partial discharge, dissolved gas anomalies) an average of **6.2 days before failure**. That's enough lead time to schedule planned maintenance instead of emergency response." },
        ],
      },
    ],
    suggestions: [
      'Show grid load forecast',
      'How does OutagePredict work?',
      "What's our renewable mix?",
      'SCADA modernization status',
    ],
  },
  'nb-financial': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What are the KYC processing times looking like this month?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "KYC processing has improved significantly since the AI-assisted screening went live. Here's the **March 2026 performance dashboard**:" },
          {
            table: {
              headers: ['Metric', 'Current', 'Last Month', 'Change', 'Target'],
              rows: [
                ['Average KYC processing time', '4.2 hours', '6.8 hours', '-38%', '< 6 hours'],
                ['Enhanced Due Diligence (EDD) cases', '18.4 hours', '24.1 hours', '-24%', '< 24 hours'],
                ['SAR filings submitted', '142', '128', '+11%', 'N/A'],
                ['False positive rate (sanctions screening)', '8.2%', '14.6%', '-44%', '< 10%'],
                ['Auto-approved (low risk)', '67%', '51%', '+31%', '> 60%'],
              ],
            },
          },
          { text: "The **false positive reduction from 14.6% to 8.2%** is the headline number. Previously, compliance analysts spent roughly **340 hours per month** investigating sanctions screening hits that turned out to be name-matching false positives. The AI now cross-references entity resolution data from 6 commercial databases before escalating, which has freed up **4.2 FTEs** worth of analyst capacity to focus on genuine high-risk cases." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How are the SAR filings trending — anything unusual?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "The **142 SAR filings** this month are within normal range, but there's an emerging pattern worth flagging:" },
          {
            list: [
              "**Crypto-related SARs up 34%** — 38 filings this month involve cryptocurrency-to-fiat conversion patterns. The AI transaction monitoring system flagged a cluster of 12 accounts using a similar layering pattern through DeFi bridges. Investigation team has grouped these into **Case Cluster #2026-0312** for coordinated review.",
              "**Trade-based laundering signals** — 6 SARs relate to import/export invoice discrepancies where the AI detected pricing anomalies exceeding 40% of fair market value. These are concentrated in the precious metals trading desk and involve counterparties in three jurisdictions flagged by FATF.",
              "**Reduced false escalations** — The AI's behavioral scoring model has reduced unnecessary SAR escalations by **28%** compared to the rules-based system. Analysts report that cases reaching their queue now have a **72% conversion rate** to actual filings, up from 44% under the old system.",
            ],
          },
          { text: "The crypto cluster is the one I'd recommend briefing the BSA officer on this week. The pattern suggests a coordinated operation, and FinCEN issued an advisory last month on similar DeFi bridge laundering typologies." },
        ],
      },
    ],
    suggestions: [
      'Show KYC processing times',
      'How many SAR filings this month?',
      "What's our false positive rate?",
      'Trade compliance alert summary',
    ],
  },
  'nb-health': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What does the trial enrollment status look like across our active studies?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **enrollment dashboard** for all active clinical trials as of this week:" },
          {
            table: {
              headers: ['Study', 'Phase', 'Target N', 'Enrolled', '% Complete', 'Enrollment Rate'],
              rows: [
                ['NBH-4201 (Oncology)', 'Phase III', '1,200', '1,084', '90.3%', 'On track'],
                ['NBH-3150 (Cardiology)', 'Phase II', '480', '312', '65.0%', 'Behind 8%'],
                ['NBH-5022 (Rare Disease)', 'Phase II', '180', '97', '53.9%', 'At risk'],
                ['NBH-1088 (Immunology)', 'Phase I', '60', '58', '96.7%', 'Near complete'],
                ['NBH-6300 (Neurology)', 'Phase III', '2,400', '1,641', '68.4%', 'On track'],
              ],
            },
          },
          { text: "**NBH-5022 (Rare Disease)** is the one that needs attention. The AI enrollment predictor estimates we'll miss the Q3 enrollment close by **11 weeks** at the current rate. The model identified 3 underperforming sites and recommends activating 2 backup sites in Germany and South Korea where the patient registry overlap is highest. SafetyWatch has flagged no safety signals on this study, so the protocol isn't the barrier — it's site activation delays." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How does SafetyWatch flag adverse events in real time?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "**SafetyWatch** operates as a three-layer pharmacovigilance AI system that monitors adverse events across all active studies continuously:" },
          {
            list: [
              "**Layer 1: Real-time eCRF ingestion** — As investigators enter adverse event data into the electronic case report forms, SafetyWatch parses the narrative text using medical NLP to code events to MedDRA preferred terms. It processes an average of **420 AE reports per day** across all studies and flags coding discrepancies within 15 minutes, compared to the previous 48-hour manual review cycle.",
              "**Layer 2: Statistical signal detection** — The system runs Bayesian disproportionality analysis (PRR and EBGM scoring) every 6 hours across the pooled safety database. When a drug-event combination exceeds the signaling threshold, it generates an **automated Signal Assessment Report** and routes it to the safety physician on call. This quarter it detected **2 genuine signals** out of 14 alerts — a 14.3% precision rate that's in line with industry benchmarks for early-phase detection.",
              "**Layer 3: Cross-study pattern matching** — SafetyWatch compares AE patterns across all Northbridge Health studies, including terminated ones, to detect class effects. Last month it identified a hepatic enzyme elevation pattern in NBH-4201 that matched a signal seen in a discontinued 2024 study with a related compound — this triggered a protocol amendment adding liver function monitoring at Week 8.",
            ],
          },
          { text: "The GxP compliance rate for SafetyWatch is currently **99.2%**, validated under 21 CFR Part 11 with full audit trail. Every AI-generated safety assessment is reviewed by a qualified safety physician before any regulatory action is taken — the system recommends, the physician decides." },
        ],
      },
    ],
    suggestions: [
      'Show trial enrollment status',
      'How does SafetyWatch flag events?',
      'GxP compliance rate?',
      'Manufacturing QA batch release status',
    ],
  },
  'ee-finance': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'What is the tax filing completion rate for this quarter?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **Q1 2026 tax filing automation dashboard** for the Ministry of Finance:" },
          {
            table: {
              headers: ['Filing Type', 'Total Due', 'Auto-Processed', 'Manual Review', 'Completion Rate', 'Avg. Time'],
              rows: [
                ['Personal income tax (TSD)', '148,200', '141,312', '6,888', '95.4%', '< 1 min'],
                ['Corporate income tax (TSD)', '24,600', '21,648', '2,952', '88.0%', '3.2 min'],
                ['VAT returns', '38,400', '35,712', '2,688', '93.0%', '1.8 min'],
                ['Social tax declarations', '52,100', '50,538', '1,562', '97.0%', '< 1 min'],
                ['Customs declarations', '8,900', '7,476', '1,424', '84.0%', '4.1 min'],
              ],
            },
          },
          { text: "Overall automated processing rate is **93.1%**, up from 87.4% last quarter. The **customs declarations** category has the lowest automation rate because the AI still struggles with tariff code classification for mixed-commodity shipments — particularly e-commerce parcels with multiple item categories. We're training a specialized model on HS code mapping that should push this above 90% by Q3." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How accurate are the revenue forecast models?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "The AI revenue forecasting models have been **remarkably accurate** this fiscal year. Here's the forecast-vs-actual comparison:" },
          {
            list: [
              "**Overall tax revenue forecast accuracy: 97.8%** — The model predicted total Q4 2025 tax revenue of \u20AC3.42B against actual collections of \u20AC3.35B, a variance of just 2.1%. This outperforms the econometric model used previously, which had a 6.4% average variance.",
              "**E-Residency revenue tracking** — The model correctly predicted a **14% increase** in e-Residency-linked corporate tax filings, driven by the new digital nomad visa program. Actual increase was 12.8%. This feeds into the Ministry's 3-year fiscal planning model.",
              "**Anomaly detection for fraud** — The revenue forecasting pipeline also flags statistical outliers. This quarter, it identified **\u20AC4.2M in suspicious VAT refund claims** from 23 entities exhibiting carousel fraud indicators. EMTA investigators confirmed 18 of the 23 cases (78% precision), resulting in \u20AC3.1M in blocked fraudulent refunds.",
            ],
          },
          { text: "The forecasting team is now integrating real-time X-Road data feeds from the Business Register and Employment Register to improve the corporate income tax model. Early testing shows this could reduce forecast variance below **1.5%** for corporate tax revenue." },
        ],
      },
    ],
    suggestions: [
      'Show tax filing completion rate',
      'Revenue forecast accuracy?',
      'How many audits automated?',
      'VAT fraud detection results',
    ],
  },
  'ee-social': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'How are benefits processing times performing this month?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **March 2026 benefits processing dashboard** for the Social Insurance Board:" },
          {
            table: {
              headers: ['Benefit Type', 'Applications', 'Avg. Processing Time', 'Auto-Approved', 'Target SLA', 'Status'],
              rows: [
                ['Family benefits', '12,400', '1.2 days', '89%', '3 days', 'Exceeding'],
                ['Disability assessment', '4,200', '8.4 days', '42%', '10 days', 'On track'],
                ['Pension calculations', '6,800', '2.1 days', '78%', '5 days', 'Exceeding'],
                ['Parental leave', '3,100', '0.8 days', '94%', '2 days', 'Exceeding'],
                ['Unemployment insurance', '5,600', '3.6 days', '61%', '5 days', 'On track'],
              ],
            },
          },
          { text: "**Parental leave** has the highest auto-approval rate at 94% because the eligibility criteria are well-defined and the AI can verify employment history and contribution records directly through X-Road integration with the Employment Register. **Disability assessments** remain the most complex — the 42% auto-approval rate reflects the fact that most cases require medical documentation review by a qualified assessor. However, the AI pre-screening has reduced assessor workload by **31%** by auto-populating case summaries and flagging incomplete documentation before it reaches the review queue." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How does HealthSync integrate health records for eligibility checks?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "**HealthSync** is the X-Road-based health data integration layer that enables real-time eligibility verification. Here's how it works:" },
          {
            list: [
              "**Automated medical record retrieval** — When a citizen applies for disability or sickness benefits, HealthSync queries the Health Information System (TIS) via X-Road to retrieve relevant diagnoses, treatment records, and physician assessments. The citizen consents once through eesti.ee, and the system pulls only the specific data fields needed for eligibility — no blanket access to full medical history. Average query response time is **1.4 seconds**.",
              "**Cross-registry validation** — HealthSync simultaneously checks the Population Register (for residency), Employment Register (for contribution history), and Health Insurance Fund database (for coverage status). This eliminates the old process where citizens had to collect paper certificates from 3-4 different offices. The AI verifies data consistency across registries and flags discrepancies — this month it caught **127 cases** where employment records didn't match contribution payments.",
              "**Privacy-preserving design** — All data flows are logged in the X-Road audit trail. Citizens can see exactly which government agencies accessed their data through the eesti.ee data tracker portal. HealthSync processes **zero persistent copies** of medical data — it queries in real time and discards after the eligibility decision is recorded. This architecture passed the EU GDPR compliance audit in January 2026 with zero findings.",
            ],
          },
          { text: "The case resolution rate for benefits involving HealthSync queries is **94.2%** without requiring the citizen to submit any additional documentation. Before HealthSync, that rate was 58% — meaning 42% of applicants had to mail or upload supplementary documents, adding an average of 11 days to processing time." },
        ],
      },
    ],
    suggestions: [
      'Show benefits processing times',
      'How does HealthSync work?',
      'Case resolution metrics?',
      'Disability assessment backlog status',
    ],
  },
  'ee-economic': {
    messages: [
      {
        role: 'user',
        content: [{ text: "What's the current e-Residency application status?" }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **e-Residency program dashboard** for March 2026:" },
          {
            table: {
              headers: ['Metric', 'This Month', 'Last Month', 'YoY Change', 'Status'],
              rows: [
                ['New applications', '4,280', '3,910', '+18%', 'Above target'],
                ['Avg. processing time', '3.2 days', '4.1 days', '-42%', 'Exceeding SLA'],
                ['Approval rate', '92.4%', '91.8%', '+1.2%', 'Stable'],
                ['Active e-Residents (total)', '112,400', '109,800', '+14%', 'Growing'],
                ['Companies registered by e-Residents', '28,600', '27,400', '+22%', 'Strong growth'],
              ],
            },
          },
          { text: "The **18% application spike** is driven by two factors: the new digital nomad visa partnership with Portugal and Thailand (announced February 2026), and increasing interest from UK fintech founders post-Brexit seeking EU market access. The AI screening system now auto-processes **74% of applications** through automated background checks against Interpol, EU sanctions lists, and PEP databases, with average turnaround under 90 minutes. Only applications flagged for enhanced review (geo-risk, PEP matches, or incomplete documentation) require manual processing." },
        ],
      },
      {
        role: 'user',
        content: [{ text: 'How are trade permit processing times trending?' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Trade permit processing has seen **major improvements** since the AI-assisted classification system went live in January:" },
          {
            list: [
              "**Standard trade permits** — Processing time reduced from 5.2 days to **1.8 days** (65% improvement). The AI auto-classifies goods against the EU Combined Nomenclature and checks for sanctions, dual-use restrictions, and preferential trade agreement eligibility. **82% of standard permits** are now issued without human intervention.",
              "**Dual-use export licenses** — These remain complex at **6.4 days average**, but down from 12.1 days. The AI pre-screens against the EU Dual-Use Regulation (2021/821) and generates a risk assessment that reduces analyst review time by 40%. Estonia's dual-use licensing is critical for the growing defense tech sector — **142 licenses** processed this quarter, up 34% YoY.",
              "**New business registrations** — The Business Register processed **2,840 new registrations** this month, with **91% completed same-day** through the automated e-Business Register portal. The AI validates articles of association, checks beneficial ownership declarations against the UBO register, and verifies compliance with EU Anti-Money Laundering directives. Average registration time for an e-Resident founding an O\u00DC (private limited company) is now **18 minutes** end-to-end.",
            ],
          },
          { text: "The economic affairs team is targeting **sub-1-day processing** for all standard trade permits by Q4 2026, which would make Estonia the fastest in the EU for trade permit issuance." },
        ],
      },
    ],
    suggestions: [
      'e-Residency application status?',
      'Trade permit processing time?',
      'New business registrations?',
      'Dual-use export license trends',
    ],
  },
  'ee-ria': {
    messages: [
      {
        role: 'user',
        content: [{ text: 'Show me the current threat dashboard.' }],
      },
      {
        role: 'ai',
        content: [
          { text: "Here's the **RIA Cybersecurity Threat Dashboard** as of today:" },
          {
            table: {
              headers: ['Threat Category', 'Events (24h)', 'Blocked', 'Under Investigation', 'Severity'],
              rows: [
                ['DDoS attacks', '847', '841 (99.3%)', '6', 'Medium'],
                ['Phishing campaigns', '2,140', '2,098 (98.0%)', '42', 'High'],
                ['Malware detections', '312', '308 (98.7%)', '4', 'Medium'],
                ['Unauthorized access attempts', '1,680', '1,672 (99.5%)', '8', 'Low'],
                ['APT indicators', '23', '18 (78.3%)', '5', 'Critical'],
              ],
            },
          },
          { text: "The **APT indicators** row is the priority. We're tracking 5 active investigations linked to a state-sponsored campaign targeting Baltic government infrastructure. The threat actor is using a novel supply-chain vector through a compromised open-source library used in X-Road adapter servers. RIA's AI threat hunting system (CLAW) detected the anomalous behavior pattern **14 hours before** the CERT-EU advisory was published. All affected adapter servers have been patched, and we've issued a security bulletin to X-Road partners in Finland and Luxembourg." },
        ],
      },
      {
        role: 'user',
        content: [{ text: "What's the X-Road uptime and health status this month?" }],
      },
      {
        role: 'ai',
        content: [
          { text: "**X-Road infrastructure health** for March 2026:" },
          {
            list: [
              "**Overall uptime: 99.97%** — Two brief incidents this month: a 12-minute outage on March 8 affecting the Tax Board adapter (caused by a certificate rotation error caught by automated monitoring) and a 4-minute degradation on March 21 during a planned security patch rollout. Both were resolved within SLA.",
              "**Transaction volume: 184 million queries** this month, averaging 6.1 million per day. Peak day was March 15 (tax filing deadline) with **11.2 million queries** — the AI auto-scaling system provisioned additional capacity 2 hours before the surge based on historical pattern analysis, maintaining sub-200ms response times throughout.",
              "**Incident response times** — Average time from alert to acknowledgment: **3.2 minutes**. Average time to resolution for P1 incidents: **28 minutes** (target: < 30 min). Average for P2: **2.4 hours** (target: < 4 hours). The AI triage system now auto-classifies 89% of incoming alerts correctly on first pass, routing them to the appropriate response team without manual dispatcher intervention.",
            ],
          },
          { text: "The X-Road monitoring AI is also tracking a **gradual increase in cross-border queries** — transactions with Finland's Suomi.fi system are up **22% this quarter** as more bilateral services come online. RIA is load-testing for a projected **250 million monthly queries** by end of 2026 to ensure the infrastructure scales ahead of demand." },
        ],
      },
    ],
    suggestions: [
      'Show threat dashboard',
      'X-Road uptime this month?',
      'Incident response times?',
      'Cross-border data exchange stats',
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

function MessageBubble({ message, index }: { message: StaticMessage; index: number }) {
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

/** Streamed AI message with markdown bold rendering */
function StreamedAIBubble({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-2.5 justify-start"
    >
      <div className="w-7 h-7 rounded-full bg-blue flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
      </div>
      <div className="max-w-[85%] sm:max-w-[75%] bg-surface-raised border border-border rounded-2xl rounded-bl-md px-4 py-3">
        <div className="text-[13px] leading-relaxed text-ink-secondary whitespace-pre-line">
          {content.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line.startsWith('- ') ? (
                <span className="flex gap-2">
                  <span className="text-ink-tertiary">-</span>
                  <span>{renderTextWithBold(line.slice(2))}</span>
                </span>
              ) : (
                renderTextWithBold(line)
              )}
            </span>
          ))}
          {content === '' && (
            <span className="inline-block w-1.5 h-4 bg-ink-tertiary animate-pulse ml-0.5" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LiveUserBubble({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-2.5 justify-end"
    >
      <div className="max-w-[85%] sm:max-w-[75%] bg-blue text-white rounded-2xl rounded-br-md px-4 py-2.5">
        <p className="text-[13px] leading-relaxed">{content}</p>
      </div>
      <div className="w-7 h-7 rounded-full bg-surface-sunken border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
        <User className="w-3.5 h-3.5 text-ink-tertiary" strokeWidth={2} />
      </div>
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export default function Assistant() {
  const { company } = useCompany();
  const chat = chatData[company.id] || chatData.meridian;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Build company context string for the API
  const companyContext = `Currently viewing: ${company.name} (${company.shortName})
Industry: ${company.industry}
Employees: ${company.employees}
ID: ${company.id}`;

  const { messages: liveMessages, isStreaming, error, sendMessage, clearMessages } = useAtlasChat({
    companyContext,
  });

  // Reset live messages when company changes
  useEffect(() => {
    clearMessages();
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [company.id, clearMessages]);

  // Auto-scroll on new messages or streaming
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveMessages, isStreaming]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isStreaming) return;
    const question = inputValue.trim();
    setInputValue('');
    sendMessage(question);
  }, [inputValue, isStreaming, sendMessage]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    if (isStreaming) return;
    sendMessage(suggestion);
  }, [isStreaming, sendMessage]);

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] max-w-[960px] mx-auto">
      <div className="px-4 lg:px-8 pt-4 flex-shrink-0">
        <PreliminaryBanner />
      </div>
      {/* Page header */}
      <div className="px-4 lg:px-8 pt-2 pb-4 flex-shrink-0">
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
        {/* Static pre-populated messages */}
        {chat.messages.map((msg, i) => (
          <MessageBubble key={`${company.id}-${i}`} message={msg} index={i} />
        ))}

        {/* Typing indicator (only when no live messages and not streaming) */}
        {liveMessages.length === 0 && !isStreaming ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: chat.messages.length * 0.08 + 0.3 }}
          >
            <TypingIndicator />
          </motion.div>
        ) : null}

        {/* Live messages from real Claude API */}
        {liveMessages.map((msg, i) => {
          if (msg.role === 'user') {
            return <LiveUserBubble key={`${company.id}-live-${i}`} content={msg.content} />;
          }
          return <StreamedAIBubble key={`${company.id}-live-${i}`} content={msg.content} />;
        })}

        {/* Streaming indicator when waiting for first token */}
        {isStreaming && liveMessages.length > 0 && liveMessages[liveMessages.length - 1].role === 'user' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TypingIndicator />
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 mx-4 rounded-xl bg-red-50 border border-red-100 text-[13px] text-red-600"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Connection issue, try again.</span>
          </motion.div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="px-4 lg:px-8 pb-3 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {chat.suggestions.map((s, i) => (
            <motion.button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              disabled={isStreaming}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="px-3 py-1.5 text-[12px] font-medium text-blue bg-blue-muted rounded-full
                         hover:bg-blue hover:text-white transition-colors duration-150 cursor-pointer
                         border border-transparent hover:border-blue
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-muted disabled:hover:text-blue disabled:hover:border-transparent"
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
                       outline-none border-none disabled:opacity-50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !inputValue.trim()}
            className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center flex-shrink-0
                       hover:bg-blue/90 transition-colors duration-150 cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
