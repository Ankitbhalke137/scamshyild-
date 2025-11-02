import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings, Globe, Volume2, Link as LinkIcon, Upload } from 'lucide-react';
import { getTranslation, Language } from '../lib/translations';
import { Badge } from './ui/badge';

interface SettingsScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  settings: {
    voiceAssistant: boolean;
    blockchainLog: boolean;
    ipfsUpload: boolean;
  };
  onSettingsChange: (key: string, value: boolean) => void;
}

export function SettingsScreen({ 
  language, 
  onLanguageChange, 
  settings, 
  onSettingsChange 
}: SettingsScreenProps) {
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-3 rounded-xl">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">{t('settings')}</h2>
          <p className="text-xs text-gray-500">Customize app</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <Globe className="mr-2 h-4 w-4" />
            {t('language')}
          </CardTitle>
          <CardDescription className="text-xs">Choose language</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={(val) => onLanguageChange(val as Language)}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇬🇧 {t('english')}</SelectItem>
              <SelectItem value="hi">🇮🇳 {t('hindi')}</SelectItem>
              <SelectItem value="or">🇮🇳 {t('odia')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Detection Settings</CardTitle>
          <CardDescription className="text-xs">Configure scam detection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <Label htmlFor="voice" className="text-sm">{t('voiceAssistant')}</Label>
              </div>
              <p className="text-xs text-gray-500">
                TTS announcements
              </p>
            </div>
            <Switch
              id="voice"
              checked={settings.voiceAssistant}
              onCheckedChange={(checked) => onSettingsChange('voiceAssistant', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-gray-500" />
                <Label htmlFor="blockchain" className="text-sm">{t('blockchainLog')}</Label>
              </div>
              <p className="text-xs text-gray-500">
                Log to Polygon
              </p>
            </div>
            <Switch
              id="blockchain"
              checked={settings.blockchainLog}
              onCheckedChange={(checked) => onSettingsChange('blockchainLog', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-gray-500" />
                <Label htmlFor="ipfs" className="text-sm">{t('ipfsUpload')}</Label>
              </div>
              <p className="text-xs text-gray-500">
                Upload to IPFS
              </p>
            </div>
            <Switch
              id="ipfs"
              checked={settings.ipfsUpload}
              onCheckedChange={(checked) => onSettingsChange('ipfsUpload', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Model Info</CardTitle>
          <CardDescription className="text-xs">Detection engine</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Model</span>
            <Badge variant="outline" className="text-xs">IndicBERTv2</Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Languages</span>
            <div className="flex gap-1">
              <Badge variant="secondary" className="text-xs">EN</Badge>
              <Badge variant="secondary" className="text-xs">HI</Badge>
              <Badge variant="secondary" className="text-xs">OR</Badge>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Processing</span>
            <Badge className="bg-green-600 text-xs">On-Device</Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Version</span>
            <Badge variant="outline" className="text-xs">v2.0.1</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-900 text-sm">🔐 Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-blue-800">
          <p>✓ Local processing</p>
          <p>✓ No data sent to servers</p>
          <p>✓ End-to-end encryption</p>
          <p>✓ Blockchain evidence trail</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-gray-600">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Platform:</strong> Web Demo</p>
          <p><strong>Tech:</strong> React, TFLite, Polygon, IPFS</p>
          <p className="pt-2 text-xs text-gray-500">
            Privacy by Technology, Not by Trust 🔐
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
