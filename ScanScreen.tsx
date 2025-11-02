import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Loader2, Shield } from 'lucide-react';
import { detectScam, ScamDetectionResult, generateBlockchainHash, generateIPFSCid } from '../lib/scamDetection';
import { getTranslation, Language } from '../lib/translations';
import { hashSHA256 } from '../lib/encryption';
import { Progress } from './ui/progress';

interface ScanScreenProps {
  language: Language;
  onScanComplete: (result: ScamDetectionResult) => void;
  settings: {
    voiceAssistant: boolean;
    blockchainLog: boolean;
    ipfsUpload: boolean;
  };
}

export function ScanScreen({ language, onScanComplete, settings }: ScanScreenProps) {
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScamDetectionResult | null>(null);
  const [blockchainTx, setBlockchainTx] = useState<string | null>(null);
  const [ipfsCid, setIpfsCid] = useState<string | null>(null);

  const t = (key: string) => getTranslation(language, key);

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setBlockchainTx(null);
    setIpfsCid(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const scanResult = detectScam(message);
    setResult(scanResult);
    onScanComplete(scanResult);

    if (settings.voiceAssistant) {
      const announcement = `${t(scanResult.label)} detected with ${Math.round(scanResult.confidence * 100)}% confidence`;
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(announcement);
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'or' ? 'or-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }

    if (settings.blockchainLog && scanResult.label !== 'safe') {
      await new Promise(resolve => setTimeout(resolve, 800));
      setBlockchainTx(generateBlockchainHash());
    }

    if (settings.ipfsUpload && scanResult.label === 'scam') {
      await new Promise(resolve => setTimeout(resolve, 600));
      setIpfsCid(generateIPFSCid());
    }

    setIsAnalyzing(false);
  };

  const getResultIcon = () => {
    if (!result) return null;
    if (result.label === 'safe') return <CheckCircle className="w-7 h-7 text-green-600" />;
    if (result.label === 'suspicious') return <AlertTriangle className="w-7 h-7 text-yellow-600" />;
    return <AlertCircle className="w-7 h-7 text-red-600" />;
  };

  const getResultColor = () => {
    if (!result) return 'gray';
    if (result.label === 'safe') return 'green';
    if (result.label === 'suspicious') return 'yellow';
    return 'red';
  };

  const exampleMessages = [
    "Congratulations! You've won ₹10,00,000 in our lottery. Click here to claim: bit.ly/claim123",
    "Your bank account has been suspended. Verify within 24 hours or account will be closed permanently.",
    "Hi, your Amazon order #1234 has been shipped and will arrive tomorrow.",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-cyan-500 to-green-400 p-3 rounded-xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">{t('scanMessage')}</h2>
          <p className="text-xs text-gray-500">IndicBERTv2</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Paste Message</CardTitle>
          <CardDescription className="text-xs">Enter SMS or text to analyze</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder={t('pasteMessage')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="resize-none text-sm"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !message.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-green-400 hover:from-cyan-600 hover:to-green-500"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                {t('analyze')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className={`border-2 border-${getResultColor()}-500`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getResultIcon()}
                <div>
                  <CardTitle className={`text-base text-${getResultColor()}-700`}>
                    {t(result.label).toUpperCase()}
                  </CardTitle>
                  <p className="text-xs text-gray-500">
                    {t('confidence')}: {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <Badge 
                variant={result.label === 'safe' ? 'default' : 'destructive'}
                className={`text-xs ${result.label === 'safe' ? 'bg-green-600' : result.label === 'suspicious' ? 'bg-yellow-600' : ''}`}
              >
                v2.0
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Progress value={result.confidence * 100} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {result.processingTime}ms
              </p>
            </div>

            <div>
              <p className="text-xs mb-2">{t('reasons')}:</p>
              <div className="space-y-1">
                {result.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <AlertCircle className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-700">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {blockchainTx && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs mb-1">🔗 Blockchain Log</p>
                <p className="text-xs font-mono text-blue-700 break-all">{blockchainTx.slice(0, 40)}...</p>
              </div>
            )}

            {ipfsCid && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs mb-1">📦 IPFS Hash</p>
                <p className="text-xs font-mono text-purple-700 break-all">{ipfsCid.slice(0, 30)}...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Try Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {exampleMessages.map((example, i) => (
            <Button
              key={i}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 text-xs"
              onClick={() => setMessage(example)}
            >
              <div className="line-clamp-2">{example}</div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
