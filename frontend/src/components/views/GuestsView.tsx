import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  FileBadge,
  Globe,
  Calendar,
  X,
  Edit2,
  DollarSign,
  BedDouble,
} from 'lucide-react';
import { Guest } from '../../types';
import { formatCurrency, formatDateSpanish } from '../../utils/formatters';

export const GuestsView: React.FC = () => {
  const { guests, reservations, createGuest, updateGuest } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [documentType, setDocumentType] = useState<'DNI' | 'Pasaporte' | 'Cédula'>('DNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('España');

  // Selected guest for drawer/modal history
  const [selectedGuestForHistory, setSelectedGuestForHistory] = useState<Guest | null>(null);

  const filteredGuests = guests.filter((g) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      g.fullName.toLowerCase().includes(term) ||
      g.documentNumber.toLowerCase().includes(term) ||
      g.email.toLowerCase().includes(term) ||
      g.phone.toLowerCase().includes(term)
    );
  });

  const openCreateModal = () => {
    setEditingGuest(null);
    setFullName('');
    setDocumentType('DNI');
    setDocumentNumber('');
    setEmail('');
    setPhone('');
    setNationality('España');
    setIsModalOpen(true);
  };

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setFullName(guest.fullName);
    setDocumentType(guest.documentType);
    setDocumentNumber(guest.documentNumber);
    setEmail(guest.email);
    setPhone(guest.phone);
    setNationality(guest.nationality);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !documentNumber.trim()) return;

    if (editingGuest) {
      const res = updateGuest(editingGuest.id, {
        fullName: fullName.trim(),
        documentType,
        documentNumber: documentNumber.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nationality: nationality.trim(),
      });
      if (res.success) setIsModalOpen(false);
    } else {
      const res = createGuest({
        fullName: fullName.trim(),
        documentType,
        documentNumber: documentNumber.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nationality: nationality.trim() || 'España',
      });
      if (res.success) setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            Directorio de Huéspedes
          </h2>
          <p className="text-xs text-slate-500">
            Registro de clientes, búsqueda por documento o nombre e historial de estancias.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Huésped</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, documento (DNI/Pasaporte), teléfono o email..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          {filteredGuests.length} {filteredGuests.length === 1 ? 'huésped' : 'huéspedes'}
        </span>
      </div>

      {/* Guests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuests.map((guest) => {
          const guestReservations = reservations.filter((r) => r.guestId === guest.id);
          const totalSpent = guestReservations.reduce((sum, r) => sum + r.paidAmount, 0);

          return (
            <div
              key={guest.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{guest.fullName}</h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 mt-1">
                      <FileBadge className="w-3 h-3 text-teal-600" />
                      {guest.documentType}: {guest.documentNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => openEditModal(guest)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Editar datos del huésped"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{guest.email || 'Sin correo'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{guest.phone || 'Sin teléfono'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{guest.nationality}</span>
                  </div>
                </div>
              </div>

              {/* Guest History Stats & CTA */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Estancias:</span>
                  <span className="font-bold text-slate-800">
                    {guestReservations.length} {guestReservations.length === 1 ? 'reserva' : 'reservas'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Total pagado:</span>
                  <span className="font-bold text-teal-700">{formatCurrency(totalSpent)}</span>
                </div>
              </div>

              {guestReservations.length > 0 && (
                <button
                  onClick={() => setSelectedGuestForHistory(guest)}
                  className="mt-3 w-full py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  Ver Historial de Estancias
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Guest Reservations History Modal */}
      {selectedGuestForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base">Historial de Estancias</h3>
                <p className="text-xs text-slate-300">{selectedGuestForHistory.fullName}</p>
              </div>
              <button
                onClick={() => setSelectedGuestForHistory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
              {reservations
                .filter((r) => r.guestId === selectedGuestForHistory.id)
                .map((res) => (
                  <div key={res.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-900">{res.id}</span>
                      <span className="font-bold text-teal-700">{res.status}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Fechas:</span>
                      <span className="font-medium">
                        {formatDateSpanish(res.checkIn)} al {formatDateSpanish(res.checkOut)} ({res.nights} noches)
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total facturado:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(res.totalAmount)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingGuest ? 'Editar Huésped' : 'Registrar Nuevo Huésped'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Laura Mercedes Silva"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doc.</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as any)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Cédula">Cédula</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    required
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="Ej: 44920199"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Móvil</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 611 223 344"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nacionalidad / Origen</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Ej: España, México, Colombia..."
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
                  disabled={!fullName.trim() || !documentNumber.trim()}
                  className="flex-1 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-600 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  {editingGuest ? 'Actualizar Datos' : 'Guardar Huésped'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
