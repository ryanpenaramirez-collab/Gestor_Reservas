import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BedDouble,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  UserCheck,
  LogOut,
  Plus,
  ArrowRight,
  Sparkles,
  FileText,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency, formatDateSpanish, getRoomStatusBadge, getStatusBadge } from '../../utils/formatters';
import { ReservationModal } from '../ReservationModal';
import { PaymentModal } from '../PaymentModal';

export const DashboardView: React.FC = () => {
  const {
    rooms,
    reservations,
    guests,
    payments,
    setActiveTab,
    checkInReservation,
    checkOutReservation,
    setVoucherReservationId,
    updateRoom,
    currentUser,
  } = useHotel();

  const [isNewResModalOpen, setIsNewResModalOpen] = useState(false);
  const [paymentResId, setPaymentResId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Ocupada').length;
  const cleaningRooms = rooms.filter((r) => r.status === 'En Limpieza').length;
  const availableRooms = rooms.filter((r) => r.status === 'Disponible').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'Mantenimiento').length;

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Active reservations
  const inHouseReservations = reservations.filter((r) => r.status === 'Hospedado');
  const arrivalsToday = reservations.filter(
    (r) => r.status === 'Confirmada' && r.checkIn <= todayStr
  );
  const departuresToday = reservations.filter(
    (r) => r.status === 'Hospedado' && r.checkOut <= todayStr
  );

  // Revenue calculation
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
              Operaciones del Hotel
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1 text-white">
            Tablero de Recepción y Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Gestión en tiempo real del estado de habitaciones, ingresos, llegadas y salidas de huéspedes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsNewResModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <CalendarDays className="w-4 h-4 text-teal-400" />
            <span>Buscador Fechas</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ocupación */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ocupación Actual</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{occupancyRate}%</span>
            <span className="text-xs text-slate-500">
              ({occupiedRooms} de {totalRooms} hab.)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Llegadas de Hoy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check-in Pendientes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{arrivalsToday.length}</span>
            <span className="text-xs text-emerald-700 font-semibold">llegadas hoy</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Listas para registro de ingreso
          </p>
        </div>

        {/* Salidas de Hoy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check-out de Hoy</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{departuresToday.length}</span>
            <span className="text-xs text-amber-700 font-semibold">salidas programadas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Requieren revisión de saldos
          </p>
        </div>

        {/* Ingresos Recaudados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ingresos Totales</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{formatCurrency(totalRevenue)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {payments.length} transacciones registradas
          </p>
        </div>
      </div>

      {/* Room Rack - Grid of Rooms */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-teal-700" />
              Rack de Habitaciones en Tiempo Real
            </h3>
            <p className="text-xs text-slate-500">
              Visualiza el estado instantáneo de cada habitación del hotel
            </p>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {availableRooms} Libres
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> {occupiedRooms} Ocupadas
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> {cleaningRooms} En Limpieza
            </span>
            {maintenanceRooms > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span> {maintenanceRooms} Mant.
              </span>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
          {rooms.map((room) => {
            const statusBadge = getRoomStatusBadge(room.status);
            // Current in-house reservation for this room
            const currentRes = reservations.find(
              (r) => r.roomId === room.id && r.status === 'Hospedado'
            );
            const guest = currentRes ? guests.find((g) => g.id === currentRes.guestId) : null;

            return (
              <div
                key={room.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black text-slate-900 font-mono">
                      Hab. {room.number}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tipo:</span>
                      <span className="font-semibold text-slate-800">{room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capacidad:</span>
                      <span className="font-medium text-slate-800">{room.capacity} pers.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tarifa:</span>
                      <span className="font-bold text-teal-800">${room.pricePerNight} / noche</span>
                    </div>
                  </div>

                  {/* Guest in house info */}
                  {currentRes && guest && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] space-y-1">
                      <p className="font-bold text-amber-900 truncate">Huésped: {guest.fullName}</p>
                      <p className="text-amber-800 text-[10px]">
                        Salida: {formatDateSpanish(currentRes.checkOut)} ({currentRes.nights} noches)
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Room Action Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  {room.status === 'En Limpieza' ? (
                    <button
                      onClick={() => updateRoom(room.id, { status: 'Disponible' })}
                      className="w-full py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Marcar como Limpia
                    </button>
                  ) : currentRes ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <button
                        onClick={() => setVoucherReservationId(currentRes.id)}
                        title="Ver Comprobante"
                        className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPaymentResId(currentRes.id)}
                        title="Registrar Pago"
                        className="p-1.5 text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => checkOutReservation(currentRes.id)}
                        className="flex-1 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                      >
                        Check-out
                      </button>
                    </div>
                  ) : room.status === 'Disponible' ? (
                    <button
                      onClick={() => {
                        setActiveTab('availability');
                      }}
                      className="w-full py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
                    >
                      Reservar Habitación
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic mx-auto">En reparación</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Today's Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Arrivals (Check-in pendientes) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Llegadas Pendientes (Check-in)
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {arrivalsToday.length} pendientes
            </span>
          </div>

          {arrivalsToday.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">
              No hay más check-ins pendientes para el día de hoy.
            </p>
          ) : (
            <div className="space-y-3">
              {arrivalsToday.map((res) => {
                const guest = guests.find((g) => g.id === res.guestId);
                const room = rooms.find((r) => r.id === res.roomId);
                const pending = res.totalAmount - res.paidAmount;

                return (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 font-mono">{res.id}</span>
                        <span className="text-xs font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                          Hab. {room?.number} ({room?.type})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-1">
                        {guest?.fullName || 'Huésped'} ({res.numGuests} pers.)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatDateSpanish(res.checkIn)} al {formatDateSpanish(res.checkOut)} ({res.nights} noches)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => checkInReservation(res.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                      >
                        Hacer Check-in
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Departures (Check-out de hoy) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <LogOut className="w-4 h-4 text-amber-600" />
              Salidas de Hoy (Check-out)
            </h3>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              {departuresToday.length} salidas
            </span>
          </div>

          {departuresToday.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">
              No hay salidas programadas para el día de hoy.
            </p>
          ) : (
            <div className="space-y-3">
              {departuresToday.map((res) => {
                const guest = guests.find((g) => g.id === res.guestId);
                const room = rooms.find((r) => r.id === res.roomId);
                const pending = res.totalAmount - res.paidAmount;

                return (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 font-mono">{res.id}</span>
                        <span className="text-xs font-semibold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                          Hab. {room?.number}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-1">
                        {guest?.fullName || 'Huésped'}
                      </p>
                      <div className="text-[11px] mt-0.5">
                        {pending > 0.01 ? (
                          <span className="text-rose-700 font-bold">
                            Saldo pendiente: {formatCurrency(pending)}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">
                            Cuenta liquidada al 100%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {pending > 0.01 && (
                        <button
                          onClick={() => setPaymentResId(res.id)}
                          className="px-2.5 py-1.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition-colors"
                        >
                          Cobrar
                        </button>
                      )}
                      <button
                        onClick={() => checkOutReservation(res.id)}
                        className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Check-out
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ReservationModal
        isOpen={isNewResModalOpen}
        onClose={() => setIsNewResModalOpen(false)}
      />
      <PaymentModal
        reservationId={paymentResId}
        onClose={() => setPaymentResId(null)}
      />
    </div>
  );
};
