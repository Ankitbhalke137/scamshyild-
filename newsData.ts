export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  region: string;
  publisher: string;
  publishedAt: string;
  category: 'phishing' | 'banking' | 'cyber-attack' | 'data-breach' | 'fraud';
}

export const fraudNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Major UPI Scam Ring Busted in Odisha - 50 Arrested',
    summary: 'Cyber crime police arrested 50 people running a fake UPI payment app that siphoned ₹12 crores from victims across India.',
    url: '#',
    region: 'Odisha',
    publisher: 'Cyber Crime Division',
    publishedAt: '2025-11-01',
    category: 'fraud',
  },
  {
    id: '2',
    title: 'Phishing Alert: Fake Income Tax Refund Messages',
    summary: 'CERT-In warns about widespread phishing campaign targeting taxpayers with fake refund links.',
    url: '#',
    region: 'National',
    publisher: 'CERT-In',
    publishedAt: '2025-10-30',
    category: 'phishing',
  },
  {
    id: '3',
    title: 'Banking Trojan Targets Indian Mobile Users',
    summary: 'New Android malware "BankBot-IN" discovered stealing OTPs and banking credentials from over 10,000 devices.',
    url: '#',
    region: 'National',
    publisher: 'NCIIPC',
    publishedAt: '2025-10-28',
    category: 'banking',
  },
  {
    id: '4',
    title: 'Cyber Police Issues Warning on Loan App Scams',
    summary: 'Multiple complaints received about instant loan apps charging hidden fees and threatening customers.',
    url: '#',
    region: 'Maharashtra',
    publisher: 'Mumbai Police Cyber Cell',
    publishedAt: '2025-10-25',
    category: 'fraud',
  },
  {
    id: '5',
    title: 'Data Breach: 2 Million Users Affected in E-commerce Hack',
    summary: 'Major Indian e-commerce platform confirms data breach exposing customer phone numbers and addresses.',
    url: '#',
    region: 'National',
    publisher: 'CERT-In',
    publishedAt: '2025-10-22',
    category: 'data-breach',
  },
  {
    id: '6',
    title: 'WhatsApp Scam: Fake Customer Care Numbers',
    summary: 'Scammers impersonating customer care executives are stealing money through remote access apps.',
    url: '#',
    region: 'Karnataka',
    publisher: 'Bengaluru Cyber Crime',
    publishedAt: '2025-10-20',
    category: 'phishing',
  },
  {
    id: '7',
    title: 'SIM Swap Fraud Cases Rise by 300% in Q3 2025',
    summary: 'Telecom operators and banks collaborate to prevent unauthorized SIM replacements after surge in fraud cases.',
    url: '#',
    region: 'National',
    publisher: 'Department of Telecom',
    publishedAt: '2025-10-18',
    category: 'banking',
  },
  {
    id: '8',
    title: 'Crypto Investment Scam Dupes 500+ in Odisha',
    summary: 'Fake cryptocurrency investment platform promises 300% returns, disappears with ₹8 crore investment.',
    url: '#',
    region: 'Odisha',
    publisher: 'Economic Offences Wing',
    publishedAt: '2025-10-15',
    category: 'fraud',
  },
];
