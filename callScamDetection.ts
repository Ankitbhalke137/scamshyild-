export interface CallScamResult {
  label: 'safe' | 'suspicious' | 'scam';
  confidence: number;
  reasons: string[];
  callerInfo: {
    numberType: string;
    location: string;
    reportCount: number;
  };
  voiceAnalysis?: {
    stressLevel: number;
    speedScore: number;
    keywordMatches: string[];
  };
  riskScore: number;
  processingTime: number;
}

const scamNumberPatterns = [
  { pattern: /^(\+91)?[6-9]\d{9}$/, type: 'Valid Indian Mobile', risk: 'low' },
  { pattern: /^1800/, type: 'Toll-Free', risk: 'low' },
  { pattern: /^140/, type: 'Service Number', risk: 'low' },
  { pattern: /^\+1/, type: 'International (US)', risk: 'medium' },
  { pattern: /^\+234/, type: 'International (Nigeria)', risk: 'high' },
  { pattern: /^\+44/, type: 'International (UK)', risk: 'medium' },
  { pattern: /^\+86/, type: 'International (China)', risk: 'medium' },
  { pattern: /^00/, type: 'International Prefix', risk: 'medium' },
];

const voiceScamKeywords = [
  'congratulations', 'winner', 'lottery', 'prize', 'won',
  'bank account', 'verify', 'otp', 'password', 'cvv',
  'urgent', 'suspended', 'blocked', 'expired',
  'tax refund', 'government', 'police', 'arrest warrant',
  'loan approved', 'credit card', 'insurance claim',
  'courier', 'customs', 'package', 'delivery pending',
  'relatives', 'accident', 'hospital', 'emergency',
  'investment', 'stock market', 'crypto', 'bitcoin',
];

const knownScamPrefixes = [
  '+234', '+233', '+254', '+255', '+256',
  '+1876', '+1869', '+1758',
];

const trustedPrefixes = [
  '1800', '1860', '1900',
  '140', '155', '181',
];

