import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Brain, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompany } from '../data/CompanyContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTION_CHIPS: Record<string, string[]> = {
  '/overview': ['Summarize today\'s metrics', 'What needs attention?', 'Compare divisions'],
  '/agents': ['Which agent saved the most today?', 'Any agent issues?', 'Show fleet health'],
  '/impact': ['Break down the $5.8M', 'What\'s the payback period?', 'Compare to industry'],
  '/assessment': ['What\'s our biggest waste?', 'License optimization options', 'Migration risks'],
  '/operations': ['Which workflows are bottlenecked?', 'Show automation rate', 'Any failures today?'],
  '/intelligence': ['Summarize latest insights', 'What patterns do you see?', 'Data quality issues?'],
  '/verification': ['Any pending verifications?', 'Show audit trail', 'Compliance status?'],
  '/reliability': ['Current error rates?', 'SLA compliance?', 'Incident trends?'],
};

const DEFAULT_CHIPS = ['Summarize today\'s metrics', 'What needs attention?', 'Show me key insights', 'Compare divisions'];

const CANNED_RESPONSES: Record<string, string> = {
  'summarize today\'s metrics': 'Today\'s key metrics are looking strong. Agent fleet utilization is at 94%, with 12 active workflows processing across 7 divisions. Total cost savings have reached $5.8M YTD, up 12% from last month. The verification pass rate is 98.2%, and average processing time has dropped to 2.3 seconds per document.',
  'what needs attention?': 'A few items need your attention:\n\n1. **Division 3 (IC Rail)** — Agent response times spiked 15% in the last hour, likely due to a data pipeline backlog\n2. **License audit** — 3 SaaS licenses are up for renewal this week with potential savings of $42K\n3. **Verification queue** — 23 documents pending manual review, up from the usual 8-12 range',
  'compare divisions': 'Here\'s the division comparison:\n\n- **IC Rail** — Highest throughput (340 tasks/day), 97% automation rate\n- **IC Construction** — Best ROI ($1.2M savings), fastest adoption\n- **IC Technologies** — Most agents deployed (8), highest complexity\n- **IC Transit** — Newest onboard, ramping up quickly at 78% automation\n\nOverall, Construction leads in value generation while Rail leads in volume.',
  'which agent saved the most today?': 'The **Invoice Processing Agent** leads today with $12,400 in savings across 847 processed invoices. Close behind is the **Contract Analysis Agent** at $8,200 from 23 contracts reviewed. The fleet collectively has saved $34,600 today.',
  'any agent issues?': 'All agents are healthy with one minor exception:\n\n- **Document Classifier v2.1** is showing slightly elevated latency (avg 340ms vs normal 180ms) since 2:15 PM. Root cause appears to be increased document queue depth. No errors or failures detected — just slower than usual. Should self-resolve as the queue drains.',
  'show fleet health': 'Fleet health overview:\n\n- **12/12 agents** operational (100% uptime today)\n- **Avg response time**: 210ms (within SLA)\n- **Tasks completed**: 2,847 today\n- **Error rate**: 0.03% (well below 0.5% threshold)\n- **Queue depth**: Normal across all agents\n\nAll systems green. No intervention needed.',
  'break down the $5.8m': 'The $5.8M ROI breaks down as follows:\n\n- **Labor automation**: $2.4M (41%) — Reduced manual processing across divisions\n- **License optimization**: $1.1M (19%) — Eliminated redundant SaaS subscriptions\n- **Error reduction**: $890K (15%) — Fewer costly mistakes in document processing\n- **Speed improvements**: $740K (13%) — Faster turnaround on time-sensitive tasks\n- **Compliance savings**: $670K (12%) — Avoided penalties and audit costs',
  'what\'s the payback period?': 'The payback period analysis:\n\n- **Initial investment**: $2.8M (platform + integration + training)\n- **Monthly value generated**: ~$717K ($8.6M gross / 12)\n- **Payback achieved**: ~3.9 months\n- **Current ROI multiple**: 2.07x\n- **Projected Year 2**: $8.7M cumulative value\n\nYou\'re well past breakeven and accelerating.',
  'compare to industry': 'Compared to industry benchmarks:\n\n- **Automation rate**: 94% vs industry avg 62% — **Top 5%**\n- **AI adoption speed**: 3 months to full deployment vs avg 9 months\n- **ROI multiple**: 2.07x vs industry avg 1.4x\n- **Error rate**: 0.03% vs industry avg 1.2%\n- **Agent uptime**: 99.97% vs industry avg 98.5%\n\nYou\'re significantly outperforming peers in construction/infrastructure.',
  'what\'s our biggest waste?': 'The biggest areas of waste identified:\n\n1. **Duplicate SaaS licenses** — $340K/yr across divisions using overlapping tools\n2. **Manual data entry** — Estimated 2,100 hours/month still done manually\n3. **Report generation** — 45 hours/week spent on reports that could be automated\n4. **Context switching** — Teams averaging 12 tool switches per workflow\n\nThe SaaS consolidation alone could save $340K within 60 days.',
  'license optimization options': 'License optimization opportunities:\n\n- **Consolidate 3 project management tools** → Save $180K/yr by standardizing on one\n- **Right-size Salesforce licenses** → 40% of seats are underutilized, save $95K/yr\n- **Eliminate redundant storage** → 3 overlapping cloud storage services, save $65K/yr\n- **Renegotiate enterprise agreements** → Volume discount potential of $120K/yr\n\nTotal addressable: **$460K/yr** in license savings.',
  'migration risks': 'Key migration risks to consider:\n\n1. **Data integrity** (Medium) — Cross-system data mapping needs validation for 3 legacy systems\n2. **User adoption** (Low) — Training programs are showing 92% completion rate\n3. **Integration downtime** (Low) — Estimated 2-hour maintenance window per system\n4. **Compliance continuity** (Low) — All audit trails preserved during migration\n\nOverall risk profile is **low**. The phased approach mitigates most concerns.',
};

function getCannedResponse(message: string): string {
  const lower = message.toLowerCase().trim();
  // Check for exact or close matches
  for (const [key, response] of Object.entries(CANNED_RESPONSES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return response;
    }
  }
  // Keyword-based fallback
  if (lower.includes('agent')) return CANNED_RESPONSES['show fleet health'];
  if (lower.includes('save') || lower.includes('roi') || lower.includes('money')) return CANNED_RESPONSES['break down the $5.8m'];
  if (lower.includes('risk') || lower.includes('issue') || lower.includes('problem')) return CANNED_RESPONSES['what needs attention?'];
  if (lower.includes('compare') || lower.includes('benchmark')) return CANNED_RESPONSES['compare to industry'];
  if (lower.includes('license') || lower.includes('saas')) return CANNED_RESPONSES['license optimization options'];
  if (lower.includes('waste') || lower.includes('optimize')) return CANNED_RESPONSES['what\'s our biggest waste?'];

  return 'I can help you analyze your AI operations data. Try asking about agent performance, ROI breakdown, division comparisons, or specific metrics. I have deep context on your fleet health, cost savings, and optimization opportunities.';
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

  const chips = SUGGESTION_CHIPS[location.pathname] || DEFAULT_CHIPS;

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
      const response = getCannedResponse(text);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: response };
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, company]);

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
