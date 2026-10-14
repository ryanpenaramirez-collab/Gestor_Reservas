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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <Hotel className="w-4 h-4 text-teal-400" />
                <span>GestorReservas</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Sistema integral de gestión de reservas, habitaciones, huéspedes, operaciones de check-in/check-out y reportes para pequeños hoteles.
              </p>
            </div>

            <div>
              <span className="text-white font-semibold text-xs uppercase tracking-wider block mb-2">
                Contacto & Ubicación
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Av. Las Palmeras 450, Centro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>+34 912 883 200 / +34 600 112 233</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>recepcion@gestorreservas.com</span>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-white font-semibold text-xs uppercase tracking-wider block mb-2">
                Persistencia Local
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Esta aplicación funciona 100% en el cliente y almacena los datos de demostración en <code className="bg-slate-800 px-1 py-0.5 rounded text-teal-300 font-mono text-[11px]">localStorage</code>. Puedes alternar de rol o reiniciar los datos cuando lo desees desde la barra superior.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} GestorReservas. Todos los derechos reservados.</p>
            <p>Diseño en Azul Oscuro & Verde Azulado · Roles: Huésped, Recepcionista y Administrador</p>
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
