# REQUESTS LISTOS PARA COPIAR Y PEGAR

**Nota:** Reemplaza los valores entre `{{...}}` con valores reales

---

## PARTE 1: SETUP INICIAL

### 1. Health Check

```
GET http://localhost:3000
```

### 2. Obtener Categorías (necesarás el ID para crear órdenes)

```
GET http://localhost:3000/categories
```

**Respuesta esperada incluye:**

- `id` - Copiar uno de estos para usar en órdenes
- `name` - Nombre de la categoría

---

## PARTE 2: FLUJO DE USUARIO NUEVO

### 3. REGISTRAR USUARIO (copiar y pegar tal cual, cambiar email)

```
POST http://localhost:3000/auth/signup/user
Content-Type: application/json

{
  "email": "usuario123@example.com",
  "password": "Password123!",
  "first_name": "Juan",
  "last_name": "Pérez",
  "gender": "male",
  "birthdate": "1990-05-15",
  "address": "Calle Principal 123, Apartamento 4B",
  "phone": "3001234567",
  "country": "CO"
}
```

**Guardar:** `user_id` de la respuesta para pasos siguientes

---

### 4. HACER LOGIN (copiar email y password del paso anterior)

```
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "usuario123@example.com",
  "password": "Password123!"
}
```

**Respuesta:**

- Devuelve mensaje "Usuario Logeado"
- ⚠️ La cookie se envía automáticamente (toma nota en Postman/Thunder Client si quieres guardar el token)

---

### 5. OBTENER MI INFORMACIÓN (para verificar login)

```
GET http://localhost:3000/auth/me
Authorization: Bearer {{TOKEN_AQUI}}
```

O si tienes la cookie:

```
GET http://localhost:3000/auth/me
```

---

## PARTE 3: PERFIL

### 6. OBTENER PERFIL

```
GET http://localhost:3000/profiles/user/{{user_id}}
```

**Reemplazar:** `{{user_id}}` con el ID que guardaste en paso 3

---

### 7. ACTUALIZAR PERFIL (opcional)

```
PUT http://localhost:3000/profiles/user/{{user_id}}
Content-Type: application/json

{
  "first_name": "Juan Carlos",
  "phone": "3009876543"
}
```

**Nota:** Todos los campos son opcionales

---

### 8. SUBIR FOTO DE PERFIL

```
PUT http://localhost:3000/profiles/user/{{user_id}}/image
Content-Type: multipart/form-data

image: [selecciona un archivo JPG/PNG]
```

**En Postman:**

1. Cambiar Body a "form-data"
2. Clave: "image", Tipo: "File"
3. Seleccionar archivo de tu computadora

---

## PARTE 4: ÓRDENES

### 9. CREAR ORDEN (sin token necesario)

```
POST http://localhost:3000/orders
Content-Type: application/json

{
  "userId": "{{user_id}}",
  "name": "Paquete de electrónica",
  "category_id": "{{CATEGORIA_ID}}",
  "description": "Monitor LG 27 pulgadas, nuevo en caja",
  "image": "https://example.com/monitor.jpg",
  "pickup_direction": "Calle 10 #50-30, Bogotá, Colombia",
  "delivery_direction": "Carrera 15 #80-90, Bogotá, Colombia",
  "height": 50,
  "width": 65,
  "depth": 10,
  "weight": 8.5,
  "fragile": true,
  "cooled": false,
  "dangerous": false,
  "urgent": false,
  "unit": "cm",
  "distance": 15.5
}
```

**Reemplazar:**

- `{{user_id}}` con el ID del usuario que guardaste en paso 3
- `{{CATEGORIA_ID}}` con un ID de categoría del paso 2

**Guardar:** `id` de la respuesta para los siguientes pasos

---

### 10. OBTENER MIS ÓRDENES (sin token necesario)

```
GET http://localhost:3000/orders?userId={{user_id}}
```

**Reemplazar:** `{{user_id}}` con tu ID de usuario

---

### 11. OBTENER UNA ORDEN POR ID (sin token necesario)

```
GET http://localhost:3000/orders/{{order_id}}?userId={{user_id}}
```

**Reemplazar:**

- `{{order_id}}` con el ID que guardaste en paso 9
- `{{user_id}}` con tu ID de usuario

