import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Hotel,
  RotateCcw,
  User as UserIcon,
  ShieldCheck,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { currentUser, logout, resetToDemoData } = useHotel();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            Administrador
          </span>
        );
      case 'receptionist':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-200 border border-teal-400/30">
            <UserCheck className="w-3.5 h-3.5 text-teal-300" />
            Recepcionista
          </span>
        );
      case 'guest':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30">
            <UserIcon className="w-3.5 h-3.5 text-sky-300" />
            Huésped
          </span>
        );
    }
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
                <Hotel className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                    GestorReservas
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-900/60 text-teal-300 px-1.5 py-0.5 rounded border border-teal-700/50 hidden sm:inline-block">
                    Gestión Hotelera
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Sistema de Reservas y Operaciones
                </p>
              </div>
            </div>

            {/* Right actions: Demo Reset, Profile & Logout */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowResetConfirm(true)}
                title="Restaurar datos de prueba iniciales"
                className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Restaurar Demo</span>
              </button>

              {currentUser && (
                <div className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/70">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-teal-500/30">
                    <UserIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                    <div>{getRoleBadge(currentUser.role)}</div>
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                title="Cerrar sesión"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/60 hover:bg-rose-600/90 border border-slate-700/60 hover:border-rose-500/50 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-sm w-full animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 text-center">
              ¿Restaurar datos de ejemplo?
            </h4>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Esta acción restablecerá todas las habitaciones, reservas, huéspedes y pagos a los valores iniciales de demostración en localStorage.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDemoData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                Sí, restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
