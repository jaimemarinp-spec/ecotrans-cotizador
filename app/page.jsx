'use client';

import { useMemo, useState } from "react";

const ROUTES = {
  "Santiago|Iquique": 1859,
  "Santiago|Antofagasta": 1365,
  "Santiago|Calama": 1540
};

const PAYMENT = {
  adelantado: -0.04,
  contado: 0,
  "15_dias": 0.03,
  "30_dias": 0.07
};

const PAYMENT_LABEL = {
  adelantado: "Adelantado",
  contado: "Contado al descargar",
  "15_dias": "15 días",
  "30_dias": "30 días"
};

const SERVICE_LABEL = {
  consolidado: "Consolidado",
  dedicado: "Dedicado",
  exclusivo: "Exclusivo",
  equipo_completo: "Equipo completo"
};

const WEIGHT_BANDS = [
  { min: 0, max: 5000, amount: 100000 },
  { min: 5001, max: 10000, amount: 130000 },
  { min: 10001, max: 15000, amount: 160000 },
  { min: 15001, max: 20000, amount: 190000 },
  { min: 20001, max: 26000, amount: 230000 },
  { min: 26001, max: Infinity, amount: 300000 }
];

const MAX_POSITIONS = 22;
const MAX_KG = 25000;
const MAX_M3 = 75;
const FULL_TRUCK_MIN_PER_KM = 2000;
const CONSOLIDADO_KM_REFERENCIAL = 3500;
const COST_PER_KM = 1200;
const MIN_MARGIN_CLP = 150000;
const MIN_MARGIN_PCT = 0.12;

