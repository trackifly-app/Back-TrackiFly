# REQUESTS LISTOS PARA COPIAR Y PEGAR

**Nota:** Reemplaza los valores entre `{{...}}` con valores reales

## BASE URL

| Entorno    | URL                                           |
| ---------- | --------------------------------------------- |
| Local      | `http://localhost:3000`                       |
| Producción | `https://back-production-xxxx.up.railway.app` |

> El archivo usa `localhost:3000`. Para probar producción, reemplazá con la URL de Railway.

## ÍNDICE DE ENDPOINTS

| #   | Método | Ruta                           | Descripción                      |
| --- | ------ | ------------------------------ | -------------------------------- |
| 1   | GET    | /                              | Health Check                     |
| 2   | GET    | /categories                    | Obtener todas las categorías     |
| 2.5 | GET    | /categories/:id                | Obtener una categoría específica |
| 3   | POST   | /auth/signup/user              | Registrar usuario                |
| 4   | POST   | /auth/signin                   | Login                            |
| 5   | GET    | /auth/me                       | Obtener mi información           |
| 5.5 | POST   | /auth/google                   | Autenticación con Google         |
| 6   | GET    | /profiles/user/:id             | Obtener perfil                   |
| 7   | PUT    | /profiles/user/:id             | Actualizar perfil                |
| 8   | PUT    | /profiles/user/:id/image       | Subir foto de perfil             |
| 9   | POST   | /orders                        | Crear orden                      |
| 10  | GET    | /orders?userId=                | Obtener mis órdenes              |
| 11  | GET    | /orders/:id                    | Obtener una orden por ID         |
| 12  | PATCH  | /orders/:id                    | Actualizar orden                 |
| 13  | GET    | /orders/track/:tracking_code   | Rastreo público                  |
| 14  | DELETE | /orders/:id                    | Eliminar orden                   |
| 15  | POST   | /auth/logout                   | Logout                           |
| 16  | POST   | /orders/bulk                   | Crear múltiples órdenes (bulk)   |
| 17  | POST   | /orders/bulk                   | Bulk con continueOnError         |
| 18  | POST   | /orders/bulk                   | Bulk 10 órdenes (caso real)      |
| 19  | GET    | /orders?userId=                | Ver órdenes creadas por bulk     |
| 20  | POST   | /mercadopago/create-preference | Iniciar pago MercadoPago         |
| 21  | POST   | /mercadopago/webhook           | Webhook MercadoPago (simulación) |
| 22  | POST   | /auth/signup/company           | Registrar empresa                |
| 23  | PUT    | /users/:id/status              | Aprobar/rechazar empresa         |
| 24  | GET    | /companies/user/:id            | Obtener datos de empresa         |
| 25  | POST   | /auth/signin                   | Login empresa                    |
| 26  | POST   | /auth/register-operator        | Registrar operador               |
| 27  | PUT    | /companies/user/:id            | Actualizar datos empresa         |
| 28  | PUT    | /companies/user/:id/image      | Subir logo empresa               |
| 29  | PUT    | /users/:id/role-admin          | Promover a administrador         |
| 30  | GET    | /users?page=&limit=            | Obtener todos los usuarios       |
| 31  | GET    | /users/:id                     | Obtener un usuario específico    |
| 32  | DELETE | /users/:id                     | Eliminar usuario (lógico)        |
| 33  | PUT    | /users/:id/status              | Cambiar estado de usuario        |

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

### 2.5. Obtener Una Categoría Específica

```
GET http://localhost:3000/categories/{{category_id}}
```

**Reemplazar:** `{{category_id}}` con el ID de una categoría del paso 2

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

- Devuelve mensaje "Sesión iniciada exitosamente"
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

**Respuesta incluye:**

- `id` - Tu user_id
- `role` - Tu rol (user, company, admin, operator, superadmin)
- `status` - Tu estado (PENDING, APPROVED, REJECTED)

---

### 5.5. AUTENTICACIÓN CON GOOGLE (Alternativa)

```
POST http://localhost:3000/auth/google
Content-Type: application/json

{
  "email": "usuario@gmail.com",
  "name": "Juan Pérez",
  "googleId": "1234567890.apps.googleusercontent.com",
  "picture": "https://lh3.googleusercontent.com/a/default-user"
}
```

**Respuesta:**

```json
{
  "message": "Autenticación exitosa",
  "isNew": true
}
```

**Nota:** Si `isNew` es true, significa que se creó un nuevo usuario. La cookie se envía automáticamente.

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
  "last_name": "Pérez García",
  "birthdate": "1990-05-15",
  "gender": "male",
  "address": "Calle Nueva 456",
  "phone": "3009876543",
  "country": "CO"
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

**Respuesta:**

```json
{
  "message": "Imagen actualizada correctamente",
  "url": "https://res.cloudinary.com/..."
}
```

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
  "distance": 15.5,
  "price": 125.50
}
```

**Reemplazar:**

- `{{user_id}}` con el ID del usuario que guardaste en paso 3
- `{{CATEGORIA_ID}}` con un ID de categoría del paso 2

**Guardar:** `id` (order_id) y `tracking_code` de la respuesta para los siguientes pasos

---

### 10. OBTENER MIS ÓRDENES

```
GET http://localhost:3000/orders?userId={{user_id}}
```

**Reemplazar:** `{{user_id}}` con tu ID de usuario

---

### 11. OBTENER UNA ORDEN POR ID

```
GET http://localhost:3000/orders/{{order_id}}?userId={{user_id}}
```

**Reemplazar:**

- `{{order_id}}` con el ID que guardaste en paso 9
- `{{user_id}}` con tu ID de usuario

---

### 12. ACTUALIZAR ORDEN

```
PATCH http://localhost:3000/orders/{{order_id}}
Content-Type: application/json

