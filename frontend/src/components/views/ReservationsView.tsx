import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BookMarked,
  Search,
  Plus,
  Filter,
  UserCheck,
  LogOut,
  CreditCard,
  FileText,
  Edit2,
  XCircle,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types';
import { formatCurrency, formatDateSpanish, getStatusBadge } from '../../utils/formatters';
import { ReservationModal } from '../ReservationModal';
import { PaymentModal } from '../PaymentModal';

export const ReservationsView: React.FC = () => {
  const {
    reservations,
    rooms,
    guests,
    checkInReservation,
    checkOutReservation,
    cancelReservation,
    setVoucherReservationId,
    currentUser,
  } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewResModalOpen, setIsNewResModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [paymentResId, setPaymentResId] = useState<string | null>(null);

  // Cancellation modal state
  const [cancellingResId, setCancellingResId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Filter reservations
  const filteredReservations = reservations.filter((res) => {
    // Status filter
    if (statusFilter !== 'all' && res.status !== statusFilter) return false;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const guest = guests.find((g) => g.id === res.guestId);
      const room = rooms.find((r) => r.id === res.roomId);

      const matchId = res.id.toLowerCase().includes(term);
      const matchGuest = guest?.fullName.toLowerCase().includes(term) || guest?.documentNumber.toLowerCase().includes(term);
      const matchRoom = room?.number.toLowerCase().includes(term);

      if (!matchId && !matchGuest && !matchRoom) return false;
    }

    return true;
  });

  const handleConfirmCancel = () => {
    if (!cancellingResId) return;
    cancelReservation(cancellingResId, cancelReason);
    setCancellingResId(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-teal-700" />
            Gestión de Reservas
          </h2>
          <p className="text-xs text-slate-500">
            Administra todas las reservas del hotel, realiza check-in, check-out, pagos y emisión de comprobantes.
          </p>
        </div>

        <button
          onClick={() => setIsNewResModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Reserva</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, huésped, DNI o hab..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'Confirmada', label: 'Confirmadas' },
            { id: 'Hospedado', label: 'En Estancia' },
            { id: 'Finalizada', label: 'Finalizadas' },
            { id: 'Cancelada', label: 'Canceladas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table / Cards */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No se encontraron reservas</h4>
          <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros o la búsqueda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Código / Huésped</th>
                  <th className="py-3 px-4">Habitación</th>
                  <th className="py-3 px-4">Fechas y Noches</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Cobros / Saldo</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((res) => {
                  const guest = guests.find((g) => g.id === res.guestId);
                  const room = rooms.find((r) => r.id === res.roomId);
                  const badge = getStatusBadge(res.status);
                  const pendingBalance = res.totalAmount - res.paidAmount;

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Code and Guest */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block text-xs">
                          {res.id}
                        </span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {guest?.fullName || 'Huésped desconocido'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {guest?.documentType}: {guest?.documentNumber}
                        </span>
                      </td>

                      {/* Room */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">
                          Hab. {room?.number}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {room?.type} · Piso {room?.floor}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {res.numGuests} pers.
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">
                          <span>{formatDateSpanish(res.checkIn)}</span>
                          <span className="text-slate-400 mx-1">→</span>
                          <span>{formatDateSpanish(res.checkOut)}</span>
                        </div>
                        <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
                          {res.nights} {res.nights === 1 ? 'noche' : 'noches'} (${res.pricePerNight}/n)
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                        {res.actualCheckInTime && (
                          <span className="text-[10px] text-slate-400 block mt-1">
                            In: {res.actualCheckInTime}
                          </span>
                        )}
                        {res.actualCheckOutTime && (
                          <span className="text-[10px] text-slate-400 block">
                            Out: {res.actualCheckOutTime}
                          </span>
                        )}
                      </td>

                      {/* Balance & Payments */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">
                            {formatCurrency(res.totalAmount)}
                          </span>
                          <div className="text-[11px]">
                            {pendingBalance > 0.01 ? (
                              <span className="text-rose-700 font-bold block">
                                Saldo: {formatCurrency(pendingBalance)}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-semibold block">
                                100% Abonado
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          {/* Check-in */}
                          {res.status === 'Confirmada' && (
                            <button
                              onClick={() => checkInReservation(res.id)}
                              title="Registrar Check-in"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                            >
                              Check-in
                            </button>
                          )}

                          {/* Check-out */}
                          {res.status === 'Hospedado' && (
                            <button
                              onClick={() => checkOutReservation(res.id)}
                              title="Registrar Check-out"
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                            >
                              Check-out
                            </button>
                          )}

                          {/* Registrar Pago */}
                          {res.status !== 'Cancelada' && pendingBalance > 0.01 && (
                            <button
                              onClick={() => setPaymentResId(res.id)}
                              title="Registrar Pago"
                              className="p-1.5 text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Comprobante */}
                          <button
                            onClick={() => setVoucherReservationId(res.id)}
                            title="Ver Comprobante de Reserva"
                            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Modificar */}
                          {(res.status === 'Confirmada' || res.status === 'Hospedado') && (
                            <button
                              onClick={() => setEditingReservation(res)}
                              title="Modificar Reserva"
                              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Cancelar */}
                          {res.status === 'Confirmada' && (
                            <button
                              onClick={() => setCancellingResId(res.id)}
                              title="Cancelar Reserva"
                              className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingResId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">¿Cancelar esta reserva?</h4>
              <p className="text-xs text-slate-500 mt-1">
                La reserva <strong className="font-mono text-slate-800">{cancellingResId}</strong> cambiará su estado a Cancelada y liberará la habitación.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Motivo de la cancelación (opcional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Cambio de planes del cliente"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCancellingResId(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modals */}
      <ReservationModal
        isOpen={isNewResModalOpen}
        onClose={() => setIsNewResModalOpen(false)}
      />
      <ReservationModal
        isOpen={Boolean(editingReservation)}
        onClose={() => setEditingReservation(null)}
        reservationToEdit={editingReservation}
      />
      <PaymentModal
        reservationId={paymentResId}
        onClose={() => setPaymentResId(null)}
      />
    </div>
  );
};
