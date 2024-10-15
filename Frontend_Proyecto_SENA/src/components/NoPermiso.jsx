import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importamos un ícono de advertencia

const NoPermiso = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <FaExclamationTriangle className="text-red-600 text-6xl animate-bounce mb-4" />
      <h1 className="text-4xl font-bold text-sena mb-4">
        NO TIENES EL PERMISO
      </h1>
      <p className="text-lg text-black">
        Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
      </p>
    </div>
  );
}

export default NoPermiso;