function clp(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

function formatPct(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(0)}%`;
}

function getBandAmount(weight) {
  const band = WEIGHT_BANDS.find((b) => weight >= b.min && weight <= b.max);
  return band ? band.amount : 0;
}

export default function Page() {
  const [form, setForm] = useState({
    servicio: "consolidado",
    origen: "Santiago",
    destino: "Iquique",
    pallets: 6,
    pesoKg: 6000,
    volumenM3: 12,
    retiro: true,
    ultimaMilla: true,
    formaPago: "contado"
  });
  const [copied, setCopied] = useState(false);

  const distance = ROUTES[`${form.origen}|${form.destino}`] || 0;

  const calc = useMemo(() => {
    const valorRamplaMin = distance * FULL_TRUCK_MIN_PER_KM;
    const valorRamplaRefConsolidado = distance * CONSOLIDADO_KM_REFERENCIAL;

    const posByPallet = Number(form.pallets) || 0;
    const posByKg = ((Number(form.pesoKg) || 0) / MAX_KG) * MAX_POSITIONS;
    const posByM3 = ((Number(form.volumenM3) || 0) / MAX_M3) * MAX_POSITIONS;

    const posicionesCobrables = Math.max(posByPallet, posByKg, posByM3);
    const valorPosicion = valorRamplaRefConsolidado / MAX_POSITIONS;

    let criterioCobro = "Tarifa full truck";
    let subtotalServicio = valorRamplaMin;

    if (form.servicio === "consolidado") {
      subtotalServicio = posicionesCobrables * valorPosicion;
      if (posicionesCobrables === posByKg) criterioCobro = "Cobro por peso";
      else if (posicionesCobrables === posByM3) criterioCobro = "Cobro por volumen";
      else criterioCobro = "Cobro por posición";
    }

    const retiroFee = form.retiro ? getBandAmount(Number(form.pesoKg) || 0) : 0;
    const ultimaMillaFee = form.ultimaMilla ? getBandAmount(Number(form.pesoKg) || 0) : 0;
    const subtotalNeto = subtotalServicio + retiroFee + ultimaMillaFee;

    const paymentFactor = PAYMENT[form.formaPago] || 0;
    const paymentAdjustment = subtotalNeto * paymentFactor;
    const neto = subtotalNeto + paymentAdjustment;
    const iva = neto * 0.19;
    const total = neto + iva;

    const costoOperacion = form.servicio === "consolidado" ? null : distance * COST_PER_KM;
    const utilidad = costoOperacion === null ? null : neto - costoOperacion;
    const margenPct = utilidad === null || neto <= 0 ? null : utilidad / neto;

    let estado = "NO APLICA";
    let stateClass = "warn";

    if (form.servicio !== "consolidado") {
      if ((utilidad || 0) < 0) {
        estado = "PERDIENDO PLATA";
        stateClass = "bad";
      } else if ((utilidad || 0) < MIN_MARGIN_CLP) {
        estado = "BAJO MIN $";
        stateClass = "warn";
      } else if ((margenPct || 0) < MIN_MARGIN_PCT) {
        estado = "BAJO MIN %";
        stateClass = "warn";
      } else {
        estado = "OK";
        stateClass = "ok";
      }
    }

    return {
      valorRamplaMin,
      valorRamplaRefConsolidado,
      posByPallet,
      posByKg,
      posByM3,
      posicionesCobrables,
      valorPosicion,
      criterioCobro,
      subtotalServicio,
      retiroFee,
      ultimaMillaFee,
      subtotalNeto,
      paymentFactor,
      paymentAdjustment,
      neto,
      iva,
      total,
      costoOperacion,
      utilidad,
      margenPct,
      estado,
      stateClass
    };
  }, [form, distance]);

  const quoteText = useMemo(() => {
    return [
      "ECOTRANS SPA – COTIZACIÓN",
      `Servicio: ${SERVICE_LABEL[form.servicio]}`,
      `Ruta: ${form.origen} → ${form.destino}`,
      `Distancia referencial: ${distance} km`,
      `Carga: ${Number(form.pallets).toLocaleString("es-CL")} pallet(s) / ${Number(form.pesoKg).toLocaleString("es-CL")} kg / ${Number(form.volumenM3).toLocaleString("es-CL")} m³`,
      `Incluye retiro local: ${form.retiro ? "Sí" : "No"}`,
      `Incluye última milla: ${form.ultimaMilla ? "Sí" : "No"}`,
      `Forma de pago: ${PAYMENT_LABEL[form.formaPago]}`,
      `Criterio de cobro: ${calc.criterioCobro}`,
      "",
      `Valor neto: ${clp(calc.neto)}`,
      `IVA: ${clp(calc.iva)}`,
      `Total: ${clp(calc.total)}`,
      "",
      "Validez referencial: 24 horas",
      "Ecotrans Spa | contacto@ecotrans-spa.cl | +56 9 8530 9169"
    ].join("\n");
  }, [form, calc, distance]);

  async function copyQuote() {
    await navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="wrap">
      <section className="hero">
        <div className="heroGrid">
          <div>
            <div className="brand">
              <div className="logoMark">E</div>
              <div className="logoText"><span className="eco">Eco</span><span className="trans">trans</span></div>
            </div>

            <div style={{ marginTop: 16 }} className="badge">
              Cotizador interno · versión web operacional
            </div>

            <h1>Cotiza rápido, protege margen y evita perder plata.</h1>

            <p>
              Versión V2 basada en tu lógica operativa real: consolidado por posiciones, peso y m³; full truck con mínimo por km;
              retiro y última milla por tramo de peso; y validación automática de margen.
            </p>

            <div className="pills">
              <div className="pill">Santiago → Iquique</div>
              <div className="pill">Santiago → Antofagasta</div>
              <div className="pill">Santiago → Calama</div>
            </div>
          </div>

          <div className="card pad">
            <h3>Resumen ejecutivo</h3>
            <div className="summaryTop">
              <div className="metric">
                <small>Valor neto</small>
                <strong>{clp(calc.neto)}</strong>
              </div>
              <div className="metric">
                <small>Total final</small>
                <strong>{clp(calc.total)}</strong>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="kv"><span>Servicio</span><strong>{SERVICE_LABEL[form.servicio]}</strong></div>
              <div className="kv"><span>Criterio</span><strong>{calc.criterioCobro}</strong></div>
              <div className="kv"><span>Distancia</span><strong>{distance} km</strong></div>
              <div className="kv"><span>Estado utilidad</span><span className={`state ${calc.stateClass}`}>{calc.estado}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sectionGrid">
        <div className="card pad">
          <h2>Datos de cotización</h2>
          <p className="note" style={{ marginTop: 8, marginBottom: 18 }}>
            Prioridades: no perder plata, cumplir margen mínimo, cotizar rápido, calcular bien posiciones y automatizar validación.
          </p>

          <div className="formGrid">
            <div className="field">
              <label>Servicio</label>
              <select value={form.servicio} onChange={(e) => updateField("servicio", e.target.value)}>
                <option value="consolidado">Consolidado</option>
                <option value="dedicado">Dedicado</option>
                <option value="exclusivo">Exclusivo</option>
                <option value="equipo_completo">Equipo completo</option>
              </select>
            </div>

            <div className="field">
              <label>Forma de pago</label>
              <select value={form.formaPago} onChange={(e) => updateField("formaPago", e.target.value)}>
                <option value="adelantado">Adelantado</option>
                <option value="contado">Contado al descargar</option>
                <option value="15_dias">15 días</option>
                <option value="30_dias">30 días</option>
              </select>
            </div>

            <div className="field">
              <label>Origen</label>
              <select value={form.origen} onChange={(e) => updateField("origen", e.target.value)}>
                <option value="Santiago">Santiago</option>
              </select>
            </div>

            <div className="field">
              <label>Destino</label>
              <select value={form.destino} onChange={(e) => updateField("destino", e.target.value)}>
                <option value="Iquique">Iquique</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="Calama">Calama</option>
              </select>
            </div>

            <div className="field">
              <label>Pallets / posiciones físicas</label>
              <input type="number" min="0" value={form.pallets} onChange={(e) => updateField("pallets", Number(e.target.value))} />
            </div>

            <div className="field">
              <label>Peso total (kg)</label>
              <input type="number" min="0" value={form.pesoKg} onChange={(e) => updateField("pesoKg", Number(e.target.value))} />
            </div>

            <div className="field">
              <label>Volumen total (m³)</label>
              <input type="number" min="0" step="0.1" value={form.volumenM3} onChange={(e) => updateField("volumenM3", Number(e.target.value))} />
            </div>

            <div className="field">
              <label>Tarifa consolidado referencial</label>
              <input type="text" value={clp(CONSOLIDADO_KM_REFERENCIAL) + " / km"} readOnly />
            </div>
          </div>

          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            <div className="toggleRow">
              <div>
                <strong>Retiro local</strong>
                <div className="subtle">Se calcula por tramo de peso</div>
              </div>
              <input type="checkbox" checked={form.retiro} onChange={(e) => updateField("retiro", e.target.checked)} />
            </div>

            <div className="toggleRow">
              <div>
                <strong>Última milla</strong>
                <div className="subtle">Se calcula por tramo de peso</div>
              </div>
              <input type="checkbox" checked={form.ultimaMilla} onChange={(e) => updateField("ultimaMilla", e.target.checked)} />
            </div>
          </div>
        </div>

        <div className="rightCol">
          <div className="card pad">
            <h3>Resultado comercial</h3>
            <div style={{ marginTop: 12 }}>
              <div className="kv"><span>Subtotal servicio</span><strong>{clp(calc.subtotalServicio)}</strong></div>
              <div className="kv"><span>Retiro local</span><strong>{clp(calc.retiroFee)}</strong></div>
              <div className="kv"><span>Última milla</span><strong>{clp(calc.ultimaMillaFee)}</strong></div>
              <div className="kv"><span>Ajuste forma de pago ({formatPct(calc.paymentFactor)})</span><strong>{clp(calc.paymentAdjustment)}</strong></div>
              <div className="divider"></div>
              <div className="kv"><span>Neto</span><strong>{clp(calc.neto)}</strong></div>
              <div className="kv"><span>IVA</span><strong>{clp(calc.iva)}</strong></div>
              <div className="kv"><span className="total">Total</span><strong className="total">{clp(calc.total)}</strong></div>
            </div>
          </div>

          <div className="card pad">
            <h3>Validación y margen</h3>
            <div style={{ marginTop: 12 }}>
              <div className="kv"><span>Posiciones por pallet</span><strong>{calc.posByPallet.toFixed(2)}</strong></div>
              <div className="kv"><span>Posiciones por kg</span><strong>{calc.posByKg.toFixed(2)}</strong></div>
              <div className="kv"><span>Posiciones por m³</span><strong>{calc.posByM3.toFixed(2)}</strong></div>
              <div className="kv"><span>Posiciones cobrables</span><strong>{calc.posicionesCobrables.toFixed(2)}</strong></div>
              <div className="kv"><span>Valor por posición</span><strong>{clp(calc.valorPosicion)}</strong></div>
              <div className="kv"><span>Costo operación</span><strong>{calc.costoOperacion === null ? "No aplica en consolidado" : clp(calc.costoOperacion)}</strong></div>
              <div className="kv"><span>Utilidad estimada</span><strong>{calc.utilidad === null ? "No aplica" : clp(calc.utilidad)}</strong></div>
              <div className="kv"><span>Margen %</span><strong>{calc.margenPct === null ? "No aplica" : `${(calc.margenPct * 100).toFixed(1)}%`}</strong></div>
              <div className="kv"><span>Estado</span><span className={`state ${calc.stateClass}`}>{calc.estado}</span></div>
            </div>
          </div>

          <div className="card pad">
            <h3>Mensaje listo para enviar</h3>
            <div className="quoteBox" style={{ marginTop: 12 }}>{quoteText}</div>
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={copyQuote}>
                {copied ? "Copiado" : "Copiar cotización"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="footer">
        <div>Ecotrans Spa · contacto@ecotrans-spa.cl</div>
        <div>+56 9 8530 9169</div>
        <div>Base validada según parámetros confirmados</div>
      </div>
    </div>
  );
}
