# 📚 Documentación Completa - SmartRoom

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Documentación de Componentes](#documentación-de-componentes)
6. [Guía de Usuario](#guía-de-usuario)
7. [Instalación y Configuración](#instalación-y-configuración)
8. [Endpoints de la API](#endpoints-de-la-api)

---

## Descripción General

**SmartRoom** es un sistema completo de automatización y monitoreo de habitaciones inteligentes basado en IoT. Proporciona:

- ✅ Monitoreo ambiental en tiempo real (temperatura, humedad, luz)
- ✅ Detección de movimiento y presencia no autorizada
- ✅ Control de acceso mediante RFID
- ✅ Control automatizado de puertas, ventanas y luces
- ✅ Sistema de alertas en tiempo real
- ✅ Panel web intuitivo para gestión y control
- ✅ Historial completo de accesos

El sistema integra **microcontroladores ESP8266** con sensores IoT, un backend robusto en Node.js/Express y una aplicación frontend moderna con React.

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    DISPOSITIVOS IoT                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ESP8266-A (Control de Acceso)    ESP8266-B (Ambiental) │
│  └─ RFID Reader (MFRC522)         └─ DHT11 (Temp/Hum) │
│  └─ Servo (Puerta)                 └─ LDR (Luz)       │
│  └─ Ultrasonido (Presencia)        └─ PIR (Movimiento) │
│  └─ LED Alarma                      └─ HC-SR04 (Dist)  │
│  └─ WiFi                            └─ WiFi            │
│                  │                           │          │
└──────────────────┼───────────────────────────┼──────────┘
                   │ HTTP/MQTT                 │
                   └─────────────┬─────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │   Broker MQTT            │
                    │  (192.168.1.35:1883)    │
                    └──────────────┬───────────┘
                                   │
        ┌──────────────────────────┴──────────────────────────┐
        ▼                                                       ▼
┌──────────────────────────┐                        ┌─────────────────────┐
│  Backend (Node.js)       │                        │  Frontend (React)   │
│  ├─ Express API          │                        │  ├─ Dashboard       │
│  ├─ Controllers          │                        │  ├─ Controles       │
│  ├─ Services             │                        │  ├─ Acceso/Usuarios │
│  ├─ MQTT Client          │◄──────────────────────►│  └─ Eventos/Alertas│
│  └─ Mongoose Models      │   HTTP REST API        └─────────────────────┘
│     Puerto: 3000         │     (localhost:3000)
└──────────────┬───────────┘
               │
               ▼
        ┌─────────────────┐
        │   MongoDB       │
        │ Datos del Sistema│
        └─────────────────┘
```

---

## Stack Tecnológico

### 🔧 Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Lenguaje**: TypeScript 5.9+
- **Base de Datos**: MongoDB 8.x con Mongoose ODM
- **Mensajería**: MQTT (mqtt v5.14)
- **Herramientas**: 
  - nodemon (recarga automática)
  - ts-node (ejecución TypeScript)
  - ESLint + Prettier (linting/formato)

### 🎨 Frontend
- **Librería**: React 19
- **Herramienta de Build**: Vite 7.2
- **Estilos**: Tailwind CSS 3.4
- **Gráficos**: Recharts 3.4 (gráficos de sensores)
- **Íconos**: Lucide React 0.553
- **Notificaciones**: React Hot Toast 2.6
- **Router**: React Router DOM 7.9
- **Lenguaje**: TypeScript 5.9

### 🔌 Firmware (Microcontroladores)
- **Plataforma**: ESP8266 (NodeMCU v2)
- **Framework**: Arduino (PlatformIO)
- **Librerías Clave**:
  - MFRC522 (lector RFID)
  - ArduinoJson (serialización JSON)
  - PubSubClient (MQTT)
  - Servo (control de motores)

---

## Estructura de Carpetas

```
SmartRoom/
│
├── backend/                          # API REST - Node.js/Express
│   ├── src/
│   │   ├── app.ts                   # Configuración de Express
│   │   ├── server.ts                # Punto de entrada del servidor
│   │   │
│   │   ├── config/
│   │   │   ├── config.ts            # Variables de entorno
│   │   │   └── response.ts          # Tipos de respuesta HTTP
│   │   │
│   │   ├── models/                  # Esquemas de base de datos
│   │   │   ├── user_model.ts        # Usuarios (RFID, roles)
│   │   │   ├── device_model.ts      # Estados de dispositivos
│   │   │   ├── sensors_model.ts     # Datos de sensores
│   │   │   ├── alerts_model.ts      # Sistema de alertas
│   │   │   └── access_logs_model.ts # Historial de accesos
│   │   │
│   │   ├── controllers/             # Lógica de peticiones HTTP
│   │   │   ├── user_controller.ts
│   │   │   ├── devices_controller.ts
│   │   │   ├── sensors_controller.ts
│   │   │   ├── alerts_controller.ts
│   │   │   └── acess_logs_controller.ts
│   │   │
│   │   ├── services/                # Lógica de negocio
│   │   │   ├── user_service.ts
│   │   │   ├── devices_service.ts
│   │   │   ├── sensors_service.ts
│   │   │   ├── alerts_services.ts
│   │   │   └── access_logs_services.ts
│   │   │
│   │   ├── routes/                  # Rutas de API
│   │   │   ├── index.ts             # Punto de entrada de rutas
│   │   │   ├── user_routes.ts
│   │   │   ├── devices_routes.ts
│   │   │   ├── sensors_routes.ts
│   │   │   ├── alert_routes.ts
│   │   │   └── access_logs_routes.ts
│   │   │
│   │   └── mqtt/
│   │       └── mqtt_client.ts       # Cliente MQTT para comunicación
│   │
│   ├── package.json                 # Dependencias
│   ├── tsconfig.json                # Configuración TypeScript
│   └── nodemon.json                 # Configuración de recarga automática
│
├── frontend/                         # Aplicación React - Vite
│   ├── src/
│   │   ├── main.tsx                 # Punto de entrada React
│   │   ├── App.tsx                  # Componente principal
│   │   │
│   │   ├── api/                     # Funciones cliente de API
│   │   │   ├── usersApi.ts
│   │   │   ├── sensorsApi.ts
│   │   │   ├── controlsApi.ts       # Control de dispositivos
│   │   │   ├── alertsApi.ts
│   │   │   └── logsApi.ts           # Historial de accesos
│   │   │
│   │   ├── components/              # Componentes React reutilizables
│   │   │   ├── ControlPanel.tsx     # Panel de control principal
│   │   │   ├── ControlSwitch.tsx
│   │   │   ├── DoorSwitch.tsx
│   │   │   ├── LightSwitch.tsx
│   │   │   ├── WindowSwitch.tsx
│   │   │   ├── ManualSwitch.tsx
│   │   │   └── Clock.tsx
│   │   │
│   │   ├── pages/                   # Componentes de página
│   │   │   ├── Dashboard.tsx        # Panel principal (sensores + gráficos)
│   │   │   ├── Access.tsx           # Gestión de usuarios
│   │   │   ├── Events.tsx           # Historial de eventos/alertas
│   │   │   └── Controls.tsx
│   │   │
│   │   ├── types/                   # Interfaces TypeScript
│   │   │   ├── User.ts
│   │   │   ├── Sensors.ts
│   │   │   ├── Alerts.ts
│   │   │   └── Logs.ts
│   │   │
│   │   ├── hooks/                   # Custom hooks React
│   │   │   └── useFetch.ts          # Hook para peticiones HTTP
│   │   │
│   │   ├── layouts/
│   │   │   └── Layout.tsx           # Layout principal con navegación
│   │   │
│   │   ├── App.css                  # Estilos globales
│   │   └── index.css
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts               # Configuración Vite
│   ├── tailwind.config.js           # Configuración Tailwind
│   └── index.html                   # HTML principal
│
├── SmartRoom_IO/                     # Firmware ESP8266 (Control Acceso)
│   ├── src/
│   │   ├── main.cpp                 # Programa principal
│   │   └── mqtt_config.cpp
│   ├── lib/
│   │   └── mqtt_config.h
│   └── platformio.ini               # Configuración PlatformIO
│
├── SmartRoom_IO_2/                   # Firmware ESP8266 (Sensores)
│   ├── src/
│   │   ├── main.cpp
│   │   └── mqtt_config.cpp
│   ├── lib/
│   │   └── mqtt_config.h
│   └── platformio.ini
│
├── documentation.md                  # Este archivo
├── README.md
└── LICENSE
```

---

## Documentación de Componentes

### 📱 Backend

#### `app.ts` - Configuración de Express
Configura el servidor Express con:
- CORS habilitado para permitir conexiones del frontend
- Middleware de JSON
- Rutas de API bajo el prefijo `/api`
- Ruta raíz de prueba

```typescript
// Rutas disponibles:
GET  /                    → Mensaje de bienvenida
POST /api/users          → CRUD de usuarios
GET  /api/sensors        → Datos de sensores
PUT  /api/devices        → Control de dispositivos
GET  /api/alerts         → Sistema de alertas
GET  /api/logs           → Historial de accesos
```

#### `server.ts` - Punto de Entrada
Conecta la base de datos MongoDB y levanta el servidor:
- Escucha en puerto definido por `config.port`
- Conecta con MongoDB usando Mongoose
- Registra estado de conexión en consola

#### `config.ts` - Configuración
Lee variables de entorno:
```javascript
PORT=3000              // Puerto del servidor
NODE_ENV=development   // Ambiente (development/production)
MONGO_URI=mongodb://... // Conexión a MongoDB
```

#### Modelos de Base de Datos

**`user_model.ts` - Usuarios**
```typescript
{
  name: string,           // Nombre del usuario
  email: string,          // Email único
  rfid_uid: string,       // UID del tag RFID único
  role: "admin|user|guest", // Rol de usuario
  active: boolean,        // Usuario activo/desactivado
  createdAt: Date,
  updatedAt: Date
}
```

**`device_model.ts` - Dispositivos**
```typescript
{
  available: boolean,     // Modo manual activado
  door: {
    state: "open|closed|locked",
    last_changed: Date
  },
  window: {
    state: "open|closed",
    last_changed: Date
  },
  lights: {
    on: boolean,
    last_changed: Date
  },
  updatedAt: Date
}
```

**`sensors_model.ts` - Sensores**
```typescript
{
  temperature_c: string,   // Temperatura en Celsius
  humidity_pct: string,    // Humedad en porcentaje
  light_pct: string,       // Luz en porcentaje
  low_light: boolean,      // Indicador de luz baja
  motion: boolean,         // Movimiento detectado
  timestamp: Date,
  source: string           // Fuente del sensor (ESP32, etc)
}
```

**`alerts_model.ts` - Alertas**
```typescript
{
  type: "unauthorized_presence|motion_alert|temp_high|humidity_high|forced_door",
  description: string,
  duration_ms: number,     // Duración de la alerta
  timestamp: Date,
  resolved: boolean,       // Alerta resuelta
  source: string           // Dispositivo que generó alerta
}
```

**`access_logs_model.ts` - Historial de Accesos**
```typescript
{
  uid: string,             // UID del tag RFID
  authorized: boolean,     // Acceso autorizado/denegado
  door_action: "open|deny|lock",
  timestamp: Date,
  user_id: ObjectId,       // Referencia a usuario
  source: string           // Dispositivo que registró
}
```

#### Controladores
Manejan las peticiones HTTP y llaman a los servicios:
- Validan datos
- Llaman métodos de servicio
- Retornan respuestas JSON
- Manejan errores

#### Servicios
Contienen la lógica de negocio:
- Operaciones CRUD en base de datos
- Validaciones de datos
- Lógica de negocio compleja
- Interacciones con MQTT

#### MQTT Client
`mqtt_client.ts` - Cliente que se conecta al broker MQTT:
- Host: `mqtt://192.168.1.35`
- Publica lista de usuarios activos en `rfid/allowed/update`
- Se suscribe a tópicos para recibir comandos
- Autorización con usuario/contraseña

---

### 🎨 Frontend

#### `App.tsx` - Componente Principal
Define las rutas de la aplicación:
- Dashboard: Panel principal
- Access: Gestión de usuarios
- Events: Historial de eventos

Integra notificaciones con React Hot Toast.

#### Páginas

**`Dashboard.tsx` - Panel Principal**
Muestra en tiempo real:
- **Sensores**: Temperatura, humedad, luz, movimiento
- **Gráfico de Monitoreo**: Líneas de temperatura, humedad y luz
- **Panel de Control**: Botones para controlar puertas, ventanas, luces
- **Modo Manual**: Activar/desactivar control automático

Actualiza datos cada 5 segundos y sincroniza con el servidor.

**`Access.tsx` - Gestión de Usuarios**
CRUD completo de usuarios:
- Listar todos los usuarios
- Crear nuevo usuario con RFID
- Editar usuario existente
- Eliminar usuario
- Asignar roles (admin, user, guest)
- Activar/desactivar usuarios

**`Events.tsx`** (vacío, en desarrollo)

#### Componentes

**`ControlPanel.tsx`**
Panel principal con todos los controles:
- Switch de puerta
- Switch de ventana
- Switch de luces
- Switch de modo manual

**`ControlSwitch.tsx`, `DoorSwitch.tsx`, etc.**
Componentes individuales para cada dispositivo. Cada uno:
- Muestra estado actual
- Permite cambiar estado
- Entra en animación mientras se actualiza
- Muestra error si falla

#### API Hooks
Custom hooks para peticiones HTTP:
```typescript
useGetSensors()      // GET /api/sensors
useGetControls()     // GET /api/devices
useUpdateDoor()      // PUT /api/devices
useGetUsers()        // GET /api/users
usePostUser()        // POST /api/users
usePutUser()         // PUT /api/users/:id
useDeleteUser()      // DELETE /api/users/:id
```

#### useFetch Hook
Hook genérico para peticiones HTTP:
```typescript
const {data, isLoading, commonFetch} = useFetch(url, method)

// Uso:
await commonFetch({input: {...}})
```

---

### 🔌 Firmware ESP8266

#### `SmartRoom_IO` - Control de Acceso
**Hardware**:
- MFRC522 RFID Reader (pines D2, D1)
- Servo motor para puerta (pin D4)
- Sensor ultrasonido HC-SR04 (pines D0, D8)
- LED alarma (pin D3)
- WiFi integrado

**Funciones principales**:
1. **Lectura RFID**: Lee tags RFID
2. **Validación**: Compara con lista de UIDs autorizados
3. **Control de Puerta**: Abre puerta si está autorizado
4. **Detección de Presencia**: Ultrasonido detecta intrusos
5. **Sistema de Alarma**: Alerta sonora/visual si presencia sin RFID
6. **Comunicación**:
   - HTTP: Registra accesos en backend
   - MQTT: Recibe actualizaciones de usuarios y comandos

**Flujo de Operación**:
```
Lee RFID
    ↓
¿Autorizado?
    ├─ SÍ → Abre puerta + POST acceso autorizado
    └─ NO → POST acceso denegado + Alarma si presencia
```

---

## Guía de Usuario

### 👨‍💼 Rol: Administrador

#### 1. Acceder al Dashboard
1. Abrir navegador en `http://localhost:5173`
2. Se muestra el panel principal

#### 2. Monitoreo de Sensores
- **Panel de sensores**: Muestra valores en tiempo real
- **Gráfico**: Visualiza tendencias de temperatura, humedad y luz
- Se actualiza cada 5 segundos automáticamente

#### 3. Controlar Dispositivos (Modo Manual)
- **Activar Modo Manual**: Clic en "Modo Manual"
- Botones se activan:
  - 🚪 Puerta: Abre/Cierra la puerta
  - 🪟 Ventana: Abre/Cierra ventana
  - 💡 Luces: Enciende/Apaga
- Los cambios se sincronizan en tiempo real

#### 4. Gestionar Usuarios
1. Ir a sección **Acceso**
2. Tabla de usuarios activos

**Crear Usuario**:
- Clic en "+ Nuevo Usuario"
- Llenar formulario:
  - Nombre
  - Email (único)
  - RFID UID (UID del tag, único)
  - Rol: admin/user/guest
  - Estado: Activo/Desactivado
- Clic "Guardar"
- ✅ Usuario creado y agregado a lista de autorizados

**Editar Usuario**:
- Tabla → Clic en "Editar"
- Modificar campos necesarios
- Clic "Guardar"
- ✅ Los cambios se sincronizan con ESP8266 automáticamente

**Eliminar Usuario**:
- Tabla → Clic en "Eliminar"
- ✅ Usuario removido de la lista de autorizados

#### 5. Visualizar Eventos (En Desarrollo)
- Sección **Eventos**: Historial de accesos y alertas
- Filtrar por tipo, fecha, usuario
- Exportar reportes

### 👤 Rol: Usuario/Guest

Pueden acceder solo a:
- Dashboard (lectura)
- Dashboard (lectura)
- No pueden crear/editar/eliminar usuarios
- No pueden cambiar modo manual

### 🔐 Seguridad

**Acceso con RFID**:
1. Acercarse con tag RFID al lector
2. Sistema valida UID
3. ✅ Si está autorizado: Puerta se abre 3 segundos
4. ❌ Si no está autorizado: Se registra intento fallido
5. 🚨 Si hay presencia >30s sin RFID válido: Alerta

---

## Instalación y Configuración

### 📋 Prerrequisitos

- Node.js 18+ ([descargar](https://nodejs.org/))
- MongoDB 6+ ([descargar](https://www.mongodb.com/try/download/community))
- npm o yarn
- Git
- PlatformIO CLI (para firmware)
- Arduino IDE (opcional, para debuggeo)

### 🚀 Instalación Backend

```bash
# 1. Navegar a carpeta backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno
# Windows PowerShell:
echo "PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smartroom" | Out-File -Encoding utf8 .env

# Linux/Mac:
cat > .env << EOF
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smartroom
EOF

# 4. Iniciar servidor
npm run nodemon

# ✅ Servidor corriendo en http://localhost:3000
```

### 🎨 Instalación Frontend

```bash
# 1. Navegar a carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# ✅ App corriendo en http://localhost:5173
```

### 🔌 Instalación Firmware

```bash
# 1. Instalar PlatformIO CLI
pip install platformio

# 2. Abrir proyecto
cd SmartRoom_IO
pio project init

# 3. Configurar credenciales WiFi en src/main.cpp
# Buscar y modificar:
const char *WIFI_SSID = "TU_SSID";
const char *WIFI_PASS = "TU_PASSWORD";

# 4. Compilar
pio run

# 5. Cargar en ESP8266
pio run --target upload

# ✅ Firmware cargado en el microcontrolador
```

### 🗄️ Configurar MongoDB

**Opción 1: MongoDB Local**
```bash
# Descargar e instalar desde mongodb.com
# En Windows: mongod.exe comienza el servidor
# En Linux/Mac: mongod

# Verificar conexión:
mongosh
> show databases
```

**Opción 2: MongoDB Atlas (Cloud)**
```bash
# 1. Crear cuenta en https://www.mongodb.com/cloud/atlas
# 2. Crear cluster
# 3. Obtener connection string
# 4. Actualizar MONGO_URI en .env
```

### 🔗 Configuración MQTT

El sistema usa MQTT para comunicación en tiempo real entre ESP8266 y Backend.

**Opción 1: Broker Local**
```bash
# Instalar Mosquitto (broker MQTT)
# Windows: descargar desde mosquitto.org
# Linux: sudo apt-get install mosquitto

# Iniciar servicio:
mosquitto

# Verificar puerto (por defecto 1883)
```

**Opción 2: Broker en Línea**
- Use un broker público como test.mosquitto.org
- Modifique IP en:
  - `backend/src/mqtt/mqtt_client.ts`
  - `SmartRoom_IO/src/main.cpp`

---

## Endpoints de la API

### 👥 Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Listar todos los usuarios |
| GET | `/api/users/:id` | Obtener usuario por ID |
| GET | `/api/users/allowed` | Listar RFIDs autorizados |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

**Ejemplo POST /api/users**:
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "rfid_uid": "1A2B3C4D",
  "role": "admin",
  "active": true
}
```

### 📊 Sensores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/sensors` | Obtener último registro de sensores |
| POST | `/api/sensors` | Registrar nuevo dato de sensor |

**Ejemplo respuesta GET /api/sensors**:
```json
{
  "temperature_c": "25.3",
  "humidity_pct": "45.2",
  "light_pct": "80.0",
  "low_light": false,
  "motion": true,
  "timestamp": "2024-12-01T15:30:00Z",
  "source": "ESP32-B"
}
```

### 🚪 Dispositivos (Control)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/devices` | Obtener estado de dispositivos |
| PUT | `/api/devices/door` | Controlar puerta (open/closed/locked) |
| PUT | `/api/devices/window` | Controlar ventana (open/closed) |
| PUT | `/api/devices/lights` | Controlar luces (on/off) |
| PUT | `/api/devices/manual` | Activar/desactivar modo manual |

**Ejemplo PUT /api/devices/door**:
```json
{
  "state": "open"  // "open", "closed", "locked"
}
```

### ⚠️ Alertas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/alerts` | Obtener todas las alertas |
| POST | `/api/alerts` | Crear nueva alerta |

**Tipos de alerta**:
- `unauthorized_presence`: Presencia sin RFID válido
- `motion_alert`: Movimiento detectado
- `temp_high`: Temperatura alta
- `humidity_high`: Humedad alta
- `forced_door`: Fuerza en la puerta

### 📜 Historial de Accesos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/logs` | Obtener todos los accesos |
| POST | `/api/logs` | Registrar acceso |

**Ejemplo respuesta GET /api/logs**:
```json
{
  "uid": "1A2B3C4D",
  "authorized": true,
  "door_action": "open",
  "timestamp": "2024-12-01T15:30:00Z",
  "user_id": "507f1f77bcf86cd799439011",
  "source": "esp32-A"
}
```

---

## Solución de Problemas

### ❌ Backend no conecta a MongoDB
**Síntomas**: Error "Failed to connect to MongoDB"

**Soluciones**:
1. Verificar MongoDB está corriendo: `mongosh`
2. Verificar `MONGO_URI` en `.env`
3. En Windows, iniciar servicio: `mongod.exe`
4. Reiniciar terminal

### ❌ Frontend no ve cambios
**Síntomas**: Dashboard no actualiza datos

**Soluciones**:
1. Verificar backend está corriendo
2. Verificar URL en `api/*.ts` es correcta
3. Limpiar caché: `Ctrl+Shift+R` (hard refresh)
4. Revisar consola de navegador (F12) para errores

### ❌ ESP8266 no conecta WiFi
**Síntomas**: Serial muestra "WiFi falló"

**Soluciones**:
1. Verificar SSID y password en `main.cpp`
2. Verificar ESP8266 está cerca del router
3. Aumentar delay de conexión: cambiar `15000` por `20000`

### ❌ RFID no funciona
**Síntomas**: No lee tags

**Soluciones**:
1. Verificar pines SPI (D2, D1)
2. Probar con programa de ejemplo MFRC522
3. Verificar tag RFID funciona en otro dispositivo
4. Revisar voltaje: debe ser 3.3V

---

## Notas Importantes

- 🔐 **Seguridad**: Las credenciales WiFi están hardcodeadas. En producción, usar almacenamiento seguro.
- 📱 **Performance**: El frontend está optimizado con useMemo y useCallback.
- 💾 **Base de Datos**: Los datos de sensores se guardan cada lectura. Considerar agregación para grandes volúmenes.
- 🔄 **MQTT**: Los mensajes se persisten (retain: true) para no perder datos.
- ⚡ **Tiempo Real**: Actualización cada 5 segundos en frontend (configurable).
- ‼️**Bug**: El modo manual presenta un bug: cuando se activa, luego se enciende algún módulo y finalmente se desactiva el modo manual sin apagar antes ese módulo, la lógica automática deja de funcionar. Para evitarlo, antes de salir del modo manual se debe verificar que ningún módulo continúe activado; de lo contrario, el modo automático no tomará el control correctamente.


**Última actualización**: Diciembre 1, 2024  
**Versión del documento**: 1.0
