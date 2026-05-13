/**
 * Componente Checkout (Formulario de Pago)
 * Formulario interactivo para completar la reserva
 * Opciones: Tarjeta de Crédito o Efectivo al Retirar
 */
import { useState } from 'react';

export default function Checkout({ carrito, mesaSeleccionada, onConfirmar }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    metodoPago: 'tarjeta', // 'tarjeta' o 'efectivo'
    numeroTarjeta: '',
    expiracion: '',
    cvv: ''
  });

  // Estado de validación
  const [errores, setErrores] = useState({});

  // Calcular total
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validar formulario
  const validar = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'Email no válido';
    }

    // Validar campos de tarjeta solo si eligió tarjeta
    if (formData.metodoPago === 'tarjeta') {
      if (!formData.numeroTarjeta.trim()) nuevosErrores.numeroTarjeta = 'Número de tarjeta requerido';
      if (!formData.expiracion.trim()) nuevosErrores.expiracion = 'Fecha requerida';
      if (!formData.cvv.trim()) nuevosErrores.cvv = 'CVV requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) {
      onConfirmar(formData);
    }
  };

  return (
    <section id="pago" className="section-wrapper">
      <div className="container">
        <div className="section-title">
          <h2><i className="bi bi-credit-card me-2"></i>Finalizar Reserva</h2>
          <p>Completa tus datos para confirmar tu pedido</p>
        </div>

        <div className="checkout-card fade-in-up">
          <form onSubmit={handleSubmit}>
            {/* Resumen de la reserva */}
            <div className="order-summary mb-4">
              <h6><i className="bi bi-receipt me-1"></i> Resumen del Pedido</h6>
              <div className="summary-item">
                <span><i className="bi bi-geo-alt me-1"></i>Mesa</span>
                <strong>Mesa {mesaSeleccionada + 1}</strong>
              </div>
              {carrito.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-item" style={{ borderBottom: 'none', paddingTop: '0.5rem' }}>
                <strong>Total</strong>
                <strong style={{ fontSize: '1.1rem', color: 'var(--cafe-oscuro)' }}>${total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Datos personales */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>
            </div>

            {/* Método de pago */}
            <label className="form-label mb-2">Método de Pago</label>
            <div className="row g-3 mb-4">
              {/* Opción: Tarjeta */}
              <div className="col-md-6">
                <div
                  className={`payment-option ${formData.metodoPago === 'tarjeta' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, metodoPago: 'tarjeta' }))}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="metodoPago"
                    checked={formData.metodoPago === 'tarjeta'}
                    onChange={() => setFormData(prev => ({ ...prev, metodoPago: 'tarjeta' }))}
                  />
                  <div>
                    <i className="bi bi-credit-card-2-front me-1"></i>
                    <strong>Tarjeta de Crédito</strong>
                    <br />
                    <small className="text-muted">Pago seguro en línea</small>
                  </div>
                </div>
              </div>

              {/* Opción: Efectivo */}
              <div className="col-md-6">
                <div
                  className={`payment-option ${formData.metodoPago === 'efectivo' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, metodoPago: 'efectivo' }))}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="metodoPago"
                    checked={formData.metodoPago === 'efectivo'}
                    onChange={() => setFormData(prev => ({ ...prev, metodoPago: 'efectivo' }))}
                  />
                  <div>
                    <i className="bi bi-cash-stack me-1"></i>
                    <strong>Efectivo al Retirar</strong>
                    <br />
                    <small className="text-muted">Paga cuando retires tu pedido</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Campos de tarjeta (solo si eligió tarjeta) */}
            {formData.metodoPago === 'tarjeta' && (
              <div className="row g-3 mb-4 fade-in-up">
                <div className="col-12">
                  <label className="form-label">Número de Tarjeta</label>
                  <input
                    type="text"
                    className={`form-control ${errores.numeroTarjeta ? 'is-invalid' : ''}`}
                    name="numeroTarjeta"
                    value={formData.numeroTarjeta}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {errores.numeroTarjeta && <div className="invalid-feedback">{errores.numeroTarjeta}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label">Expiración</label>
                  <input
                    type="text"
                    className={`form-control ${errores.expiracion ? 'is-invalid' : ''}`}
                    name="expiracion"
                    value={formData.expiracion}
                    onChange={handleChange}
                    placeholder="MM/AA"
                    maxLength="5"
                  />
                  {errores.expiracion && <div className="invalid-feedback">{errores.expiracion}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    className={`form-control ${errores.cvv ? 'is-invalid' : ''}`}
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                  />
                  {errores.cvv && <div className="invalid-feedback">{errores.cvv}</div>}
                </div>
              </div>
            )}

            {/* Botón de confirmar */}
            <button type="submit" className="btn btn-coffee w-100 py-3" style={{ fontSize: '1.05rem' }}>
              <i className="bi bi-check-circle me-2"></i>
              Confirmar Reserva — ${total.toFixed(2)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
