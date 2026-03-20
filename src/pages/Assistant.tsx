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
    ],
    suggestions: [
      'Show X-Road AI integration plan',
      'Analyze ministry adoption rates',
      'Compare to EU digital benchmarks',
      'Generate digital government roadmap',
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
            <h1 className="text-[22px] font-semibold text-ink tracking-tight leading-none">AI Assistant</h1>
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
