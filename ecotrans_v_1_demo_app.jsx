export default function EcotransV1Demo() {
  const cargas = [
    {
      id: 1,
      tipo: 'Rollo',
      nombre: 'Rollo largo',
      cantidad: 3,
      largo: 5.0,
      ancho: 0.4,
      alto: 0.4,
      peso: 140,
      orientacion: 'Acostado',
      apilable: 'No',
      recibe: 'Sí',
      fragil: 'No',
      prioridad: 'Larga',
      grupo: 'A',
      color: 'bg-sky-500'
    },
    {
      id: 2,
      tipo: 'Caja',
      nombre: 'Cajas varias',
      cantidad: 8,
      largo: 0.6,
      ancho: 0.5,
      alto: 0.45,
      peso: 20,
      orientacion: 'Libre',
      apilable: 'Sí',
      recibe: 'Sí',
      fragil: 'No',
      prioridad: 'Normal',
      grupo: 'B',
      color: 'bg-amber-500'
    },
    {
      id: 3,
      tipo: 'Ventana',
      nombre: 'Ventana con vidrio',
      cantidad: 2,
      largo: 1.5,
      ancho: 0.12,
      alto: 2.0,
      peso: 55,
      orientacion: 'Parado',
      apilable: 'No',
      recibe: 'No',
      fragil: 'Sí',
      prioridad: 'Delicada',
      grupo: 'C',
      color: 'bg-rose-500'
    },
    {
      id: 4,
      tipo: 'Pallet',
      nombre: 'Pallet estándar',
      cantidad: 2,
      largo: 1.2,
      ancho: 1.0,
      alto: 1.4,
      peso: 320,
      orientacion: 'Libre',
      apilable: 'Sí',
      recibe: 'Sí',
      fragil: 'No',
      prioridad: 'Pesada',
      grupo: 'D',
      color: 'bg-emerald-500'
    },
  ];

  const trailerLength = 13.5;
  const trailerWidth = 2.5;
  const heightLimit = 2.7;

  const layoutTop = [
    { x: 0.0, y: 0.15, w: 5.0, h: 0.4, label: '3 rollos base', color: 'bg-sky-500' },
    { x: 5.2, y: 0.0, w: 1.2, h: 1.0, label: 'Pallet 1', color: 'bg-emerald-500' },
    { x: 6.5, y: 0.0, w: 1.2, h: 1.0, label: 'Pallet 2', color: 'bg-emerald-500' },
    { x: 5.2, y: 1.1, w: 1.8, h: 0.9, label: 'Cajas', color: 'bg-amber-500' },
    { x: 7.2, y: 1.1, w: 0.3, h: 1.2, label: 'Ventanas', color: 'bg-rose-500' },
  ];

  const isoBlocks = [
    { left: '10%', top: '58%', w: '33%', h: '11%', label: 'Rollos base 5,0 m', color: 'bg-sky-500' },
    { left: '16%', top: '41%', w: '22%', h: '13%', label: 'Cajas arriba', color: 'bg-amber-500' },
    { left: '40%', top: '46%', w: '12%', h: '15%', label: 'Pallets', color: 'bg-emerald-500' },
    { left: '56%', top: '32%', w: '4%', h: '28%', label: 'Ventanas', color: 'bg-rose-500' },
  ];

  const metrics = [
    { label: 'Largo útil', value: '13,5 m' },
    { label: 'Ancho útil', value: '2,5 m' },
    { label: 'Altura operativa', value: '2,7 m' },
    { label: 'Largo ocupado estimado', value: '7,5 m' },
    { label: 'Ancho ocupado máx.', value: '2,3 m' },
    { label: 'Altura máxima usada', value: '2,1 m' },
    { label: 'Peso total estimado', value: '1.625 kg' },
    { label: 'Uso longitudinal', value: '55,6 %' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-medium uppercase tracking-wide text-slate-500">Ecotrans · Demo V1</div>
              <h1 className="text-3xl font-bold text-slate-900">Planificador de carga</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Demo visual de las 3 pantallas base: ingreso de cargas, configuración de plataforma y resultado con vistas superior, lateral e isométrica.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center font-medium text-slate-700">Pantalla 1<br/>Cargas</div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center font-medium text-slate-700">Pantalla 2<br/>Configuración</div>
              <div className="rounded-2xl bg-sky-600 px-4 py-3 text-center font-medium text-white">Pantalla 3<br/>Resultado</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">1. Diseño de pantalla: ingreso de cargas</h2>
              <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">+ Agregar bulto</button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      {['Tipo','Nombre','Cant.','L','A','H','Peso','Orientación','Apilable','Recibe arriba','Frágil','Prioridad','Grupo'].map((h) => (
                        <th key={h} className="whitespace-nowrap px-3 py-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cargas.map((c) => (
                      <tr key={c.id} className="border-t border-slate-100">
                        <td className="px-3 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium text-white ${c.color}`}>{c.tipo}</span></td>
                        <td className="px-3 py-3 text-slate-800">{c.nombre}</td>
                        <td className="px-3 py-3">{c.cantidad}</td>
                        <td className="px-3 py-3">{c.largo}</td>
                        <td className="px-3 py-3">{c.ancho}</td>
                        <td className="px-3 py-3">{c.alto}</td>
                        <td className="px-3 py-3">{c.peso}</td>
                        <td className="px-3 py-3">{c.orientacion}</td>
                        <td className="px-3 py-3">{c.apilable}</td>
                        <td className="px-3 py-3">{c.recibe}</td>
                        <td className="px-3 py-3">{c.fragil}</td>
                        <td className="px-3 py-3">{c.prioridad}</td>
                        <td className="px-3 py-3">{c.grupo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">2. Diseño de pantalla: configuración</h2>
            <div className="space-y-4">
              {[
                ['Largo útil de plataforma', '13,5 m'],
                ['Ancho útil de plataforma', '2,5 m'],
                ['Altura operativa', '2,7 m'],
                ['Tipo de unidad', 'Semirremolque plataforma'],
                ['Modo de acomodo', 'Automático'],
                ['Objetivo', 'Minimizar largo ocupado'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 text-sm font-medium text-slate-600">{label}</div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">{value}</div>
                </div>
              ))}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                La V1 acomoda por reglas básicas: primero pesados y largos abajo, luego apilables y delicados donde corresponda.
              </div>
              <button className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white">Generar layout</button>
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">3. Demo visual inicial</h2>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">Plataforma {trailerLength.toFixed(1).replace('.', ',')} m × {trailerWidth.toFixed(1).replace('.', ',')} m</div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-700">Vista superior</div>
                <div className="relative aspect-[13.5/2.5] w-full rounded-2xl border-2 border-slate-400 bg-slate-50">
                  {layoutTop.map((b, idx) => (
                    <div
                      key={idx}
                      className={`absolute overflow-hidden rounded-lg border border-white/70 ${b.color} text-[10px] font-semibold text-white shadow-sm`}
                      style={{
                        left: `${(b.x / trailerLength) * 100}%`,
                        top: `${(b.y / trailerWidth) * 100}%`,
                        width: `${(b.w / trailerLength) * 100}%`,
                        height: `${(b.h / trailerWidth) * 100}%`,
                      }}
                    >
                      <div className="p-1">{b.label}</div>
                    </div>
                  ))}
                  <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-slate-500">
                    <span>0 m</span>
                    <span>13,5 m</span>
                  </div>
                  <div className="absolute -right-12 top-0 bottom-0 flex items-center text-xs text-slate-500 [writing-mode:vertical-rl]">2,5 m</div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-700">Vista lateral</div>
                <div className="relative h-64 rounded-2xl border-2 border-slate-300 bg-slate-50">
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-slate-300" />
                  <div className="absolute bottom-6 left-[3%] h-10 w-[37%] rounded-t-xl bg-sky-500" />
                  <div className="absolute bottom-[4.2rem] left-[8%] h-20 w-[25%] rounded-t-xl bg-amber-500/95" />
                  <div className="absolute bottom-6 left-[41%] h-16 w-[10%] rounded-t-xl bg-emerald-500" />
                  <div className="absolute bottom-6 left-[53%] h-24 w-[3%] rounded-t-lg bg-rose-500" />
                  <div className="absolute right-4 top-4 rounded-xl bg-white/90 px-3 py-2 text-xs text-slate-700 shadow">
                    Altura usada: 2,1 m<br/>Libre: 0,6 m
                  </div>
                  <div className="absolute left-2 top-2 text-xs text-slate-500">2,7 m máx.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-700">Vista isométrica</div>
              <div className="relative h-80 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-white">
                <div className="absolute left-[8%] top-[64%] h-[14%] w-[72%] skew-x-[-35deg] rounded-xl border border-slate-300 bg-slate-300/80" />
                <div className="absolute left-[16%] top-[52%] h-[18%] w-[64%] skew-x-[-35deg] rounded-xl border border-slate-300 bg-slate-200/70" />
                {isoBlocks.map((b, idx) => (
                  <div key={idx} className={`absolute rounded-xl border border-white/70 ${b.color} px-2 py-1 text-xs font-semibold text-white shadow-lg`} style={{ left: b.left, top: b.top, width: b.w, height: b.h }}>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Resumen técnico</h2>
              <div className="space-y-3">
                {metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-600">{m.label}</span>
                    <span className="font-semibold text-slate-900">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Alertas V1</h2>
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">La carga cabe dentro del largo útil y del ancho útil.</div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">Ventanas marcadas como frágiles y sin carga encima.</div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">Rollos largos usados como base del acomodo.</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Qué vendría en V2</h2>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• Cálculo legal por ejes</div>
                <div>• Tara tracto y semirremolque</div>
                <div>• Centro de gravedad y carga por eje</div>
                <div>• Ajuste manual arrastrando bultos</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
