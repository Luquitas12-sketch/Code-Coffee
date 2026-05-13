/**
 * Componente TableMap (Mapa de Mesas)
 * Grid interactivo estilo Ticketmaster para seleccionar mesas
 * Estados: Libre (verde), Ocupado (rojo), Seleccionado (marrón)
 */
import { useState, useEffect } from 'react';

// Cantidad total de mesas disponibles
const TOTAL_MESAS = 12;

// Generar mesas ocupadas aleatoriamente al cargar
const generarMesasOcupadas = () => {
  const ocupadas = new Set();
  // Ocupar entre 3 y 5 mesas al azar
  const cantidadOcupadas = Math.floor(Math.random() * 3) + 3;
  while (ocupadas.size < cantidadOcupadas) {
    ocupadas.add(Math.floor(Math.random() * TOTAL_MESAS));
  }
  return ocupadas;
};

export default function TableMap({ mesaSeleccionada, onSeleccionarMesa }) {
  // Estado local para mesas ocupadas (se genera una vez al montar)
  const [mesasOcupadas, setMesasOcupadas] = useState(new Set());

  useEffect(() => {
    setMesasOcupadas(generarMesasOcupadas());
  }, []);

  // Manejar click en una mesa
  const handleClick = (index) => {
    // No permitir seleccionar mesas ocupadas
    if (mesasOcupadas.has(index)) return;

    // Toggle: si ya está seleccionada, deseleccionar
    if (mesaSeleccionada === index) {
      onSeleccionarMesa(null);
    } else {
      onSeleccionarMesa(index);
    }
  };

  // Determinar la clase CSS de cada mesa según su estado
  const obtenerClase = (index) => {
    if (mesasOcupadas.has(index)) return 'mesa-item mesa-ocupada';
    if (mesaSeleccionada === index) return 'mesa-item mesa-seleccionada';
    return 'mesa-item mesa-libre';
  };

  // Obtener ícono según estado
  const obtenerIcono = (index) => {
    if (mesasOcupadas.has(index)) return <i className="bi bi-person-fill mesa-icon"></i>;
    if (mesaSeleccionada === index) return <i className="bi bi-check-circle-fill mesa-icon"></i>;
    return <i className="bi bi-laptop mesa-icon"></i>;
  };

  // Obtener texto de estado
  const obtenerEstado = (index) => {
    if (mesasOcupadas.has(index)) return 'Ocupada';
    if (mesaSeleccionada === index) return 'Tu mesa';
    return 'Libre';
  };

  return (
    <section id="reservas" className="section-wrapper">
      <div className="container">
        <div className="section-title">
          <h2><i className="bi bi-grid-3x3-gap me-2"></i>Reserva tu Mesa</h2>
          <p>Selecciona tu espacio de trabajo ideal para programar con café</p>
        </div>

        {/* Grid de mesas */}
        <div className="table-grid">
          {Array.from({ length: TOTAL_MESAS }, (_, i) => (
            <div
              key={i}
              className={obtenerClase(i)}
              onClick={() => handleClick(i)}
              title={`Mesa ${i + 1} — ${obtenerEstado(i)}`}
            >
              {obtenerIcono(i)}
              <span>Mesa {i + 1}</span>
            </div>
          ))}
        </div>

        {/* Leyenda de colores */}
        <div className="mesa-leyenda">
          <span>
            <span className="leyenda-color" style={{ background: 'var(--verde-libre)' }}></span>
            Libre
          </span>
          <span>
            <span className="leyenda-color" style={{ background: 'var(--rojo-ocupado)' }}></span>
            Ocupada
          </span>
          <span>
            <span className="leyenda-color" style={{ background: 'var(--marron-seleccionado)' }}></span>
            Seleccionada
          </span>
        </div>

        {/* Mensaje de selección */}
        {mesaSeleccionada !== null && (
          <div className="text-center mt-3 fade-in-up">
            <div className="alert d-inline-flex align-items-center gap-2 px-4" role="alert"
              style={{
                background: 'rgba(139, 111, 71, 0.1)',
                border: '1px solid var(--marron-seleccionado)',
                borderRadius: '10px',
                color: 'var(--cafe-oscuro)'
              }}>
              <i className="bi bi-check-circle-fill"></i>
              <strong>Mesa {mesaSeleccionada + 1}</strong> seleccionada — ¡Ahora elige tu pedido!
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