---

### 12. ACTUALIZAR ORDEN (sin token necesario)

```
PATCH http://localhost:3000/orders/{{order_id}}
Content-Type: application/json

{
  "userId": "{{user_id}}",
  "name": "Paquete de electrónica - URGENTE",
  "urgent": true,
  "weight": 9
}
```

**Reemplazar:**

- `{{order_id}}` con el ID de la orden
- `{{user_id}}` con tu ID de usuario

**Nota:** Solo envía los campos que quieres cambiar

---

### 13. INICIAR PAGO CON MERCADOPAGO (Requiere Token)

```
POST http://localhost:3000/mercadopago/create-preference
Authorization: Bearer {{TOKEN_AQUI}}
Content-Type: application/json

{
  "orderId": "{{order_id}}"
}
```

**Reemplazar:**

- `{{TOKEN_AQUI}}` con tu JWT token del paso 4 (Login)
- `{{order_id}}` con el ID de la orden creada

**Respuesta Esperada:**

- Te devuelve un `checkout_url`. Abre esa URL en tu navegador para simular el pago real en el sandbox de MercadoPago.

---

### 14. SIMULAR WEBHOOK DE MERCADOPAGO (Alternativa manual si no pagaste arriba)

```
POST http://localhost:3000/mercadopago/webhook
Content-Type: application/json

{
  "type": "payment",
  "data": {
    "id": "123456789"
  }
}
```

**Nota:** Esto simula que MercadoPago avisó que el pago se hizo. El backend buscará la orden asociada y activará el cambio de estado automático (Cron Job).

---

### 15. RASTREO PÚBLICO (No requiere token ni userId)

```
GET http://localhost:3000/orders/track/{{tracking_code}}
```

**Reemplazar:** `{{tracking_code}}` con el código tipo `VLZ-2026-XXXXXX` que obtuviste al crear la orden.

---

### 16. ELIMINAR ORDEN (sin token necesario)

```
DELETE http://localhost:3000/orders/{{order_id}}?userId={{user_id}}
```

**Reemplazar:**

- `{{order_id}}` con el ID de la orden
- `{{user_id}}` con tu ID de usuario

---

### 17. LOGOUT

```
POST http://localhost:3000/auth/logout
```

---

## PARTE 4.5: CREACIÓN MASIVA DE PEDIDOS (BULK ORDERS)

### 18. CREAR MÚLTIPLES ÓRDENES DE UNA VEZ (Exitoso)

```
POST http://localhost:3000/orders/bulk
Content-Type: application/json

{
  "companyId": "{{company_id}}",
  "continueOnError": false,
  "orders": [
    {
      "name": "Paquete A - Electrónica",
      "category_id": "{{CATEGORIA_ID}}",
      "description": "Laptop Dell XPS 13",
      "pickup_direction": "Calle 123, Apartamento 4B, Buenos Aires",
      "delivery_direction": "Avenida Libertad 456, Oficina 10, CABA",
      "height": 35,
      "width": 25,
      "depth": 2,
      "weight": 2.5,
      "fragile": true,
      "dangerous": false,
      "cooled": false,
      "urgent": true,
      "unit": "cm",
      "distance": 15.5,
      "price": 450.0
    },
    {
      "name": "Paquete B - Ropa",
      "category_id": "{{CATEGORIA_ID}}",
      "description": "Caja de ropa (15kg)",
      "pickup_direction": "Centro comercial, local 42, Mendoza",
      "delivery_direction": "Almacén retail, Zona 5, Mendoza",
      "height": 40,
      "width": 30,
      "depth": 25,
      "weight": 15,
      "fragile": false,
      "dangerous": false,
      "cooled": false,
      "urgent": false,
      "unit": "cm",
      "distance": 8.0,
      "price": 120.0
    },
    {
      "name": "Paquete C - Comida Refrigerada",
      "category_id": "{{CATEGORIA_ID}}",
      "description": "Contenedor con alimentos frescos",
      "pickup_direction": "Mercado local, puesto 15, Córdoba",
      "delivery_direction": "Restaurante gourmet, zona norte, Córdoba",
      "height": 20,
      "width": 20,
      "depth": 15,
      "weight": 8.5,
      "fragile": false,
      "dangerous": false,
      "cooled": true,
      "urgent": true,
      "unit": "cm",
      "distance": 5.2,
      "price": 95.5
    }
  ]
}
```

