'use client';

import { useState } from "react";

export default function Page() {
  const [peso, setPeso] = useState(6000);

  return (
    <main style={{ padding: 20 }}>
      <h1>Ecotrans Cotizador</h1>
      <p>App funcionando correctamente 🚀</p>

      <input
        type="number"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
      />

      <p>Peso: {peso} kg</p>
    </main>
  );
}