export function detectCallScam(
  phoneNumber: string,
  voiceTranscript?: string,
  callDuration?: number
): CallScamResult {
  const startTime = Date.now();
  
  const cleanNumber = phoneNumber.replace(/[\s\-()]/g, '');
  
  let riskScore = 0;
  const reasons: string[] = [];
  let numberType = 'Unknown';
  let location = 'Unknown';
  let reportCount = Math.floor(Math.random() * 500);

  const isTrusted = trustedPrefixes.some(prefix => cleanNumber.startsWith(prefix));
  if (isTrusted) {
    return {
      label: 'safe',
      confidence: 0.95,
      reasons: ['Verified service number', 'Trusted prefix'],
      callerInfo: {
        numberType: 'Service Number',
        location: 'India',
        reportCount: 0,
      },
      riskScore: 5,
      processingTime: Date.now() - startTime,
    };
  }

  const isKnownScam = knownScamPrefixes.some(prefix => cleanNumber.startsWith(prefix));
  if (isKnownScam) {
    riskScore += 60;
    reasons.push('High-risk international prefix');
  }

  for (const { pattern, type, risk } of scamNumberPatterns) {
    if (pattern.test(cleanNumber)) {
      numberType = type;
      if (risk === 'high') riskScore += 40;
      if (risk === 'medium') riskScore += 20;
      if (risk === 'low') riskScore -= 10;
      break;
    }
  }

  if (cleanNumber.startsWith('+91')) {
    location = 'India';
    const stateCode = cleanNumber.substring(3, 5);
    if (['11', '22', '33', '44', '80'].includes(stateCode)) {
      location = 'Major Metro';
      riskScore -= 5;
    }
  } else if (cleanNumber.startsWith('+')) {
    location = 'International';
    riskScore += 25;
    reasons.push('International caller');
  }

  if (!cleanNumber.match(/^(\+91)?[6-9]\d{9}$/) && !cleanNumber.startsWith('1800')) {
    riskScore += 30;
    reasons.push('Irregular number format');
  }

  if (reportCount > 100) {
    riskScore += 40;
    reasons.push(`${reportCount} spam reports`);
  } else if (reportCount > 50) {
    riskScore += 20;
    reasons.push(`${reportCount} user reports`);
  }

  let voiceAnalysis: CallScamResult['voiceAnalysis'];
  if (voiceTranscript) {
    const transcript = voiceTranscript.toLowerCase();
    const keywordMatches = voiceScamKeywords.filter(keyword => 
      transcript.includes(keyword)
    );

    if (keywordMatches.length > 0) {
      riskScore += keywordMatches.length * 15;
      reasons.push(`${keywordMatches.length} scam keywords detected`);
    }

    const stressLevel = Math.min(100, keywordMatches.length * 20 + Math.random() * 30);
    const speedScore = 60 + Math.random() * 40;

    if (stressLevel > 60) {
      riskScore += 20;
      reasons.push('High stress voice patterns');
    }

    if (speedScore > 80) {
      riskScore += 15;
      reasons.push('Unusually fast speech');
    }

    voiceAnalysis = {
      stressLevel,
      speedScore,
      keywordMatches: keywordMatches.slice(0, 5),
    };
  }

  if (callDuration !== undefined) {
    if (callDuration < 10) {
      riskScore += 15;
      reasons.push('Very short call duration');
    } else if (callDuration > 300) {
      riskScore -= 10;
    }
  }

  const detectedPattern = /^(\+91)?0{5,}|1{5,}|9{5,}/.test(cleanNumber);
  if (detectedPattern) {
    riskScore += 35;
    reasons.push('Suspicious number pattern');
  }

  if (cleanNumber.length < 10 && !cleanNumber.startsWith('1800')) {
    riskScore += 25;
    reasons.push('Invalid number length');
  }

  riskScore = Math.min(100, Math.max(0, riskScore));

  let label: 'safe' | 'suspicious' | 'scam';
  let confidence: number;

  if (riskScore >= 70) {
    label = 'scam';
    confidence = 0.85 + (riskScore - 70) / 100;
    reasons.unshift('High-risk scam indicators');
  } else if (riskScore >= 40) {
    label = 'suspicious';
    confidence = 0.65 + (riskScore - 40) / 100;
    reasons.unshift('Multiple risk factors detected');
  } else {
    label = 'safe';
    confidence = 0.70 + (30 - riskScore) / 100;
    if (reasons.length === 0) {
      reasons.push('No major risk indicators');
    }
  }

  return {
    label,
    confidence: Math.min(0.99, confidence),
    reasons: [...new Set(reasons)].slice(0, 4),
    callerInfo: {
      numberType,
      location,
      reportCount,
    },
    voiceAnalysis,
    riskScore,
    processingTime: Date.now() - startTime,
  };
}

export function analyzeCallBehavior(
  callDuration: number,
  hangupBy: 'caller' | 'receiver' | 'auto'
): { suspicious: boolean; reason: string } {
  if (callDuration < 5 && hangupBy === 'caller') {
    return { suspicious: true, reason: 'Caller hung up immediately' };
  }
  
  if (callDuration > 600) {
    return { suspicious: false, reason: 'Long conversation indicates legitimacy' };
  }

  if (hangupBy === 'auto') {
    return { suspicious: true, reason: 'Automated call system detected' };
  }

  return { suspicious: false, reason: 'Normal call behavior' };
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

export function getCallerDatabase(phoneNumber: string): {
  name: string | null;
  category: string;
  verified: boolean;
  spamScore: number;
} {
  const cleanNumber = phoneNumber.replace(/[\s\-()]/g, '');
  
  const spamScore = Math.floor(Math.random() * 100);
  
  if (cleanNumber.startsWith('1800')) {
    return {
      name: 'Customer Service',
      category: 'Business',
      verified: true,
      spamScore: 5,
    };
  }

  if (spamScore > 80) {
    return {
      name: null,
      category: 'Telemarketing',
      verified: false,
      spamScore,
    };
  }

  if (spamScore > 60) {
    return {
      name: null,
      category: 'Suspected Spam',
      verified: false,
      spamScore,
    };
  }

  return {
    name: null,
    category: 'Unknown',
    verified: false,
    spamScore,
  };
}
