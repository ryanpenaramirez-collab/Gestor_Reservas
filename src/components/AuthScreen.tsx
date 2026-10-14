import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Hotel,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  IdCard,
  Phone,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, loginAs, register, users } = useHotel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña para continuar.');
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const quickAccessAccounts = [
    {
      role: 'admin' as const,
      label: 'Administrador',
      description: 'Acceso total y reportes',
      icon: <ShieldCheck className="w-4 h-4" />,
      accent: 'hover:border-indigo-400 hover:bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      role: 'receptionist' as const,
      label: 'Recepcionista',
      description: 'Check-in / check-out y reservas',
      icon: <UserCheck className="w-4 h-4" />,
      accent: 'hover:border-teal-400 hover:bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      role: 'guest' as const,
      label: 'Huésped',
      description: 'Consulta y crea reservas',
      icon: <UserIcon className="w-4 h-4" />,
      accent: 'hover:border-sky-400 hover:bg-sky-50',
      iconColor: 'text-sky-600',
    },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Branding panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white p-12 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Hotel className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-tight">GestorReservas</p>
            <p className="text-[11px] text-slate-400">Sistema de gestión hotelera</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Gestiona tu hotel pequeño de forma{' '}
            <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
              simple y completa
            </span>
          </h1>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed">
            Habitaciones, huéspedes, check-in, check-out, pagos y reportes en un solo lugar.
            Administra cada operación del día a día desde cualquier dispositivo.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Control de ocupación y disponibilidad en tiempo real
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Registro de huéspedes y cobros por reserva
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Reportes gráficos de ingresos y ocupación
            </li>
          </ul>
        </div>

        <p className="relative text-[11px] text-slate-500">
          © {new Date().getFullYear()} GestorReservas. Todos los derechos reservados.
        </p>
      </div>

      {/* Auth form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Hotel className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">GestorReservas</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Iniciar sesión</h2>
            <p className="text-sm text-slate-500 mt-1">
              Ingresa con tu correo y contraseña para acceder al sistema.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              Iniciar sesión
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-500">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
            >
              Registrarme
            </button>
          </div>

          {/* Quick access */}
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Acceso rápido de prueba
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-4">
              {quickAccessAccounts.map((account) => {
                const target = users.find((u) => u.role === account.role);
                return (
                  <button
                    key={account.role}
                    type="button"
                    disabled={!target}
                    onClick={() => target && loginAs(target.id)}
                    title={account.description}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-slate-200 bg-white transition-all disabled:opacity-50 ${account.accent}`}
                  >
                    <span className={account.iconColor}>{account.icon}</span>
                    <span className="text-[11px] font-semibold text-slate-700 leading-tight text-center">
                      {account.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Inicia sesión al instante con una cuenta de demostración según su rol.
            </p>
          </div>
        </div>
      </div>

      {isRegisterOpen && <RegisterModal onClose={() => setIsRegisterOpen(false)} />}
    </div>
  );
};

interface RegisterModalProps {
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const { register } = useHotel();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !documentNumber.trim() || !phone.trim() || !password) {
      setError('Completa todos los campos para crear tu cuenta.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const result = register({ name, email, documentNumber, phone, password });
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white">
          <div>
            <h3 className="text-lg font-bold">Crear una cuenta</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Regístrate como huésped para reservar y gestionar tus estancias.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre completo</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Ana Martínez"
                autoComplete="name"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">ID o cédula</label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="Ej: 12345678A"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Teléfono</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: +34 600 000 000"
                  autoComplete="tel"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-colors"
            >
              Registrarme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
