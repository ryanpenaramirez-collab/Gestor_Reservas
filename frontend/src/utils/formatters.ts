import { ReservationStatus, RoomStatus, UserRole } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateSpanish = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

export const getStatusBadge = (status: ReservationStatus) => {
  switch (status) {
    case 'Confirmada':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Confirmada',
      };
    case 'Hospedado':
      return {
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        dot: 'bg-sky-500',
        label: 'Hospedado (En curso)',
      };
    case 'Finalizada':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
        label: 'Finalizada',
      };
    case 'Cancelada':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'Cancelada',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        label: status,
      };
  }
};

export const getRoomStatusBadge = (status: RoomStatus) => {
  switch (status) {
    case 'Disponible':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Disponible',
      };
    case 'Ocupada':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Ocupada',
      };
    case 'En Limpieza':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'En Limpieza',
      };
    case 'Mantenimiento':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        dot: 'bg-slate-500',
        label: 'Mantenimiento',
      };
  }
};

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'receptionist':
      return 'Recepcionista';
    case 'guest':
      return 'Huésped';
  }
};
