# Referencia de API de SmartRoom

Este documento proporciona documentación detallada de la API REST del backend de SmartRoom.

## URL Base

```
http://localhost:3000/api
```

## Autenticación

> **Nota**: La API actual no implementa autenticación. Para despliegues en producción, considera agregar autenticación basada en JWT.

## Formato de Respuesta

Todas las respuestas de la API siguen un formato JSON consistente:

**Respuesta Exitosa:**
```json
{
  "data": [ /* array de objetos */ ],
  "message": "Éxito"
}
```

**Respuesta de Error:**
```json
{
  "error": "Mensaje de error",
  "message": "Descripción de lo que salió mal"
}
```

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Creado - Recurso creado exitosamente |
| 400 | Petición Incorrecta - Cuerpo de petición o parámetros inválidos |
| 404 | No Encontrado - Recurso no encontrado |
| 500 | Error Interno del Servidor - Error del lado del servidor |

---

## Endpoints

### Verificación de Estado

#### GET /

Verificar si la API está corriendo.

**Petición:**
```bash
curl http://localhost:3000/
```

**Respuesta:**
```
Hello, World!
```

---

## API de Sensores

### GET /api/sensors

Obtener todas las lecturas de sensores.

**Petición:**
```bash
curl http://localhost:3000/api/sensors
```

**Respuesta:**
```json
[
  {
    "_id": "6789abc123def456ghi789jk",
    "temperature_c": "25.5",
    "humidity_pct": "60.0",
    "light_pct": "45",
    "low_light": false,
    "motion": false,
    "timestamp": "2025-01-15T10:30:00.000Z",
    "source": "esp8266-B"
  }
]
```

### GET /api/sensors/:id

Obtener una lectura de sensor específica por ID.

**Parámetros:**
| Nombre | Tipo | Ubicación | Descripción |
|--------|------|-----------|-------------|
| id | string | ruta | ObjectId de MongoDB |

**Petición:**
```bash
curl http://localhost:3000/api/sensors/6789abc123def456ghi789jk
```

**Respuesta:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "temperature_c": "25.5",
  "humidity_pct": "60.0",
  "light_pct": "45",
  "low_light": false,
  "motion": false,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "source": "esp8266-B"
}
```

**Respuesta de Error (404):**
```json
{
  "error": "Lectura de sensor no encontrada"
}
```

### POST /api/sensors

Crear una nueva lectura de sensor.

**Cuerpo de Petición:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| temperature_c | string | Sí | Temperatura en Celsius |
| humidity_pct | string | Sí | Porcentaje de humedad |
| light_pct | string | Sí | Porcentaje de nivel de luz |
| low_light | boolean | Sí | ¿El nivel de luz es bajo? |
| motion | boolean | Sí | ¿Se detectó movimiento? |
| source | string | No | Identificador del dispositivo |

**Petición:**
```bash
curl -X POST http://localhost:3000/api/sensors \
  -H "Content-Type: application/json" \
  -d '{
    "temperature_c": "25.5",
    "humidity_pct": "60.0",
    "light_pct": "45",
    "low_light": false,
    "motion": false,
    "source": "esp8266-B"
  }'
```

**Respuesta (201):**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "temperature_c": "25.5",
  "humidity_pct": "60.0",
  "light_pct": "45",
  "low_light": false,
  "motion": false,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "source": "esp8266-B"
}
```

### PUT /api/sensors/:id

Actualizar una lectura de sensor existente.

**Petición:**
```bash
curl -X PUT http://localhost:3000/api/sensors/6789abc123def456ghi789jk \
  -H "Content-Type: application/json" \
  -d '{
    "temperature_c": "26.0",
    "humidity_pct": "58.0",
    "light_pct": "50",
    "low_light": false,
    "motion": true
  }'
```

