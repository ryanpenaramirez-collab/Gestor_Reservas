import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Room,
  Guest,
  Reservation,
  Payment,
  PaymentMethod,
  ActiveTab,
  RoomStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ROOMS,
  INITIAL_GUESTS,
  generateInitialReservationsAndPayments,
} from '../data/initialData';

interface NotificationState {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface HotelContextType {
  currentUser: User | null;
  users: User[];
  rooms: Room[];
  guests: Guest[];
  reservations: Reservation[];
  payments: Payment[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  notification: NotificationState | null;
  showNotification: (text: string, type?: 'success' | 'error' | 'info') => void;
  voucherReservationId: string | null;
  setVoucherReservationId: (id: string | null) => void;
  
  // Auth methods
  login: (userId: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  
  // Availability & Calculation
  calculateNights: (checkIn: string, checkOut: string) => number;
  isRoomAvailable: (
    roomId: string,
    checkIn: string,
    checkOut: string,
    excludeReservationId?: string
  ) => { available: boolean; conflict?: Reservation };
  getAvailableRooms: (
    checkIn: string,
    checkOut: string,
    roomType?: string,
    capacity?: number,
    excludeReservationId?: string
  ) => Room[];
  
  // Reservations
  createReservation: (
    data: {
      roomId: string;
      guestId: string;
      checkIn: string;
      checkOut: string;
      numGuests: number;
      specialRequests?: string;
    },
    initialPayment?: {
      amount: number;
      method: PaymentMethod;
      reference?: string;
      notes?: string;
    }
  ) => { success: boolean; message: string; reservation?: Reservation };
  
  updateReservation: (
    id: string,
    updates: {
      roomId?: string;
      checkIn?: string;
      checkOut?: string;
      numGuests?: number;
      specialRequests?: string;
    }
  ) => { success: boolean; message: string };
  
  cancelReservation: (id: string, reason?: string) => { success: boolean; message: string };
  checkInReservation: (id: string) => { success: boolean; message: string };
  checkOutReservation: (id: string) => { success: boolean; message: string };
  
  // Payments
  addPayment: (
    reservationId: string,
    amount: number,
    method: PaymentMethod,
    reference?: string,
    notes?: string
  ) => { success: boolean; message: string };
  getReservationPayments: (reservationId: string) => Payment[];
  
  // Rooms (Admin)
  createRoom: (data: Omit<Room, 'id'>) => { success: boolean; message: string; room?: Room };
  updateRoom: (id: string, updates: Partial<Room>) => { success: boolean; message: string };
  deleteRoom: (id: string) => { success: boolean; message: string };
  
  // Guests
  createGuest: (data: Omit<Guest, 'id' | 'createdAt'>) => { success: boolean; message: string; guest?: Guest };
  updateGuest: (id: string, updates: Partial<Guest>) => { success: boolean; message: string };
  
  // System
  resetToDemoData: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'gestorreservas_current_user_v1',
  ROOMS: 'gestorreservas_rooms_v1',
  GUESTS: 'gestorreservas_guests_v1',
  RESERVATIONS: 'gestorreservas_reservations_v1',
  PAYMENTS: 'gestorreservas_payments_v1',
};

const getSaved = (key: string, legacyKey?: string) => {
  return localStorage.getItem(key) || (legacyKey ? localStorage.getItem(legacyKey) : null);
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = getSaved(STORAGE_KEYS.CURRENT_USER, 'hotelgest_current_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default logged in as Receptionist for immediate operational dashboard view, or Admin
    return INITIAL_USERS[1]; // Laura Gómez (Recepcionista)
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = getSaved(STORAGE_KEYS.ROOMS, 'hotelgest_rooms_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_ROOMS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = getSaved(STORAGE_KEYS.GUESTS, 'hotelgest_guests_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_GUESTS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = getSaved(STORAGE_KEYS.RESERVATIONS, 'hotelgest_reservations_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const initial = generateInitialReservationsAndPayments();
    return initial.reservations;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = getSaved(STORAGE_KEYS.PAYMENTS, 'hotelgest_payments_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const initial = generateInitialReservationsAndPayments();
    return initial.payments;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return currentUser?.role === 'guest' ? 'my-reservations' : 'dashboard';
  });

  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [voucherReservationId, setVoucherReservationId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  // Adjust active tab when role changes
  useEffect(() => {
    if (currentUser?.role === 'guest' && (activeTab === 'dashboard' || activeTab === 'rooms' || activeTab === 'reports' || activeTab === 'guests')) {
      setActiveTab('my-reservations');
    }
  }, [currentUser]);

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setNotification({ id, text, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const login = (userId: string): boolean => {
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'guest') {
        setActiveTab('my-reservations');
      } else {
        setActiveTab('dashboard');
      }
      showNotification(`Sesión iniciada como ${user.name} (${formatRole(user.role)})`, 'success');
      return true;
    }
    showNotification('Usuario no encontrado', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showNotification('Has cerrado sesión correctamente', 'info');
  };

  const switchRole = (role: UserRole) => {
    const targetUser = INITIAL_USERS.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === 'guest') {
        setActiveTab('my-reservations');
      } else {
        setActiveTab('dashboard');
      }
      showNotification(`Rol cambiado a: ${formatRole(role)} (${targetUser.name})`, 'info');
    }
  };

  const formatRole = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'receptionist':
        return 'Recepcionista';
      case 'guest':
        return 'Huésped';
    }
  };

  const calculateNights = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Overlap verification logic
  const isRoomAvailable = (
    roomId: string,
    checkIn: string,
    checkOut: string,
    excludeReservationId?: string
  ): { available: boolean; conflict?: Reservation } => {
    if (!checkIn || !checkOut || checkIn >= checkOut) {
      return { available: false };
    }

    const room = rooms.find((r) => r.id === roomId);
    if (!room) return { available: false };

    // Find conflicting reservation
    // A conflict happens if:
    // 1. Same roomId
    // 2. Reservation is active ('Confirmada' or 'Hospedado')
    // 3. Not the excluded reservation (useful when editing)
    // 4. Dates overlap: (newCheckIn < existingCheckOut) && (newCheckOut > existingCheckIn)
    const conflict = reservations.find((res) => {
      if (res.id === excludeReservationId) return false;
      if (res.roomId !== roomId) return false;
      if (res.status === 'Cancelada' || res.status === 'Finalizada') return false;

      const overlap = checkIn < res.checkOut && checkOut > res.checkIn;
      return overlap;
    });

    if (conflict) {
      return { available: false, conflict };
    }

    return { available: true };
  };

  const getAvailableRooms = (
    checkIn: string,
    checkOut: string,
    roomType?: string,
    capacity?: number,
    excludeReservationId?: string
  ): Room[] => {
    if (!checkIn || !checkOut || checkIn >= checkOut) return [];

    return rooms.filter((room) => {
      // Must not be in maintenance
      if (room.status === 'Mantenimiento') return false;

      // Filter by type if provided
      if (roomType && roomType !== 'all' && room.type !== roomType) return false;

      // Filter by capacity if provided
      if (capacity && room.capacity < capacity) return false;

      // Check dates overlap
      const { available } = isRoomAvailable(room.id, checkIn, checkOut, excludeReservationId);
      return available;
    });
  };

  // Create Reservation
  const createReservation = (
    data: {
      roomId: string;
      guestId: string;
      checkIn: string;
      checkOut: string;
      numGuests: number;
      specialRequests?: string;
    },
    initialPayment?: {
      amount: number;
      method: PaymentMethod;
      reference?: string;
      notes?: string;
    }
  ) => {
    const { roomId, guestId, checkIn, checkOut, numGuests, specialRequests } = data;

    // Validate dates
    const nights = calculateNights(checkIn, checkOut);
    if (nights <= 0) {
      showNotification('La fecha de salida debe ser posterior a la fecha de entrada.', 'error');
      return { success: false, message: 'La fecha de salida debe ser posterior a la fecha de entrada.' };
    }

    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      showNotification('Habitación no encontrada.', 'error');
      return { success: false, message: 'Habitación no encontrada.' };
    }

    if (numGuests > room.capacity) {
      showNotification(`La habitación ${room.number} solo admite hasta ${room.capacity} personas.`, 'error');
      return { success: false, message: `Excede la capacidad máxima de la habitación (${room.capacity}).` };
    }

    // Check overlap
    const { available, conflict } = isRoomAvailable(roomId, checkIn, checkOut);
    if (!available && conflict) {
      const msg = `Conflicto de fechas: La habitación ${room.number} ya está reservada del ${conflict.checkIn} al ${conflict.checkOut}.`;
      showNotification(msg, 'error');
      return { success: false, message: msg };
    }

    const totalAmount = nights * room.pricePerNight;
    const paidAmount = initialPayment && initialPayment.amount > 0 ? initialPayment.amount : 0;
    const newId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReservation: Reservation = {
      id: newId,
      roomId,
      guestId,
      checkIn,
      checkOut,
      nights,
      pricePerNight: room.pricePerNight,
      totalAmount,
      paidAmount,
      status: 'Confirmada',
      numGuests,
      specialRequests: specialRequests?.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      createdByUserId: currentUser?.id || 'guest',
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Handle initial payment if provided
    if (initialPayment && initialPayment.amount > 0) {
      const newPayment: Payment = {
        id: `PAY-${Date.now().toString().slice(-6)}`,
        reservationId: newId,
        amount: initialPayment.amount,
        date: new Date().toISOString().split('T')[0],
        method: initialPayment.method,
        reference: initialPayment.reference?.trim() || undefined,
        notes: initialPayment.notes?.trim() || 'Pago inicial al reservar',
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    showNotification(`¡Reserva ${newId} creada con éxito para la habitación ${room.number}!`, 'success');
    return { success: true, message: 'Reserva creada exitosamente', reservation: newReservation };
  };

  // Update Reservation
  const updateReservation = (
    id: string,
    updates: {
      roomId?: string;
      checkIn?: string;
      checkOut?: string;
      numGuests?: number;
      specialRequests?: string;
    }
  ) => {
    const existing = reservations.find((r) => r.id === id);
    if (!existing) {
      showNotification('Reserva no encontrada.', 'error');
      return { success: false, message: 'Reserva no encontrada.' };
    }

    if (existing.status === 'Cancelada' || existing.status === 'Finalizada') {
      showNotification('No se puede modificar una reserva cancelada o finalizada.', 'error');
      return { success: false, message: 'No se puede modificar una reserva en este estado.' };
    }

    // Role check: Guest can only modify their own reservation
    if (currentUser?.role === 'guest' && existing.guestId !== currentUser.guestId) {
      showNotification('Solo puedes modificar tus propias reservas.', 'error');
      return { success: false, message: 'Acceso no autorizado.' };
    }

    const targetRoomId = updates.roomId || existing.roomId;
    const targetCheckIn = updates.checkIn || existing.checkIn;
    const targetCheckOut = updates.checkOut || existing.checkOut;

    const nights = calculateNights(targetCheckIn, targetCheckOut);
    if (nights <= 0) {
      showNotification('La fecha de salida debe ser posterior a la fecha de entrada.', 'error');
      return { success: false, message: 'Fechas inválidas.' };
    }

    const room = rooms.find((r) => r.id === targetRoomId);
    if (!room) {
      showNotification('Habitación no encontrada.', 'error');
      return { success: false, message: 'Habitación no encontrada.' };
    }

    if (updates.numGuests && updates.numGuests > room.capacity) {
      showNotification(`La habitación ${room.number} solo admite hasta ${room.capacity} personas.`, 'error');
      return { success: false, message: 'Capacidad excedida.' };
    }

    // Check overlap excluding this reservation
    const { available, conflict } = isRoomAvailable(targetRoomId, targetCheckIn, targetCheckOut, id);
    if (!available && conflict) {
      const msg = `Conflicto de fechas: La habitación ${room.number} ya tiene una reserva activa del ${conflict.checkIn} al ${conflict.checkOut}.`;
      showNotification(msg, 'error');
      return { success: false, message: msg };
    }

    const newTotal = nights * room.pricePerNight;

    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            roomId: targetRoomId,
            checkIn: targetCheckIn,
            checkOut: targetCheckOut,
            nights,
            pricePerNight: room.pricePerNight,
            totalAmount: newTotal,
            numGuests: updates.numGuests ?? r.numGuests,
            specialRequests: updates.specialRequests !== undefined ? updates.specialRequests : r.specialRequests,
          };
        }
        return r;
      })
    );

