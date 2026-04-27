/**
 * EJEMPLOS DE USO - Bulk Orders API
 *
 * Este archivo contiene ejemplos reales de payloads para crear bulk orders
 * Usa estos ejemplos con cURL, Postman o cualquier cliente HTTP
 */

// ============================================================================
// EJEMPLO 1: Bulk Order Exitoso - Caso Ideal
// ============================================================================
// Endpoint: POST http://localhost:3000/orders/bulk
// Description: Crea 3 órdenes válidas para una company

const example1_success = {
  companyId: "550e8400-e29b-41d4-a716-446655440000", // UUID válido de la company
  continueOnError: false,
  orders: [
    {
      name: "Paquete A - Electrónica",
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      description: "Laptop Dell XPS 13",
      pickup_direction: "Calle 123, Apartamento 4B, Buenos Aires",
      delivery_direction: "Avenida Libertad 456, Oficina 10, CABA",
      height: 35,
      width: 25,
      depth: 2,
      weight: 2.5,
      fragile: true,
      dangerous: false,
      cooled: false,
      urgent: true,
      unit: "cm",
      distance: 15.5,
      price: 450.0,
      image: "https://example.com/laptop.jpg",
    },
    {
      name: "Paquete B - Ropa",
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      description: "Caja de ropa (15kg)",
      pickup_direction: "Centro comercial, local 42, Mendoza",
      delivery_direction: "Almacén retail, Zona 5, Mendoza",
      height: 40,
      width: 30,
      depth: 25,
      weight: 15,
      fragile: false,
      dangerous: false,
      cooled: false,
      urgent: false,
      unit: "cm",
      distance: 8.0,
      price: 120.0,
    },
    {
      name: "Paquete C - Comida Refrigerada",
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      description: "Contenedor con alimentos frescos",
      pickup_direction: "Mercado local, puesto 15, Córdoba",
      delivery_direction: "Restaurante gourmet, zona norte, Córdoba",
      height: 20,
      width: 20,
      depth: 15,
      weight: 8.5,
      fragile: false,
      dangerous: false,
      cooled: true,
      urgent: true,
      unit: "cm",
      distance: 5.2,
      price: 95.5,
    },
  ],
};

// ============================================================================
// EJEMPLO 2: Bulk Order con continueOnError = true
// ============================================================================
// Description: Crea órdenes incluso si hay errores en algunas
// Resultado esperado: Partial success (algunas exitosas, algunas con errores)

const example2_partial = {
  companyId: "550e8400-e29b-41d4-a716-446655440000",
  continueOnError: true, // CLAVE: Continúa incluso si hay errores
  orders: [
    {
      name: "Paquete Válido",
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      pickup_direction: "Ubicación A, Ciudad",
      delivery_direction: "Ubicación B, Ciudad",
      height: 30,
      width: 20,
      depth: 10,
      weight: 5,
      fragile: false,
      dangerous: false,
      cooled: false,
      urgent: false,
      unit: "cm",
      distance: 10,
      price: 100,
    },
    {
      name: "Paquete con Categoría Inválida",
      category_id: "INVALID-UUID-XXXX", // UUID inválido
      pickup_direction: "Ubicación A, Ciudad",
      delivery_direction: "Ubicación B, Ciudad",
      height: 30,
      width: 20,
      depth: 10,
      weight: 5,
      fragile: false,
      dangerous: false,
      cooled: false,
      urgent: false,
      unit: "cm",
      distance: 10,
      price: 100,
    },
    {
      name: "Otro Paquete Válido",
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      pickup_direction: "Ubicación C, Ciudad",
      delivery_direction: "Ubicación D, Ciudad",
      height: 25,
      width: 15,
      depth: 8,
      weight: 3,
      fragile: true,
      dangerous: false,
      cooled: false,
      urgent: false,
      unit: "cm",
      distance: 12,
      price: 150,
    },
  ],
};

// ============================================================================
// EJEMPLO 3: Bulk Order Grande - 100 órdenes
// ============================================================================
// Description: Crea 100 órdenes automáticamente generadas
// Caso de uso: Importación masiva desde CSV o base de datos

