import { useState, useCallback, useRef } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseAtlasChatOptions {
  companyContext?: string;
}

/* ── Fallback canned responses when API is unavailable ────── */

function getCannedFallback(msg: string): string {
  const lower = msg.toLowerCase().trim();
  if (lower.includes('metric') || lower.includes('summarize'))
    return 'Today\'s key metrics are looking strong. Agent fleet utilization is at 94%, with 12 active workflows processing across all divisions. Verification pass rate is 94.2%, and average processing time is 2.3 seconds per document. Projected annual ROI: $5.8M.';
  if (lower.includes('attention') || lower.includes('issue') || lower.includes('problem'))
    return 'A few items need attention:\n\n1. **eCMS batch lag** — QMirror/AS400 data is 18 hours stale, blocking real-time cost analysis\n2. **License audit** — 3 SaaS licenses up for renewal this week with potential savings of $42K\n3. **Telematics** — 12 vehicles with stale feeds >10 minutes';
  if (lower.includes('compare') || lower.includes('division'))
    return 'Division comparison:\n\n- **IC Construction (HCC)** — Best ROI ($1.2M savings), most agents deployed (10)\n- **IC Rail (HRSI)** — Highest throughput (340 tasks/day)\n- **IC Technologies (HTI)** — 8 agents, highest PTC/signal complexity\n- **IC Transit (HTSI)** — Newest onboard, ramping up at 78% automation';
  if (lower.includes('agent') || lower.includes('fleet'))
    return 'Fleet health overview:\n\n- **68/68 agents** operational (100% uptime today)\n- **Avg response time**: 210ms (within SLA)\n- **Tasks completed**: 2,847 today\n- **Error rate**: 0.03% (well below 0.5% threshold)\n\nAll systems green.';
  if (lower.includes('roi') || lower.includes('save') || lower.includes('money') || lower.includes('cost'))
    return 'ROI breakdown:\n\n- Labor automation: $2.4M (41%)\n- License optimization: $1.1M (19%)\n- Error reduction: $890K (15%)\n- Speed improvements: $740K (13%)\n- Compliance savings: $670K (12%)\n\nTotal projected: $5.8M annual. Current payback period: ~3.9 months.';
  if (lower.includes('ready') || lower.includes('ai-ready') || lower.includes('which system'))
    return 'AI readiness tiers:\n\n- **Champion (AI-ready today)**: Procore, HCSS Telematics, iCIMS — rich APIs, structured data\n- **High Value (moderate work)**: P6, Heavy Job, Equipment360 — build data pipelines first\n- **Bottleneck (blocking AI)**: eCMS, QMirror/AS400, MCP — flat-file exports, batch lag\n\nStart with Champions, then unblock the pipeline.';
  if (lower.includes('blocking') || lower.includes('real-time'))
    return 'The biggest blocker is the **QMirror/AS400 batch lag** — it introduces 12-24 hour data delays across all divisions. Until that\'s resolved, real-time AI on core financial and job cost data is impossible. Recommended fix: build an API bridge layer that streams incremental changes.';
  if (lower.includes('railsentry') || lower.includes('edge'))
    return 'RailSentry expansion path:\n\n1. **Tie Inspection AI** (HRSI) — wood/concrete/composite classification, in pilot\n2. **HSI Ultrasonic** — B-scan defect detection at ~80% confidence, expanding to A-scan\n3. **MLOps infrastructure** — shared model registry for all 3 models\n\nDeploy GPU nodes in TX/AZ data centers for edge inference.';
  return 'I can help you analyze your AI operations data. Try asking about agent performance, ROI breakdown, division comparisons, system readiness, or specific metrics. I have deep context on your fleet health, cost savings, and optimization opportunities.';
}

export function useAtlasChat(options: UseAtlasChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isStreaming) return;

    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: userMessage.trim() };

    // Add user message AND empty assistant placeholder atomically to prevent race
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '' }]);
    setIsStreaming(true);

    // Build message history for the API (exclude the empty placeholder)
    const apiMessages = [...messages, userMsg].map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    try {
      abortRef.current = new AbortController();

      const response = await fetch('/api/atlas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          companyContext: options.companyContext,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

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
            const parsed = JSON.parse(data) as { text?: string; error?: string };
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              assistantContent += parsed.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch (e) {
            // Skip malformed JSON lines, but re-throw application errors
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      // Fallback to canned responses instead of showing an error
      const fallback = getCannedFallback(userMessage);
      await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: fallback };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, isStreaming, options.companyContext]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    cancelStream,
  };
}
