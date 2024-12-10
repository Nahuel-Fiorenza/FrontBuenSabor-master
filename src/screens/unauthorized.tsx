// src/screens/Unauthorized.tsx
import React from 'react';

const Unauthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">Acceso Denegado</h1>
      <p className="mt-4 text-lg text-gray-700">
        No tienes los permisos necesarios para acceder a esta página.
      </p>
    </div>
  );
};

export default Unauthorized;
