import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Brain, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompany } from '../data/CompanyContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* ── Per-company suggestion chips ─────────────────────────── */

const SUGGESTION_CHIPS: Record<string, Record<string, string[]>> = {
  meridian: {
    '/overview': ['Summarize today\'s metrics', 'What needs attention?', 'Compare divisions'],
    '/agents': ['Which agent saved the most today?', 'Any agent issues?', 'Show fleet health'],
    '/impact': ['Break down the $5.8M', 'What\'s the payback period?', 'Compare to industry'],
    '/assessment': ['What\'s our biggest waste?', 'License optimization options', 'Migration risks'],
    '/operations': ['Which workflows are bottlenecked?', 'Show automation rate', 'Any failures today?'],
    '/intelligence': ['Summarize latest insights', 'What patterns do you see?', 'Data quality issues?'],
    '/verification': ['Any pending verifications?', 'Show audit trail', 'Compliance status?'],
    '/reliability': ['Current error rates?', 'SLA compliance?', 'Incident trends?'],
  },
  oakwood: {
    '/overview': ['Summarize claims metrics', 'What needs attention?', 'Compare departments'],
    '/agents': ['Which agent closed the most claims?', 'Any agent issues?', 'Show fleet health'],
    '/impact': ['Break down claims savings', 'What\'s the fraud detection rate?', 'Compare to industry'],
    '/assessment': ['What\'s our biggest leakage?', 'Guidewire optimization options', 'Duck Creek migration risks'],
    '/operations': ['Which claims are bottlenecked?', 'Show auto-adjudication rate', 'Any failures today?'],
    '/intelligence': ['Summarize fraud patterns', 'What loss trends do you see?', 'Data quality issues?'],
    '/verification': ['Any pending claim reviews?', 'Show audit trail', 'Compliance status?'],
    '/reliability': ['Current processing times?', 'SLA compliance?', 'Incident trends?'],
  },
  pinnacle: {
    '/overview': ['Summarize clinical metrics', 'What needs attention?', 'Compare departments'],
    '/agents': ['Which agent processed the most orders?', 'Any agent issues?', 'Show fleet health'],
    '/impact': ['Break down cost savings', 'What\'s the denial reduction rate?', 'Compare to benchmarks'],
    '/assessment': ['What\'s our biggest compliance gap?', 'Epic optimization options', 'FHIR migration status'],
    '/operations': ['Which workflows are bottlenecked?', 'Show automation rate', 'Any failures today?'],
    '/intelligence': ['Summarize clinical patterns', 'What coding trends do you see?', 'Data quality issues?'],
    '/verification': ['Any pending clinical reviews?', 'Show audit trail', 'HIPAA compliance status?'],
    '/reliability': ['Current response times?', 'SLA compliance?', 'Incident trends?'],
  },
  atlas: {
    '/overview': ['Summarize production metrics', 'What needs attention?', 'Compare OpCos'],
    '/agents': ['Which agent optimized the most?', 'Any agent issues?', 'Show fleet health'],
    '/impact': ['Break down OEE improvements', 'What\'s the scrap reduction?', 'Compare to benchmarks'],
    '/assessment': ['What\'s our biggest bottleneck?', 'SAP optimization options', 'MES integration risks'],
    '/operations': ['Which lines are bottlenecked?', 'Show yield rate', 'Any quality alerts today?'],
    '/intelligence': ['Summarize quality trends', 'What SPC patterns do you see?', 'Data quality issues?'],
    '/verification': ['Any pending quality holds?', 'Show audit trail', 'ISO compliance status?'],
    '/reliability': ['Current downtime rates?', 'SLA compliance?', 'Maintenance backlog?'],
  },
  northbridge: {
    '/overview': ['Summarize enterprise metrics', 'What needs attention?', 'Compare OpCos'],
    '/agents': ['Which OpCo has highest AI adoption?', 'Any agent issues?', 'Show fleet health'],
    '/impact': ['Break down the $42M annual projection', 'What\'s the cross-OpCo synergy?', 'Compare to targets'],
    '/assessment': ['What\'s our biggest risk?', 'GxP validation status', 'ITAR compliance gaps'],
    '/operations': ['Which OpCo workflows are bottlenecked?', 'Show automation rate', 'Any failures today?'],
    '/intelligence': ['Summarize cross-OpCo patterns', 'What trends do you see?', 'Data quality issues?'],
    '/verification': ['Any pending regulatory reviews?', 'Show audit trail', 'Compliance status?'],
    '/reliability': ['Current error rates?', 'SLA compliance?', 'Incident trends?'],
  },
  estonia: {
    '/overview': ['Summarize gov-service metrics', 'What needs attention?', 'Compare ministries'],
    '/agents': ['Which service has highest usage?', 'Any agent issues?', 'Show X-Road health'],
    '/impact': ['Break down citizen impact', 'What\'s the cost savings?', 'Compare to EU benchmarks'],
    '/assessment': ['What\'s our biggest gap?', 'X-Road optimization options', 'Cybersecurity posture'],
    '/operations': ['Which services are bottlenecked?', 'Show automation rate', 'Any failures today?'],
    '/intelligence': ['Summarize citizen patterns', 'What trends do you see?', 'Data quality issues?'],
    '/verification': ['Any pending security patches?', 'Show audit trail', 'GDPR compliance status?'],
    '/reliability': ['Current response times?', 'SLA compliance?', 'Incident trends?'],
  },
};

