import React from 'react';
import { useHotel } from '../context/HotelContext';
import { ShieldCheck, UserCheck, User as UserIcon, X, Check } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, login } = useHotel();

  if (!isOpen) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      case 'receptionist':
        return <UserCheck className="w-5 h-5 text-teal-600" />;
      case 'guest':
        return <UserIcon className="w-5 h-5 text-sky-600" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Administrador</span>;
      case 'receptionist':
        return <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">Recepcionista</span>;
      case 'guest':
        return <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">Huésped</span>;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Acceso completo: administración de habitaciones, tarifas por noche y reportes gráficos de ocupación e ingresos.';
      case 'receptionist':
        return 'Operaciones diarias: gestión de reservas, check-in, check-out, registro de huéspedes y cobro de pagos.';
      case 'guest':
        return 'Vista de cliente: consulta disponibilidad, reserva habitaciones y gestiona o cancela sus propias reservas.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white">
          <div>
            <h3 className="text-lg font-bold">Cambiar Rol / Iniciar Sesión</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Selecciona una cuenta de prueba para verificar los permisos de cada rol
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[75vh] overflow-y-auto">
          {users.map((user) => {
            const isCurrent = currentUser?.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  login(user.id);
                  onClose();
                }}
                className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500/30'
                    : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/70 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                      {getRoleIcon(user.role)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 group-hover:text-teal-950">
                        {user.name}
                      </span>
                      {getRoleBadge(user.role)}
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {getRoleDescription(user.role)}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'
                    }`}
                  >
                    {isCurrent ? 'Sesión Actual' : 'Ingresar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Todos los datos se guardan de forma local en tu navegador con <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">localStorage</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
