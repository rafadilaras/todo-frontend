'use client';

import React from 'react';
import { authService } from '@/services/authService';

export default function UserNavHeader() {
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      authService.logout();
    }
  };

  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-dark-70">
          Daftar Tugas Saya
        </h1>
        <p className="text-xs text-muted mt-0.5">Tersinkronisasi langsung dengan Database Backend</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs font-medium px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
