import { detectScam, ScamDetectionResult } from './scamDetection';
import { detectCallScam, CallScamResult } from './callScamDetection';

export interface IncomingCall {
  id: string;
  phoneNumber: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
  status: 'ringing' | 'answered' | 'missed' | 'blocked';
}

export interface IncomingSMS {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  status: 'received' | 'blocked';
}

export interface MonitoringAlert {
  id: string;
  type: 'call' | 'sms';
  severity: 'safe' | 'suspicious' | 'scam';
  timestamp: Date;
  details: string;
  phoneNumber?: string;
  message?: string;
  blocked: boolean;
}

const callExamples = [
  { number: '+2349012345678', name: 'Unknown', type: 'scam' },
  { number: '+919876543210', name: 'Contact', type: 'safe' },
  { number: '+11234567890', name: 'Unknown', type: 'suspicious' },
  { number: '18001234567', name: 'Customer Service', type: 'safe' },
  { number: '+447123456789', name: 'UK Caller', type: 'suspicious' },
];

const smsExamples = [
  "Congratulations! You've won ₹10,00,000. Click here: bit.ly/claim123",
  "Your Amazon order #1234 has been shipped and will arrive tomorrow.",
  "URGENT: Your bank account suspended. Verify OTP 123456 within 24 hours.",
  "Hi! Meeting at 5 PM today. See you there!",
  "Your tax refund of ₹50,000 is ready. Claim now at gov-refund.xyz",
  "Reminder: Your appointment is scheduled for tomorrow at 10 AM.",
];

export class MonitoringService {
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private callCallback: ((call: IncomingCall, result: CallScamResult) => void) | null = null;
  private smsCallback: ((sms: IncomingSMS, result: ScamDetectionResult) => void) | null = null;
  private autoBlockEnabled = false;

  startMonitoring(
    onCallDetected: (call: IncomingCall, result: CallScamResult) => void,
    onSMSDetected: (sms: IncomingSMS, result: ScamDetectionResult) => void,
    autoBlock = false
  ) {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.autoBlockEnabled = autoBlock;
    this.callCallback = onCallDetected;
    this.smsCallback = onSMSDetected;

    this.monitoringInterval = setInterval(() => {
      const shouldSimulate = Math.random() > 0.7;
      
      if (shouldSimulate) {
        const isCall = Math.random() > 0.5;
        
        if (isCall) {
          this.simulateIncomingCall();
        } else {
          this.simulateIncomingSMS();
        }
      }
    }, 8000);
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  isActive() {
    return this.isMonitoring;
  }

  private simulateIncomingCall() {
    const example = callExamples[Math.floor(Math.random() * callExamples.length)];
    
    const call: IncomingCall = {
      id: `call-${Date.now()}`,
      phoneNumber: example.number,
      timestamp: new Date(),
      type: 'incoming',
      status: 'ringing',
    };

    const result = detectCallScam(example.number);

    if (this.autoBlockEnabled && result.label === 'scam') {
      call.status = 'blocked';
    }

    if (this.callCallback) {
      this.callCallback(call, result);
    }
  }

  private simulateIncomingSMS() {
    const message = smsExamples[Math.floor(Math.random() * smsExamples.length)];
    const sender = callExamples[Math.floor(Math.random() * callExamples.length)].number;

    const sms: IncomingSMS = {
      id: `sms-${Date.now()}`,
      sender,
      message,
      timestamp: new Date(),
      status: 'received',
    };

    const result = detectScam(message);

    if (this.autoBlockEnabled && result.label === 'scam') {
      sms.status = 'blocked';
    }

    if (this.smsCallback) {
      this.smsCallback(sms, result);
    }
  }
}

export const monitoringService = new MonitoringService();