**Reemplazar:**

- `{{company_id}}` con el ID de tu empresa
- `{{CATEGORIA_ID}}` con un ID de categoría válido (del paso 2)

**Respuesta Esperada (201 Created):**

```json
{
  "companyId": "{{company_id}}",
  "totalRequested": 3,
  "successCount": 3,
  "failureCount": 0,
  "duration": 342,
  "successful": [
    {
      "id": "uuid",
      "tracking_code": "VLZ-1714240000000-ABC123",
      "status": "pending",
      "price": 450.0,
      "packageDetails": { ... }
    },
    ...
  ],
  "errors": [],
  "summary": {
    "status": "success",
    "percentage": 100,
    "message": "3/3 órdenes creadas exitosamente en 342ms"
  }
}
```

---

### 19. CREAR MÚLTIPLES ÓRDENES CON continueOnError (Resultado Parcial)

**Uso:** Cuando algunos pedidos pueden fallar pero quieres guardar los que sí funcionan

```
POST http://localhost:3000/orders/bulk
Content-Type: application/json

{
  "companyId": "{{company_id}}",
  "continueOnError": true,
  "orders": [
    {
      "name": "Paquete Válido",
      "category_id": "{{CATEGORIA_ID_VALIDA}}",
      "pickup_direction": "Ubicación A, Ciudad",
      "delivery_direction": "Ubicación B, Ciudad",
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
    },
    {
      "name": "Paquete con Categoría Inválida",
      "category_id": "INVALID-UUID-XXXX",
      "pickup_direction": "Ubicación C, Ciudad",
      "delivery_direction": "Ubicación D, Ciudad",
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
    },
    {
      "name": "Otro Paquete Válido",
      "category_id": "{{CATEGORIA_ID_VALIDA}}",
      "pickup_direction": "Ubicación E, Ciudad",
      "delivery_direction": "Ubicación F, Ciudad",
      "height": 25,
      "width": 15,
      "depth": 8,
      "weight": 3,
      "fragile": true,
      "dangerous": false,
      "cooled": false,
      "urgent": false,
      "unit": "cm",
      "distance": 12,
      "price": 150
    }
  ]
}
```

**Respuesta Esperada (201 Created - Parcial):**

```json
{
  "companyId": "{{company_id}}",
  "totalRequested": 3,
  "successCount": 2,
  "failureCount": 1,
  "duration": 215,
  "successful": [ ... ],
  "errors": [
    {
      "index": 1,
      "orderData": { ... },
      "error": "La categoría con id 'INVALID-UUID-XXXX' no existe",
      "code": "CATEGORY_NOT_FOUND"
    }
  ],
  "summary": {
    "status": "partial",
    "percentage": 67,
    "message": "2/3 órdenes creadas exitosamente en 215ms"
  }
}
```

**Nota:** Las 2 órdenes válidas se crean, la inválida se registra en `errors`

---

### 20. CREAR 10 ÓRDENES (Caso de Uso Real)