const DEFAULT_CHIPS: Record<string, string[]> = {
  meridian: ['Summarize today\'s metrics', 'What needs attention?', 'Show me key insights', 'Compare divisions'],
  oakwood: ['Summarize claims metrics', 'What needs attention?', 'Show fraud indicators', 'Compare departments'],
  pinnacle: ['Summarize patient metrics', 'What needs attention?', 'Show clinical insights', 'Compare departments'],
  atlas: ['Summarize production metrics', 'What needs attention?', 'Show quality trends', 'Compare OpCos'],
  northbridge: ['Summarize enterprise metrics', 'What needs attention?', 'Show cross-OpCo insights', 'Compare subsidiaries'],
  estonia: ['Summarize gov-service metrics', 'What needs attention?', 'Show citizen impact', 'Compare ministries'],
};

const GENERIC_DEFAULT_CHIPS = ['Summarize today\'s metrics', 'What needs attention?', 'Show me key insights', 'Compare divisions'];

/* ── Per-company canned responses ─────────────────────────── */

const CANNED_RESPONSES: Record<string, Record<string, string>> = {
  meridian: {
    'summarize today\'s metrics': 'Today\'s key metrics are looking strong. Agent fleet utilization is at 94%, with 12 active workflows processing across 7 divisions. 3 AI models in production (RailSentry, Tie Inspection, HSI Ultrasonic). Projected annual ROI: $5.8M (per Command Center assessment). Current operational impact tracked at $3.6M across verification, automation, and adoption. The verification pass rate is 94.2%, and average processing time has dropped to 2.3 seconds per document.',
    'what needs attention?': 'A few items need your attention:\n\n1. **HRSI — eCMS batch lag** — QMirror/AS400 data is 18 hours stale, blocking real-time cost analysis\n2. **License audit** — 3 SaaS licenses are up for renewal this week with potential savings of $42K\n3. **HCSS Telematics** — 12 vehicles in IC Environmental with stale telematics feeds >10 minutes',
    'compare divisions': 'Here\'s the division comparison:\n\n- **IC Rail (HRSI)** — Highest throughput (340 tasks/day), HCSS suite well-adopted\n- **IC Construction (HCC)** — Best ROI ($1.2M savings), most agents deployed (10)\n- **IC Technologies (HTI)** — 8 agents, highest PTC/signal complexity\n- **IC Transit (HTSI)** — Newest onboard, ramping up at 78% automation\n\nOverall, Construction leads in value generation while Rail leads in volume.',
    'which agent saved the most today?': 'The **RailSentry** agent leads today with $14,200 in value from 648 defect scans processed. Close behind is the **Blueprint** cost estimation agent at $8,200 from 23 eCMS work orders reviewed. The fleet collectively has saved $34,600 today.',
    'any agent issues?': 'All agents are healthy with one minor exception:\n\n- **eCMS Data Pipeline** is showing slightly elevated latency (avg 340ms vs normal 180ms) since 2:15 PM. Root cause appears to be QMirror/AS400 batch lag. No errors or failures detected — just slower than usual. Should self-resolve when the next batch completes.',
    'show fleet health': 'Fleet health overview:\n\n- **68/68 agents** operational (100% uptime today)\n- **Avg response time**: 210ms (within SLA)\n- **Tasks completed**: 2,847 today\n- **Error rate**: 0.03% (well below 0.5% threshold)\n- **Queue depth**: Normal across all agents\n\nAll systems green. No intervention needed.',
    'break down the $5.8m': 'Two numbers to understand here:\n\n**Command Center Projected ROI: $5.8M** (includes tech stack + workflow + license savings)\n- Labor automation: $2.4M (41%) — HCSS suite, Procore, Equipment360\n- License optimization: $1.1M (19%) — eCMS consolidation, P6 right-sizing\n- Error reduction: $890K (15%) — RailSentry, HSI Ultrasonic\n- Speed improvements: $740K (13%) — Heavy Job field automation\n- Compliance savings: $670K (12%) — HCSS Safety, FRA automation\n\n**Last Mile Operational Impact: $3.6M** (verification, automation, and adoption impact currently tracked)\n\nThe gap reflects savings identified but not yet fully realized through operational deployment.',
    'what\'s the payback period?': 'The payback period analysis:\n\n- **Initial investment**: $2.8M (platform + integration + training)\n- **Monthly value generated**: ~$717K ($8.6M gross / 12)\n- **Payback achieved**: ~3.9 months\n- **Current ROI multiple**: 2.07x\n- **Projected Year 2**: $8.7M cumulative value\n\nYou\'re well past breakeven and accelerating.',
    'compare to industry': 'Compared to industry benchmarks:\n\n- **Automation rate**: 94% vs industry avg 62% — **Top 5%**\n- **AI adoption speed**: 3 months to full deployment vs avg 9 months\n- **ROI multiple**: 2.07x vs industry avg 1.4x\n- **Error rate**: 0.03% vs industry avg 1.2%\n- **Agent uptime**: 99.97% vs industry avg 98.5%\n\nYou\'re significantly outperforming peers in construction/infrastructure.',
    'what\'s our biggest waste?': 'The biggest areas of waste identified:\n\n1. **eCMS license duplication** — $480K/yr across 4 division instances that should be one tenant\n2. **QMirror/AS400 manual workarounds** — Estimated 2,100 hours/month rekeying data due to batch lag\n3. **Report generation** — 45 hours/week spent on Business Objects reports that could be automated\n4. **MCP payroll rekeying** — Crew hours manually entered into eCMS payroll module\n\nThe eCMS consolidation alone could save $480K within 90 days.',
    'license optimization options': 'License optimization opportunities:\n\n- **Consolidate 4 eCMS instances** → Save $480K/yr by standardizing on single tenant\n- **Right-size P6 licenses** → 23 seats underutilized, save $92K/yr\n- **HCSS suite cleanup** → Remove 20 retired vehicle trackers, save $24K/yr\n- **Renegotiate enterprise agreements** → Volume discount potential of $120K/yr\n\nTotal addressable: **$716K/yr** in license savings.',
    'migration risks': 'Key migration risks to consider:\n\n1. **QMirror/AS400 migration** (High) — Core financial data on legacy platform, needs careful API bridge\n2. **eCMS consolidation** (Medium) — 4 division instances with different configurations\n3. **MCP payroll integration** (Low) — Well-understood data model, API available\n4. **Compliance continuity** (Low) — All audit trails preserved during migration\n\nOverall risk profile is **medium**. The AS400 dependency is the critical path item.',
  },
  oakwood: {
    'summarize claims metrics': 'Claims operations are running well today. Auto-adjudication rate is at 68%, up from 61% last month. Average claim cycle time is 4.2 days (target: 5.0). Total claims in flight: 3,847 across all lines. Fraud detection flagged 23 suspicious claims this week — 4 confirmed, saving an estimated $184K in prevented payouts.',
    'what needs attention?': 'A few items need your attention:\n\n1. **Claims backlog** — Workers Comp queue has 42 claims pending >48 hours, up from normal 15-20\n2. **Duck Creek sync** — Policy endorsement data is 8% incomplete, affecting coverage lookup accuracy\n3. **Fraud alert** — 3 claims from the same body shop in Hartford flagged for potential collision repair inflation',
    'compare departments': 'Here\'s the department comparison:\n\n- **Claims** — Processing 980 queries/day, 99.3% success rate, 1.9 min freshness\n- **Underwriting** — 520 queries/day, strong loss ratio analysis, 86% data completeness\n- **Policy Admin** — Highest completeness at 92%, fastest context freshness at 1.6 min\n- **Customer Service** — Highest query volume (1,120/day), best success rate at 99.7%\n\nCustomer Service leads on throughput while Policy Admin leads on data quality.',
    'show fraud indicators': 'Current fraud indicators:\n\n- **23 claims flagged** this week (up 15% from weekly avg)\n- **Top patterns**: Staged collisions (4), medical provider mills (3), inflated repair estimates (6)\n- **Geographic clusters**: Hartford CT (4 claims), Miami FL (3 claims)\n- **AI detection rate**: 94% (vs industry avg 72%)\n- **Estimated savings**: $184K in prevented fraudulent payouts this week\n\nThe Hartford body shop cluster warrants SIU referral.',
    'guidewire optimization options': 'Guidewire optimization opportunities:\n\n- **Enable real-time event streaming** → Reduce claim data lag from 15 min to <30 sec\n- **Activate ClaimCenter ML scoring** → Auto-triage 30% more claims, save $220K/yr\n- **Consolidate duplicate integrations** → 4 redundant API connections identified, save $45K/yr\n- **Upgrade to cloud-native** → Eliminate 3 on-prem servers, save $180K/yr\n\nTotal addressable: **$445K/yr** in optimization savings.',
    'duck creek migration risks': 'Key Duck Creek migration risks:\n\n1. **Policy data mapping** (Medium) — 8% endorsement gap needs resolution before migration\n2. **Rating engine parity** (Low) — All 142 rating algorithms validated in parallel run\n3. **Agent portal downtime** (Medium) — Estimated 4-hour cutover window required\n4. **Historical data** (Low) — 10-year loss history migration tested and verified\n\nOverall risk profile is **medium-low**. The endorsement gap is the key item to resolve first.',
  },
  pinnacle: {
    'summarize clinical metrics': 'Clinical operations are performing well. Patient throughput is up 8% this month with 420 managed context windows serving clinical and admin staff. Average query response time is 1.8 seconds. HIPAA compliance is at 100% across all AI services. The billing denial rate has dropped to 3.2% (down from 5.8% pre-AI), saving an estimated $890K in recovered revenue.',
    'what needs attention?': 'A few items need your attention:\n\n1. **Epic lab interface** — 22 lab results pending >30 minutes, affecting clinical decision support accuracy\n2. **Prior auth queue** — 18 imaging orders awaiting authorization, up from typical 6-8\n3. **Coding alert** — 4th TTE denial this month for missing prior auth — may indicate a workflow gap in cardiology scheduling',
    'compare departments': 'Here\'s the department comparison:\n\n- **Clinical** — 860 queries/day, fastest freshness at 1.2 min, 99.6% success\n- **Admin** — Solid performance at 340 queries/day, room for improvement on completeness (84%)\n- **Billing** — 420 queries/day, strong coding accuracy, 88% completeness\n- **Pharmacy** — Best data quality (96% completeness), fastest freshness at 1.0 min, 99.8% success\n\nPharmacy leads on data quality while Clinical leads on volume and freshness.',
    'show clinical insights': 'Key clinical insights:\n\n- **Readmission risk**: 12 patients flagged as high-risk in the last 24 hours\n- **Drug interactions**: AI caught 8 potential interactions before dispensing today\n- **Coding accuracy**: AI-assisted coding shows 97.2% first-pass acceptance rate\n- **Clinical documentation**: Average note completion time down 40% with AI assistance\n- **Prior auth**: Auto-approval rate for standard procedures up to 78%\n\nThe drug interaction catches alone represent significant patient safety value.',
    'epic optimization options': 'Epic optimization opportunities:\n\n- **Enable real-time lab interface** → Reduce lab result lag from 30 min to <2 min\n- **Activate CDS triggers** → Catch 15% more drug interactions and dosing errors\n- **Integrate predictive analytics** → Identify at-risk patients 48 hours earlier\n- **Streamline order entry** → Reduce physician clicks by 35% with AI-suggested orders\n\nThe lab interface fix alone could improve clinical decision support for 148 active users.',
    'fhir migration status': 'FHIR migration status:\n\n- **Resource coverage**: 94% (up from 78% pre-migration)\n- **Mapped resources**: Patient, Encounter, Observation, MedicationRequest, DiagnosticReport\n- **Pending**: AllergyIntolerance (in testing), Immunization (Q2)\n- **Performance**: 180ms avg response time (target: <500ms)\n- **Validation**: All CMS-required profiles passing\n\nThe migration is on track. The remaining 6% covers edge-case resources scheduled for Q2.',
  },
  atlas: {
    'summarize production metrics': 'Production metrics are strong across all 4 OpCos. Overall OEE is 84.7% (target: 87%). Total throughput: 12,400 units today across 18 active production lines. Scrap rate is at 1.8% (down from 2.4% last quarter). SAP integration is processing 4.2M records with 99.1% success rate. The predictive maintenance system flagged 6 upcoming equipment issues before failure.',
    'what needs attention?': 'A few items need your attention:\n\n1. **Line 4 (Precision Parts)** — OEE dropped to 82.3%, driven by a 42-minute tool change delay\n2. **Aluminum stock** — 3.2 days remaining vs 5-day minimum; inbound PO is 3 days late\n3. **SPC alert** — Composites batch CMP-0891 showing 7 consecutive declining data points on tensile strength',
    'compare opcos': 'Here\'s the OpCo comparison:\n\n- **Precision Parts** — 780 queries/day, strong OEE tracking, 88% completeness\n- **Advanced Materials** — Best quality monitoring (SPC coverage 97%), 85% completeness\n- **Assembly Systems** — Highest throughput (940 queries/day), best freshness at 1.5 min\n- **Logistics & Supply** — Room for improvement at 82% completeness, but strong on supply chain visibility\n\nAssembly Systems leads in volume while Advanced Materials leads on quality data.',
    'show quality trends': 'Quality trends across OpCos:\n\n- **Overall scrap rate**: 1.8% (target: <2.0%) — on track\n- **SPC violations this week**: 4 (down from 7 last week)\n- **Customer complaints**: 2 (YTD avg: 3.1/week)\n- **First-pass yield**: 98.2% (up 0.4% from last month)\n- **Predictive maintenance**: 6 issues caught before failure (est. savings: $340K)\n\nThe downward trend in SPC violations indicates process stability is improving.',
    'sap optimization options': 'SAP optimization opportunities:\n\n- **Enable real-time PP integration** → Reduce production order lag from 20 min to <2 min\n- **Activate SAP IBP** → Improve demand forecast accuracy by 22%\n- **Consolidate PM workflows** → Merge 3 maintenance scheduling systems into SAP PM\n- **MES bi-directional sync** → Close the loop on shop-floor data, save 120 manual entries/day\n\nThe PP real-time integration alone would eliminate the 2nd-shift data lag issue.',
    'mes integration risks': 'Key MES integration risks:\n\n1. **OPC-UA connectivity** (Medium) — 8 tags on Line 6 showing intermittent packet loss\n2. **Data volume** (Low) — PLC telemetry at 20K readings/batch is within capacity\n3. **Schema mapping** (Low) — 97% of tags mapped after recent calibration push\n4. **Downtime window** (Medium) — Line-by-line cutover requires 2-hour windows per line\n\nOverall risk profile is **medium-low**. The Line 6 network issue should be resolved before the April 2 switch replacement.',
  },
  northbridge: {
    'summarize enterprise metrics': 'Enterprise AI performance is strong. Projected annual value: $42M across 4 OpCos ($10.5M/quarter run rate). Overall adoption rate: 58% (Aerospace 62%, Energy 55%, Financial 68%, Health Sciences 52%). Context windows serving 4,200 users across 184 connected systems. Cross-OpCo AI models deployed: 3 shared frameworks saving $2.1M in development costs.',
    'what needs attention?': 'A few items need your attention:\n\n1. **Health Sciences** — AI adoption at 52% (target 70%), GxP validation is the bottleneck\n2. **Aerospace** — ITAR data restrictions limiting 14 fields from unified model mapping\n3. **FINRA exam** — NB Financial has a scheduled examination in 14 days, prep documentation needs completion\n4. **Cross-OpCo schema** — 14 Aerospace data fields still unmapped to enterprise model',
    'compare opcos': 'Here\'s the OpCo comparison:\n\n- **NB Financial** — Highest adoption (68%), strongest compliance automation\n- **NB Aerospace** — Solid at 62% adoption, MRO optimization driving value\n- **NB Energy** — At 55% adoption, grid optimization and outage prevention leading gains\n- **NB Health Sciences** — Behind at 52%, GxP validation bottleneck but clinical trial processing showing promise\n\nFinancial leads on adoption rate. Projected annual impact: $42M across all OpCos ($10.5M/quarter).',
    'show cross-opco insights': 'Cross-OpCo AI insights:\n\n- **Shared models**: 3 deployed (document classification, risk scoring, compliance monitoring)\n- **Data standardization**: 86% of cross-OpCo fields mapped to unified schema\n- **Best practice transfers**: Energy\'s predictive maintenance model being adapted for Aerospace MRO\n- **Compliance framework**: Financial\'s validation approach being templated for Health Sciences GxP\n- **Cost avoidance**: $2.1M saved by sharing AI infrastructure vs separate deployments\n\nThe cross-pollination between Financial and Health Sciences on validation is the highest-impact synergy opportunity.',
    'gxp validation status': 'GxP validation status for Health Sciences:\n\n- **Validated services**: 8 of 11 AI services (73%)\n- **In validation**: 3 services (clinical trial data extraction, adverse event classification, batch record review)\n- **Timeline**: Validation protocols submitted, expected completion April 15\n- **Blockers**: IQ/OQ/PQ documentation requires 21 CFR Part 11 compliance review\n- **Impact**: Once validated, automation rate jumps from 80% to projected 95%\n\nRecommend allocating 2 additional QA resources from the shared services team to accelerate.',
    'itar compliance gaps': 'ITAR compliance status for Aerospace:\n\n- **Data classification**: 96% of technical data properly tagged\n- **Access controls**: FedRAMP-approved deployment model in place since February\n- **Gap areas**: 14 data fields from design engineering not yet integrated into AI context\n- **Reason**: ITAR Category IV restrictions require separate data handling pipeline\n- **Remediation**: Dedicated ITAR-compliant processing partition being built, ETA April 20\n\nThe 14 unmapped fields don\'t affect current AI services but limit future engineering copilot capabilities.',
  },
  estonia: {
    'summarize gov-service metrics': 'Digital government services are performing well. 35 AI services live across 4 entities (target: 35). Citizen service response time: 2.4 seconds (down from 12 seconds pre-AI). Citizen satisfaction: 87% (up from 74%). Q1 cost savings: \u20AC4.2M. X-Road AI-enabled exchanges: 1,240/day (up 340%). EU Digital Decade alignment: 92% (target: 90%).',
    'what needs attention?': 'A few items need your attention:\n\n1. **CVE-2026-1847** — 53 X-Road security servers still pending OpenSSL patch (HIGH severity)\n2. **Population Registry** — 1,240 address updates pending from municipal registries\n3. **Social Affairs** — Benefits eligibility checker needs one more service to hit Q1 target\n4. **Phishing campaigns** — 2 active campaigns targeting government employees identified today',
    'compare ministries': 'Here\'s the ministry comparison:\n\n- **Min. of Finance** — 14 AI services (ahead of 12 target), best automation in tax pre-filling\n- **Min. of Social Affairs** — 9 of 10 target, highest citizen query volume at 2,400/day\n- **Min. of Economic Affairs** — 7 of 8 target, e-Residency auto-approval rate at 66%\n- **RIA** — 5 of 5 target, 99.99% X-Road uptime, strongest data quality at 97%\n\nFinance leads on deployment while RIA leads on infrastructure reliability.',
    'show citizen impact': 'Citizen impact metrics:\n\n- **Service response time**: 2.4 sec (was 12 sec) — **5x faster**\n- **Citizen satisfaction**: 87% (was 74%) — **+13 points**\n- **24/7 availability**: 98.5% of services now available outside business hours\n- **Paper reduction**: 89% of citizen interactions now fully digital\n- **Cross-ministry queries**: Citizens no longer need to visit multiple offices — 420 AI-resolved cross-ministry queries daily\n- **e-Residency processing**: Application review time down from 5 days to 4 hours\n\nEstonia continues to lead the EU in digital government service delivery.',
    'show x-road health': 'X-Road infrastructure health:\n\n- **Security servers**: 1,247 active, 0 offline\n- **Transactions (24h)**: 2.4M at 180ms avg response (SLA: <500ms)\n- **Availability**: 99.99% (8 seconds downtime in 24h)\n- **Error rate**: 0.012%\n- **Cross-border connections**: 12 partner countries active\n- **Certificate status**: 3 renewals due in 14 days\n\nX-Road is operating optimally. Schedule the 3 certificate renewals for the Sunday maintenance window.',
    'cybersecurity posture': 'National cybersecurity posture:\n\n- **Active threats**: 3 DDoS attempts mitigated (RU/BY origin), 2 phishing campaigns detected\n- **CVE-2026-1847**: HIGH severity, 89 of 142 affected servers patched (53 pending, ETA 18:00)\n- **CERT-EE alerts**: No elevated threat level for Baltics (per NATO CCDCOE)\n- **eID system**: Fully operational, 14,200 authentications/hour\n- **Incident response**: 0 active incidents, mean time to detect: 4.2 minutes\n\nPriority action: complete the remaining 53 OpenSSL patches before end of business today.',
  },
};

