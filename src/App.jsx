/**
 * ============================================
 * App.jsx — Code & Coffee Workspace
 * Componente principal de la aplicación
 * Gestiona el estado global y el flujo de la SPA
 * ============================================
 */
import { useState } from 'react';

// Importar componentes
import Navbar from './components/Navbar';
import TableMap from './components/TableMap';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracker from './components/OrderTracker';

export default function App() {
  // ============================================
  // Estado principal de la aplicación
  // ============================================

  // Mesa seleccionada por el usuario (null = ninguna)
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  // Carrito de compras: array de { id, nombre, precio, imagen, cantidad }
  const [carrito, setCarrito] = useState([]);

  // Paso actual del flujo: 0=reserva+menú, 1=menú, 2=pago, 3=tracker
  const [pasoActual, setPasoActual] = useState(0);

  // Datos del pedido confirmado
  const [pedido, setPedido] = useState(null);

  // Visibilidad del carrito offcanvas
  const [carritoVisible, setCarritoVisible] = useState(false);

  // ============================================
  // Funciones de gestión del carrito
  // ============================================

  /**
   * Agregar un producto al carrito
   * Si ya existe, incrementa la cantidad
   */
  const agregarProducto = (producto) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.id === producto.id);
      if (existente) {
        // Incrementar cantidad del producto existente
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // Agregar nuevo producto con cantidad 1
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  /**
   * Actualizar la cantidad de un producto en el carrito
   */
  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  /**
   * Eliminar un producto del carrito
   */
  const eliminarItem = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  // ============================================
  // Funciones de navegación del flujo
  // ============================================

  /**
   * Ir al checkout (desde el carrito)
   */
  const procederPago = () => {
    setCarritoVisible(false);
    setPasoActual(2);
    // Scroll suave al formulario de pago
    setTimeout(() => {
      document.getElementById('pago')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  /**
   * Confirmar la reserva y activar el tracker
   */
  const confirmarReserva = (datosFormulario) => {
    setPedido(datosFormulario);
    setPasoActual(3);
    // Scroll al inicio para ver el tracker
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Reiniciar todo para un nuevo pedido
   */
  const nuevoPedido = () => {
    setMesaSeleccionada(null);
    setCarrito([]);
    setPasoActual(0);
    setPedido(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================
  // Renderizado condicional según el paso actual
  // ============================================
  return (
    <div className="app">
      {/* Barra de navegación (siempre visible excepto en tracker) */}
      {pasoActual !== 3 && (
        <Navbar
          carrito={carrito}
          onAbrirCarrito={() => setCarritoVisible(true)}
          pasoActual={pasoActual}
        />
      )}

      {/* Contenido principal */}
      <main style={{ paddingTop: pasoActual !== 3 ? '76px' : '0' }}>
        {/* === PASO 3: Order Tracker (pantalla completa) === */}
        {pasoActual === 3 && pedido && (
          <OrderTracker
            pedido={pedido}
            carrito={carrito}
            mesaSeleccionada={mesaSeleccionada}
            onNuevoPedido={nuevoPedido}
          />
        )}

        {/* === PASOS 0-2: Flujo de reserva === */}
        {pasoActual !== 3 && (
          <>
            {/* Hero Section */}
            <section className="hero-section" id="inicio">
              <div className="container">
                <h1 className="fade-in-up">&#9749; Code & Coffee Workspace</h1>
                <p className="fade-in-up" style={{ animationDelay: '0.1s' }}>
                  Tu espacio ideal para programar, crear y disfrutar del mejor café.
                  Reserva tu mesa, elige tu pedido y comienza a codear.
                </p>

                {/* Indicador de pasos */}
                <div className="step-indicator mt-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {[0, 1, 2].map(step => (
                    <div
                      key={step}
                      className={`step-dot-indicator ${pasoActual >= step ? 'active' : ''}`}
                    ></div>
                  ))}
                </div>
              </div>
            </section>

            {/* PASO 0: Mapa de Mesas (siempre visible en flujo) */}
            <TableMap
              mesaSeleccionada={mesaSeleccionada}
              onSeleccionarMesa={setMesaSeleccionada}
            />

            {/* PASO 0-1: Menú de Productos (siempre visible en flujo) */}
            <Menu
              onAgregarProducto={agregarProducto}
              mesaSeleccionada={mesaSeleccionada}
            />

            {/* PASO 2: Checkout (solo cuando hay items y se procede al pago) */}
            {pasoActual >= 2 && carrito.length > 0 && (
              <Checkout
                carrito={carrito}
                mesaSeleccionada={mesaSeleccionada}
                onConfirmar={confirmarReserva}
              />
            )}

            {/* Footer */}
            <footer className="text-center py-4" style={{ color: 'var(--cafe-suave)', fontSize: '0.9rem' }}>
              <div className="container">
                <p className="mb-0">
                  &#9749; Code & Coffee Workspace &copy; 2026 — Proyecto Universitario
                </p>
              </div>
            </footer>
          </>
        )}
      </main>

      {/* Carrito Offcanvas (siempre montado, se controla con visibilidad) */}
      <Cart
        carrito={carrito}
        visible={carritoVisible}
        onCerrar={() => setCarritoVisible(false)}
        onActualizarCantidad={actualizarCantidad}
        onEliminarItem={eliminarItem}
        onProcederPago={procederPago}
        mesaSeleccionada={mesaSeleccionada}
      />
    </div>
  );
}
