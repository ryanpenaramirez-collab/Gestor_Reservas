import React from 'react';
import { useHotel } from '../context/HotelContext';
import {
  LayoutDashboard,
  CalendarSearch,
  BookMarked,
  Users,
  BedDouble,
  BarChart3,
  BookmarkCheck,
} from 'lucide-react';
import { ActiveTab } from '../types';

export const Navigation: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, reservations } = useHotel();

  if (!currentUser) return null;

  // Count active reservations for badges
  const pendingCheckInsToday = reservations.filter((r) => r.status === 'Confirmada').length;
  const inHouseCount = reservations.filter((r) => r.status === 'Hospedado').length;

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    roles: ('guest' | 'receptionist' | 'admin')[];
    badge?: number;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Panel General',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['receptionist', 'admin'],
    },
    {
      id: 'my-reservations',
      label: 'Mis Reservas',
      icon: <BookmarkCheck className="w-4 h-4" />,
      roles: ['guest'],
      badge: reservations.filter((r) => r.guestId === currentUser.guestId && r.status !== 'Cancelada').length,
    },
    {
      id: 'availability',
      label: 'Buscar Disponibilidad',
      icon: <CalendarSearch className="w-4 h-4" />,
      roles: ['guest', 'receptionist', 'admin'],
    },
    {
      id: 'reservations',
      label: 'Reservas del Hotel',
      icon: <BookMarked className="w-4 h-4" />,
      roles: ['receptionist', 'admin'],
      badge: pendingCheckInsToday > 0 ? pendingCheckInsToday : undefined,
    },
    {
      id: 'guests',
      label: 'Huéspedes',
      icon: <Users className="w-4 h-4" />,
      roles: ['receptionist', 'admin'],
    },
    {
      id: 'rooms',
      label: 'Habitaciones y Tarifas',
      icon: <BedDouble className="w-4 h-4" />,
      roles: ['admin'],
    },
    {
      id: 'reports',
      label: 'Reportes y Métricas',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['admin'],
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {visibleItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs shadow-teal-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white text-teal-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
