/**
 * Componente Cart (Carrito)
 * Offcanvas lateral que muestra los items agregados
 * Permite modificar cantidades y proceder al pago
 */
import { useEffect, useRef } from 'react';

export default function Cart({
  carrito,
  visible,
  onCerrar,
  onActualizarCantidad,
  onEliminarItem,
  onProcederPago,
  mesaSeleccionada
}) {
  const offcanvasRef = useRef(null);
  const bsOffcanvasRef = useRef(null);

  // Controlar apertura/cierre del offcanvas con Bootstrap
  useEffect(() => {
    let bsOffcanvas = null;
    const initOffcanvas = async () => {
      const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
      if (offcanvasRef.current && !bsOffcanvasRef.current) {
        bsOffcanvas = new bootstrap.Offcanvas(offcanvasRef.current);
        bsOffcanvasRef.current = bsOffcanvas;

        // Escuchar evento de cierre
        offcanvasRef.current.addEventListener('hidden.bs.offcanvas', () => {
          onCerrar();
        });
      }

      if (visible && bsOffcanvasRef.current) {
        bsOffcanvasRef.current.show();
      } else if (!visible && bsOffcanvasRef.current) {
        bsOffcanvasRef.current.hide();
      }
    };
    initOffcanvas();
  }, [visible]);

  // Calcular el total del carrito
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div
      ref={offcanvasRef}
      className="offcanvas offcanvas-end offcanvas-cart"
      tabIndex="-1"
      id="carritoOffcanvas"
    >
      {/* Encabezado */}
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">
          <i className="bi bi-bag-fill me-2"></i>Tu Pedido
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={onCerrar}
        ></button>
      </div>

      {/* Cuerpo del carrito */}
      <div className="offcanvas-body d-flex flex-column">
        {carrito.length === 0 ? (
          /* Carrito vacío */
          <div className="text-center py-5">
            <i className="bi bi-bag-x" style={{ fontSize: '3rem', color: 'var(--cafe-suave)' }}></i>
            <p className="mt-3" style={{ color: 'var(--cafe-suave)' }}>
              Tu carrito está vacío
            </p>
            <small className="text-muted">Agrega productos desde el menú</small>
          </div>
        ) : (
          <>
            {/* Info de la mesa */}
            {mesaSeleccionada !== null && (
              <div className="alert py-2 px-3 mb-3" style={{
                background: 'rgba(139, 111, 71, 0.1)',
                border: '1px solid var(--marron-seleccionado)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--cafe-oscuro)'
              }}>
                <i className="bi bi-geo-alt-fill me-1"></i>
                Mesa <strong>{mesaSeleccionada + 1}</strong>
              </div>
            )}

            {/* Lista de items */}
            <div className="flex-grow-1">
              {carrito.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="cart-item-info">
                    <h6>{item.nombre}</h6>
                    <span className="price">${item.precio.toFixed(2)}</span>
                  </div>
                  <div className="cart-qty-controls">
                    {/* Botón decrementar / eliminar */}
                    <button
                      onClick={() =>
                        item.cantidad > 1
                          ? onActualizarCantidad(item.id, item.cantidad - 1)
                          : onEliminarItem(item.id)
                      }
                    >
                      {item.cantidad > 1 ? '−' : <i className="bi bi-trash3" style={{ fontSize: '0.7rem' }}></i>}
                    </button>
                    <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                      {item.cantidad}
                    </span>
                    {/* Botón incrementar */}
                    <button onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total y botón de pago */}
            <div className="mt-auto">
              <div className="cart-total">
                <h5>Total</h5>
                <h5>${total.toFixed(2)}</h5>
              </div>
              <button
                className="btn btn-coffee w-100 mt-3"
                onClick={onProcederPago}
              >
                <i className="bi bi-credit-card me-2"></i>
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
