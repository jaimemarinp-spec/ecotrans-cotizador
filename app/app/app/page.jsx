'use client';
import React, { useState } from "react";

export default function Page() {
  const [peso, setPeso] = useState(6000);

  return (
    <div style={{ padding: 20 }}>
      <h1>Ecotrans Cotizador</h1>
      <p>Aplicación funcionando correctamente</p>
      <input
        type="number"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
      />
      <p>Peso ingresado: {peso} kg</p>
    </div>
  );
}
