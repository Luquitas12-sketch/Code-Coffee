/**
 * Componente OrderTracker (Rastreador de Pedido)
 * Muestra el progreso del pedido con:
 * - Código de referencia único
 * - Barra de progreso animada
 * - Contador regresivo (countdown)
 * - Estados: Recibido → Preparando → Listo
 */
import { useState, useEffect } from 'react';

// Duración total de la simulación en segundos (30 seg para demo)
const DURACION_TOTAL = 30;

// Generar código de referencia único
const generarCodigo = () => {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `#CC-${num}`;
};

export default function OrderTracker({ pedido, carrito, mesaSeleccionada, onNuevoPedido }) {
  // Código de referencia (se genera una vez)
  const [codigo] = useState(generarCodigo());

  // Segundos restantes
  const [segundosRestantes, setSegundosRestantes] = useState(DURACION_TOTAL);

  // Estado actual del pedido
  const [estadoActual, setEstadoActual] = useState(0); // 0: Recibido, 1: Preparando, 2: Listo

  // Porcentaje de progreso
  const progreso = ((DURACION_TOTAL - segundosRestantes) / DURACION_TOTAL) * 100;

  // Efecto del countdown
  useEffect(() => {
    if (segundosRestantes <= 0) return;

    const timer = setInterval(() => {
      setSegundosRestantes(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Actualizar estado según el progreso
  useEffect(() => {
    if (progreso >= 100) {
      setEstadoActual(2); // Listo
    } else if (progreso >= 40) {
      setEstadoActual(1); // Preparando
    } else {
      setEstadoActual(0); // Recibido
    }
  }, [progreso]);

  // Formatear tiempo mm:ss
  const formatearTiempo = (seg) => {
    const min = Math.floor(seg / 60);
    const sec = seg % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Definir los pasos del tracker
  const pasos = [
    { icono: 'bi-receipt', label: 'Recibido' },
    { icono: 'bi-fire', label: 'Preparando' },
    { icono: 'bi-check-circle', label: 'Listo' }
  ];

  // Calcular total
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Mensajes según estado
  const mensajes = [
    '¡Tu pedido ha sido recibido! Estamos poniéndonos en marcha...',
    '¡Tu café se está preparando con cariño! Ya casi...',
    '¡Tu pedido está listo! Puedes pasar a recogerlo a tu mesa.'
  ];

  // Íconos animados según estado
  const iconosEstado = ['&#9749;', '&#128293;', '&#9989;'];

  return (
    <section className="section-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="section-title">
          <h2><i className="bi bi-graph-up me-2"></i>Estado de tu Pedido</h2>
          <p>Sigue el progreso de tu pedido en tiempo real</p>
        </div>

        <div className="tracker-card fade-in-up">
          {/* Código de referencia */}
          <div className="tracker-ref">{codigo}</div>

          {/* Ícono de estado animado */}
          <div
            className={`tracker-status-icon ${estadoActual < 2 ? 'pulse' : ''}`}
            dangerouslySetInnerHTML={{ __html: iconosEstado[estadoActual] }}
          />

          {/* Mensaje de estado */}
          <p style={{ color: 'var(--cafe-suave)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
            {mensajes[estadoActual]}
          </p>

          {/* Contador regresivo */}
          {segundosRestantes > 0 ? (
            <div className="tracker-countdown">
              {formatearTiempo(segundosRestantes)}
              <small>Tiempo estimado de preparación</small>
            </div>
          ) : (
            <div className="tracker-countdown" style={{ color: 'var(--verde-libre)' }}>
              <i className="bi bi-check-circle-fill"></i>
              <small>¡Pedido completado!</small>
            </div>
          )}

          {/* Barra de progreso */}
          <div className="progress-coffee">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progreso}%` }}
              aria-valuenow={progreso}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

          {/* Pasos del tracker */}
          <ul className="tracker-steps">
            {pasos.map((paso, index) => (
              <li
                key={index}
                className={`tracker-step ${
                  index === estadoActual ? 'active' : ''
                } ${index < estadoActual ? 'completed' : ''}`}
              >
                <div className="step-dot">
                  {index < estadoActual ? (
                    <i className="bi bi-check-lg"></i>
                  ) : (
                    <i className={`bi ${paso.icono}`}></i>
                  )}
                </div>
                <span>{paso.label}</span>
              </li>
            ))}
          </ul>

          {/* Resumen del pedido */}
          <div className="order-summary mt-4">
            <h6><i className="bi bi-receipt me-1"></i> Detalles del Pedido</h6>
            <div className="summary-item">
              <span><i className="bi bi-geo-alt me-1"></i>Mesa</span>
              <strong>Mesa {mesaSeleccionada + 1}</strong>
            </div>
            <div className="summary-item">
              <span><i className="bi bi-person me-1"></i>Cliente</span>
              <strong>{pedido.nombre}</strong>
            </div>
            <div className="summary-item">
              <span><i className="bi bi-wallet2 me-1"></i>Pago</span>
              <strong>{pedido.metodoPago === 'tarjeta' ? 'Tarjeta de Crédito' : 'Efectivo al Retirar'}</strong>
            </div>
            {carrito.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.nombre} x{item.cantidad}</span>
                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-item" style={{ borderBottom: 'none', paddingTop: '0.5rem' }}>
              <strong>Total Pagado</strong>
              <strong style={{ fontSize: '1.1rem' }}>${total.toFixed(2)}</strong>
            </div>
          </div>

          {/* Botón para nuevo pedido (solo cuando terminó) */}
          {segundosRestantes <= 0 && (
            <button
              className="btn btn-coffee w-100 mt-4 fade-in-up"
              onClick={onNuevoPedido}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Hacer Nuevo Pedido
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
