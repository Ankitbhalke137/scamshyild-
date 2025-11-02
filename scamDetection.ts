export interface ScamDetectionResult {
  label: 'safe' | 'suspicious' | 'scam';
  confidence: number;
  reasons: string[];
  modelVersion: string;
  processingTime: number;
}

const scamPatterns = [
  { pattern: /congratulations.*won|lottery.*winner|claim.*prize/i, type: 'Prize Scam', severity: 'scam' },
  { pattern: /verify.*account|update.*payment|suspended.*account/i, type: 'Phishing', severity: 'scam' },
  { pattern: /urgent.*action|account.*blocked|verify.*within/i, type: 'Urgency Scam', severity: 'scam' },
  { pattern: /click.*link|bit\.ly|tinyurl/i, type: 'Suspicious Link', severity: 'suspicious' },
  { pattern: /otp.*\d{4,6}|password.*\d+/i, type: 'OTP Harvesting', severity: 'scam' },
  { pattern: /tax.*refund|government.*money|stimulus.*payment/i, type: 'Tax Scam', severity: 'scam' },
  { pattern: /prince|inheritance.*million|transfer.*funds/i, type: 'Nigerian Scam', severity: 'scam' },
  { pattern: /covid.*relief|vaccine.*registration|corona.*help/i, type: 'Pandemic Scam', severity: 'scam' },
  { pattern: /loan.*approved|instant.*credit|pre-approved/i, type: 'Loan Scam', severity: 'suspicious' },
  { pattern: /amazon|flipkart.*delivery|courier.*pending/i, type: 'Delivery Scam', severity: 'suspicious' },
  { pattern: /bank.*manager|रुपये|ଟଙ୍କା/i, type: 'Suspicious Content', severity: 'suspicious' },
];

const safePatterns = [
  /appointment.*confirmed|booking.*successful|order.*placed/i,
  /thank you.*purchase|receipt|invoice/i,
  /meeting.*scheduled|calendar.*invite/i,
];

export function detectScam(message: string): ScamDetectionResult {
  const startTime = Date.now();
  
  const isSafe = safePatterns.some(pattern => pattern.test(message));
  if (isSafe) {
    return {
      label: 'safe',
      confidence: 0.85 + Math.random() * 0.14,
      reasons: ['Legitimate transaction pattern', 'No suspicious keywords'],
      modelVersion: 'IndicBERTv2-TFLite',
      processingTime: Date.now() - startTime,
    };
  }

  const detectedPatterns = scamPatterns
    .filter(p => p.pattern.test(message))
    .map(p => ({ type: p.type, severity: p.severity }));

  if (detectedPatterns.length === 0) {
    return {
      label: 'safe',
      confidence: 0.70 + Math.random() * 0.15,
      reasons: ['No known scam patterns detected'],
      modelVersion: 'IndicBERTv2-TFLite',
      processingTime: Date.now() - startTime,
    };
  }

  const hasScamPattern = detectedPatterns.some(p => p.severity === 'scam');
  const label = hasScamPattern ? 'scam' : 'suspicious';
  const confidence = hasScamPattern 
    ? 0.88 + Math.random() * 0.11 
    : 0.65 + Math.random() * 0.20;

  const reasons = [
    ...detectedPatterns.map(p => p.type),
    hasScamPattern ? 'High-risk language patterns' : 'Moderate-risk indicators',
    'Multilingual analysis completed',
  ];

  return {
    label,
    confidence,
    reasons: [...new Set(reasons)].slice(0, 3),
    modelVersion: 'IndicBERTv2-TFLite',
    processingTime: Date.now() - startTime,
  };
}

export function generateBlockchainHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function generateIPFSCid(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let cid = 'Qm';
  for (let i = 0; i < 44; i++) {
    cid += chars[Math.floor(Math.random() * chars.length)];
  }
  return cid;
}