**Respuesta:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "temperature_c": "26.0",
  "humidity_pct": "58.0",
  "light_pct": "50",
  "low_light": false,
  "motion": true,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "source": "esp8266-B"
}
```

### DELETE /api/sensors/:id

Eliminar una lectura de sensor.

**Petición:**
```bash
curl -X DELETE http://localhost:3000/api/sensors/6789abc123def456ghi789jk
```

**Respuesta (200):**
```json
{
  "message": "Lectura de sensor eliminada"
}
```

---

## API de Dispositivos

### GET /api/devices

Obtener estados de todos los dispositivos.

**Petición:**
```bash
curl http://localhost:3000/api/devices
```

**Respuesta:**
```json
[
  {
    "_id": "6789abc123def456ghi789jk",
    "available": true,
    "door": {
      "state": "closed",
      "last_changed": "2025-01-15T10:00:00.000Z"
    },
    "window": {
      "state": "open",
      "last_changed": "2025-01-15T09:45:00.000Z"
    },
    "lights": {
      "on": true,
      "last_changed": "2025-01-15T10:15:00.000Z"
    },
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
]
```

### PATCH /api/devices/available

Alternar modo de control manual.

**Cuerpo de Petición:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| available | boolean | Sí | Habilitar/deshabilitar control manual |

**Petición:**
```bash
curl -X PATCH http://localhost:3000/api/devices/available \
  -H "Content-Type: application/json" \
  -d '{"available": true}'
```

**Respuesta:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "available": true,
  "door": { "state": "closed", "last_changed": "2025-01-15T10:00:00.000Z" },
  "window": { "state": "open", "last_changed": "2025-01-15T09:45:00.000Z" },
  "lights": { "on": true, "last_changed": "2025-01-15T10:15:00.000Z" },
  "updatedAt": "2025-01-15T10:35:00.000Z"
}
```

### PATCH /api/devices/door

Actualizar estado de la puerta.

**Cuerpo de Petición:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| state | string | Sí | `"open"`, `"closed"`, o `"locked"` |

**Petición:**
```bash
curl -X PATCH http://localhost:3000/api/devices/door \
  -H "Content-Type: application/json" \
  -d '{"state": "open"}'
```

**Respuesta:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "available": true,
  "door": {
    "state": "open",
    "last_changed": "2025-01-15T10:35:00.000Z"
  },
  "window": { "state": "open", "last_changed": "2025-01-15T09:45:00.000Z" },
  "lights": { "on": true, "last_changed": "2025-01-15T10:15:00.000Z" },
  "updatedAt": "2025-01-15T10:35:00.000Z"
}
```

### PATCH /api/devices/window

Actualizar estado de la ventana.

**Cuerpo de Petición:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| state | string | Sí | `"open"` o `"closed"` |

**Petición:**
```bash
curl -X PATCH http://localhost:3000/api/devices/window \
  -H "Content-Type: application/json" \
  -d '{"state": "closed"}'
```

### PATCH /api/devices/lights

Actualizar estado de las luces.

**Cuerpo de Petición:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| on | boolean | Sí | Encender/apagar luces |

**Petición:**
```bash
curl -X PATCH http://localhost:3000/api/devices/lights \
  -H "Content-Type: application/json" \
  -d '{"on": true}'
