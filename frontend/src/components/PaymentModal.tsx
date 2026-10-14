import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { X, DollarSign, CreditCard, Banknote, Landmark, Check } from 'lucide-react';
import { PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PaymentModalProps {
  reservationId: string | null;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ reservationId, onClose }) => {
  const { reservations, addPayment } = useHotel();
  const reservation = reservations.find((r) => r.id === reservationId);

  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod>('Tarjeta de Crédito');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  if (!reservationId || !reservation) return null;

  const pendingBalance = reservation.totalAmount - reservation.paidAmount;

  const handleQuickAmount = (val: number) => {
    setAmount(val.toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const res = addPayment(reservation.id, num, method, reference, notes);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base">Registrar Pago</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Reservation Summary */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Reserva:</span>
              <span className="font-mono font-bold text-slate-900">{reservation.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total reserva:</span>
              <span className="font-bold text-slate-900">{formatCurrency(reservation.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Abonado:</span>
              <span className="font-bold text-emerald-700">{formatCurrency(reservation.paidAmount)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="font-bold text-slate-800">Saldo Pendiente:</span>
              <span className="font-extrabold text-teal-700 text-sm">
                {formatCurrency(Math.max(0, pendingBalance))}
              </span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          {pendingBalance > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Monto rápido:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickAmount(pendingBalance)}
                  className="py-1.5 px-2 text-xs font-semibold bg-teal-50 border border-teal-300 text-teal-800 hover:bg-teal-100 rounded-lg transition-colors"
                >
                  Liquidar 100% ({formatCurrency(pendingBalance)})
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(pendingBalance / 2)}
                  className="py-1.5 px-2 text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  50% Restante ({formatCurrency(pendingBalance / 2)})
                </button>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monto a Registrar ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={pendingBalance > 0 ? pendingBalance : undefined}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Método de Pago *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'Efectivo', label: 'Efectivo', icon: Banknote },
                  { id: 'Tarjeta de Crédito', label: 'T. Crédito', icon: CreditCard },
                  { id: 'Tarjeta de Débito', label: 'T. Débito', icon: CreditCard },
                  { id: 'Transferencia', label: 'Transferencia', icon: Landmark },
                ] as const
              ).map((m) => {
                const Icon = m.icon;
                const isSelected = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-500'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-teal-700" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Número de Referencia / Comprobante (opcional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ej: TC-90145 / REF-2201"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notas adicionales (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Pago realizado en recepción"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex-1 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs"
            >
              Confirmar Cobro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
