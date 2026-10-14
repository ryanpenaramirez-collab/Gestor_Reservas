import React from 'react';
import { useHotel } from '../context/HotelContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, showNotification } = useHotel();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    error: 'border-rose-200 bg-rose-50/95 text-rose-950',
    info: 'border-sky-200 bg-sky-50/95 text-sky-950',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${borders[notification.type]}`}>
        {icons[notification.type]}
        <div className="text-sm font-medium leading-relaxed pr-2 flex-1">
          {notification.text}
        </div>
        <button
          onClick={() => showNotification('', 'info')}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