```

---

## API de Usuarios

### GET /api/users

Obtener todos los usuarios.

**Petición:**
```bash
curl http://localhost:3000/api/users
```

**Respuesta:**
```json
[
  {
    "_id": "6789abc123def456ghi789jk",
    "name": "Juan Pérez",
    "email": "juan.perez@ejemplo.com",
    "rfid_uid": "A3299BF4",
    "role": "user",
    "active": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

### GET /api/users/allowed

Obtener todos los UIDs RFID permitidos (solo usuarios activos).

**Petición:**
```bash
curl http://localhost:3000/api/users/allowed
```

**Respuesta:**
```json
["A3299BF4", "B4AA0CE5", "C5BB1DF6"]
```

### GET /api/users/:id

Obtener un usuario específico por ID.

**Petición:**
```bash
curl http://localhost:3000/api/users/6789abc123def456ghi789jk
```

**Respuesta:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "name": "Juan Pérez",
  "email": "juan.perez@ejemplo.com",
  "rfid_uid": "A3299BF4",
  "role": "user",
  "active": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

### POST /api/users

Crear un nuevo usuario.

**Cuerpo de Petición:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | Sí | Nombre completo del usuario |
| email | string | Sí | Email del usuario (único) |
| rfid_uid | string | Sí | UID de tarjeta RFID (único) |
| role | string | No | `"admin"`, `"user"`, o `"guest"` (por defecto: `"user"`) |
| active | boolean | No | ¿Usuario activo? (por defecto: `true`) |

**Petición:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria.garcia@ejemplo.com",
    "rfid_uid": "D6CC2EG7",
    "role": "user"
  }'
```

**Respuesta (201):**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "name": "María García",
  "email": "maria.garcia@ejemplo.com",
  "rfid_uid": "D6CC2EG7",
  "role": "user",
  "active": true,
  "createdAt": "2025-01-15T10:35:00.000Z",
  "updatedAt": "2025-01-15T10:35:00.000Z"
}
```

**Respuesta de Error (400 - Email Duplicado):**
```json
{
  "error": "El email ya existe"
}
```

### PUT /api/users/:id

Actualizar un usuario existente.

**Petición:**
```bash
curl -X PUT http://localhost:3000/api/users/6789abc123def456ghi789jk \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García López",
    "role": "admin"
  }'
```

**Respuesta:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "name": "María García López",
  "email": "maria.garcia@ejemplo.com",
  "rfid_uid": "D6CC2EG7",
  "role": "admin",
  "active": true,
  "createdAt": "2025-01-15T10:35:00.000Z",
  "updatedAt": "2025-01-15T10:40:00.000Z"
}
```

### DELETE /api/users/:id

Eliminar un usuario.

**Petición:**
```bash
curl -X DELETE http://localhost:3000/api/users/6789abc123def456ghi789jk
```

**Respuesta (200):**
```json
{
  "message": "Usuario eliminado"
}
```

---

## API de Logs de Acceso

### GET /api/logs

Obtener todos los logs de acceso.

**Petición:**
```bash
curl http://localhost:3000/api/logs
```

**Respuesta:**
```json
[
  {
    "_id": "6789abc123def456ghi789jk",
    "uid": "A3299BF4",
    "authorized": true,
    "door_action": "open",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "user_id": "6789abc123def456ghi789ab",
    "source": "esp32-A"
  }
]
```

### GET /api/logs/:id

Obtener un log de acceso específico por ID.

**Petición:**
```bash
curl http://localhost:3000/api/logs/6789abc123def456ghi789jk
```

**Respuesta:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "uid": "A3299BF4",
  "authorized": true,
  "door_action": "open",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "user_id": "6789abc123def456ghi789ab",
  "source": "esp32-A"
}
```

### POST /api/logs

Crear una nueva entrada de log de acceso.

**Cuerpo de Petición:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| uid | string | Sí | UID de tarjeta RFID |
| authorized | boolean | Sí | ¿Acceso autorizado? |
| door_action | string | No | `"open"`, `"deny"`, o `"lock"` (por defecto: `"deny"`) |
| user_id | string | No | ObjectId de MongoDB del usuario asociado |
| source | string | No | Identificador del dispositivo |

**Petición:**
```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "A3299BF4",
    "authorized": true,
    "door_action": "open",
    "source": "esp32-A"
  }'
```

**Respuesta (201):**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "uid": "A3299BF4",
  "authorized": true,
  "door_action": "open",
  "timestamp": "2025-01-15T10:35:00.000Z",
  "source": "esp32-A"
}
```

### PUT /api/logs/:id

Actualizar un log de acceso existente.

**Petición:**
```bash
curl -X PUT http://localhost:3000/api/logs/6789abc123def456ghi789jk \
  -H "Content-Type: application/json" \
  -d '{
    "door_action": "lock"
  }'
