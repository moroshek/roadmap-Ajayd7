import { 
    Zap, 
    Target, 
    Coffee, 
    Trash2,
    CheckCircle2,
    AlertCircle,
    Clock,
    XCircle,
    PauseCircle,
    PlayCircle,
    Briefcase
} from 'lucide-react';

export const QUADRANT_CONFIG = {
  'Quick Wins': { 
    icon: Zap, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-100',
    dot: '#10b981',
    bgHex: '#ecfdf5'
  },
  'Big Bets': { 
    icon: Target, 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-50', 
    border: 'border-indigo-100',
    dot: '#6366f1',
    bgHex: '#eef2ff'
  },
  'Fillers': { 
    icon: Coffee, 
    color: 'text-slate-500', 
    bg: 'bg-slate-50', 
    border: 'border-slate-100',
    dot: '#94a3b8',
    bgHex: '#f8fafc'
  },
  'Time Sinks': { 
    icon: Trash2, 
    color: 'text-orange-600', 
    bg: 'bg-orange-50', 
    border: 'border-orange-100',
    dot: '#f97316',
    bgHex: '#fff7ed'
  },
} as const;

export const STATUS_CONFIG = {
  'Active': { 
    icon: PlayCircle,
    color: 'text-emerald-700', 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200' 
  },
  'At Risk': { 
    icon: AlertCircle,
    color: 'text-rose-700', 
    bg: 'bg-rose-50', 
    border: 'border-rose-200' 
  },
  'Queued': { 
    icon: Clock,
    color: 'text-blue-700', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200' 
  },
  'Backlog': { 
    icon: Briefcase,
    color: 'text-slate-600', 
    bg: 'bg-slate-50', 
    border: 'border-slate-200' 
  },
  'Complete': { 
    icon: CheckCircle2,
    color: 'text-emerald-800', 
    bg: 'bg-emerald-100', 
    border: 'border-emerald-300' 
  },
  'Paused': { 
    icon: PauseCircle,
    color: 'text-amber-700', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200' 
  },
  'On Hold': { 
    icon: XCircle,
    color: 'text-slate-500', 
    bg: 'bg-slate-100', 
    border: 'border-slate-300' 
  },
} as const;
