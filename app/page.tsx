'use client';

import { useState, useEffect } from 'react';
import { withAuth } from '@/components/auth/withAuth';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

function HomePage() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState<{
    totalProductos: number;
    totalLocales: number;
    ventasHoy: number;
    stockBajo: number;
  } | null>(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data.data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="container-fluid p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {usuario?.nombreUsuario}</h1>
        <p className="text-gray-600 mt-2">Resumen de operaciones del día.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-4xl">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h6 className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">Ventas Hoy (Global)</h6>
          <h2 className="text-3xl font-bold text-emerald-600">
            ${stats?.ventasHoy?.toFixed(2) ?? '0.00'}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h6 className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">Total Productos (Global)</h6>
          <h2 className="text-3xl font-bold text-blue-600">
            {stats?.totalProductos ?? 0}
          </h2>
        </div>
      </div>

    </div>
  );
}

export default withAuth(HomePage);
