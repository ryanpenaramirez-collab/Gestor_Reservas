import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BookmarkCheck,
  Calendar,
  BedDouble,
  FileText,
  Edit2,
  XCircle,
  Plus,
  Wifi,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Reservation } from '../../types';
import { formatCurrency, formatDateSpanish, getStatusBadge } from '../../utils/formatters';
import { ReservationModal } from '../ReservationModal';

export const MyReservationsView: React.FC = () => {
  const { currentUser, reservations, rooms, setVoucherReservationId, cancelReservation, setActiveTab } = useHotel();

  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Guest reservations
  const myReservations = reservations.filter((r) => r.guestId === currentUser?.guestId);

  const activeReservations = myReservations.filter((r) => r.status === 'Confirmada' || r.status === 'Hospedado');
  const pastReservations = myReservations.filter((r) => r.status === 'Finalizada' || r.status === 'Cancelada');

  const handleConfirmCancel = () => {
    if (!cancellingId) return;
    cancelReservation(cancellingId, cancelReason);
    setCancellingId(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner for Guest */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
            Portal del Huésped
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1 text-white">
            ¡Hola, {currentUser?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Aquí puedes consultar el estado de tus estancias, modificar fechas, descargar tus comprobantes de pago o reservar una nueva habitación.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('availability')}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-700/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Hacer Nueva Reserva</span>
        </button>
      </div>

      {/* Guest Hotel Services Mini Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">WiFi Gratuito</span>
            <span className="text-slate-500">Red: GestorReservas_Guest</span>
          </div>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Horarios</span>
            <span className="text-slate-500">In: 14:00 | Out: 11:00</span>
          </div>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Recepción 24/7</span>
            <span className="text-slate-500">Asistencia permanente</span>
          </div>
        </div>
      </div>

      {/* Active Reservations Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5 text-teal-700" />
          Reservas Activas y Próximas
        </h3>

        {activeReservations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs space-y-3">
            <BedDouble className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No tienes reservas activas en este momento</p>
            <p className="text-xs text-slate-500">¿Planeando tu próximo viaje? Explora nuestras habitaciones disponibles.</p>
            <button
              onClick={() => setActiveTab('availability')}
              className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <span>Ver Habitaciones Libres</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReservations.map((res) => {
              const room = rooms.find((r) => r.id === res.roomId);
              const badge = getStatusBadge(res.status);
              const pendingBalance = res.totalAmount - res.paidAmount;

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/60 shadow-xs p-5 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {res.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-900">
                        Habitación {room?.number} · {room?.type}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Piso {room?.floor} · Para {res.numGuests} personas
                      </p>
                    </div>

                    {/* Dates Card */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Llegada (Check-in):</span>
                        <span className="font-bold text-slate-900">{formatDateSpanish(res.checkIn)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Salida (Check-out):</span>
                        <span className="font-bold text-slate-900">{formatDateSpanish(res.checkOut)}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200 text-teal-800 font-semibold">
                        <span>Duración:</span>
                        <span>{res.nights} {res.nights === 1 ? 'noche' : 'noches'}</span>
                      </div>
                    </div>

                    {/* Billing Info */}
                    <div className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="text-slate-500 block">Total Estancia:</span>
                        <span className="text-base font-black text-slate-900">{formatCurrency(res.totalAmount)}</span>
                      </div>
                      <div className="text-right">
                        {pendingBalance > 0.01 ? (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 block">
                            Saldo: {formatCurrency(pendingBalance)}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block">
                            Pagado 100%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setVoucherReservationId(res.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Comprobante</span>
                    </button>

                    {res.status === 'Confirmada' && (
                      <>
                        <button
                          onClick={() => setEditingRes(res)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Modificar</span>
                        </button>
                        <button
                          onClick={() => setCancellingId(res.id)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past / Cancelled Reservations History */}
      {pastReservations.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-700">
            Historial de Estancias Pasadas ({pastReservations.length})
          </h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {pastReservations.map((res) => {
                const room = rooms.find((r) => r.id === res.roomId);
                const badge = getStatusBadge(res.status);

                return (
                  <div key={res.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{res.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium mt-1">
                        Habitación {room?.number} ({room?.type}) · {formatDateSpanish(res.checkIn)} al {formatDateSpanish(res.checkOut)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="font-bold text-slate-900">{formatCurrency(res.totalAmount)}</span>
                      <button
                        onClick={() => setVoucherReservationId(res.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Ver Comprobante
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">¿Deseas cancelar tu reserva?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Se liberará la habitación reservada. Puedes volver a reservar en cualquier momento.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Motivo (opcional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Cambio de itinerario"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCancellingId(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                No cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reservation Modal */}
      <ReservationModal
        isOpen={Boolean(editingRes)}
        onClose={() => setEditingRes(null)}
        reservationToEdit={editingRes}
      />
    </div>
  );
};