function example3_large_batch() {
  const baseOrders: any[] = [];
  for (let i = 1; i <= 100; i++) {
    baseOrders.push({
      name: `Pedido Masivo #${i}`,
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      description: `Descripción automática para pedido ${i}`,
      pickup_direction: `Depósito Principal, Zona ${Math.ceil(i / 10)}`,
      delivery_direction: `Cliente ${i}, Dirección A, Ciudad`,
      height: 20 + Math.random() * 30,
      width: 15 + Math.random() * 25,
      depth: 10 + Math.random() * 20,
      weight: 2 + Math.random() * 50,
      fragile: i % 5 === 0, // Cada 5to es frágil
      dangerous: i % 10 === 0, // Cada 10mo es peligroso
      cooled: i % 7 === 0, // Cada 7mo requiere refrigeración
      urgent: i % 3 === 0, // Cada 3er es urgente
      unit: "cm",
      distance: 5 + Math.random() * 50,
      price: 50 + Math.random() * 500,
    });
  }

  return {
    companyId: "550e8400-e29b-41d4-a716-446655440000",
    continueOnError: true,
    orders: baseOrders,
  };
}

// ============================================================================
// EJEMPLO 4: Casos Edge - Errores Esperados
// ============================================================================
// Description: Ejemplos que fallarán y mostrarán manejo de errores

const example4_edge_cases = {
  companyId: "550e8400-e29b-41d4-a716-446655440000",
  continueOnError: true,
  orders: [
    {
      // Error: Array vacío (mínimo 1 orden)
      // name: "", // Campo vacío
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      pickup_direction: "Ubicación A",
      delivery_direction: "Ubicación B",
      height: 30,
      width: 20,
      depth: 10,
      weight: 5,
      fragile: false,
      dangerous: false,
      cooled: false,
      urgent: false,
      unit: "cm",
      distance: 10,
      price: 100,
    },
    {
      name: "Paquete - Valores Negativos",
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      pickup_direction: "Ubicación A",
      delivery_direction: "Ubicación B",
      height: -30, // Error: Negativo
      width: 20,
      depth: 10,
      weight: 5,
      fragile: false,
      dangerous: false,
      cooled: false,
      urgent: false,
      unit: "cm",
      distance: 10,
      price: 100,
    },
    {
      name: "Paquete - Precio Inválido",
      category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      pickup_direction: "Ubicación A",
      delivery_direction: "Ubicación B",
      height: 30,
      width: 20,
      depth: 10,
      weight: 5,
      fragile: false,
      dangerous: false,
      cooled: false,
      urgent: false,
      unit: "cm",
      distance: 10,
      price: -50, // Error: Negativo
    },
  ],
};

// ============================================================================
// EJEMPLO 5: Response Exitoso (Estructura esperada)
// ============================================================================
const expectedSuccessResponse = {
  companyId: "550e8400-e29b-41d4-a716-446655440000",
  totalRequested: 3,
  successCount: 3,
  failureCount: 0,
  duration: 342, // milisegundos
  successful: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      tracking_code: "VLZ-1714240000000-ABC123",
      status: "pending",
      pickup_direction: "Calle 123, Apartamento 4B, Buenos Aires",
      delivery_direction: "Avenida Libertad 456, Oficina 10, CABA",
      distance: 15.5,
      price: 450.0,
      packageDetails: {
        name: "Paquete A - Electrónica",
        weight: 2.5,
        dimensions: "35x25x2 cm",
        fragile: true,
        urgent: true,
        dangerous: false,
        cooled: false,
        image: "https://example.com/laptop.jpg",
        category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      },
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      tracking_code: "VLZ-1714240000001-DEF456",
      status: "pending",
      pickup_direction: "Centro comercial, local 42, Mendoza",
      delivery_direction: "Almacén retail, Zona 5, Mendoza",
      distance: 8.0,
      price: 120.0,
      packageDetails: {
        name: "Paquete B - Ropa",
        weight: 15,
        dimensions: "40x30x25 cm",
        fragile: false,
        urgent: false,
        dangerous: false,
        cooled: false,
        image: "https://cdn-icons-png.flaticon.com/512/683/683030.png",
        category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      },
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      tracking_code: "VLZ-1714240000002-GHI789",
      status: "pending",
      pickup_direction: "Mercado local, puesto 15, Córdoba",
      delivery_direction: "Restaurante gourmet, zona norte, Córdoba",
      distance: 5.2,
      price: 95.5,
      packageDetails: {
        name: "Paquete C - Comida Refrigerada",
        weight: 8.5,
        dimensions: "20x20x15 cm",
        fragile: false,
        urgent: true,
        dangerous: false,
        cooled: true,
        image: "https://cdn-icons-png.flaticon.com/512/683/683030.png",
        category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      },
    },
  ],
  errors: [],
  summary: {
    status: "success",
    percentage: 100,
    message: "3/3 órdenes creadas exitosamente en 342ms",
  },
};

