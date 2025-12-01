# Guía de Configuración de SmartRoom

Esta guía proporciona instrucciones paso a paso para configurar el entorno de desarrollo de SmartRoom.

## Tabla de Contenidos

- [Prerrequisitos](#prerrequisitos)
- [Inicio Rápido](#inicio-rápido)
- [Configuración del Backend](#configuración-del-backend)
- [Configuración del Frontend](#configuración-del-frontend)
- [Configuración del Firmware](#configuración-del-firmware)
- [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
- [Configuración del Broker MQTT](#configuración-del-broker-mqtt)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)
- [Ejecutar Pruebas](#ejecutar-pruebas)
- [Compilar para Producción](#compilar-para-producción)
- [Solución de Problemas](#solución-de-problemas)

---

## Prerrequisitos

### Software Requerido

| Software | Versión | Propósito |
|----------|---------|-----------|
| Node.js | 18.x o superior | Runtime de backend y frontend |
| npm | 9.x o superior | Gestión de paquetes |
| MongoDB | 6.x o superior | Base de datos |
| Git | 2.x o superior | Control de versiones |
| PlatformIO | Última | Desarrollo de firmware |

### Software Opcional

| Software | Propósito |
|----------|-----------|
| Docker | Despliegue en contenedores |
| VS Code | IDE recomendado |
| MongoDB Compass | GUI de base de datos |
| MQTT Explorer | Depuración de MQTT |

### Hardware (para funcionalidad IoT completa)

- 2x placas ESP8266 NodeMCU v2
- Sensor de temperatura/humedad DHT11
- Módulo lector RFID MFRC522
- Sensor ultrasónico HC-SR04
- Sensor de movimiento PIR HC-SR501
- 2x servomotores SG90
- LDR (fotorresistor) con resistencia de 10kΩ
- LEDs con resistencias apropiadas
- Protoboard y cables jumper
- Fuente de alimentación 5V (para servos)

---

## Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/GerardoMejia1107/SmartRoom.git
cd SmartRoom

# Instalar dependencias del backend
cd backend
npm install

# Crear archivo de entorno
cp .env.example .env  # Editar con tu URI de MongoDB

# Iniciar backend (requiere MongoDB corriendo)
npm run nodemon

# En una nueva terminal, instalar e iniciar frontend
cd ../frontend
npm install
npm run dev
```

Abrir el navegador en `http://localhost:5173` para ver la aplicación.

---

## Configuración del Backend

### 1. Navegar al Directorio del Backend

```bash
cd backend
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instala los siguientes paquetes clave:
- `express` - Framework web
- `mongoose` - ODM de MongoDB
- `mqtt` - Cliente MQTT
- `dotenv` - Configuración de entorno
- `cors` - Compartición de recursos entre orígenes
- `typescript` - Compilador TypeScript

### 3. Configurar Entorno

Crear un archivo `.env` en el directorio `backend/`:

```bash
touch .env
```

Agregar la siguiente configuración:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de MongoDB
MONGO_URI=mongodb://localhost:27017/smartroom
```

### 4. Verificar Configuración de TypeScript

El `tsconfig.json` ya debería estar configurado. Configuraciones clave:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 5. Iniciar Servidor de Desarrollo

```bash
npm run nodemon
```

El backend iniciará en `http://localhost:3000`.

### 6. Verificar que el Backend está Corriendo

```bash
curl http://localhost:3000/
# Salida esperada: Hello, World!

curl http://localhost:3000/api/sensors
# Salida esperada: [] (array vacío si no hay datos)
```

---

## Configuración del Frontend

### 1. Navegar al Directorio del Frontend

```bash
cd frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instala los siguientes paquetes clave:
- `react` - Librería de UI
- `react-dom` - Renderizador React DOM
- `react-router-dom` - Enrutamiento del lado del cliente
- `recharts` - Visualización de datos
- `lucide-react` - Íconos
- `react-hot-toast` - Notificaciones toast
- `tailwindcss` - Framework CSS
- `vite` - Herramienta de build

### 3. Configurar Endpoint de API (si es necesario)

Si tu backend no está corriendo en `localhost:3000`, actualiza la URL base de la API en los archivos de API ubicados en `frontend/src/api/`.

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El frontend iniciará en `http://localhost:5173`.

### 5. Scripts Disponibles

```bash
# Iniciar servidor de desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar ESLint
npm run lint
```

---

## Configuración del Firmware

### 1. Instalar PlatformIO

**Opción A: Extensión de VS Code (Recomendada)**

1. Instalar [Visual Studio Code](https://code.visualstudio.com/)
2. Instalar la [extensión PlatformIO IDE](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide)

**Opción B: Instalación CLI**

```bash
pip install platformio
```

### 2. Abrir Proyecto de Firmware

Hay dos proyectos de firmware:

- `SmartRoom_IO/` - Nodo de control de acceso (RFID, puerta)
- `SmartRoom_IO_2/` - Nodo de control ambiental (DHT11, LDR, PIR)

Abrir la carpeta del proyecto deseado en VS Code con PlatformIO.

### 3. Configurar WiFi y Backend

Editar `src/main.cpp` en cada proyecto:

```cpp
// Actualizar estos valores
const char *WIFI_SSID = "TU_SSID_WIFI";
const char *WIFI_PASS = "TU_CONTRASEÑA_WIFI";
const char *BACKEND_URL = "http://IP_TU_BACKEND:3000/api/sensors";
```

Editar `lib/mqtt_config.cpp`:

```cpp
// Actualizar configuración del broker MQTT
const char* MQTT_HOST = "mqtt://IP_TU_BROKER_MQTT";
const char* MQTT_USER = "tu_usuario_mqtt";
const char* MQTT_PASSWORD = "tu_contraseña_mqtt";
```

### 4. Instalar Librerías

PlatformIO instalará automáticamente las librerías definidas en `platformio.ini`:

**SmartRoom_IO (Control de Acceso):**
- MFRC522
- PubSubClient
- ArduinoJson

**SmartRoom_IO_2 (Ambiental):**
- DHT sensor library
- Adafruit Unified Sensor
- PubSubClient
- ArduinoJson

### 5. Compilar y Cargar

```bash
# Usando CLI de PlatformIO
cd SmartRoom_IO  # o SmartRoom_IO_2
pio run --target upload

# O usar el botón de upload de PlatformIO IDE en VS Code
```

### 6. Monitorear Salida Serial

```bash
pio device monitor --baud 115200

# O usar el Monitor Serial integrado de VS Code
```

---

## Configuración de la Base de Datos

### Opción A: Instalación Local de MongoDB

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
1. Descargar MongoDB Community Server de [mongodb.com](https://www.mongodb.com/try/download/community)
2. Ejecutar el instalador y seguir el asistente de configuración
3. Iniciar el servicio de MongoDB

### Opción B: Docker

```bash
docker run -d --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7
```

### Opción C: MongoDB Atlas (Nube)

1. Crear una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un nuevo cluster
3. Obtener tu cadena de conexión
4. Actualizar `MONGO_URI` en tu archivo `.env`

### Verificar Conexión a MongoDB

```bash
# Usando mongosh
mongosh mongodb://localhost:27017/smartroom

# O usando MongoDB Compass
# Conectar a: mongodb://localhost:27017
```

---

## Configuración del Broker MQTT

### Opción A: Mosquitto (Local)

**macOS:**
```bash
brew install mosquitto
brew services start mosquitto
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mosquitto mosquitto-clients
sudo systemctl start mosquitto
sudo systemctl enable mosquitto
```

**Windows:**
1. Descargar Mosquitto de [mosquitto.org](https://mosquitto.org/download/)
2. Ejecutar el instalador
3. Iniciar el servicio Mosquitto

### Opción B: Docker

```bash
docker run -d --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto:2
```

### Configurar Autenticación (Opcional pero Recomendado)

Crear `/etc/mosquitto/passwd`:
```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd smartroom
```

Actualizar `/etc/mosquitto/mosquitto.conf`:
```conf
listener 1883
password_file /etc/mosquitto/passwd
allow_anonymous false
```

Reiniciar Mosquitto:
```bash
sudo systemctl restart mosquitto
```

### Probar Conexión MQTT

```bash
# Suscribirse a todos los topics (terminal 1)
mosquitto_sub -h localhost -t "#" -v

# Publicar un mensaje de prueba (terminal 2)
mosquitto_pub -h localhost -t "test/topic" -m "Hola MQTT"
```

---

## Variables de Entorno

### Variables de Entorno del Backend

| Variable | Descripción | Por Defecto | Requerido |
|----------|-------------|-------------|-----------|
| `PORT` | Puerto del servidor API | `3000` | No |
| `NODE_ENV` | Modo de entorno | `development` | No |
| `MONGO_URI` | Cadena de conexión MongoDB | - | Sí |

### Archivo `.env` de Ejemplo

```env
# backend/.env

# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
MONGO_URI=mongodb://localhost:27017/smartroom

# Agregar estos si externalizas la config de MQTT
# MQTT_HOST=mqtt://localhost
# MQTT_USER=smartroom
# MQTT_PASSWORD=tu_contraseña
```

---

## Ejecutar la Aplicación

### Iniciar Todos los Servicios

**Terminal 1 - MongoDB (si no está corriendo como servicio):**
```bash
mongod --dbpath /ruta/a/datos
```

**Terminal 2 - Broker MQTT (si no está corriendo como servicio):**
```bash
mosquitto -v
```

**Terminal 3 - Backend:**
```bash
cd backend
npm run nodemon
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

### Usando Docker Compose (Alternativa)

Crear un `docker-compose.yml` en la raíz del proyecto:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  mosquitto:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
      - "9001:9001"

volumes:
  mongodb_data:
```

Ejecutar:
```bash
docker-compose up -d
```

---

## Ejecutar Pruebas

### Pruebas de Backend

Actualmente, el backend no tiene pruebas automatizadas configuradas. Para ejecutar pruebas una vez agregadas:

```bash
cd backend
npm test
```

### Pruebas de Frontend

Actualmente, el frontend no tiene pruebas automatizadas configuradas. Para ejecutar pruebas una vez agregadas:

```bash
cd frontend
npm test
```

### Pruebas Manuales de API

Usar curl o un cliente API como Postman:

```bash
# Crear una lectura de sensor
curl -X POST http://localhost:3000/api/sensors \
  -H "Content-Type: application/json" \
  -d '{
    "temperature_c": "25.5",
    "humidity_pct": "60.0",
    "light_pct": "45",
    "low_light": false,
    "motion": false,
    "source": "prueba"
  }'

# Obtener todos los sensores
curl http://localhost:3000/api/sensors

# Crear un usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Prueba",
    "email": "prueba@ejemplo.com",
    "rfid_uid": "A1B2C3D4",
    "role": "user"
  }'
```

---

## Compilar para Producción

### Backend

```bash
cd backend

# Compilar TypeScript
npx tsc

# La salida estará en el directorio dist/
node dist/server.js
```

### Frontend

```bash
cd frontend

# Compilar para producción
npm run build

# La salida estará en el directorio dist/
# Servir con cualquier servidor de archivos estáticos
npm run preview  # Previsualizar localmente
```

### Lista de Verificación para Despliegue en Producción

- [ ] Establecer `NODE_ENV=production`
- [ ] Usar MongoDB de producción (Atlas o servidor dedicado)
- [ ] Habilitar autenticación MQTT y TLS
- [ ] Configurar CORS para orígenes específicos
- [ ] Configurar proxy inverso (nginx)
- [ ] Habilitar HTTPS/TLS
- [ ] Configurar logging y monitoreo
- [ ] Configurar respaldos automatizados

---

## Solución de Problemas

### Problemas Comunes

#### Error "Cannot find module"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Conexión a MongoDB Fallida
```bash
# Verificar si MongoDB está corriendo
sudo systemctl status mongod

# Verificar cadena de conexión
mongosh mongodb://localhost:27017
```

#### Error CORS en el Navegador
Asegurar que la configuración CORS del backend permite tu origen del frontend:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  // o origin: '*' para desarrollo
}));
```

#### ESP8266 No Conecta a WiFi
- Verificar WiFi de 2.4GHz (ESP8266 no soporta 5GHz)
- Verificar credenciales en firmware
- Verificar salida del monitor serial para depuración

#### Problemas de Conexión MQTT
- Verificar que el broker está corriendo: `sudo systemctl status mosquitto`
- Verificar que el puerto 1883 es accesible
- Verificar que las credenciales coinciden con la configuración del broker

### Obtener Ayuda

- Revisar la [Documentación Técnica](./TECHNICAL.md)
- Revisar [Arquitectura](./ARCHITECTURE.md) para visión general del sistema
- Abrir un issue en GitHub para bugs
- Ver [Contribución](./CONTRIBUTING.md) para guías de contribución

---

*Última actualización: Diciembre 2024*
