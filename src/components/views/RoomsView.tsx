import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BedDouble,
  Plus,
  Edit2,
  Trash2,
  Users,
  DollarSign,
  Layers,
  Sparkles,
  X,
  Check,
  AlertCircle,
  Wrench,
  Brush,
} from 'lucide-react';
import { Room, RoomStatus, RoomType } from '../../types';
import { formatCurrency, getRoomStatusBadge } from '../../utils/formatters';

export const RoomsView: React.FC = () => {
  const { rooms, createRoom, updateRoom, deleteRoom } = useHotel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form states
  const [number, setNumber] = useState('');
  const [type, setType] = useState<RoomType>('Matrimonial');
  const [capacity, setCapacity] = useState(2);
  const [pricePerNight, setPricePerNight] = useState(75);
  const [status, setStatus] = useState<RoomStatus>('Disponible');
  const [floor, setFloor] = useState(1);
  const [amenitiesInput, setAmenitiesInput] = useState('WiFi 6, Baño privado, Smart TV, Aire acondicionado');
  const [description, setDescription] = useState('');

  // Delete confirm state
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingRoom(null);
    setNumber('');
    setType('Matrimonial');
    setCapacity(2);
    setPricePerNight(80);
    setStatus('Disponible');
    setFloor(1);
    setAmenitiesInput('WiFi 6, Baño privado, Smart TV, Aire acondicionado');
    setDescription('Habitación amplia y moderna con luz natural.');
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setNumber(room.number);
    setType(room.type);
    setCapacity(room.capacity);
    setPricePerNight(room.pricePerNight);
    setStatus(room.status);
    setFloor(room.floor);
    setAmenitiesInput(room.amenities.join(', '));
    setDescription(room.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim() || pricePerNight <= 0) return;

    const amenities = amenitiesInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    if (editingRoom) {
      const res = updateRoom(editingRoom.id, {
        number: number.trim(),
        type,
        capacity,
        pricePerNight,
        status,
        floor,
        amenities,
        description: description.trim(),
      });
      if (res.success) setIsModalOpen(false);
    } else {
      const res = createRoom({
        number: number.trim(),
        type,
        capacity,
        pricePerNight,
        status,
        floor,
        amenities,
        description: description.trim(),
      });
      if (res.success) setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
            <Layers className="w-3.5 h-3.5" />
            Panel de Administración Exclusivo
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-teal-700" />
            Gestión de Habitaciones y Tarifas
          </h2>
          <p className="text-xs text-slate-500">
            Define nuevas habitaciones, ajusta tarifas por noche, capacidades y estados de mantenimiento.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Habitación</span>
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {rooms.map((room) => {
          const badge = getRoomStatusBadge(room.status);

          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-black text-slate-900 font-mono">
                    Hab. {room.number}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Tipo & Piso</span>
                      <span className="font-bold text-slate-800">{room.type} (Piso {room.floor})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Tarifa / Noche</span>
                      <span className="text-sm font-black text-teal-800">${room.pricePerNight}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600 pt-1">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>Capacidad: {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}</span>
                  </div>

                  <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                    {room.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Servicios
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(room)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar y Tarifa</span>
                </button>
                <button
                  onClick={() => setDeletingRoomId(room.id)}
                  title="Eliminar habitación"
                  className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingRoomId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">¿Eliminar esta habitación?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Solo se pueden eliminar habitaciones que no cuenten con reservas activas.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingRoomId(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRoom(deletingRoomId);
                  setDeletingRoomId(null);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingRoom ? `Editar Habitación ${editingRoom.number}` : 'Nueva Habitación'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Habitación *</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Ej: 104"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Piso</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={floor}
                    onChange={(e) => setFloor(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Habitación *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Doble">Doble</option>
                    <option value="Matrimonial">Matrimonial</option>
                    <option value="Suite">Suite</option>
                    <option value="Familiar">Familiar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacidad (Personas) *</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarifa por Noche ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min={1}
                      step="1"
                      required
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-teal-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado de la Habitación</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Ocupada">Ocupada</option>
                    <option value="En Limpieza">En Limpieza</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Servicios y Comodidades (separados por coma)
                </label>
                <input
                  type="text"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  placeholder="Ej: WiFi 6, Jacuzzi, Smart TV, Balcón"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre vista, distribución, camas..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!number.trim() || pricePerNight <= 0}
                  className="flex-1 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-600 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  {editingRoom ? 'Guardar Cambios' : 'Crear Habitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