```
POST http://localhost:3000/orders/bulk
Content-Type: application/json

{
  "companyId": "{{company_id}}",
  "continueOnError": true,
  "orders": [
    {
      "name": "Pedido 1 - Electrónica",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 1, Calle 50, Bogotá",
      "height": 30, "width": 20, "depth": 10,
      "weight": 5, "fragile": false, "dangerous": false,
      "cooled": false, "urgent": false, "unit": "cm",
      "distance": 10, "price": 100
    },
    {
      "name": "Pedido 2 - Ropa",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 2, Calle 60, Bogotá",
      "height": 25, "width": 15, "depth": 8,
      "weight": 3, "fragile": false, "dangerous": false,
      "cooled": false, "urgent": false, "unit": "cm",
      "distance": 12, "price": 150
    },
    {
      "name": "Pedido 3 - Alimentos",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 3, Calle 70, Bogotá",
      "height": 20, "width": 20, "depth": 15,
      "weight": 8, "fragile": false, "dangerous": false,
      "cooled": true, "urgent": true, "unit": "cm",
      "distance": 8, "price": 200
    },
    {
      "name": "Pedido 4",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 4, Calle 80, Bogotá",
      "height": 35, "width": 25, "depth": 10,
      "weight": 6, "fragile": true, "dangerous": false,
      "cooled": false, "urgent": false, "unit": "cm",
      "distance": 15, "price": 180
    },
    {
      "name": "Pedido 5",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 5, Calle 90, Bogotá",
      "height": 28, "width": 18, "depth": 12,
      "weight": 4, "fragile": false, "dangerous": false,
      "cooled": false, "urgent": false, "unit": "cm",
      "distance": 11, "price": 95
    },
    {
      "name": "Pedido 6",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 6, Calle 100, Bogotá",
      "height": 32, "width": 22, "depth": 9,
      "weight": 7, "fragile": false, "dangerous": true,
      "cooled": false, "urgent": true, "unit": "cm",
      "distance": 20, "price": 250
    },
    {
      "name": "Pedido 7",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 7, Calle 110, Bogotá",
      "height": 24, "width": 16, "depth": 11,
      "weight": 2, "fragile": true, "dangerous": false,
      "cooled": false, "urgent": false, "unit": "cm",
      "distance": 9, "price": 75
    },
    {
      "name": "Pedido 8",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 8, Calle 120, Bogotá",
      "height": 40, "width": 30, "depth": 20,
      "weight": 15, "fragile": false, "dangerous": false,
      "cooled": false, "urgent": false, "unit": "cm",
      "distance": 18, "price": 350
    },
    {
      "name": "Pedido 9",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 9, Calle 130, Bogotá",
      "height": 22, "width": 14, "depth": 7,
      "weight": 1, "fragile": false, "dangerous": false,
      "cooled": false, "urgent": false, "unit": "cm",
      "distance": 6, "price": 50
    },
    {
      "name": "Pedido 10",
      "category_id": "{{CATEGORIA_ID}}",
      "pickup_direction": "Depósito Central, Bogotá",
      "delivery_direction": "Cliente 10, Calle 140, Bogotá",
      "height": 38, "width": 28, "depth": 13,
      "weight": 10, "fragile": false, "dangerous": false,
      "cooled": true, "urgent": true, "unit": "cm",
      "distance": 14, "price": 220
    }
  ]
}
```

**Respuesta Esperada (201 Created):**

- 10 órdenes creadas en ~100-150ms
- `duration`: ~150
- `percentage`: 100
- `message`: "10/10 órdenes creadas exitosamente en 150ms"

---

### 21. OBTENER TODAS LAS ÓRDENES CREADAS POR BULK

Después de crear órdenes con bulk, puedes obtenerlas con:

```
GET http://localhost:3000/orders?userId={{user_id}}
```

**Verás todas las órdenes** (incluyendo las creadas por bulk)

---

## PARTE 5: FLUJO DE EMPRESA

### 18. REGISTRAR EMPRESA

```
POST http://localhost:3000/auth/signup/company
Content-Type: application/json

{
  "email": "admin@transexpress.com",
  "password": "Password123!",
  "company_name": "TransExpress S.A.S",
  "industry": "Logística y Transporte",
  "contact_name": "Carlos Mendoza",
  "plan": "pro",
  "address": "Carrera 7 #45-100, Bogotá",
  "phone": "3001234567",
  "country": "CO"
}
```

**Guardar:** `user_id` para paso siguiente

**⚠️ IMPORTANTE:** La empresa queda en estado `PENDING`

---

### 19. CAMBIAR ESTADO DE EMPRESA A APPROVED (REQUIERE CREDENCIALES DE ADMIN)

```
PUT http://localhost:3000/users/{{company_user_id}}/status
Content-Type: application/json

89865625-0c0c-4b5c-8451-8b839fee56e8
{
  "status": "APPROVED"
}
```

**Reemplazar:** `{{company_user_id}}` con el ID de la empresa (paso 18)

---

### 20. EMPRESA: OBTENER DATOS

```
GET http://localhost:3000/companies/user/{{company_user_id}}
```

---

### 21. EMPRESA: LOGIN (después de ser aprobada)

```
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "admin@transexpress.com",
  "password": "Password123!"
}
```

---

### 22. EMPRESA: REGISTRAR OPERADOR

