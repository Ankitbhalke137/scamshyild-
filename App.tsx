import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ScanScreen } from './components/ScanScreen';
import { CallScanScreen } from './components/CallScanScreen';
import { MonitoringScreen } from './components/MonitoringScreen';
import { MonitoringWidget } from './components/MonitoringWidget';
import { FreezeAccount } from './components/FreezeAccount';
import { NewsScreen } from './components/NewsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Button } from './components/ui/button';
import { Home, Shield, Lock, Newspaper, Settings, LogOut, Menu, Phone, Activity } from 'lucide-react';
import { Language } from './lib/translations';
import { ScamDetectionResult } from './lib/scamDetection';
import { CallScamResult } from './lib/callScamDetection';
import { monitoringService } from './lib/monitoringService';
import { Toaster, toast } from 'sonner@2.0.3';
import logo from 'figma:asset/78a6bf560a6282d93bf2818b1a534c19b6c87bca.png';

type Screen = 'dashboard' | 'scan' | 'callscan' | 'monitor' | 'freeze' | 'news' | 'settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    voiceAssistant: true,
    blockchainLog: true,
    ipfsUpload: true,
  });
  const [stats, setStats] = useState({
    totalScans: 0,
    scamsBlocked: 0,
    accountsFrozen: 0,
  });
  const [showMonitoringWidget, setShowMonitoringWidget] = useState(false);
  const [monitoringScans, setMonitoringScans] = useState(0);

  useEffect(() => {
    const savedStats = localStorage.getItem('safecypher_stats');
    const savedLanguage = localStorage.getItem('safecypher_language');
    const savedSettings = localStorage.getItem('safecypher_settings');

    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedLanguage) setLanguage(savedLanguage as Language);
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('safecypher_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('safecypher_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('safecypher_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const checkMonitoring = setInterval(() => {
      const isActive = monitoringService.isActive();
      setShowMonitoringWidget(isActive && currentScreen !== 'monitor');
    }, 1000);

    return () => clearInterval(checkMonitoring);
  }, [currentScreen]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success('Welcome to Safe Cypher!', {
      description: 'Privacy by Technology, Not by Trust 🔐',
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('dashboard');
    toast.info('Logged out successfully');
  };

  const handleScanComplete = (result: ScamDetectionResult) => {
    setStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      scamsBlocked: result.label === 'scam' ? prev.scamsBlocked + 1 : prev.scamsBlocked,
    }));

    if (result.label === 'scam') {
      toast.error('Scam Detected!', {
        description: `Confidence: ${(result.confidence * 100).toFixed(1)}%`,
      });
    } else if (result.label === 'suspicious') {
      toast.warning('Suspicious Content', {
        description: 'Exercise caution with this message',
      });
    } else {
      toast.success('Message appears safe', {
        description: 'No scam patterns detected',
      });
    }
  };

  const handleCallScanComplete = (result: CallScamResult) => {
    setStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      scamsBlocked: result.label === 'scam' ? prev.scamsBlocked + 1 : prev.scamsBlocked,
    }));

    if (result.label === 'scam') {
      toast.error('Scam Call Detected!', {
        description: `Risk Score: ${result.riskScore}%`,
      });
    } else if (result.label === 'suspicious') {
      toast.warning('Suspicious Caller', {
        description: 'Exercise caution',
      });
    } else {
      toast.success('Caller appears safe', {
        description: 'No major risk indicators',
      });
    }
  };

  const handleAccountFrozen = () => {
    setStats(prev => ({
      ...prev,
      accountsFrozen: prev.accountsFrozen + 1,
    }));
    toast.success('Account freeze request submitted', {
      description: 'Your data is encrypted and secure',
    });
  };

  const handleSettingsChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'monitor', label: 'Monitor', icon: Activity },
    { id: 'scan', label: 'Message', icon: Shield },
    { id: 'callscan', label: 'Call', icon: Phone },
    { id: 'freeze', label: 'Freeze', icon: Lock },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} language={language} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      <Toaster position="top-center" richColors />
      
      <header className="bg-gradient-to-r from-cyan-500 to-green-400 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Safe Cypher" className="w-12 h-12 rounded-lg" />
              <div>
                <h1 className="text-lg">Safe Cypher</h1>
                <p className="text-xs text-cyan-50">ScamShield</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:bg-white/20"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="bg-white border-b shadow-lg">
          <nav className="px-4 py-2 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${isActive ? 'bg-gradient-to-r from-cyan-500 to-green-400' : ''}`}
                  onClick={() => handleNavigate(item.id as Screen)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </nav>
        </div>
      )}

      <main className="flex-1 px-4 py-6">
        {currentScreen === 'dashboard' && (
          <Dashboard 
            onNavigate={handleNavigate} 
            language={language}
            stats={stats}
          />
        )}
        {currentScreen === 'scan' && (
          <ScanScreen 
            language={language}
            onScanComplete={handleScanComplete}
            settings={settings}
          />
        )}
        {currentScreen === 'callscan' && (
          <CallScanScreen 
            language={language}
            onScanComplete={handleCallScanComplete}
            settings={settings}
          />
        )}
        {currentScreen === 'monitor' && (
          <MonitoringScreen 
            language={language}
            onStatsUpdate={(scamsBlocked) => {
              setStats(prev => ({
                ...prev,
                scamsBlocked: prev.scamsBlocked + scamsBlocked,
                totalScans: prev.totalScans + 1,
              }));
              setMonitoringScans(prev => prev + 1);
            }}
          />
        )}
        {currentScreen === 'freeze' && (
          <FreezeAccount 
            language={language}
            onAccountFrozen={handleAccountFrozen}
          />
        )}
        {currentScreen === 'news' && (
          <NewsScreen language={language} />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen 
            language={language}
            onLanguageChange={setLanguage}
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </main>

      <nav className="bg-white border-t sticky bottom-0 shadow-lg">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as Screen)}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-cyan-600' 
                    : 'text-gray-500'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'fill-cyan-100' : ''}`} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {showMonitoringWidget && (
        <MonitoringWidget 
          scansCount={monitoringScans}
          onNavigate={() => handleNavigate('monitor')}
          onClose={() => setShowMonitoringWidget(false)}
        />
      )}
    </div>
  );
}
