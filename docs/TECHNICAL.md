# Documentación Técnica de SmartRoom

Este documento proporciona documentación técnica completa para el sistema de automatización de habitaciones inteligentes SmartRoom basado en IoT.

## Tabla de Contenidos

- [Visión General del Proyecto](#visión-general-del-proyecto)
- [Metas y Objetivos](#metas-y-objetivos)
- [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
- [Flujo de Datos](#flujo-de-datos)
- [Componentes de Hardware](#componentes-de-hardware)
- [Stack de Software](#stack-de-software)
- [Modelos de Datos](#modelos-de-datos)
- [Contrato de API](#contrato-de-api)
- [Configuración](#configuración)
- [Despliegue](#despliegue)
- [Estrategia de Pruebas](#estrategia-de-pruebas)
- [Consideraciones de Seguridad](#consideraciones-de-seguridad)
- [Solución de Problemas](#solución-de-problemas)

---

## Visión General del Proyecto

SmartRoom es un sistema de automatización de habitaciones inteligentes basado en IoT que monitorea y controla varios aspectos del ambiente de una habitación. El sistema integra sensores de hardware y actuadores con una aplicación web moderna para proporcionar capacidades de monitoreo y control en tiempo real.

### Características Principales

- **Monitoreo Ambiental**: Sensado de temperatura, humedad y nivel de luz
- **Detección de Movimiento**: Detección de movimiento basada en PIR con generación de alertas
- **Control de Acceso**: Acceso a puertas basado en RFID con autenticación de usuarios
- **Control Automatizado**: Control automático de ventanas y luces basado en lecturas de sensores
- **Modo Manual**: Control remoto de dispositivos a través de interfaz web
- **Sistema de Alertas**: Alertas en tiempo real para eventos de seguridad y ambientales
- **Registro de Accesos**: Historial completo de intentos de acceso

---

## Metas y Objetivos

1. **Automatización**: Automatizar el control del ambiente de la habitación (iluminación, ventilación) basado en datos de sensores
2. **Seguridad**: Proporcionar control de acceso seguro basado en RFID con registro completo
3. **Monitoreo**: Monitoreo en tiempo real de condiciones ambientales
4. **Accesibilidad**: Interfaz web amigable para monitoreo y control remoto
5. **Escalabilidad**: Diseño modular que soporta múltiples habitaciones y sensores
6. **Confiabilidad**: Comunicación robusta basada en MQTT para actualizaciones en tiempo real

---

## Arquitectura de Alto Nivel

El sistema SmartRoom consiste en los siguientes componentes principales:

### Resumen de Componentes

| Componente | Tecnología | Descripción |
|------------|------------|-------------|
| **Sensores/Actuadores** | ESP8266 (NodeMCU) | Microcontroladores con sensores y actuadores |
| **API Backend** | Node.js + Express + TypeScript | Servidor API REST que maneja persistencia de datos y lógica de negocio |
| **Base de Datos** | MongoDB | Base de datos documental para almacenar datos de sensores, usuarios y logs |
| **Broker MQTT** | Mosquitto (o similar) | Broker de mensajes para comunicación en tiempo real con dispositivos |
| **Frontend** | React + TypeScript + Vite | Panel de control web e interfaz de control |

### Interacciones de Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Sistema SmartRoom                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐              ┌──────────────────┐                    │
│  │   ESP8266-A      │              │   ESP8266-B      │                    │
│  │   (Acceso)       │              │   (Ambiente)     │                    │
│  │  - Lector RFID   │              │  - Sensor DHT11  │                    │
│  │  - Servo (Puerta)│              │  - Sensor LDR    │                    │
│  │  - Ultrasónico   │              │  - PIR Movim.    │                    │
│  │  - LED Alarma    │              │  - Servo (Vent.) │                    │
│  └────────┬─────────┘              └────────┬─────────┘                    │
│           │                                 │                               │
│           │  HTTP POST / MQTT               │  HTTP POST / MQTT            │
│           │                                 │                               │
│           ▼                                 ▼                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                       Broker MQTT (Mosquitto)                         │  │
│  │                   Mensajería pub/sub basada en topics                 │  │
│  └──────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                   API Backend (Node.js + Express)                     │  │
│  │    Endpoints REST: /api/sensors, /api/devices, /api/users, etc.      │  │
│  └──────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                       Base de Datos MongoDB                           │  │
│  │   Colecciones: sensors, devices, users, access_logs, alerts          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                     ▲                                       │
│                                     │                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                   Frontend (React + Vite + Tailwind)                  │  │
│  │        Dashboard | Controles | Logs de Acceso | Eventos/Alertas      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

### Flujo de Datos de Sensores

1. **Sensores ESP8266** leen datos ambientales (temperatura, humedad, luz, movimiento)
2. **HTTP POST** envía lecturas de sensores al endpoint `/api/sensors` del backend
3. **Backend** valida y almacena datos en la colección `sensors` de MongoDB
4. **Frontend** consulta o obtiene datos de sensores para mostrar en el dashboard

### Flujo de Control de Acceso

1. **Tarjeta RFID** es escaneada en el lector ESP8266-A
2. **ESP8266** verifica UID contra la lista permitida (sincronizada vía MQTT)
3. **Servo de puerta** abre si está autorizado; LED de alarma parpadea si no está autorizado
4. **HTTP POST** registra intento de acceso al endpoint `/api/logs` del backend
5. **Frontend** muestra logs de acceso en tiempo real

### Flujo de Control de Dispositivos

1. **Usuario** hace clic en botón de control en el dashboard del frontend
2. **Frontend** envía petición PATCH al backend `/api/devices/{tipo}`
3. **Backend** publica comando al topic MQTT
4. **ESP8266** se suscribe al topic y ejecuta comando (ej., toggle LED, abrir ventana)
5. **Backend** actualiza estado del dispositivo en MongoDB

### Flujo de Alertas

1. **ESP8266** detecta anomalía (ej., presencia prolongada sin RFID válido)
2. **HTTP POST** envía alerta al endpoint `/api/alerts` del backend
3. **Backend** almacena alerta en la colección `alerts` de MongoDB
4. **Frontend** muestra notificación de alerta al usuario

---

## Componentes de Hardware

### Hardware Recomendado

| Componente | Modelo | Propósito |
|------------|--------|-----------|
| Microcontrolador | ESP8266 NodeMCU v2 | Microcontrolador con WiFi |
| Temperatura/Humedad | DHT11 | Monitoreo ambiental |
| Sensor de Luz | LDR (Fotorresistor) | Detección de nivel de luz |
| Sensor de Movimiento | HC-SR501 PIR | Detección de movimiento |
| Lector RFID | MFRC522 | Lectura de tarjetas de acceso |
| Sensor Ultrasónico | HC-SR04 | Detección de proximidad/presencia |
| Servomotor | SG90 9G | Actuación de puerta/ventana |
| LED | LED estándar 5mm | Indicadores de estado |

### Conexiones ESP8266-A (Control de Acceso)

| Componente | Pin | GPIO |
|------------|-----|------|
| RFID SDA/SS | D2 | GPIO4 |
| RFID RST | D1 | GPIO5 |
| RFID SCK | D5 | GPIO14 |
| RFID MISO | D6 | GPIO12 |
| RFID MOSI | D7 | GPIO13 |
| Servo Puerta | D4 | GPIO2 |
| Ultrasónico TRIG | D0 | GPIO16 |
| Ultrasónico ECHO | D8 | GPIO15 |
| LED Alarma | D3 | GPIO0 |

### Conexiones ESP8266-B (Ambiental)

| Componente | Pin | GPIO |
|------------|-----|------|
| DHT11 DATA | D4 | GPIO2 |
| Servo Ventana | D5 | GPIO14 |
| LDR | A0 | ADC |
| LED Luz | D6 | GPIO12 |
| PIR | D1 | GPIO5 |

### Requisitos de Alimentación

- ESP8266: Lógica 3.3V (alimentación USB 5V)
- Servos: 5V (se recomienda fuente de alimentación separada para múltiples servos)
- Sensores: Compatibles con 3.3V-5V

---

## Stack de Software

### Backend

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| Node.js | 18+ | Entorno de ejecución |
| Express | 5.x | Framework de servidor HTTP |
| TypeScript | 5.x | JavaScript con tipado |
| Mongoose | 8.x | ODM para MongoDB |
| MQTT.js | 5.x | Librería cliente MQTT |
| dotenv | 17.x | Configuración de entorno |
| cors | 2.x | Compartición de recursos entre orígenes |
| nodemon | 3.x | Hot-reload en desarrollo |

### Frontend

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| React | 19.x | Librería de UI |
| Vite | 7.x | Herramienta de build y servidor dev |
| TypeScript | 5.x | JavaScript con tipado |
| Tailwind CSS | 3.x | Framework CSS utility-first |
| React Router | 7.x | Enrutamiento del lado del cliente |
| Recharts | 3.x | Visualización de datos |
| Lucide React | 0.x | Librería de íconos |
| React Hot Toast | 2.x | Notificaciones toast |

### Firmware (PlatformIO)

| Librería | Versión | Propósito |
|----------|---------|-----------|
| PubSubClient | 2.8 | Cliente MQTT para Arduino |
| ArduinoJson | 7.4.2 | Parseo/serialización JSON |
| DHT sensor library | 1.4.6 | Soporte para sensor DHT11/DHT22 |
| MFRC522 | 1.3.6 | Librería de lector RFID |
| Adafruit Unified Sensor | 1.1.15 | Capa de abstracción de sensores |

---

## Modelos de Datos

### Lectura de Sensor

```json
{
  "_id": "ObjectId",
  "temperature_c": "25.5",
  "humidity_pct": "60.0",
  "light_pct": "45",
  "low_light": false,
  "motion": false,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "source": "esp8266-B"
}
```

### Estado de Dispositivo

```json
{
  "_id": "ObjectId",
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
```

### Usuario

```json
{
  "_id": "ObjectId",
  "name": "Juan Pérez",
  "email": "juan.perez@ejemplo.com",
  "rfid_uid": "A3299BF4",
  "role": "user",
  "active": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

### Log de Acceso

```json
{
  "_id": "ObjectId",
  "uid": "A3299BF4",
  "authorized": true,
  "door_action": "open",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "user_id": "ObjectId",
  "source": "esp32-A"
}
```

### Alerta

```json
{
  "_id": "ObjectId",
  "type": "unauthorized_presence",
  "description": "Presencia >30s sin RFID válido",
  "duration_ms": 30000,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "resolved": false,
  "source": "esp32-A"
}
```

---

## Contrato de API

URL Base: `http://localhost:3000/api`

### Sensores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/sensors` | Obtener todas las lecturas de sensores |
| GET | `/sensors/:id` | Obtener lectura de sensor por ID |
| POST | `/sensors` | Crear nueva lectura de sensor |
| PUT | `/sensors/:id` | Actualizar lectura de sensor |
| DELETE | `/sensors/:id` | Eliminar lectura de sensor |

### Dispositivos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/devices` | Obtener estado de todos los dispositivos |
| PATCH | `/devices/available` | Alternar modo de control manual |
| PATCH | `/devices/door` | Actualizar estado de puerta |
| PATCH | `/devices/window` | Actualizar estado de ventana |
| PATCH | `/devices/lights` | Actualizar estado de luces |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users` | Obtener todos los usuarios |
| GET | `/users/allowed` | Obtener todos los UIDs RFID permitidos |
| GET | `/users/:id` | Obtener usuario por ID |
| POST | `/users` | Crear nuevo usuario |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |

### Logs de Acceso

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/logs` | Obtener todos los logs de acceso |
| GET | `/logs/:id` | Obtener log de acceso por ID |
| POST | `/logs` | Crear nuevo log de acceso |
| PUT | `/logs/:id` | Actualizar log de acceso |
| DELETE | `/logs/:id` | Eliminar log de acceso |

### Alertas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/alerts` | Obtener todas las alertas |
| GET | `/alerts/:id` | Obtener alerta por ID |
| POST | `/alerts` | Crear nueva alerta |
| PUT | `/alerts/:id` | Actualizar alerta |
| DELETE | `/alerts/:id` | Eliminar alerta |

Para referencia detallada de la API con ejemplos de petición/respuesta, ver [API.md](./API.md).

---

## Configuración

### Variables de Entorno

Crear un archivo `.env` en el directorio `backend/`:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Conexión MongoDB
MONGO_URI=mongodb://localhost:27017/smartroom

# Configuración MQTT (configurar en mqtt_client.ts)
# MQTT_HOST=mqtt://192.168.1.35
# MQTT_USER=tu_usuario
# MQTT_PASSWORD=tu_contraseña
```

### Topics MQTT

| Topic | Dirección | Descripción |
|-------|-----------|-------------|
| `rfid/allowed/update` | Backend → ESP | Lista de UIDs RFID permitidos |
| `room/control/lights` | Backend → ESP | Comandos de control de luz |
| `room/control/window` | Backend → ESP | Comandos de control de ventana |
| `room/control/door` | Backend → ESP | Comandos de control de puerta |
| `room/control/manual` | Backend → ESP | Toggle de modo manual |

---

## Despliegue

### Desarrollo Local

Ver [SETUP.md](./SETUP.md) para instrucciones detalladas de configuración de desarrollo local.

### Despliegue en Producción

#### Backend (Node.js)

1. **Compilar la aplicación**:
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. **Usando servicio systemd**:
   ```ini
   # /etc/systemd/system/smartroom-backend.service
   [Unit]
   Description=SmartRoom Backend API
   After=network.target mongodb.service

   [Service]
   Type=simple
   User=smartroom
   WorkingDirectory=/opt/smartroom/backend
   ExecStart=/usr/bin/node dist/server.js
   Restart=on-failure
   Environment=NODE_ENV=production
   Environment=PORT=3000
   Environment=MONGO_URI=mongodb://localhost:27017/smartroom

   [Install]
   WantedBy=multi-user.target
   ```

3. **Usando Docker**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY dist/ ./dist/
   EXPOSE 3000
   CMD ["node", "dist/server.js"]
   ```

#### Frontend (Build Estático)

1. **Compilar la aplicación**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Servir con nginx**:
   ```nginx
   server {
       listen 80;
       server_name smartroom.ejemplo.com;

       root /var/www/smartroom/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Broker MQTT (Mosquitto)

```yaml
# docker-compose.yml
services:
  mosquitto:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
```

#### Despliegue de Firmware

1. Abrir PlatformIO IDE o VS Code con extensión PlatformIO
2. Conectar ESP8266 vía USB
3. Actualizar credenciales WiFi y URL del backend en el código fuente
4. Compilar y cargar:
   ```bash
   cd SmartRoom_IO  # o SmartRoom_IO_2
   pio run --target upload
   ```

---

## Estrategia de Pruebas

### Pruebas de Backend

Actualmente, el backend no tiene pruebas automatizadas configuradas. Para agregar pruebas:

1. **Instalar dependencias de prueba**:
   ```bash
   npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
   ```

2. **Agregar script de prueba a package.json**:
   ```json
   {
     "scripts": {
       "test": "jest"
     }
   }
   ```

3. **Ejemplo de prueba unitaria**:
   ```typescript
   // src/__tests__/sensors.test.ts
   import request from 'supertest';
   import app from '../app';

   describe('API de Sensores', () => {
     it('GET /api/sensors debería retornar datos de sensores', async () => {
       const res = await request(app).get('/api/sensors');
       expect(res.statusCode).toBe(200);
     });
   });
   ```

### Pruebas de Frontend

1. **Instalar dependencias de prueba**:
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
   ```

2. **Ejecutar pruebas**:
   ```bash
   npm run test
   ```

### Pruebas de Integración

1. Usar herramientas como Postman o curl para probar endpoints de la API
2. Monitorear mensajes MQTT con MQTT Explorer
3. Verificar flujo de datos de sensores desde ESP8266 a la base de datos

### Pruebas de Hardware

1. Usar Monitor Serial (115200 baud) para depurar ESP8266
2. Probar lector RFID con tarjetas conocidas
3. Verificar rango de movimiento del servo
4. Probar lecturas de sensores con multímetro

---

## Consideraciones de Seguridad

### Seguridad de Red

- **Segmentación de Red**: Mantener dispositivos IoT en una VLAN separada
- **Reglas de Firewall**: Restringir conexiones entrantes solo a puertos necesarios
- **TLS/SSL**: Usar HTTPS para frontend y API en producción
- **Seguridad MQTT**: Habilitar autenticación y TLS para broker MQTT

### Autenticación y Autorización

- Actualmente, la API no implementa autenticación
- Para producción, considerar agregar:
  - Autenticación basada en JWT para endpoints de API
  - Control de acceso basado en roles (roles admin, user, guest existen en el modelo)
  - Limitación de tasa de API

### Gestión de Secretos

- **Nunca commitear credenciales** al control de versiones
- Usar variables de entorno para configuración sensible
- Para producción, usar un gestor de secretos (HashiCorp Vault, AWS Secrets Manager)
- Rotar credenciales de MQTT y base de datos regularmente

### Seguridad de Firmware

- Actualizar credenciales WiFi antes del despliegue
- Considerar usar secure boot en ESP8266/ESP32
- Validar y sanitizar entrada de UID RFID
- Implementar watchdog timer para confiabilidad

### Seguridad de Base de Datos

- Usar autenticación de MongoDB en producción
- Habilitar cifrado de red para conexiones MongoDB
- Respaldos regulares de base de datos
- Limitar permisos de usuario de base de datos

---

## Solución de Problemas

### Problemas Comunes

#### ESP8266 No Conecta a WiFi

1. Verificar credenciales WiFi en firmware
2. Verificar intensidad de señal WiFi
3. Asegurar que el router soporte 2.4GHz (ESP8266 no soporta 5GHz)
4. Intentar resetear el ESP8266

#### Conexión MQTT Fallida

1. Verificar que el broker MQTT esté corriendo
2. Verificar dirección IP y puerto del broker
3. Verificar credenciales MQTT
4. Verificar reglas de firewall para puerto 1883

#### Backend No Inicia

1. Verificar si MongoDB está corriendo
2. Verificar variable de entorno `MONGO_URI`
3. Verificar conflictos de puerto (por defecto: 3000)
4. Revisar logs de consola para errores

#### Lecturas de Sensores No Aparecen

1. Verificar salida del monitor serial de ESP8266
2. Verificar que la URL de HTTP POST sea correcta
3. Asegurar que CORS del backend esté configurado
4. Verificar conexión a MongoDB

#### RFID No Lee Tarjetas

1. Verificar conexionado SPI (SCK, MISO, MOSI, SS)
2. Verificar alimentación del módulo RFID
3. Probar con tarjetas conocidas que funcionen
4. Verificar salida serial para registro de versión

#### Servo No Se Mueve

1. Verificar alimentación del servo (5V separada del ESP)
2. Verificar conexión del cable de señal
3. Probar servo con diferentes valores de PWM
4. Asegurar que el servo no esté bloqueado mecánicamente

### Comandos de Depuración

```bash
# Verificar estado de MongoDB
mongosh --eval "db.serverStatus()"

# Verificar logs del backend
journalctl -u smartroom-backend -f

# Probar conexión MQTT
mosquitto_sub -h localhost -t "#" -v

# Probar endpoint de API
curl http://localhost:3000/api/sensors
```

### Ubicaciones de Logs

| Componente | Ubicación del Log |
|------------|-------------------|
| Backend | Consola (stdout) / journalctl |
| MongoDB | `/var/log/mongodb/` |
| MQTT | `/var/log/mosquitto/` |
| ESP8266 | Monitor Serial (115200 baud) |

---

## Recursos Adicionales

- [Guía de Configuración](./SETUP.md) - Configuración del entorno de desarrollo
- [Referencia de API](./API.md) - Documentación detallada de la API
- [Arquitectura](./ARCHITECTURE.md) - Diagramas de arquitectura del sistema
- [Contribución](./CONTRIBUTING.md) - Guías de contribución
- [Changelog](./CHANGELOG.md) - Historial de versiones

---

*Última actualización: Diciembre 2024*