```
POST http://localhost:3000/auth/register-operator
Authorization: Bearer {{EMPRESA_TOKEN}}
Content-Type: application/json

{
  "email": "operador@transexpress.com",
  "password": "Password123!",
  "first_name": "Roberto",
  "last_name": "García",
  "address": "Calle 50 #10-20",
  "phone": "3009876543",
  "country": "CO"
}
```

**Reemplazar:** `{{EMPRESA_TOKEN}}` con token de la empresa (paso 21)

---

## PARTE 6: GESTIÓN DE USUARIOS (ADMIN)

### 23. PROMOVER A ADMINISTRADOR (Nuevo)

```
PUT http://localhost:3000/users/{{user_id}}/role-admin
```

---

### 24. OBTENER TODOS LOS USUARIOS

```
GET http://localhost:3000/users?page=1&limit=10
```

---

### 25. ELIMINAR USUARIO (BORRADO LÓGICO)

```
DELETE http://localhost:3000/users/{{user_id}}
```

---

### 26. CAMBIAR ESTADO DE USUARIO

```
PUT http://localhost:3000/users/{{user_id}}/status
Content-Type: application/json

{
  "status": "APPROVED"
}
```

**Valores válidos para status:**

- `PENDING` - Pendiente de aprobación
- `APPROVED` - Aprobado (puede usar la plataforma)
- `REJECTED` - Rechazado (no puede usar la plataforma)

---

## PARTE 7: DASHBOARD DE REPORTES (ADMIN)

### 27. OBTENER REPORTES POR FILTRO (1h | 1d | 7d | 1m | historic)

```
GET http://localhost:3000/api/admin/reportes?filter=1d
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Parámetros query disponibles:**

- `filter=1h` → Datos por minutos (12 intervalos de 5 min)
- `filter=1d` → Datos por horas (24 horas) - **DEFAULT**
- `filter=7d` → Datos por días (7 días)
- `filter=1m` → Datos por días (30 días)
- `filter=historic` → Datos por meses (historial completo)

---

### Ejemplo: Filtro 1h (por minutos)

```
GET http://localhost:3000/api/admin/reportes?filter=1h
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Respuesta esperada (200 OK):**

```json
{
  "totalUsers": 15,
  "previousUsers": 12,
  "totalCompanies": 3,
  "previousCompanies": 2,
  "orders": {
    "delivered": 8,
    "started": 5,
    "canceled": 2
  },
  "previousOrders": {
    "delivered": 6,
    "started": 3,
    "canceled": 1
  },
  "usersPerPeriod": [0, 1, 2, 1, 0, 2, 3, 1, 2, 1, 1, 0],
  "companiesPerPeriod": [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  "labels": ["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45", "00:50", "00:55"]
}
```

---

### Ejemplo: Filtro 1d (por horas)

