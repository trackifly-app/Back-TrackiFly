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
