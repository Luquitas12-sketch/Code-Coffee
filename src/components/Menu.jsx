/**
 * Componente Menu
 * Muestra los productos disponibles con tarjetas estilo café
 * Permite agregar productos al carrito
 */

// Lista de productos con imágenes de Unsplash
const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Espresso',
    descripcion: 'Shot intenso de café puro, perfecto para recargar energías mientras programas.',
    precio: 3.50,
    imagen: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
    icono: 'bi-cup-hot-fill'
  },
  {
    id: 2,
    nombre: 'Latte',
    descripcion: 'Suave mezcla de espresso y leche cremosa con arte latte.',
    precio: 4.50,
    imagen: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    icono: 'bi-cup-straw'
  },
  {
    id: 3,
    nombre: 'Croissant',
    descripcion: 'Croissant artesanal recién horneado, crujiente por fuera y suave por dentro.',
    precio: 3.00,
    imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop',
    icono: 'bi-egg-fried'
  },
  {
    id: 4,
    nombre: 'Avocado Toast',
    descripcion: 'Tostada de pan artesanal con aguacate fresco, semillas y un toque de limón.',
    precio: 7.50,
    imagen: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    icono: 'bi-heart-fill'
  }
];

export default function Menu({ onAgregarProducto, mesaSeleccionada }) {
  return (
    <section id="menu" className="section-wrapper" style={{ background: 'var(--blanco-hueso)' }}>
      <div className="container">
        <div className="section-title">
          <h2><i className="bi bi-cup-hot me-2"></i>Nuestro Menú</h2>
          <p>Combustible premium para tus sesiones de código</p>
        </div>

        {/* Grid de tarjetas de productos */}
        <div className="row g-4 justify-content-center">
          {PRODUCTOS.map((producto) => (
            <div key={producto.id} className="col-12 col-sm-6 col-lg-3">
              <div className="product-card fade-in-up">
                {/* Imagen del producto */}
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  loading="lazy"
                />
                <div className="card-body">
                  {/* Nombre y descripción */}
                  <h5 className="product-name">
                    <i className={`bi ${producto.icono} me-1`}></i>
                    {producto.nombre}
                  </h5>
                  <p className="product-desc">{producto.descripcion}</p>

                  {/* Precio y botón de agregar */}
                  <div className="product-footer">
                    <span className="product-price">${producto.precio.toFixed(2)}</span>
                    <button
                      className="btn btn-coffee btn-sm"
                      onClick={() => onAgregarProducto(producto)}
                      disabled={mesaSeleccionada === null}
                      title={mesaSeleccionada === null ? 'Primero selecciona una mesa' : 'Agregar al carrito'}
                    >
                      <i className="bi bi-plus-lg me-1"></i>Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay mesa seleccionada */}
        {mesaSeleccionada === null && (
          <div className="text-center mt-4">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Selecciona una mesa primero para agregar productos al carrito
            </small>
          </div>
        )}
      </div>
    </section>
  );
}

// Exportar los productos para uso en otros componentes
export { PRODUCTOS };
