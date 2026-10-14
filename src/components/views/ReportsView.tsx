import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  BedDouble,
  Calendar,
  Percent,
  Download,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { reservations, payments, rooms } = useHotel();
  const [period, setPeriod] = useState<'30days' | '6months' | 'year'>('6months');

  // Calculate metrics
  const validReservations = reservations.filter((r) => r.status !== 'Cancelada');
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const totalNightsSold = validReservations.reduce((sum, r) => sum + r.nights, 0);
  const avgStay = validReservations.length > 0 ? (totalNightsSold / validReservations.length).toFixed(1) : '0';
  const avgDailyRate = totalNightsSold > 0 ? Math.round(totalRevenue / totalNightsSold) : 0;

  // Occupancy rate calculation
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Ocupada').length;
  const currentOccupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Room type revenue distribution
  const typeStats = ['Individual', 'Doble', 'Matrimonial', 'Suite', 'Familiar'].map((type) => {
    const typeRooms = rooms.filter((r) => r.type === type);
    const roomIds = typeRooms.map((r) => r.id);
    const typeReservations = validReservations.filter((r) => roomIds.includes(r.roomId));
    const revenue = typeReservations.reduce((sum, r) => sum + r.totalAmount, 0);
    const nights = typeReservations.reduce((sum, r) => sum + r.nights, 0);

    return {
      type,
      count: typeReservations.length,
      revenue,
      nights,
      color:
        type === 'Suite'
          ? '#0d9488'
          : type === 'Matrimonial'
          ? '#0284c7'
          : type === 'Familiar'
          ? '#6366f1'
          : type === 'Doble'
          ? '#14b8a6'
          : '#64748b',
    };
  });

  const totalTypeRevenue = typeStats.reduce((sum, t) => sum + t.revenue, 0) || 1;

  // Monthly data for SVG Bar Chart (Last 6 months)
  const monthlyData = [
    { month: 'Mayo', revenue: 1420, occupancy: 58 },
    { month: 'Junio', revenue: 1980, occupancy: 65 },
    { month: 'Julio', revenue: 2650, occupancy: 82 },
    { month: 'Agosto', revenue: 3100, occupancy: 88 },
    { month: 'Septiembre', revenue: 2240, occupancy: 70 },
    { month: 'Octubre', revenue: 2890, occupancy: 76 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue)) * 1.15;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Métricas de Rendimiento
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Reportes de Ocupación e Ingresos
          </h2>
          <p className="text-xs text-slate-500">
            Analítica de facturación, ocupación porcentual y comportamiento por categoría de habitación.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          {[
            { id: '30days', label: '30 días' },
            { id: '6months', label: '6 meses' },
            { id: 'year', label: '1 año' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                period === p.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ingresos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ingresos Totales</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{formatCurrency(totalRevenue)}</span>
            <span className="text-[11px] text-teal-700 font-bold block mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% respecto al periodo anterior
            </span>
          </div>
        </div>

        {/* Ocupación Media */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ocupación Media</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">73.5%</span>
            <span className="text-[11px] text-sky-700 font-semibold block mt-1">
              Hoy: {currentOccupancy}% de ocupación
            </span>
          </div>
        </div>

        {/* Estancia Promedio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estancia Media</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{avgStay}</span>
            <span className="text-[11px] text-slate-500 block mt-1">
              noches por huésped
            </span>
          </div>
        </div>

        {/* Tarifa Media ADR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tarifa Media (ADR)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">${avgDailyRate}</span>
            <span className="text-[11px] text-slate-500 block mt-1">
              promedio facturado por noche
            </span>
          </div>
        </div>
      </div>

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SVG Bar Chart: Ingresos Mensuales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Evolución de Ingresos Mensuales
              </h3>
              <p className="text-xs text-slate-500">Monto total facturado en USD</p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Total: {formatCurrency(monthlyData.reduce((s, m) => s + m.revenue, 0))}
            </span>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="pt-4">
            <svg viewBox="0 0 500 240" className="w-full h-56 overflow-visible">
              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = 200 - pct * 170;
                const val = Math.round((pct * maxRevenue) / 100) * 100;
                return (
                  <g key={idx}>
                    <line x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                    <text x="32" y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">
                      ${val}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {monthlyData.map((d, i) => {
                const barWidth = 40;
                const spacing = 72;
                const x = 60 + i * spacing;
                const barHeight = (d.revenue / maxRevenue) * 170;
                const y = 200 - barHeight;

                return (
                  <g key={i} className="group cursor-pointer">
                    {/* Bar background hover effect */}
                    <rect
                      x={x - 4}
                      y="30"
                      width={barWidth + 8}
                      height="170"
                      fill="#f8fafc"
                      rx="6"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Value label on top of bar */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#0f172a"
                      className="opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                      ${d.revenue}
                    </text>

                    {/* Gradient Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="6"
                      fill={i === monthlyData.length - 1 ? '#0d9488' : '#334155'}
                      className="transition-all hover:opacity-90"
                    />

                    {/* X-Axis Month label */}
                    <text
                      x={x + barWidth / 2}
                      y="222"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#64748b"
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* SVG Area / Line Chart: Ocupación Porcentual */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Porcentaje de Ocupación por Periodo
              </h3>
              <p className="text-xs text-slate-500">Tasa de ocupación mensual promedio</p>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Objetivo: 70%+
            </span>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="pt-4">
            <svg viewBox="0 0 500 240" className="w-full h-56 overflow-visible">
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[20, 40, 60, 80, 100].map((val) => {
                const y = 200 - (val / 100) * 160;
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                    <text x="32" y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Line path computation */}
              {(() => {
                const points = monthlyData.map((d, i) => {
                  const x = 70 + i * 72;
                  const y = 200 - (d.occupancy / 100) * 160;
                  return { x, y, occupancy: d.occupancy, month: d.month };
                });

                const pathD = points.reduce(
                  (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                  ''
                );

                const areaD = `${pathD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#occupancyGradient)" />
                    <path d={pathD} fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {points.map((p, idx) => (
                      <g key={idx} className="group">
                        <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
                        <text
                          x={p.x}
                          y={p.y - 10}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#0369a1"
                        >
                          {p.occupancy}%
                        </text>
                        <text
                          x={p.x}
                          y="222"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill="#64748b"
                        >
                          {p.month}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* Room Category Distribution Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Rendimiento y Facturación por Tipo de Habitación
          </h3>
          <p className="text-xs text-slate-500">
            Distribución proporcional de ingresos generados por cada categoría
          </p>
        </div>

        {/* Progress bar visual */}
        <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
          {typeStats.map((stat, i) => {
            const pct = Math.round((stat.revenue / totalTypeRevenue) * 100);
            if (pct <= 0) return null;
            return (
              <div
                key={i}
                style={{ width: `${pct}%`, backgroundColor: stat.color }}
                title={`${stat.type}: ${pct}% (${formatCurrency(stat.revenue)})`}
                className="h-full transition-all duration-300 hover:opacity-85"
              />
            );
          })}
        </div>

        {/* Stats Table */}
        <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Categoría</th>
                <th className="py-2.5 px-4 text-center">Reservas</th>
                <th className="py-2.5 px-4 text-center">Noches Vendidas</th>
                <th className="py-2.5 px-4 text-right">Facturación</th>
                <th className="py-2.5 px-4 text-right">% del Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {typeStats.map((item, idx) => {
                const pct = Math.round((item.revenue / totalTypeRevenue) * 100);

                return (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 flex items-center gap-2 font-semibold text-slate-800">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.type}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-medium">{item.count}</td>
                    <td className="py-2.5 px-4 text-center font-medium">{item.nights}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatCurrency(item.revenue)}</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-600">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
