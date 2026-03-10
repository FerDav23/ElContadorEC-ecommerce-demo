/**
 * Mock data for demo mode. No real backend or payments.
 */

// Demo users for "Sign in as Manager" / "Sign in as Client"
export const DEMO_USERS = {
  manager: {
    id: 1,
    nombres: 'Demo',
    apellidos: 'Manager',
    correo: 'demo-manager@example.com',
    cartID: 'demo-cart-manager',
    token: 'demo-token-manager',
    isAdmin: true,
  },
  client: {
    id: 2,
    nombres: 'Demo',
    apellidos: 'Client',
    correo: 'demo-client@example.com',
    cartID: 'demo-cart-client',
    token: 'demo-token-client',
    isAdmin: false,
  },
};

// Categories (categorias) – shape expected by Home and useCategorias
export const MOCK_CATEGORIAS = [
  { id_categoria: 1, nombre: 'Monthly/Annual Returns', color: '#4285F4', imagen: 'file-invoice' },
  { id_categoria: 2, nombre: 'Income Tax', color: '#34A853', imagen: 'calculator' },
  { id_categoria: 3, nombre: 'SRI Refunds', color: '#FBBC05', imagen: 'receipt' },
  { id_categoria: 4, nombre: 'External Audit', color: '#EA4335', imagen: 'shield-alt' },
  { id_categoria: 5, nombre: 'Legal Services', color: '#9C27B0', imagen: 'users' },
];

// Subcategories (subcategorias)
export const MOCK_SUBCATEGORIAS = [
  { id_subcategoria: 1, nombre: 'Small business', id_servicio: 1 },
  { id_subcategoria: 2, nombre: 'Medium business', id_servicio: 1 },
  { id_subcategoria: 3, nombre: 'Individual', id_servicio: 2 },
  { id_subcategoria: 4, nombre: 'Company', id_servicio: 2 },
  { id_subcategoria: 5, nombre: 'Standard', id_servicio: 3 },
  { id_subcategoria: 6, nombre: 'Express', id_servicio: 3 },
  { id_subcategoria: 7, nombre: 'Full audit', id_servicio: 4 },
  { id_subcategoria: 8, nombre: 'Review', id_servicio: 4 },
  { id_subcategoria: 9, nombre: 'Consultation', id_servicio: 5 },
];

// Services (servicios) – id_servicio, nombre, descripcion, id_categoria
export const MOCK_SERVICIOS = [
  { id_servicio: 1, nombre: 'Monthly declarations', descripcion: 'Monthly tax and accounting declarations for businesses.', id_categoria: 1 },
  { id_servicio: 2, nombre: 'Income tax filing', descripcion: 'Annual income tax preparation and filing.', id_categoria: 2 },
  { id_servicio: 3, nombre: 'SRI refund process', descripcion: 'Assistance with SRI refund requests and follow-up.', id_categoria: 3 },
  { id_servicio: 4, nombre: 'External audit', descripcion: 'Independent audit services for companies.', id_categoria: 4 },
  { id_servicio: 5, nombre: 'Legal advisory', descripcion: 'Legal and compliance advisory for businesses.', id_categoria: 5 },
];

// Items (pricing per service + subcategory) – id_item, id_servicio, id_subcategoria, precio
export const MOCK_ITEMS = [
  { id_item: 1, id_servicio: 1, id_subcategoria: 1, precio: 50 },
  { id_item: 2, id_servicio: 1, id_subcategoria: 2, precio: 120 },
  { id_item: 3, id_servicio: 2, id_subcategoria: 3, precio: 80 },
  { id_item: 4, id_servicio: 2, id_subcategoria: 4, precio: 200 },
  { id_item: 5, id_servicio: 3, id_subcategoria: 5, precio: 60 },
  { id_item: 6, id_servicio: 3, id_subcategoria: 6, precio: 100 },
  { id_item: 7, id_servicio: 4, id_subcategoria: 7, precio: 500 },
  { id_item: 8, id_servicio: 4, id_subcategoria: 8, precio: 250 },
  { id_item: 9, id_servicio: 5, id_subcategoria: 9, precio: 75 },
];

// Servicios with Items (for useAllServicios shape – each Item has Subcategoria)
export function getMockServiciosWithItems() {
  return MOCK_SERVICIOS.map((servicio) => {
    const itemsForServicio = MOCK_ITEMS.filter((i) => i.id_servicio === servicio.id_servicio);
    const Items = itemsForServicio.map((item) => {
      const sub = MOCK_SUBCATEGORIAS.find((s) => s.id_subcategoria === item.id_subcategoria);
      return {
        ...item,
        Subcategoria: sub || { id_subcategoria: item.id_subcategoria, nombre: 'N/A', id_servicio: servicio.id_servicio },
      };
    });
    return { ...servicio, Items, subcategorias: MOCK_SUBCATEGORIAS.filter((s) => s.id_servicio === servicio.id_servicio) };
  });
}

// Características per service (for ServicioPage)
export const MOCK_CARACTERISTICAS_BY_SERVICIO = {
  1: [
    { id_caracteristica: 1, nombre: 'Monthly reporting', descripcion: 'Detailed monthly reports.' },
    { id_caracteristica: 2, nombre: 'SRI compliance', descripcion: 'SRI-compliant filings.' },
  ],
  2: [
    { id_caracteristica: 3, nombre: 'Tax optimization', descripcion: 'Legal deductions and credits.' },
  ],
  3: [{ id_caracteristica: 4, nombre: 'Refund tracking', descripcion: 'Status updates on refunds.' }],
  4: [{ id_caracteristica: 5, nombre: 'Audit report', descripcion: 'Formal audit report delivery.' }],
  5: [{ id_caracteristica: 6, nombre: 'Legal opinion', descripcion: 'Written legal opinions.' }],
};

// Flat list of all características (for Admin Panel useCaracteristicas)
export const MOCK_CARACTERISTICAS = [
  { id_caracteristica: 1, nombre: 'Monthly reporting', descripcion: 'Detailed monthly reports.' },
  { id_caracteristica: 2, nombre: 'SRI compliance', descripcion: 'SRI-compliant filings.' },
  { id_caracteristica: 3, nombre: 'Tax optimization', descripcion: 'Legal deductions and credits.' },
  { id_caracteristica: 4, nombre: 'Refund tracking', descripcion: 'Status updates on refunds.' },
  { id_caracteristica: 5, nombre: 'Audit report', descripcion: 'Formal audit report delivery.' },
  { id_caracteristica: 6, nombre: 'Legal opinion', descripcion: 'Written legal opinions.' },
];

// Cart items – keyed by cartID for demo (in-memory; default empty)
const demoCartStore = { 'demo-cart-manager': [], 'demo-cart-client': [] };
export function getMockCartItems(cartID) {
  return demoCartStore[cartID] || [];
}
export function setMockCartItems(cartID, items) {
  if (demoCartStore[cartID]) demoCartStore[cartID] = items;
  else demoCartStore[cartID] = items;
}

// Cards (for Paymentez mock) – fake tokens, demo only
export const MOCK_CARDS = {
  1: [
    { bin: '411111', status: 'valid', token: 'demo-card-token-1', holder_name: 'Demo User', expiry_year: '2026', expiry_month: '12', type: 'vi', number: '4242' },
  ],
  2: [
    { bin: '511915', status: 'valid', token: 'demo-card-token-2', holder_name: 'Demo Client', expiry_year: '2026', expiry_month: '06', type: 'mc', number: '7991' },
  ],
};

// Banner (for ServicioPage random banner)
export const MOCK_BANNER = { success: true, data: { url: null } };