/* ── Generic fallback responses ───────────────────────────── */
const GENERIC_RESPONSES: Record<string, string> = {
  'summarize today\'s metrics': 'Today\'s key metrics are looking strong. Agent fleet utilization is at 94%, with active workflows processing across your organization. Cost savings are tracking ahead of plan, and the verification pass rate is above 98%.',
  'what needs attention?': 'I\'ve identified a few items that need your attention. Check the overview dashboard for the latest alerts and priority items across your organization.',
  'show fleet health': 'Fleet health overview: All agents operational with normal queue depths and response times within SLA. No intervention needed.',
};

function getCannedResponse(message: string, companyId: string): string {
  const lower = message.toLowerCase().trim();

  // First check company-specific responses
  const companyResponses = CANNED_RESPONSES[companyId];
  if (companyResponses) {
    for (const [key, response] of Object.entries(companyResponses)) {
      if (lower.includes(key) || key.includes(lower)) {
        return response;
      }
    }
  }

  // Then check generic responses
  for (const [key, response] of Object.entries(GENERIC_RESPONSES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return response;
    }
  }

  // Then check meridian as fallback (it has the most comprehensive responses)
  if (companyId !== 'meridian') {
    const meridianResponses = CANNED_RESPONSES['meridian'];
    if (meridianResponses) {
      for (const [key, response] of Object.entries(meridianResponses)) {
        if (lower.includes(key) || key.includes(lower)) {
          return response;
        }
      }
    }
  }

  // Keyword-based fallback using company-specific responses where available
  const responses = companyResponses || CANNED_RESPONSES['meridian'] || {};
  if (lower.includes('agent')) return responses['show fleet health'] || GENERIC_RESPONSES['show fleet health'];
  if (lower.includes('save') || lower.includes('roi') || lower.includes('money')) return responses['break down the $5.8m'] || responses['break down claims savings'] || responses['break down cost savings'] || responses['break down oee improvements'] || responses['break down the $11m annual projection'] || responses['break down citizen impact'] || 'I can help you analyze ROI and cost savings. Try asking about specific savings breakdowns for your organization.';
  if (lower.includes('risk') || lower.includes('issue') || lower.includes('problem')) return responses['what needs attention?'] || GENERIC_RESPONSES['what needs attention?'];
  if (lower.includes('compare') || lower.includes('benchmark')) return responses['compare to industry'] || responses['compare departments'] || responses['compare opcos'] || responses['compare ministries'] || 'I can help you compare performance across your organization. Try asking about specific divisions or departments.';
  if (lower.includes('license') || lower.includes('saas')) return responses['license optimization options'] || 'I can help analyze license optimization opportunities. Ask about specific tools or platforms you\'re interested in optimizing.';
  if (lower.includes('waste') || lower.includes('optimize')) return responses['what\'s our biggest waste?'] || responses['what\'s our biggest leakage?'] || responses['what\'s our biggest bottleneck?'] || responses['what\'s our biggest gap?'] || 'I can help identify optimization opportunities across your operations. Try asking about specific areas like licensing, workflows, or data quality.';

  return 'I can help you analyze your AI operations data. Try asking about agent performance, ROI breakdown, division comparisons, or specific metrics. I have deep context on your fleet health, cost savings, and optimization opportunities.';
}

