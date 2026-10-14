import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Printer, X, Hotel, CheckCircle, Clock, Calendar, User, CreditCard, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDateSpanish, getStatusBadge } from '../utils/formatters';

export const VoucherModal: React.FC = () => {
  const { voucherReservationId, setVoucherReservationId, reservations, rooms, guests, payments } = useHotel();

  if (!voucherReservationId) return null;

  const reservation = reservations.find((r) => r.id === voucherReservationId);
  if (!reservation) return null;

  const room = rooms.find((r) => r.id === reservation.roomId);
  const guest = guests.find((g) => g.id === reservation.guestId);
  const resPayments = payments.filter((p) => p.reservationId === reservation.id);
  const pendingBalance = reservation.totalAmount - reservation.paidAmount;
  const isFullyPaid = pendingBalance <= 0.01;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:fixed-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 print:shadow-none print:border-none print:max-w-none">
        
        {/* Modal Top Bar (Hidden in print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Hotel className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm sm:text-base">Comprobante de Reserva / Factura de Estancia</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={() => setVoucherReservationId(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Sheet */}
        <div id="hotel-voucher-printable" className="p-6 sm:p-8 space-y-6 text-slate-800 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-xl">
                <Hotel className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">GestorReservas Boutique</h1>
                <p className="text-xs text-slate-500">Av. Las Palmeras 450, Centro Histórico</p>
                <p className="text-xs text-slate-500">Tel: +34 912 883 200 · NIT/RUT: 900.824.119-3</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Nº de Reserva</span>
                <span className="text-base font-black text-slate-900 font-mono">{reservation.id}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Fecha emisión: {formatDateSpanish(reservation.createdAt)}
              </p>
            </div>
          </div>

          {/* Payment Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-2 ${
            isFullyPaid
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-5 h-5 ${isFullyPaid ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div>
                <span className="font-bold text-sm block">
                  {isFullyPaid ? 'ESTADO: PAGO TOTAL CONFIRMADO' : 'ESTADO: SALDO PENDIENTE DE COBRO'}
                </span>
                <span className="text-xs opacity-85">
                  Estado de reserva: <span className="font-semibold">{reservation.status}</span>
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs opacity-75 block">Saldo pendiente:</span>
              <span className={`text-base font-black ${isFullyPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                {formatCurrency(Math.max(0, pendingBalance))}
              </span>
            </div>
          </div>

          {/* Guest and Stay Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guest Info */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" /> Datos del Huésped
              </h4>
              <div>
                <p className="font-bold text-slate-900 text-sm">{guest?.fullName || 'Huésped no registrado'}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {guest?.documentType}: <span className="font-mono font-medium">{guest?.documentNumber}</span>
                </p>
                <p className="text-xs text-slate-600">Email: {guest?.email}</p>
                <p className="text-xs text-slate-600">Tel: {guest?.phone}</p>
                <p className="text-xs text-slate-500">Nacionalidad: {guest?.nationality}</p>
              </div>
            </div>

            {/* Room Info */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> Detalles de la Estancia
              </h4>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Habitación:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    Nº {room?.number} ({room?.type})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                  <span>Entrada (Check-in):</span>
                  <span className="font-semibold text-slate-900">{formatDateSpanish(reservation.checkIn)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                  <span>Salida (Check-out):</span>
                  <span className="font-semibold text-slate-900">{formatDateSpanish(reservation.checkOut)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                  <span>Duración y Huéspedes:</span>
                  <span className="font-semibold text-slate-900">{reservation.nights} noches · {reservation.numGuests} pers.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Desglose de Conceptos y Tarifas
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Concepto</th>
                    <th className="py-2.5 px-3 text-center">Noches</th>
                    <th className="py-2.5 px-3 text-right">Tarifa / Noche</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-900">Estancia Habitación {room?.number}</span>
                      <span className="block text-[11px] text-slate-500">Tipo: {room?.type} · Capacidad {room?.capacity} pers.</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium">{reservation.nights}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(reservation.pricePerNight)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatCurrency(reservation.totalAmount)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-semibold border-t border-slate-200 text-slate-900">
                  <tr>
                    <td colSpan={3} className="py-2 px-3 text-right text-xs">Total Facturado:</td>
                    <td className="py-2 px-3 text-right text-sm font-black">{formatCurrency(reservation.totalAmount)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-1 px-3 text-right text-xs text-emerald-700">Total Abonado:</td>
                    <td className="py-1 px-3 text-right text-xs font-bold text-emerald-700">-{formatCurrency(reservation.paidAmount)}</td>
                  </tr>
                  <tr className="border-t border-slate-200 bg-slate-100">
                    <td colSpan={3} className="py-2 px-3 text-right text-xs font-bold text-slate-800">Saldo a Liquidar:</td>
                    <td className="py-2 px-3 text-right text-sm font-black text-slate-900">
                      {formatCurrency(Math.max(0, pendingBalance))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment History */}
          {resPayments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-teal-600" /> Registro de Pagos Realizados
              </h4>
              <div className="space-y-1.5">
                {resPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{p.method}</span>
                      {p.reference && <span className="text-slate-500 font-mono text-[11px]">Ref: {p.reference}</span>}
                      {p.notes && <span className="text-slate-400 italic text-[11px]">({p.notes})</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{formatDateSpanish(p.date)}</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(p.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Requests */}
          {reservation.specialRequests && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-0.5">Peticiones Especiales / Notas:</span>
              <p className="text-slate-600">{reservation.specialRequests}</p>
            </div>
          )}

          {/* Hotel Policies & Footer */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1 leading-relaxed">
            <p className="font-semibold text-slate-700">Políticas y Condiciones del Hotel:</p>
            <p>• Horario de Check-in: 14:00 hrs | Check-out: 11:00 hrs. Salidas posteriores sujetas a disponibilidad y cargo adicional.</p>
            <p>• Cancelaciones gratuitas hasta 48 horas antes de la fecha de llegada.</p>
            <p>• Establecimiento 100% libre de humo. WiFi gratuito para huéspedes: red <strong>GestorReservas_Guest</strong> (clave en recepción).</p>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in print) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2.5 print:hidden">
          <button
            onClick={() => setVoucherReservationId(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Comprobante</span>
          </button>
        </div>

      </div>
    </div>
  );
};
