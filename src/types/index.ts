export type UserRole = 'guest' | 'receptionist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  guestId?: string;
  avatar?: string;
}

export type RoomType = 'Individual' | 'Doble' | 'Matrimonial' | 'Suite' | 'Familiar';

export type RoomStatus = 'Disponible' | 'Ocupada' | 'En Limpieza' | 'Mantenimiento';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  capacity: number;
  pricePerNight: number;
  status: RoomStatus;
  floor: number;
  amenities: string[];
  description: string;
}

export interface Guest {
  id: string;
  fullName: string;
  documentType: 'DNI' | 'Pasaporte' | 'Cédula';
  documentNumber: string;
  email: string;
  phone: string;
  nationality: string;
  createdAt: string;
}

export type ReservationStatus = 'Confirmada' | 'Hospedado' | 'Finalizada' | 'Cancelada';

export type PaymentMethod = 'Efectivo' | 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia';

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  guestId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  paidAmount: number;
  status: ReservationStatus;
  numGuests: number;
  specialRequests?: string;
  createdAt: string;
  actualCheckInTime?: string;
  actualCheckOutTime?: string;
  createdByUserId: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'availability'
  | 'reservations'
  | 'guests'
  | 'rooms'
  | 'reports'
  | 'my-reservations';