/* ── Resolve company-specific chips ───────────────────────── */
function getCompanyChips(companyId: string, pathname: string): string[] {
  // Find chips for this company + page
  const companyChipMap = SUGGESTION_CHIPS[companyId] || SUGGESTION_CHIPS['meridian'];
  if (companyChipMap && companyChipMap[pathname]) {
    return companyChipMap[pathname];
  }
  // Fall back to company default chips
  return DEFAULT_CHIPS[companyId] || DEFAULT_CHIPS['meridian'] || GENERIC_DEFAULT_CHIPS;
}

/* ── Resolve parent company ID for sub-entities ───────────── */
function resolveCompanyKey(companyId: string): string {
  // Map sub-entity IDs to their parent for response lookup
  const parentMap: Record<string, string> = {
    hcc: 'meridian', hrsi: 'meridian', hsi: 'meridian', hti: 'meridian', htsi: 'meridian', he: 'meridian', gg: 'meridian',
    'nb-aerospace': 'northbridge', 'nb-energy': 'northbridge', 'nb-financial': 'northbridge', 'nb-health': 'northbridge',
    'ee-finance': 'estonia', 'ee-social': 'estonia', 'ee-economic': 'estonia', 'ee-ria': 'estonia',
  };
  // Use specific company responses if available, otherwise fall back to parent
  if (CANNED_RESPONSES[companyId]) return companyId;
  return parentMap[companyId] || companyId;
}