```

### DELETE /api/logs/:id

Eliminar una entrada de log de acceso.

**Petición:**
```bash
curl -X DELETE http://localhost:3000/api/logs/6789abc123def456ghi789jk
```

---

## API de Alertas

### GET /api/alerts

Obtener todas las alertas.

**Petición:**
```bash
curl http://localhost:3000/api/alerts
```

**Respuesta:**
```json
[
  {
    "_id": "6789abc123def456ghi789jk",
    "type": "unauthorized_presence",
    "description": "Presencia >30s sin RFID válido",
    "duration_ms": 30000,
    "timestamp": "2025-01-15T10:30:00.000Z",
    "resolved": false,
    "source": "esp32-A"
  }
]
```

### GET /api/alerts/:id

Obtener una alerta específica por ID.

**Petición:**
```bash
curl http://localhost:3000/api/alerts/6789abc123def456ghi789jk
```

### POST /api/alerts

Crear una nueva alerta.

**Cuerpo de Petición:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| type | string | Sí | Tipo de alerta (ver abajo) |
| description | string | Sí | Descripción de la alerta |
| duration_ms | number | No | Duración en milisegundos |
| resolved | boolean | No | ¿Alerta resuelta? (por defecto: `false`) |
| source | string | No | Identificador del dispositivo |

**Tipos de Alerta:**
- `unauthorized_presence` - Presencia detectada sin RFID válido
- `motion_alert` - Movimiento detectado en área restringida
- `temp_high` - Temperatura excedió umbral
- `humidity_high` - Humedad excedió umbral
- `forced_door` - Puerta forzada abierta

**Petición:**
```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "type": "unauthorized_presence",
    "description": "Presencia >30s sin RFID válido",
    "duration_ms": 30000,
    "source": "esp32-A"
  }'
```

**Respuesta (201):**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "type": "unauthorized_presence",
  "description": "Presencia >30s sin RFID válido",
  "duration_ms": 30000,
  "timestamp": "2025-01-15T10:35:00.000Z",
  "resolved": false,
  "source": "esp32-A"
}
```

### PUT /api/alerts/:id

Actualizar una alerta existente (ej., marcar como resuelta).

**Petición:**
```bash
curl -X PUT http://localhost:3000/api/alerts/6789abc123def456ghi789jk \
  -H "Content-Type: application/json" \
  -d '{
    "resolved": true
  }'
```

**Respuesta:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "type": "unauthorized_presence",
  "description": "Presencia >30s sin RFID válido",
  "duration_ms": 30000,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "resolved": true,
  "source": "esp32-A"
}
```

### DELETE /api/alerts/:id

Eliminar una alerta.

**Petición:**
```bash
curl -X DELETE http://localhost:3000/api/alerts/6789abc123def456ghi789jk
```

---

## Manejo de Errores

### Errores de Validación

Cuando faltan campos requeridos o son inválidos:

```json
{
  "error": "ValidationError",
  "message": "La ruta `email` es requerida."
}
```

### Errores de No Encontrado

Cuando un recurso no se encuentra:

```json
{
  "error": "NotFound",
  "message": "Recurso con ID xyz no encontrado"
}
```

### Errores del Servidor

Cuando ocurre un error inesperado:

```json
{
  "error": "InternalServerError",
  "message": "Ocurrió un error inesperado"
}
```

---

## Limitación de Tasa

> **Nota**: La limitación de tasa no está implementada actualmente. Para producción, considera agregar middleware de limitación de tasa.

---

## CORS

La API está configurada para aceptar peticiones desde cualquier origen en desarrollo:

```typescript
app.use(cors({
  origin: "*",
  methods: ["GET, POST, PUT, DELETE, PATCH"],
  allowedHeaders: ["Content-Type, Authorization"],
}));
```

Para producción, restringir a orígenes específicos.

---

## Paginación

> **Nota**: La paginación no está implementada actualmente. Todos los endpoints retornan todos los registros coincidentes. Para producción con conjuntos de datos grandes, considera implementar paginación.

Ejemplo de formato de paginación futura:
```json
{
  "data": [ /* elementos */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Documentación Relacionada

- [Documentación Técnica](./TECHNICAL.md) - Visión general y detalles del sistema
- [Arquitectura](./ARCHITECTURE.md) - Diagramas de arquitectura del sistema
- [Guía de Configuración](./SETUP.md) - Configuración del entorno de desarrollo

---

*Última actualización: Diciembre 2024*
