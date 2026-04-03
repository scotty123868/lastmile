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
          { text: "Here are the **top 5 savings opportunities** identified across Herzog's seven divisions, ranked by projected annual impact:" },
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
        content: [{ text: "What's the biggest opportunity across Herzog's divisions?" }],
      },
      {
        role: 'ai',
        content: [
          { text: "The **single biggest opportunity** is cross-division visibility. Right now, each of Herzog's seven divisions operates its own data systems independently:" },
          {
            list: [
              "**$2.8M in license waste** \u2014 Duplicate eCMS, HCSS, SAP Business Objects, and Kronos/UKG licenses across HCC, HRSI, HSI, HTI, HTSI, HE, and corporate. At least 320 licenses are inactive or redundant across division boundaries.",
              "**Crew and equipment sharing between HCC and HTSI** \u2014 Construction crews and signal/communication technicians often work adjacent corridors for the same Class I railroads but are dispatched independently. Cross-division crew optimization could save **$1.12M annually** and reduce mobilization time by 40%.",
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
              "**Compliance and security** \u2014 All P6 data remains within Herzog's network perimeter. The connector runs on-premise and communicates with the AI platform via encrypted API calls. Audit logs track every data pull with timestamps, record counts, and the service account used. Your P6 admin retains full control over which projects and fields are exposed to the connector.",
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
          { text: "Here's the **AI readiness ranking** across Herzog's seven divisions:" },
          {
            table: {
              headers: ['Division', 'Readiness Score', 'Key Strength', 'Primary Gap', 'Recommended First Use Case'],
              rows: [
                ['HSI (Inspections)', '42/100', 'Richest ultrasonic + LIDAR data', 'Manual analysis bottleneck', 'AI defect classification'],
                ['HRSI (Rail Services)', '38/100', 'Large crew data history', 'Legacy dispatch system', 'Crew optimization'],
                ['HTI (Track)', '36/100', 'Signal system diagnostics', 'Fragmented data formats', 'Signal anomaly detection'],
                ['HTSI (Signal/Comm)', '35/100', 'PTC compliance data', 'Paper-based field reports', 'Digital work orders'],
                ['HE (Energy)', '34/100', 'Grid interconnection data', 'Limited IoT sensors', 'Predictive maintenance'],
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
          { text: "This is one of the most important questions for any AI deployment in safety-critical rail operations. Herzog's system is designed with a **reliability testing pyramid** that catches errors before they reach production decisions:" },
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
    messages: [],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
    ],
  },
  'nb-energy': {
    messages: [],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
    ],
  },
  'nb-financial': {
    messages: [],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
    ],
  },
  'nb-health': {
    messages: [],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
    ],
  },
  'ee-finance': {
    messages: [],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
    ],
  },
  'ee-social': {
    messages: [],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
    ],
  },
  'ee-economic': {
    messages: [],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
    ],
  },
  'ee-ria': {
    messages: [],
    suggestions: [
      'Show RailSentry data integration gaps',
      'Compare crew dispatch optimization options',
      "What's our FRA compliance readiness?",
      'Generate fleet utilization report for Q1',
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
