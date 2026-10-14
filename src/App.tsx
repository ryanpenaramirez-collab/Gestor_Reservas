/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { Navigation } from './components/Navigation';
import { NotificationToast } from './components/NotificationToast';
import { VoucherModal } from './components/VoucherModal';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/views/DashboardView';
import { AvailabilitySearch } from './components/views/AvailabilitySearch';
import { ReservationsView } from './components/views/ReservationsView';
import { MyReservationsView } from './components/views/MyReservationsView';
import { GuestsView } from './components/views/GuestsView';
import { RoomsView } from './components/views/RoomsView';
import { ReportsView } from './components/views/ReportsView';
import { Hotel, Shield, Phone, Mail, MapPin } from 'lucide-react';

const HotelAppContent: React.FC = () => {
  const { activeTab, currentUser } = useHotel();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'my-reservations':
        return <MyReservationsView />;
      case 'availability':
        return <AvailabilitySearch />;
      case 'reservations':
        return <ReservationsView />;
      case 'guests':
        return <GuestsView />;
      case 'rooms':
        return <RoomsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return currentUser?.role === 'guest' ? <MyReservationsView /> : <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Role-filtered navigation tabs */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} GestorReservas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <VoucherModal />
      <NotificationToast />
    </div>
  );
};

const AppGate: React.FC = () => {
  const { currentUser } = useHotel();

  if (!currentUser) {
    return (
      <>
        <AuthScreen />
        <NotificationToast />
      </>
    );
  }

  return <HotelAppContent />;
};

export default function App() {
  return (
    <HotelProvider>
      <AppGate />
    </HotelProvider>
  );
}
