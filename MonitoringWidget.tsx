import { Activity, X } from 'lucide-react';
import { Button } from './ui/button';

interface MonitoringWidgetProps {
  scansCount: number;
  onNavigate: () => void;
  onClose: () => void;
}

export function MonitoringWidget({ scansCount, onNavigate, onClose }: MonitoringWidgetProps) {
  return (
    <div className="fixed bottom-20 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg p-3 flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="h-auto p-2 text-white hover:bg-white/20"
          onClick={onNavigate}
        >
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="ml-2 text-sm">Active ({scansCount})</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-auto p-1 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
