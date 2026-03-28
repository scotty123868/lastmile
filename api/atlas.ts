import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `You are Atlas, an AI assistant for UpSkiller deployed at Herzog Companies. You have detailed knowledge of Herzog's software stack, license costs, workflow automation opportunities, and AI agent deployment across all 7 divisions.

Answer questions specifically about their data. Be concise, specific, and cite numbers from the data provided. Use markdown bold (**text**) for emphasis on key figures and terms.

Here is the company data you have access to:

COMPANY PROFILE:
- Name: Herzog Companies
- Industry: Railroad & Infrastructure Construction
- Employees: 2,800
- Divisions: 7 (Herzog Contracting Corp, Herzog Railroad Services, Herzog Services, Herzog Technologies, Herzog Transit Services, Herzog Energy, Green Group LLC)

DIVISION DETAILS:
- HCC (Herzog Contracting): 1,200 employees, Rail & Highway Construction — heavy civil construction across 36 states
- HRSI (Herzog Railroad Services): 380 employees, Railroad Maintenance & Equipment — ballast maintenance, track renewal
- HSI (Herzog Services): 220 employees, Ultrasonic Rail Testing — non-destructive rail flaw detection, FRA compliance
- HTI (Herzog Technologies): 310 employees, Signal & PTC Systems — Positive Train Control, signal design
- HTSI (Herzog Transit Services): 480 employees, Passenger Rail Operations — commuter and intercity rail
- Herzog Energy: 120 employees, Energy Infrastructure — solar, wind, and energy construction
- Green Group LLC: 90 employees, Environmental Services — remediation, compliance monitoring

AI AGENTS DEPLOYED (27 total):
Shared Platform: Atlas (Personal AI Assistant), Chief (Executive Briefing), Ledger (License Waste Scanner), Relay (Meeting Intelligence), Signal (Communications Intelligence)
HCC: Dispatch (HOS Compliance), Foreman (Equipment Dispatch), Blueprint (Project Estimation), Surveyor (GPS Fleet)
HRSI: Scout (Track Defect Early Warning), Mechanic (Predictive Maintenance), Stockroom (Parts Inventory), Ballast (Material Logistics)
HSI: RailSentry (AI Rail Inspection — 94.2% accuracy), Inspector (Testing Schedule), Calibrator (Equipment Calibration)
HTI: Sentinel (Signal System Health), Integrator (PTC Installation), Compliance (FRA Signal Compliance)
HTSI: Router (Transit Schedule), Conductor (Crew Rostering), Passenger (Ridership Forecasting), Safety (Incident Tracking)
Herzog Energy: GridWatch (Asset Health), Permit (Environmental Permits)
Green Group: Remediation (Cleanup Tracking), Monitor (Environmental Compliance)

KEY METRICS:
- License waste identified: $47K/month ($564K/yr)
- Equipment tracked: 340 units across HCC
- Track miles monitored: 4,200
- FRA compliance rate: 99.8%
- Crew scheduling: 22% overtime reduction
- RailSentry accuracy: 94.2% defect detection
- Signal uptime: 99.97%

RELIABILITY & TRUST:
- AI Trust Score: 94.2% overall
- FRA geometry exception classification: 96.8% accuracy
- False positive rate: 3.1% (target <5%)
- False negative rate: 0.4% (critical threshold <1%)
- Three-tier validation: Tier 1 (automated FRA threshold check), Tier 2 (statistical anomaly detection), Tier 3 (human review for <90% confidence)
- 78% of classifications clear Tier 1 automatically, 18% need Tier 2, 4% escalate to human review`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
  }

  const { messages, companyContext } = req.body as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    companyContext?: string;
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const systemPrompt = companyContext
    ? `${SYSTEM_PROMPT}\n\nADDITIONAL CONTEXT FOR CURRENT COMPANY/DIVISION:\n${companyContext}`
    : SYSTEM_PROMPT;

  try {
    const client = new Anthropic({ apiKey });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Atlas API error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to get response from AI' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
}