export default function FloatingAtlas() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasBounced, setHasBounced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { company } = useCompany();

  const resolvedKey = resolveCompanyKey(company.id);
  const chips = getCompanyChips(resolvedKey, location.pathname);

  useEffect(() => {
    if (!hasBounced) {
      const timer = setTimeout(() => setHasBounced(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasBounced]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const assistantPlaceholder: ChatMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, userMsg, assistantPlaceholder]);
    setInput('');
    setIsTyping(true);

    // Try API first, fall back to canned responses
    try {
      const response = await fetch('/api/atlas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          companyContext: `Company: ${company.name}, Industry: ${company.industry}`,
        }),
      });

      if (!response.ok) throw new Error('API unavailable');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let assistantContent = '';

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantContent += parsed.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      // Fallback to canned responses — replace the empty placeholder, don't append
      const cannedResponse = getCannedResponse(text, resolvedKey);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: cannedResponse };
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, company, resolvedKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[70vh] sm:h-[500px] max-h-[500px] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-sunken/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-accent" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                    Atlas AI
                    <span className="text-ink-faint">&middot;</span>
                    <span className="text-[12px] font-normal text-ink-tertiary">{company.shortName}</span>
                  </div>
                  <div className="text-[10px] text-green font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-ink-tertiary hover:text-ink hover:bg-surface-sunken transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <p className="text-[13px] font-medium text-ink mb-1">How can I help?</p>
                  <p className="text-[11px] text-ink-tertiary">Ask me anything about your AI operations</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-accent text-white rounded-br-md'
                        : 'bg-surface-sunken text-ink rounded-bl-md'
                    }`}
                  >
                    {msg.content || (
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-surface-sunken rounded-2xl rounded-bl-md px-4 py-2.5">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            {messages.length === 0 && (
              <div className="px-5 pb-2 flex flex-wrap gap-1.5">
                {chips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium border border-border text-ink-secondary hover:bg-surface-sunken hover:border-border transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2 bg-surface-sunken rounded-xl px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask Atlas anything..."
                  className="flex-1 bg-transparent text-[13px] text-ink placeholder:text-ink-faint outline-none"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white disabled:opacity-30 transition-opacity hover:opacity-90"
                >
                  <Send className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/25 flex items-center justify-center text-white hover:shadow-xl hover:shadow-accent/30 transition-shadow group"
        initial={false}
        animate={!hasBounced ? {
          y: [0, -8, 0, -4, 0],
          transition: { duration: 1, delay: 0.5, ease: 'easeInOut' }
        } : {}}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5" strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div key="brain" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Brain className="w-5 h-5" strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI sparkle badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green flex items-center justify-center shadow-sm">
            <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
          </span>
        )}
      </motion.button>
    </>
  );
}
