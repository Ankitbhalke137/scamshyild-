import { Card, CardContent } from './ui/card';
import { Shield, MessageSquare, Phone, Lock, Newspaper, TrendingUp } from 'lucide-react';
import { getTranslation, Language } from '../lib/translations';
import { Badge } from './ui/badge';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  language: Language;
  stats: {
    totalScans: number;
    scamsBlocked: number;
    accountsFrozen: number;
  };
}

export function Dashboard({ onNavigate, language, stats }: DashboardProps) {
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">{t('welcome')}</h1>
        <p className="text-gray-500 mt-1 text-sm">{t('tagline')}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 px-3">
            <div className="text-center">
              <div className="bg-blue-100 p-2 rounded-lg inline-block mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500">{t('totalScans')}</p>
              <p className="text-xl mt-1">{stats.totalScans}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 px-3">
            <div className="text-center">
              <div className="bg-red-100 p-2 rounded-lg inline-block mb-2">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-xs text-gray-500">{t('scamsBlocked')}</p>
              <p className="text-xl mt-1">{stats.scamsBlocked}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 px-3">
            <div className="text-center">
              <div className="bg-orange-100 p-2 rounded-lg inline-block mb-2">
                <Lock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500">{t('accountsFrozen')}</p>
              <p className="text-xl mt-1">{stats.accountsFrozen}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg">Quick Actions</h2>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('scan')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base">{t('scanMessage')}</h3>
                <p className="text-xs text-gray-500">Analyze SMS with AI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('callscan')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base">{t('scanCall')}</h3>
                <p className="text-xs text-gray-500">AI caller verification</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-green-50 to-emerald-50" onClick={() => onNavigate('monitor')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base">Real-Time Monitor</h3>
                <p className="text-xs text-gray-500">Auto-scan incoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('freeze')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base">{t('freezeAccount')}</h3>
                <p className="text-xs text-gray-500">Secure accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('news')}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base">{t('fraudNews')}</h3>
                <p className="text-xs text-gray-500">Security alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-cyan-500 to-green-400 text-white border-0">
        <CardContent className="p-4">
          <h3 className="text-base mb-2">🔐 Protection Active</h3>
          <p className="text-xs text-cyan-50 mb-3">
            IndicBERTv2 • On-device • Blockchain verified
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
              Odia
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
              Hindi
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
              Offline
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
              Encrypted
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