{
  "userId": "{{user_id}}",
  "name": "Paquete de electrónica - URGENTE",
  "urgent": true,
  "weight": 9,
  "price": 150.00
}
```

**Reemplazar:**

- `{{order_id}}` con el ID de la orden
- `{{user_id}}` con tu ID de usuario

**Nota:** Solo envía los campos que quieres cambiar. Todos son opcionales.

---

### 13. RASTREO PÚBLICO (Sin autenticación requerida)

```
GET http://localhost:3000/orders/track/{{tracking_code}}
```

**Reemplazar:** `{{tracking_code}}` con el código tipo `VLZ-2026-XXXXXX` que obtuviste al crear la orden.

**Nota:** Este endpoint es público, cualquiera con el código de rastreo puede ver el estado de la orden.

---

### 14. ELIMINAR ORDEN

```
DELETE http://localhost:3000/orders/{{order_id}}?userId={{user_id}}
```

**Reemplazar:**

- `{{order_id}}` con el ID de la orden
- `{{user_id}}` con tu ID de usuario

---

### 15. LOGOUT

```
POST http://localhost:3000/auth/logout
```

---

## PARTE 5: CREACIÓN MASIVA DE PEDIDOS (BULK ORDERS)

### 16. CREAR MÚLTIPLES ÓRDENES DE UNA VEZ (Exitoso)

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

### 17. CREAR MÚLTIPLES ÓRDENES CON continueOnError (Resultado Parcial)

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

### 18. CREAR 10 ÓRDENES (Caso de Uso Real)

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

### 19. OBTENER TODAS LAS ÓRDENES CREADAS POR BULK

Después de crear órdenes con bulk, puedes obtenerlas con:

```
GET http://localhost:3000/orders?userId={{user_id}}
```

**Verás todas las órdenes** (incluyendo las creadas por bulk)

---

## PARTE 6: PAGOS Y MERCADOPAGO

### 20. INICIAR PAGO CON MERCADOPAGO

```
POST http://localhost:3000/mercadopago/create-preference
Content-Type: application/json

{
  "orderId": "{{order_id}}",
  "userId": "{{user_id}}"
}
```

**Reemplazar:**

- `{{order_id}}` con el ID de la orden creada
- `{{user_id}}` con tu ID de usuario

**Nota:** Si tienes un token válido, puedes usar:

```
Authorization: Bearer {{TOKEN_AQUI}}
```

**Respuesta Esperada:**

- Te devuelve un `checkout_url`. Abre esa URL en tu navegador para simular el pago real en el sandbox de MercadoPago.

---

### 21. WEBHOOK DE MERCADOPAGO (Simulación manual)

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

**Nota:** Esto simula que MercadoPago notificó que el pago se hizo. El backend buscará la orden asociada y activará el cambio de estado automático.

---

## PARTE 7: FLUJO DE EMPRESA

### 22. REGISTRAR EMPRESA

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

### 23. CAMBIAR ESTADO DE EMPRESA A APPROVED (REQUIERE CREDENCIALES DE ADMIN)

```
PUT http://localhost:3000/users/{{company_user_id}}/status
Content-Type: application/json

{
  "status": "APPROVED"
}
```

**Reemplazar:** `{{company_user_id}}` con el ID de la empresa (paso 22)

---

### 24. EMPRESA: OBTENER DATOS

```
GET http://localhost:3000/companies/user/{{company_user_id}}
```

---

### 25. EMPRESA: LOGIN (después de ser aprobada)

```
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "admin@transexpress.com",
  "password": "Password123!"
}
```

---

### 26. EMPRESA: REGISTRAR OPERADOR

```
POST http://localhost:3000/auth/register-operator
Content-Type: application/json

{
  "email": "operador@transexpress.com",
  "password": "Password123!",
  "first_name": "Roberto",
  "last_name": "García",
  "address": "Calle 50 #10-20",
  "phone": "3009876543",
  "country": "CO",
  "companyId": "{{company_id}}"
}
```

**Reemplazar:**

- `{{company_id}}` con el ID de la empresa
- Opcionalmente agregar `Authorization: Bearer {{EMPRESA_TOKEN}}` si quieres usar token en lugar de los datos en el body

**Nota:** Este endpoint crea un operador vinculado a una empresa.

---

### 27. EMPRESA: ACTUALIZAR DATOS

```
PUT http://localhost:3000/companies/user/{{company_user_id}}
Content-Type: application/json

{
  "company_name": "TransExpress S.A.S",
  "industry": "Logística y Transporte",
  "contact_name": "Carlos Mendoza Actualizado",
  "address": "Carrera 7 #45-100, Bogotá",
  "phone": "3001234567",
  "country": "CO",
  "plan": "pro"
}
```

**Nota:** Todos los campos son opcionales

---

### 28. EMPRESA: SUBIR IMAGEN/LOGO

```
PUT http://localhost:3000/companies/user/{{company_user_id}}/image
Content-Type: multipart/form-data

image: [selecciona un archivo JPG/PNG]
```

---

## PARTE 8: GESTIÓN DE USUARIOS (ADMIN)

### 29. PROMOVER A ADMINISTRADOR

```
PUT http://localhost:3000/users/{{user_id}}/role-admin
```

---

### 30. OBTENER TODOS LOS USUARIOS

```
GET http://localhost:3000/users?page=1&limit=10
```

---

### 31. OBTENER UN USUARIO ESPECÍFICO

```
GET http://localhost:3000/users/{{user_id}}
```

---

### 32. ELIMINAR USUARIO (BORRADO LÓGICO)

```
DELETE http://localhost:3000/users/{{user_id}}
```

---

### 33. CAMBIAR ESTADO DE USUARIO

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

**Última actualización:** 28 de abril de 2026
