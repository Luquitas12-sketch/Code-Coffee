/**
 * Componente Navbar
 * Barra de navegación principal con marca "Code & Coffee Workspace"
 * Incluye enlaces a secciones y badge del carrito
 */
import { useEffect } from 'react';

export default function Navbar({ carrito, onAbrirCarrito, pasoActual }) {
  // Calcular cantidad total de items en el carrito
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Importar Bootstrap JS para el collapse del menú móvil
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-coffee fixed-top">
      <div className="container">
        {/* Marca / Logo */}
        <a className="navbar-brand" href="#inicio">
          <span className="brand-icon">&#9749;</span>
          Code & Coffee
        </a>

        {/* Botón hamburguesa para móvil */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <a className={`nav-link ${pasoActual === 0 ? 'active' : ''}`} href="#reservas">
                <i className="bi bi-grid-3x3-gap me-1"></i>Reservas
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${pasoActual === 1 ? 'active' : ''}`} href="#menu">
                <i className="bi bi-cup-hot me-1"></i>Menú
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${pasoActual === 2 ? 'active' : ''}`} href="#pago">
                <i className="bi bi-credit-card me-1"></i>Pago
              </a>
            </li>
            {/* Botón del carrito con badge */}
            <li className="nav-item ms-lg-2">
              <button
                className="btn btn-coffee-outline cart-badge position-relative"
                onClick={onAbrirCarrito}
              >
                <i className="bi bi-bag me-1"></i>Carrito
                {totalItems > 0 && (
                  <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                    {totalItems}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