    showNotification(`Reserva ${id} actualizada con éxito.`, 'success');
    return { success: true, message: 'Reserva actualizada correctamente.' };
  };

  // Cancel Reservation
  const cancelReservation = (id: string, reason?: string) => {
    const existing = reservations.find((r) => r.id === id);
    if (!existing) {
      showNotification('Reserva no encontrada.', 'error');
      return { success: false, message: 'Reserva no encontrada.' };
    }

    if (existing.status === 'Cancelada') {
      showNotification('Esta reserva ya fue cancelada.', 'info');
      return { success: false, message: 'Ya cancelada.' };
    }

    if (existing.status === 'Finalizada') {
      showNotification('No se puede cancelar una estancia que ya fue completada.', 'error');
      return { success: false, message: 'No se puede cancelar una estancia completada.' };
    }

    // Check guest permission
    if (currentUser?.role === 'guest' && existing.guestId !== currentUser.guestId) {
      showNotification('Solo puedes cancelar tus propias reservas.', 'error');
      return { success: false, message: 'Acceso no autorizado.' };
    }

    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: 'Cancelada',
            specialRequests: reason ? `${r.specialRequests ? r.specialRequests + ' | ' : ''}Motivo de cancelación: ${reason}` : r.specialRequests,
          };
        }
        return r;
      })
    );

    // If room was occupied by this reservation, set to Disponible or Limpieza
    setRooms((prev) =>
      prev.map((rm) => {
        if (rm.id === existing.roomId && rm.status === 'Ocupada') {
          return { ...rm, status: 'Disponible' };
        }
        return rm;
      })
    );

    showNotification(`Reserva ${id} cancelada correctamente.`, 'info');
    return { success: true, message: 'Reserva cancelada correctamente.' };
  };

  // Check-in
  const checkInReservation = (id: string) => {
    if (currentUser?.role === 'guest') {
      showNotification('Solo el personal de recepción o administrador puede registrar el check-in.', 'error');
      return { success: false, message: 'Permiso denegado.' };
    }

    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) {
      showNotification('Reserva no encontrada.', 'error');
      return { success: false, message: 'Reserva no encontrada.' };
    }

    if (reservation.status !== 'Confirmada') {
      showNotification(`No se puede hacer check-in a una reserva en estado ${reservation.status}.`, 'error');
      return { success: false, message: 'Estado inválido para check-in.' };
    }

    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Hospedado', actualCheckInTime: timeStr } : r))
    );

    // Update room status to Ocupada
    setRooms((prev) =>
      prev.map((rm) => (rm.id === reservation.roomId ? { ...rm, status: 'Ocupada' } : rm))
    );

    showNotification(`¡Check-in realizado para reserva ${id}! Habitación asignada ocupada.`, 'success');
    return { success: true, message: 'Check-in registrado con éxito.' };
  };

  // Check-out
  const checkOutReservation = (id: string) => {
    if (currentUser?.role === 'guest') {
      showNotification('Solo el personal de recepción o administrador puede registrar el check-out.', 'error');
      return { success: false, message: 'Permiso denegado.' };
    }

    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) {
      showNotification('Reserva no encontrada.', 'error');
      return { success: false, message: 'Reserva no encontrada.' };
    }

    if (reservation.status !== 'Hospedado') {
      showNotification('Solo se puede hacer check-out a reservas con huésped hospedado.', 'error');
      return { success: false, message: 'Estado inválido para check-out.' };
    }

    const pending = reservation.totalAmount - reservation.paidAmount;
    if (pending > 0.01) {
      showNotification(`Hay un saldo pendiente de $${pending.toFixed(2)}. Por favor registre el pago antes de finalizar el check-out.`, 'error');
      return { success: false, message: `Saldo pendiente de $${pending.toFixed(2)}.` };
    }

    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Finalizada', actualCheckOutTime: timeStr } : r))
    );

    // Update room status to 'En Limpieza'
    setRooms((prev) =>
      prev.map((rm) => (rm.id === reservation.roomId ? { ...rm, status: 'En Limpieza' } : rm))
    );

    showNotification(`¡Check-out completado para reserva ${id}! La habitación pasó a estado 'En Limpieza'.`, 'success');
    return { success: true, message: 'Check-out completado.' };
  };

  // Payments
  const addPayment = (
    reservationId: string,
    amount: number,
    method: PaymentMethod,
    reference?: string,
    notes?: string
  ) => {
    if (currentUser?.role === 'guest') {
      showNotification('Solo el personal de recepción o administrador puede registrar pagos.', 'error');
      return { success: false, message: 'Permiso denegado.' };
    }

    if (amount <= 0) {
      showNotification('El monto a pagar debe ser mayor a 0.', 'error');
      return { success: false, message: 'Monto inválido.' };
    }

    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) {
      showNotification('Reserva no encontrada.', 'error');
      return { success: false, message: 'Reserva no encontrada.' };
    }

    const pending = reservation.totalAmount - reservation.paidAmount;
    if (amount > pending + 0.01) {
      showNotification(`El monto ($${amount}) supera el saldo pendiente de $${pending.toFixed(2)}.`, 'error');
      return { success: false, message: 'El monto excede el saldo pendiente.' };
    }

    const newPayment: Payment = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      reservationId,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      reference: reference?.trim() || undefined,
      notes: notes?.trim() || undefined,
    };

    setPayments((prev) => [newPayment, ...prev]);

    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === reservationId) {
          const newPaid = Number((r.paidAmount + amount).toFixed(2));
          return { ...r, paidAmount: newPaid };
        }
        return r;
      })
    );

    showNotification(`Pago de $${amount.toFixed(2)} registrado correctamente mediante ${method}.`, 'success');
    return { success: true, message: 'Pago registrado con éxito.' };
  };

  const getReservationPayments = (reservationId: string): Payment[] => {
    return payments.filter((p) => p.reservationId === reservationId);
  };

  // Room management (Admin only)
  const createRoom = (data: Omit<Room, 'id'>) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Solo el administrador puede crear nuevas habitaciones.', 'error');
      return { success: false, message: 'Permiso denegado.' };
    }

    // Check duplicate room number
    if (rooms.some((r) => r.number.trim().toLowerCase() === data.number.trim().toLowerCase())) {
      showNotification(`Ya existe una habitación con el número ${data.number}.`, 'error');
      return { success: false, message: 'Número de habitación duplicado.' };
    }

    const newRoom: Room = {
      ...data,
      id: `room-${data.number.replace(/\s+/g, '')}`,
    };

    setRooms((prev) => [...prev, newRoom]);
    showNotification(`Habitación ${newRoom.number} creada correctamente con tarifa $${newRoom.pricePerNight}/noche.`, 'success');
    return { success: true, message: 'Habitación creada.', room: newRoom };
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Solo el administrador puede modificar habitaciones y tarifas.', 'error');
      return { success: false, message: 'Permiso denegado.' };
    }

    if (updates.number) {
      const duplicate = rooms.some(
        (r) => r.id !== id && r.number.trim().toLowerCase() === updates.number?.trim().toLowerCase()
      );
      if (duplicate) {
        showNotification(`Ya existe otra habitación con el número ${updates.number}.`, 'error');
        return { success: false, message: 'Número duplicado.' };
      }
    }

    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );

    showNotification(`Habitación actualizada exitosamente.`, 'success');
    return { success: true, message: 'Habitación actualizada.' };
  };

  const deleteRoom = (id: string) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Solo el administrador puede eliminar habitaciones.', 'error');
      return { success: false, message: 'Permiso denegado.' };
    }

    // Check if room has active reservations
    const hasActiveReservations = reservations.some(
      (r) => r.roomId === id && (r.status === 'Confirmada' || r.status === 'Hospedado')
    );

    if (hasActiveReservations) {
      showNotification('No se puede eliminar una habitación con reservas confirmadas u ocupadas en curso.', 'error');
      return { success: false, message: 'La habitación tiene reservas activas.' };
    }

    setRooms((prev) => prev.filter((r) => r.id !== id));
    showNotification('Habitación eliminada correctamente.', 'info');
    return { success: true, message: 'Habitación eliminada.' };
  };

  // Guest management
  const createGuest = (data: Omit<Guest, 'id' | 'createdAt'>) => {
    // Check if document already exists
    const existing = guests.find(
      (g) => g.documentNumber.trim().toLowerCase() === data.documentNumber.trim().toLowerCase()
    );
    if (existing) {
      showNotification(`Ya existe un huésped con el documento ${data.documentNumber} (${existing.fullName}).`, 'error');
      return { success: false, message: 'Documento duplicado.', guest: existing };
    }

    const newGuest: Guest = {
      ...data,
      id: `guest-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGuests((prev) => [newGuest, ...prev]);
    showNotification(`Huésped ${newGuest.fullName} registrado correctamente.`, 'success');
    return { success: true, message: 'Huésped registrado.', guest: newGuest };
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    if (updates.documentNumber) {
      const dup = guests.find(
        (g) => g.id !== id && g.documentNumber.trim().toLowerCase() === updates.documentNumber?.trim().toLowerCase()
      );
      if (dup) {
        showNotification(`Ya existe otro huésped con el documento ${updates.documentNumber}.`, 'error');
        return { success: false, message: 'Documento duplicado.' };
      }
    }

    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showNotification('Datos del huésped actualizados.', 'success');
    return { success: true, message: 'Huésped actualizado.' };
  };

  // Reset demo data
  const resetToDemoData = () => {
    const initial = generateInitialReservationsAndPayments();
    setRooms(INITIAL_ROOMS);
    setGuests(INITIAL_GUESTS);
    setReservations(initial.reservations);
    setPayments(initial.payments);
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.GUESTS);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    showNotification('Datos de demostración restablecidos correctamente.', 'info');
  };

  return (
    <HotelContext.Provider
      value={{
        currentUser,
        users: INITIAL_USERS,
        rooms,
        guests,
        reservations,
        payments,
        activeTab,
        setActiveTab,
        notification,
        showNotification,
        voucherReservationId,
        setVoucherReservationId,
        login,
        logout,
        switchRole,
        calculateNights,
        isRoomAvailable,
        getAvailableRooms,
        createReservation,
        updateReservation,
        cancelReservation,
        checkInReservation,
        checkOutReservation,
        addPayment,
        getReservationPayments,
        createRoom,
        updateRoom,
        deleteRoom,
        createGuest,
        updateGuest,
        resetToDemoData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