```
GET http://localhost:3000/api/admin/reportes?filter=1d
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Respuesta esperada (200 OK):**

```json
{
  "totalUsers": 45,
  "previousUsers": 38,
  "totalCompanies": 8,
  "previousCompanies": 6,
  "orders": {
    "delivered": 23,
    "started": 15,
    "canceled": 5
  },
  "previousOrders": {
    "delivered": 18,
    "started": 12,
    "canceled": 3
  },
  "usersPerPeriod": [2, 1, 0, 3, 5, 2, 1, 4, 3, 2, 1, 5, 2, 1, 3, 2, 1, 2, 3, 2, 1, 2, 1, 0],
  "companiesPerPeriod": [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  "labels": ["00h", "01h", "02h", "03h", "04h", "05h", "06h", "07h", "08h", "09h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"]
}
```

---

### Ejemplo: Filtro 7d (por días)

```
GET http://localhost:3000/api/admin/reportes?filter=7d
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Respuesta esperada (200 OK):**

```json
{
  "totalUsers": 127,
  "previousUsers": 98,
  "totalCompanies": 18,
  "previousCompanies": 14,
  "orders": {
    "delivered": 64,
    "started": 32,
    "canceled": 12
  },
  "previousOrders": {
    "delivered": 48,
    "started": 24,
    "canceled": 8
  },
  "usersPerPeriod": [15, 18, 12, 20, 25, 18, 19],
  "companiesPerPeriod": [2, 2, 3, 2, 4, 2, 3],
  "labels": ["24/04", "25/04", "26/04", "27/04", "28/04", "29/04", "30/04"]
}
```

---

### Ejemplo: Filtro 1m (por días, 30 días)

```
GET http://localhost:3000/api/admin/reportes?filter=1m
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Respuesta esperada (200 OK):**

```json
{
  "totalUsers": 325,
  "previousUsers": 287,
  "totalCompanies": 52,
  "previousCompanies": 46,
  "orders": {
    "delivered": 178,
    "started": 95,
    "canceled": 32
  },
  "previousOrders": {
    "delivered": 156,
    "started": 84,
    "canceled": 28
  },
  "usersPerPeriod": [10, 12, 8, 15, 18, 14, 16, 12, 11, 13, 15, 10, 12, 14, 16, 13, 11, 10, 12, 15, 14, 13, 12, 11, 10, 14, 16, 15, 13, 12],
  "companiesPerPeriod": [1, 1, 2, 1, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1],
  "labels": ["29/03", "30/03", "31/03", "01/04", "02/04", "03/04", "04/04", "05/04", "06/04", "07/04", "08/04", "09/04", "10/04", "11/04", "12/04", "13/04", "14/04", "15/04", "16/04", "17/04", "18/04", "19/04", "20/04", "21/04", "22/04", "23/04", "24/04", "25/04", "26/04", "27/04"]
}
```

---

### Ejemplo: Filtro historic (por meses - todo el historial)

```
GET http://localhost:3000/api/admin/reportes?filter=historic
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Respuesta esperada (200 OK):**

```json
{
  "totalUsers": 2150,
  "previousUsers": 0,
  "totalCompanies": 312,
  "previousCompanies": 0,
  "orders": {
    "delivered": 1245,
    "started": 645,
    "canceled": 198
  },
  "previousOrders": {
    "delivered": 0,
    "started": 0,
    "canceled": 0
  },
  "usersPerPeriod": [45, 67, 78, 92, 105, 118, 142, 156, 178, 195, 208, 216, 225, 242, 258, 275, 298, 312, 325, 340, 352, 367, 380, 395, 412, 428, 445, 468, 492, 510],
  "companiesPerPeriod": [5, 8, 12, 15, 18, 22, 28, 32, 38, 42, 48, 52, 56, 62, 68, 74, 82, 88, 95, 102, 108, 115, 122, 130, 138, 145, 155, 165, 175, 185],
  "labels": ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic", "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic", "ene", "feb", "mar", "abr", "may", "jun"]
}
```

---

**Descripción de campos en la respuesta:**

- `totalUsers` → Cantidad de usuarios registrados en el período
- `previousUsers` → Cantidad de usuarios en el período anterior (para calcular variación)
- `totalCompanies` → Cantidad de empresas registradas en el período
- `previousCompanies` → Cantidad de empresas en el período anterior
- `orders.delivered` → Órdenes entregadas en el período
- `orders.started` → Órdenes iniciadas en el período
- `orders.canceled` → Órdenes canceladas en el período
- `previousOrders.*` → Mismo pero para el período anterior
- `usersPerPeriod[]` → Array de usuarios por cada intervalo (para gráfico)
- `companiesPerPeriod[]` → Array de empresas por cada intervalo (para gráfico)
- `labels[]` → Etiquetas del eje X (dinámicas según filtro seleccionado)

---

## VALORES VÁLIDOS PARA ENUMS

### Gender

```
"male"
"female"
"other"
```

### CompanyPlan

```
"free"
"basic"
"pro"
```

### OrderStatus

```
"pending"
"paid"
"processing"
"shipped"
"completed"
"cancelled"
```

### UserStatus

```
"PENDING"
"APPROVED"
"REJECTED"
```

### MeasurementUnit

```
"cm"
"in"
```

### Country (Códigos ISO 2 letras)

```
"CO" - Colombia
"US" - Estados Unidos
"MX" - México
"AR" - Argentina
"BR" - Brasil
"ES" - España
etc...
```

### Role

```
"user"
"company"
"admin"
"superadmin"
"operator"
```

---

## ERRORES Y SOLUCIONES RÁPIDAS

### "El email ya se encuentra registrado"

**Solución:** Usa otro email, o borra la base de datos y reinicia

### "Token inválido o expirado"

**Solución:**

1. Haz login nuevamente (POST /auth/signin)
2. Copia el token de la respuesta
3. Úsalo en Authorization header

### "La cuenta aún no ha sido aprobada"

**Solución:** Usa PUT /users/:id/status para cambiar a APPROVED

### "No tienes permiso para ver esta orden"

**Solución:** Solo puedes ver/editar/eliminar tus propias órdenes

### "El ID de categoría debe ser un UUID válido"

**Solución:**

1. Haz GET /categories
2. Copia un ID válido de la respuesta
3. Úsalo en category_id

### "La empresa contratista no está autorizada"

**Solución:** La empresa padre del operador debe estar en APPROVED

---

## PRUEBA RÁPIDA EN 5 MINUTOS

1. **Copiar y pegar paso 3** (registrar usuario)
2. **Copiar y pegar paso 4** (login) - cambiar email igual
3. **Copiar y pegar paso 2** (obtener categorías) y guardar un category_id
4. **Copiar y pegar paso 9** (crear orden) - cambiar category_id
5. **Copiar y pegar paso 10** (obtener órdenes)

✅ ¡Listo! Si todo funciona, tu backend está bien configurado.

---

## CONFIGURACIONES NECESARIAS

### En tu cliente (Postman/Thunder Client):

**Para Postman:**

- Ir a Settings → General → Automatically follow redirects: ON
- Ir a Settings → General → Retain cookies after collection run: ON

**Para Thunder Client:**

- Habilitar cookies en el cliente

**Para curl:**

```bash
curl -i -b cookie.txt -c cookie.txt \
  -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"Password123"}'
```

---

## NOTAS IMPORTANTES

1. **Base URL:** `http://localhost:3000`
2. **Token:** Válido por 60 minutos
3. **Cookie:** Válida por 7 días (se maneja automáticamente)
4. **Redis:** Requerido para cambio automático de estado en órdenes
5. **Cloudinary:** Requerido para subir imágenes
6. **PostgreSQL:** Base de datos (configurable en .env)

---

## ESTRUCTURA DE RESPUESTA TÍPICA

### Exitosa (2xx)

```json
{
  "message": "texto descriptivo",
  "data": { ... },
  "user_id": "uuid",
  "token": "jwt_token"
}
```

### Error (4xx/5xx)

```json
{
  "message": "Descripción del error",
  "error": "tipo de error",
  "statusCode": 400
}
```

---

## VIDEO TUTORIAL (TEXTO)

### Escenario: Crear un usuario y una orden

**Paso 1:** Abre Postman/Thunder Client
**Paso 2:** Nueva request → GET → `http://localhost:3000/categories`
**Paso 3:** Click "Send", espera respuesta, copia un `id`
**Paso 4:** Nueva request → POST → `http://localhost:3000/auth/signup/user`
**Paso 5:** Body → raw → JSON → pega el JSON de signup (cambiar email)
**Paso 6:** Click "Send", espera, copia el `user_id`
**Paso 7:** Nueva request → POST → `http://localhost:3000/auth/signin`
**Paso 8:** Body → raw → JSON → pega login (mismo email y password)
**Paso 9:** Click "Send", espera. El token está en la cookie
**Paso 10:** Nueva request → POST → `http://localhost:3000/orders`
**Paso 11:** Headers → agregar `Authorization: Bearer {{TOKEN}}`
**Paso 12:** Body → raw → JSON → pega orden (cambiar category_id)
**Paso 13:** Click "Send"
**Paso 14:** ¡Orden creada!

---

## TROUBLESHOOTING

### "No puedo conectar a localhost:3000"

**Solución:**

```bash
cd back
npm run start:dev
```

### "Base de datos vacía"

**Solución:** Las tablas se crean automáticamente, pero necesitas:

```bash
npm run typeorm migration:run
```

### "No puedo subir imágenes"

**Solución:** Verifica en .env:

```
CLOUDINARY_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_key
CLOUDINARY_API_SECRET=tu_secret
```

### "Cambio de estado no funciona"

**Solución:** Inicia Redis:

```bash
redis-server
```

---

**Última actualización:** 25 de abril de 2026