// ============================================================================
// EJEMPLO 6: Response Parcial (Partial Success)
// ============================================================================
const expectedPartialResponse = {
  companyId: "550e8400-e29b-41d4-a716-446655440000",
  totalRequested: 3,
  successCount: 2,
  failureCount: 1,
  duration: 215,
  successful: [
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      tracking_code: "VLZ-1714240000010-AAA111",
      status: "pending",
      pickup_direction: "Ubicación A, Ciudad",
      delivery_direction: "Ubicación B, Ciudad",
      distance: 10,
      price: 100,
      packageDetails: {
        name: "Paquete Válido",
        weight: 5,
        dimensions: "30x20x10 cm",
        fragile: false,
        urgent: false,
        dangerous: false,
        cooled: false,
        image: "https://cdn-icons-png.flaticon.com/512/683/683030.png",
        category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      },
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      tracking_code: "VLZ-1714240000012-CCC333",
      status: "pending",
      pickup_direction: "Ubicación C, Ciudad",
      delivery_direction: "Ubicación D, Ciudad",
      distance: 12,
      price: 150,
      packageDetails: {
        name: "Otro Paquete Válido",
        weight: 3,
        dimensions: "25x15x8 cm",
        fragile: true,
        urgent: false,
        dangerous: false,
        cooled: false,
        image: "https://cdn-icons-png.flaticon.com/512/683/683030.png",
        category_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      },
    },
  ],
  errors: [
    {
      index: 1,
      orderData: {
        name: "Paquete con Categoría Inválida",
        category_id: "INVALID-UUID-XXXX",
        pickup_direction: "Ubicación A, Ciudad",
        delivery_direction: "Ubicación B, Ciudad",
        height: 30,
        width: 20,
        depth: 10,
        weight: 5,
        fragile: false,
        dangerous: false,
        cooled: false,
        urgent: false,
        unit: "cm",
        distance: 10,
        price: 100,
      },
      error: "La categoría con id 'INVALID-UUID-XXXX' no existe",
      code: "CATEGORY_NOT_FOUND",
    },
  ],
  summary: {
    status: "partial",
    percentage: 67,
    message: "2/3 órdenes creadas exitosamente en 215ms",
  },
};

// ============================================================================
// COMANDOS CURL PARA TESTING
// ============================================================================

/*
# Ejemplo 1: Bulk order exitoso
curl -X POST http://localhost:3000/orders/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "continueOnError": false,
    "orders": [
      {
        "name": "Paquete A",
        "category_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "pickup_direction": "Ubicación A",
        "delivery_direction": "Ubicación B",
        "height": 30,
        "width": 20,
        "depth": 10,
        "weight": 5,
        "fragile": false,
        "dangerous": false,
        "cooled": false,
        "urgent": false,
        "unit": "cm",
        "distance": 10,
        "price": 100
      }
    ]
  }'

# Ejemplo 2: Bulk order con continueOnError
curl -X POST http://localhost:3000/orders/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "continueOnError": true,
    "orders": [...]
  }'

# Ejemplo 3: Verificar órdenes creadas
curl -X GET "http://localhost:3000/orders?userId=<user_id>"
*/

export {
  example1_success,
  example2_partial,
  example3_large_batch,
  example4_edge_cases,
  expectedSuccessResponse,
  expectedPartialResponse,
};
