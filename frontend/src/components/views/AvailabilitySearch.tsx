import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  CalendarSearch,
  Calendar,
  Users,
  BedDouble,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
} from 'lucide-react';
import { RoomType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ReservationModal } from '../ReservationModal';

export const AvailabilitySearch: React.FC = () => {
  const { calculateNights, getAvailableRooms, rooms } = useHotel();

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState<string>(getTodayStr());
  const [checkOut, setCheckOut] = useState<string>(getTomorrowStr());
  const [selectedType, setSelectedType] = useState<string>('all');
  const [capacity, setCapacity] = useState<number>(1);

  // Modal reservation trigger
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [selectedRoomToBook, setSelectedRoomToBook] = useState<string | null>(null);

  const nights = calculateNights(checkIn, checkOut);
  const availableRooms = getAvailableRooms(checkIn, checkOut, selectedType, capacity);

  const handleBookRoom = (roomId: string) => {
    setSelectedRoomToBook(roomId);
    setIsResModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30 mb-2">
            <CalendarSearch className="w-3.5 h-3.5" />
            Consulta en Tiempo Real
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Consultar Disponibilidad de Habitaciones
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Encuentra y reserva la habitación ideal para tu estancia. El sistema calcula automáticamente el total de noches y la tarifa aplicable.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-900">
          {/* Check-in */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-300" /> Fecha de Entrada
            </label>
            <input
              type="date"
              value={checkIn}
              min={getTodayStr()}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (e.target.value >= checkOut) {
                  const nextDay = new Date(e.target.value);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setCheckOut(nextDay.toISOString().split('T')[0]);
                }
              }}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs font-semibold border border-transparent focus:ring-2 focus:ring-teal-400 focus:outline-none"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-300" /> Fecha de Salida
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs font-semibold border border-transparent focus:ring-2 focus:ring-teal-400 focus:outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-teal-300" /> Tipo de Habitación
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs font-semibold border border-transparent focus:ring-2 focus:ring-teal-400 focus:outline-none"
            >
              <option value="all">Todos los tipos ({rooms.length})</option>
              <option value="Individual">Individual</option>
              <option value="Doble">Doble</option>
              <option value="Matrimonial">Matrimonial</option>
              <option value="Suite">Suite</option>
              <option value="Familiar">Familiar</option>
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-teal-300" /> Mínimo de Huéspedes
            </label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 bg-white rounded-lg text-xs font-semibold border border-transparent focus:ring-2 focus:ring-teal-400 focus:outline-none"
            >
              <option value={1}>1 persona</option>
              <option value={2}>2 personas</option>
              <option value={3}>3 personas</option>
              <option value={4}>4 personas o más</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {availableRooms.length} {availableRooms.length === 1 ? 'habitación disponible' : 'habitaciones disponibles'}
          </h3>
          <p className="text-xs text-slate-500">
            Estancia seleccionada: <strong className="text-slate-800">{nights} {nights === 1 ? 'noche' : 'noches'}</strong> ({checkIn} al {checkOut})
          </p>
        </div>

        {nights <= 0 && (
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            La fecha de salida debe ser posterior a la fecha de entrada
          </span>
        )}
      </div>

      {/* Available Rooms Grid */}
      {availableRooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BedDouble className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            No hay habitaciones libres para estos criterios
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Todas las habitaciones de este tipo o capacidad se encuentran reservadas u ocupadas en el rango de fechas seleccionado ({checkIn} al {checkOut}).
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedType('all');
                setCapacity(1);
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Ver todos los tipos disponibles
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableRooms.map((room) => {
            const totalPrice = nights * room.pricePerNight;

            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/60 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        {room.type}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Piso {room.floor}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h4 className="text-xl font-black text-slate-900 font-mono">
                        Habitación {room.number}
                      </h4>
                      <div className="text-right">
                        <span className="text-xl font-black text-slate-900">
                          ${room.pricePerNight}
                        </span>
                        <span className="text-xs text-slate-500 block -mt-0.5">/ noche</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>Capacidad máxima: hasta {room.capacity} personas</span>
                    </div>
                  </div>

                  {/* Description & Amenities */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {room.description}
                    </p>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Servicios y Comodidades
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {room.amenities.map((am, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            <Check className="w-3 h-3 text-teal-600" />
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom / Price & CTA */}
                <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total por {nights} noches:</span>
                    <span className="text-base font-black text-teal-800">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookRoom(room.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs group-hover:scale-102"
                  >
                    <span>Reservar Ahora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reservation Modal pre-filled */}
      <ReservationModal
        isOpen={isResModalOpen}
        onClose={() => {
          setIsResModalOpen(false);
          setSelectedRoomToBook(null);
        }}
        initialRoomId={selectedRoomToBook || undefined}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
      />
    </div>
  );
};
