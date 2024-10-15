import React, { useState } from "react";

const Firmas = ({ accordionStates, toggleAccordion }) => {
  const [firmaImagen, setFirmaImagen] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFirmaImagen(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      {accordionStates.firmas && (
        <div className="flex flex-col rounded-lg w-full3">
          <div className="flex flex-col">
            <div>
                <label className="mb-2 font-bold text-xs">Firma de quien hace el pedido:*</label>
                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="font-inter text-xs ml-2 mb-4"
                />
            </div>

            {firmaImagen && (
              <div className="mt-2">
                <p className="font-bold text-xs mb-2">Vista previa:</p>
                <img
                  src={firmaImagen}
                  alt="Firma"
                  className="h-24 w-auto border border-black rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Firmas;
