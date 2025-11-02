import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Loader2, Phone, Mic, Users } from 'lucide-react';
import { detectCallScam, CallScamResult, getCallerDatabase, generateBlockchainHash, generateIPFSCid } from '../lib/callScamDetection';
import { getTranslation, Language } from '../lib/translations';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';

interface CallScanScreenProps {
  language: Language;
  onScanComplete: (result: CallScamResult) => void;
  settings: {
    voiceAssistant: boolean;
    blockchainLog: boolean;
    ipfsUpload: boolean;
  };
}

export function CallScanScreen({ language, onScanComplete, settings }: CallScanScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CallScamResult | null>(null);
  const [blockchainTx, setBlockchainTx] = useState<string | null>(null);
  const [ipfsCid, setIpfsCid] = useState<string | null>(null);
  const [callerDb, setCallerDb] = useState<ReturnType<typeof getCallerDatabase> | null>(null);

  const t = (key: string) => getTranslation(language, key);

  const handleAnalyze = async () => {
    if (!phoneNumber.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setBlockchainTx(null);
    setIpfsCid(null);
    setCallerDb(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const scanResult = detectCallScam(
      phoneNumber,
      voiceTranscript || undefined,
      undefined
    );
    
    const dbResult = getCallerDatabase(phoneNumber);
    
    setResult(scanResult);
    setCallerDb(dbResult);
    onScanComplete(scanResult);

    if (settings.voiceAssistant) {
      const announcement = `${t(scanResult.label)} call detected with ${Math.round(scanResult.confidence * 100)}% confidence`;
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

  const exampleCalls = [
    { number: '+2349012345678', label: 'Nigerian Scam' },
    { number: '+919876543210', label: 'Indian Mobile' },
    { number: '18001234567', label: 'Toll-Free' },
    { number: '+11234567890', label: 'US Unknown' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">Call Scam Detection</h2>
          <p className="text-xs text-gray-500">AI-powered caller analysis</p>
        </div>
      </div>

      <Tabs defaultValue="number" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="number" className="text-sm">Phone Number</TabsTrigger>
          <TabsTrigger value="voice" className="text-sm">Voice Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="number" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Caller Details</CardTitle>
              <CardDescription className="text-xs">Enter phone number to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !phoneNumber.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Analyze Call
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Mic className="mr-2 h-4 w-4" />
                Voice Transcript
              </CardTitle>
              <CardDescription className="text-xs">Add call recording transcript for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="phone2" className="text-sm">Phone Number</Label>
                <Input
                  id="phone2"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transcript" className="text-sm">Voice Transcript</Label>
                <Textarea
                  id="transcript"
                  placeholder="Enter what the caller said..."
                  value={voiceTranscript}
                  onChange={(e) => setVoiceTranscript(e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !phoneNumber.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Voice...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Analyze with Voice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {callerDb && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Caller Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span>{callerDb.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <Badge variant="outline" className="text-xs">{callerDb.category}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Verified:</span>
              <Badge className={`text-xs ${callerDb.verified ? 'bg-green-600' : 'bg-gray-600'}`}>
                {callerDb.verified ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Spam Score:</span>
              <div className="flex items-center gap-2">
                <Progress value={callerDb.spamScore} className="h-2 w-20" />
                <span>{callerDb.spamScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                Risk: {result.riskScore}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Risk Score</span>
                <span>{result.riskScore}/100</span>
              </div>
              <Progress value={result.riskScore} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {result.processingTime}ms processing
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs mb-2">Caller Information:</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span>{result.callerInfo.numberType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span>{result.callerInfo.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reports:</span>
                  <span className={result.callerInfo.reportCount > 50 ? 'text-red-600' : ''}>
                    {result.callerInfo.reportCount}
                  </span>
                </div>
              </div>
            </div>

            {result.voiceAnalysis && (
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-xs mb-2">🎤 Voice AI Analysis:</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Stress Level</span>
                      <span>{result.voiceAnalysis.stressLevel.toFixed(0)}%</span>
                    </div>
                    <Progress value={result.voiceAnalysis.stressLevel} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Speech Speed</span>
                      <span>{result.voiceAnalysis.speedScore.toFixed(0)}%</span>
                    </div>
                    <Progress value={result.voiceAnalysis.speedScore} className="h-1.5" />
                  </div>
                  {result.voiceAnalysis.keywordMatches.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs text-gray-600 mb-1">Scam keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {result.voiceAnalysis.keywordMatches.map((keyword, i) => (
                          <Badge key={i} variant="destructive" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                <p className="text-xs mb-1">🔗 Blockchain Evidence</p>
                <p className="text-xs font-mono text-blue-700 break-all">{blockchainTx.slice(0, 40)}...</p>
              </div>
            )}

            {ipfsCid && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs mb-1">📦 IPFS Stored</p>
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
          {exampleCalls.map((example, i) => (
            <Button
              key={i}
              variant="outline"
              className="w-full justify-between text-left h-auto py-3 text-xs"
              onClick={() => {
                setPhoneNumber(example.number);
                setVoiceTranscript('');
              }}
            >
              <span>{example.number}</span>
              <Badge variant="outline" className="text-xs">{example.label}</Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-900 text-sm">🤖 AI Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-purple-800">
          <p>✓ Real-time caller ID verification</p>
          <p>✓ Voice pattern stress analysis</p>
          <p>✓ International scam database</p>
          <p>✓ Keyword detection in speech</p>
        </CardContent>
      </Card>
    </div>
  );
}
