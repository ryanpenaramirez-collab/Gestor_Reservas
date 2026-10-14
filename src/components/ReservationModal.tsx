import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { X, Calendar, User, BedDouble, AlertCircle, Plus, Check } from 'lucide-react';
import { PaymentMethod, Reservation } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationToEdit?: Reservation | null;
  initialRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  reservationToEdit,
  initialRoomId,
  initialCheckIn,
  initialCheckOut,
}) => {
  const {
    currentUser,
    rooms,
    guests,
    calculateNights,
    isRoomAvailable,
    createReservation,
    updateReservation,
    createGuest,
  } = useHotel();

  // Helper for today's ISO date string
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Form states
  const [roomId, setRoomId] = useState<string>('');
  const [guestId, setGuestId] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [numGuests, setNumGuests] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Initial payment states (only for new reservations)
  const [addPaymentNow, setAddPaymentNow] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tarjeta de Crédito');
  const [paymentRef, setPaymentRef] = useState('');

  // New guest inline creator state
  const [showNewGuestForm, setShowNewGuestForm] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestDocType, setNewGuestDocType] = useState<'DNI' | 'Pasaporte' | 'Cédula'>('DNI');
  const [newGuestDocNum, setNewGuestDocNum] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestNationality, setNewGuestNationality] = useState('España');

  // Reset or initialize values when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (reservationToEdit) {
      setRoomId(reservationToEdit.roomId);
      setGuestId(reservationToEdit.guestId);
      setCheckIn(reservationToEdit.checkIn);
      setCheckOut(reservationToEdit.checkOut);
      setNumGuests(reservationToEdit.numGuests);
      setSpecialRequests(reservationToEdit.specialRequests || '');
      setAddPaymentNow(false);
    } else {
      setRoomId(initialRoomId || (rooms[0]?.id ?? ''));
      setCheckIn(initialCheckIn || getTodayStr());
      setCheckOut(initialCheckOut || getTomorrowStr());
      setNumGuests(1);
      setSpecialRequests('');
      setAddPaymentNow(false);
      setPaymentAmount('');

      if (currentUser?.role === 'guest' && currentUser.guestId) {
        setGuestId(currentUser.guestId);
      } else {
        setGuestId(guests[0]?.id ?? '');
      }
    }
    setShowNewGuestForm(false);
  }, [isOpen, reservationToEdit, initialRoomId, initialCheckIn, initialCheckOut, currentUser]);

  if (!isOpen) return null;

  const isEditing = Boolean(reservationToEdit);
  const selectedRoom = rooms.find((r) => r.id === roomId);
  const nights = calculateNights(checkIn, checkOut);
  const totalEstimated = selectedRoom ? nights * selectedRoom.pricePerNight : 0;

  // Real-time conflict check
  const availabilityCheck =
    roomId && checkIn && checkOut && nights > 0
      ? isRoomAvailable(roomId, checkIn, checkOut, reservationToEdit?.id)
      : { available: true };

  const handleCreateNewGuestInline = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newGuestDocNum.trim()) return;

    const res = createGuest({
      fullName: newGuestName.trim(),
      documentType: newGuestDocType,
      documentNumber: newGuestDocNum.trim(),
      email: newGuestEmail.trim(),
      phone: newGuestPhone.trim(),
      nationality: newGuestNationality.trim() || 'España',
    });

    if (res.success && res.guest) {
      setGuestId(res.guest.id);
      setShowNewGuestForm(false);
      setNewGuestName('');
      setNewGuestDocNum('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId || !guestId || !checkIn || !checkOut) return;

    if (nights <= 0) return;

    if (!availabilityCheck.available) return;

    if (isEditing && reservationToEdit) {
      const res = updateReservation(reservationToEdit.id, {
        roomId,
        checkIn,
        checkOut,
        numGuests,
        specialRequests,
      });
      if (res.success) onClose();
    } else {
      const payData =
        addPaymentNow && parseFloat(paymentAmount) > 0
          ? {
              amount: parseFloat(paymentAmount),
              method: paymentMethod,
              reference: paymentRef,
              notes: 'Pago inicial al reservar',
            }
          : undefined;

      const res = createReservation(
        {
          roomId,
          guestId,
          checkIn,
          checkOut,
          numGuests,
          specialRequests,
        },
        payData
      );

      if (res.success) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base">
              {isEditing ? `Modificar Reserva ${reservationToEdit?.id}` : 'Crear Nueva Reserva'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Guest Selector (if user is receptionist or admin) */}
          {currentUser?.role !== 'guest' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" /> Huésped Titular *
                </label>
                {!showNewGuestForm && (
                  <button
                    type="button"
                    onClick={() => setShowNewGuestForm(true)}
                    className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Registrar nuevo huésped
                  </button>
                )}
              </div>

              {!showNewGuestForm ? (
                <select
                  value={guestId}
                  onChange={(e) => setGuestId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="" disabled>Seleccione un huésped...</option>
                  {guests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.fullName} — {g.documentType}: {g.documentNumber} ({g.phone})
                    </option>
                  ))}
                </select>
              ) : (
                /* Inline Quick Guest Form */
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900">Nuevo Registro de Huésped</span>
                    <button
                      type="button"
                      onClick={() => setShowNewGuestForm(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-800"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nombre Completo *</label>
                      <input
                        type="text"
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="Ej: Carmen Valenzuela"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2/5">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Doc.</label>
                        <select
                          value={newGuestDocType}
                          onChange={(e) => setNewGuestDocType(e.target.value as any)}
                          className="w-full px-1.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="DNI">DNI</option>
                          <option value="Pasaporte">Pasap.</option>
                          <option value="Cédula">Cédula</option>
                        </select>
                      </div>
                      <div className="w-3/5">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Número *</label>
                        <input
                          type="text"
                          value={newGuestDocNum}
                          onChange={(e) => setNewGuestDocNum(e.target.value)}
                          placeholder="Doc. ID"
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Email</label>
                      <input
                        type="email"
                        value={newGuestEmail}
                        onChange={(e) => setNewGuestEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Teléfono</label>
                      <input
                        type="tel"
                        value={newGuestPhone}
                        onChange={(e) => setNewGuestPhone(e.target.value)}
                        placeholder="+34 600 000 000"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateNewGuestInline}
                    disabled={!newGuestName.trim() || !newGuestDocNum.trim()}
                    className="w-full py-1.5 bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    Guardar y Asignar Huésped
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest sees their own name */
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Titular de la reserva:</span>
                <span className="font-bold text-slate-900">{currentUser?.name}</span>
              </div>
              <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                Huésped verificado
              </span>
            </div>
          )}

          {/* Dates & Nights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fecha de Llegada (Check-in) *
              </label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fecha de Salida (Check-out) *
              </label>
              <input
                type="date"
                required
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-teal-600" /> Habitación Asignada *
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
            >
              <option value="" disabled>Seleccione una habitación...</option>
              {rooms.map((rm) => {
                const isConflict =
                  checkIn &&
                  checkOut &&
                  !isRoomAvailable(rm.id, checkIn, checkOut, reservationToEdit?.id).available;
                return (
                  <option
                    key={rm.id}
                    value={rm.id}
                    disabled={rm.status === 'Mantenimiento'}
                  >
                    Habitación {rm.number} - {rm.type} (Cap: {rm.capacity} pers.) · ${rm.pricePerNight}/noche
                    {isConflict ? ' [OCUPADA EN ESAS FECHAS]' : ''}
                    {rm.status === 'Mantenimiento' ? ' [EN MANTENIMIENTO]' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Overlap Alert Warning */}
          {!availabilityCheck.available && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-900 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Conflicto de reserva detectado</p>
                <p className="mt-0.5 text-rose-700">
                  La habitación {selectedRoom?.number} ya tiene una reserva activa entre el{' '}
                  <span className="font-semibold">{availabilityCheck.conflict?.checkIn}</span> y el{' '}
                  <span className="font-semibold">{availabilityCheck.conflict?.checkOut}</span>. Seleccione otra habitación o modifique las fechas para continuar.
                </p>
              </div>
            </div>
          )}

          {/* Number of Guests & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Número de Huéspedes
              </label>
              <input
                type="number"
                min={1}
                max={selectedRoom ? selectedRoom.capacity : 6}
                value={numGuests}
                onChange={(e) => setNumGuests(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
              {selectedRoom && numGuests > selectedRoom.capacity && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">
                  Excede la capacidad de la habitación ({selectedRoom.capacity} pers.)
                </p>
              )}
            </div>

            {/* Price Preview Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-center">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Noches calculadas:</span>
                <span className="font-bold text-slate-800">{nights} {nights === 1 ? 'noche' : 'noches'}</span>
              </div>
              <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-700">Total Estancia:</span>
                <span className="text-sm font-black text-teal-800">{formatCurrency(totalEstimated)}</span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Peticiones Especiales o Notas (opcional)
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Ej: Cuna para bebé, llegada tarde, piso alto..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Optional Initial Payment (Only for new reservations when receptionist or admin) */}
          {!isEditing && currentUser?.role !== 'guest' && (
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={addPaymentNow}
                  onChange={(e) => {
                    setAddPaymentNow(e.target.checked);
                    if (e.target.checked && totalEstimated > 0) {
                      setPaymentAmount(totalEstimated.toString());
                    }
                  }}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">
                  Registrar pago inicial inmediato (seña o total)
                </span>
              </label>

              {addPaymentNow && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Monto ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={totalEstimated}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
                      placeholder="Monto"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Método</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      <option value="Tarjeta de Crédito">T. Crédito</option>
                      <option value="Tarjeta de Débito">T. Débito</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Referencia</label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="Ej: TC-1234"
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                !availabilityCheck.available ||
                nights <= 0 ||
                !roomId ||
                !guestId ||
                (selectedRoom && numGuests > selectedRoom.capacity)
              }
              className="flex-1 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs"
            >
              {isEditing ? 'Guardar Cambios' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
