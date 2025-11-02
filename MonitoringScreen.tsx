import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Shield, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Ban,
  Activity
} from 'lucide-react';
import { monitoringService, IncomingCall, IncomingSMS, MonitoringAlert } from '../lib/monitoringService';
import { CallScamResult } from '../lib/callScamDetection';
import { ScamDetectionResult } from '../lib/scamDetection';
import { getTranslation, Language } from '../lib/translations';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';

interface MonitoringScreenProps {
  language: Language;
  onStatsUpdate: (scamsBlocked: number) => void;
}

export function MonitoringScreen({ language, onStatsUpdate }: MonitoringScreenProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoBlock, setAutoBlock] = useState(true);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [recentCalls, setRecentCalls] = useState<(IncomingCall & { result: CallScamResult })[]>([]);
  const [recentSMS, setRecentSMS] = useState<(IncomingSMS & { result: ScamDetectionResult })[]>([]);

  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    return () => {
      monitoringService.stopMonitoring();
    };
  }, []);

  const handleCallDetected = (call: IncomingCall, result: CallScamResult) => {
    setRecentCalls(prev => [{ ...call, result }, ...prev].slice(0, 10));

    const alert: MonitoringAlert = {
      id: call.id,
      type: 'call',
      severity: result.label,
      timestamp: call.timestamp,
      details: `${result.label === 'scam' ? 'Scam' : result.label === 'suspicious' ? 'Suspicious' : 'Safe'} call from ${call.phoneNumber}`,
      phoneNumber: call.phoneNumber,
      blocked: call.status === 'blocked',
    };

    setAlerts(prev => [alert, ...prev].slice(0, 20));

    if (result.label === 'scam') {
      if (call.status === 'blocked') {
        toast.error('🚫 Scam Call Blocked!', {
          description: `${call.phoneNumber} - Risk: ${result.riskScore}%`,
          duration: 5000,
        });
        onStatsUpdate(1);
      } else {
        toast.warning('⚠️ Scam Call Detected!', {
          description: `${call.phoneNumber} - Risk: ${result.riskScore}%`,
          duration: 5000,
        });
      }
    } else if (result.label === 'suspicious') {
      toast.warning('⚠️ Suspicious Call', {
        description: call.phoneNumber,
        duration: 3000,
      });
    }
  };

  const handleSMSDetected = (sms: IncomingSMS, result: ScamDetectionResult) => {
    setRecentSMS(prev => [{ ...sms, result }, ...prev].slice(0, 10));

    const alert: MonitoringAlert = {
      id: sms.id,
      type: 'sms',
      severity: result.label,
      timestamp: sms.timestamp,
      details: `${result.label === 'scam' ? 'Scam' : result.label === 'suspicious' ? 'Suspicious' : 'Safe'} SMS from ${sms.sender}`,
      message: sms.message.slice(0, 50) + '...',
      blocked: sms.status === 'blocked',
    };

    setAlerts(prev => [alert, ...prev].slice(0, 20));

    if (result.label === 'scam') {
      if (sms.status === 'blocked') {
        toast.error('🚫 Scam SMS Blocked!', {
          description: `From ${sms.sender}`,
          duration: 5000,
        });
        onStatsUpdate(1);
      } else {
        toast.warning('⚠️ Scam SMS Detected!', {
          description: `From ${sms.sender}`,
          duration: 5000,
        });
      }
    } else if (result.label === 'suspicious') {
      toast.warning('⚠️ Suspicious Message', {
        description: `From ${sms.sender}`,
        duration: 3000,
      });
    }
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      monitoringService.stopMonitoring();
      setIsMonitoring(false);
      toast.info('Monitoring Stopped', {
        description: 'Real-time protection disabled',
      });
    } else {
      monitoringService.startMonitoring(handleCallDetected, handleSMSDetected, autoBlock);
      setIsMonitoring(true);
      toast.success('Monitoring Active', {
        description: 'Real-time protection enabled',
      });
    }
  };

  const getAlertIcon = (severity: string) => {
    if (severity === 'safe') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (severity === 'suspicious') return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getAlertColor = (severity: string) => {
    if (severity === 'safe') return 'bg-green-50 border-green-200';
    if (severity === 'suspicious') return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl ${isMonitoring ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-400'}`}>
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">Real-Time Monitor</h2>
          <p className="text-xs text-gray-500">
            {isMonitoring ? 'Protection Active' : 'Protection Inactive'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Protection Settings</CardTitle>
          <CardDescription className="text-xs">Configure auto-scan behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm">Real-Time Monitoring</Label>
              <p className="text-xs text-gray-500">Auto-scan calls & SMS</p>
            </div>
            <Switch
              checked={isMonitoring}
              onCheckedChange={toggleMonitoring}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm">Auto-Block Scams</Label>
              <p className="text-xs text-gray-500">Block detected threats</p>
            </div>
            <Switch
              checked={autoBlock}
              onCheckedChange={setAutoBlock}
              disabled={!isMonitoring}
            />
          </div>

          {isMonitoring && (
            <Alert className="bg-green-50 border-green-200">
              <Activity className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                Monitoring active. All incoming calls and SMS are being scanned in real-time.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isMonitoring && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-green-900">Monitoring Active</p>
            <p className="text-xs text-green-700">Scans: {recentCalls.length + recentSMS.length}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 px-3">
            <div className="text-center">
              <Phone className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Calls Scanned</p>
              <p className="text-xl mt-1">{recentCalls.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 px-3">
            <div className="text-center">
              <MessageSquare className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">SMS Scanned</p>
              <p className="text-xl mt-1">{recentSMS.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription className="text-xs">Live threat detection feed</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Shield className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No activity yet</p>
              <p className="text-xs">Enable monitoring to start</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="mt-0.5">{getAlertIcon(alert.severity)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={alert.type === 'call' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.type === 'call' ? (
                            <><Phone className="w-3 h-3 mr-1" />Call</>
                          ) : (
                            <><MessageSquare className="w-3 h-3 mr-1" />SMS</>
                          )}
                        </Badge>
                        {alert.blocked && (
                          <Badge variant="destructive" className="text-xs">
                            <Ban className="w-3 h-3 mr-1" />Blocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs">{alert.details}</p>
                      {alert.message && (
                        <p className="text-xs text-gray-600 mt-1 italic">"{alert.message}"</p>
                      )}
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isMonitoring && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-900 text-sm">🛡️ How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-blue-800">
            <p>✓ Instant AI analysis on incoming calls</p>
            <p>✓ Real-time SMS scam detection</p>
            <p>✓ Auto-block high-risk threats</p>
            <p>✓ Zero lag, on-device processing</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
