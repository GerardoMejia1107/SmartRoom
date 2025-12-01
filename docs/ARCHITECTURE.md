# Arquitectura de SmartRoom

Este documento describe la arquitectura del sistema SmartRoom de automatización de habitaciones inteligentes basado en IoT.

## Visión General del Sistema

SmartRoom es una solución IoT full-stack que combina sistemas embebidos, servicios backend y un frontend web moderno para crear un sistema inteligente de automatización de habitaciones.

## Diagrama de Arquitectura

```mermaid
flowchart TB
    subgraph Hardware["Capa de Hardware"]
        ESP_A["ESP8266-A<br/>(Control de Acceso)"]
        ESP_B["ESP8266-B<br/>(Ambiental)"]
        
        subgraph Sensors_A["Sensores/Actuadores A"]
            RFID["Lector RFID<br/>MFRC522"]
            US["Ultrasónico<br/>HC-SR04"]
            SERVO_D["Servomotor<br/>(Puerta)"]
            LED_A["LED Alarma"]
        end
        
        subgraph Sensors_B["Sensores/Actuadores B"]
            DHT["DHT11<br/>Temp/Humedad"]
            LDR["LDR<br/>Sensor de Luz"]
            PIR["PIR<br/>Movimiento"]
            SERVO_W["Servomotor<br/>(Ventana)"]
            LED_L["LED Luz"]
        end
        
        ESP_A --- Sensors_A
        ESP_B --- Sensors_B
    end
    
    subgraph Communication["Capa de Comunicación"]
        MQTT["Broker MQTT<br/>(Mosquitto)"]
        HTTP["HTTP/REST"]
    end
    
    subgraph Backend["Capa Backend"]
        API["API Express.js<br/>(Node.js + TypeScript)"]
        MQTT_C["Cliente MQTT"]
        
        subgraph Controllers["Controladores"]
            SC["Sensores"]
            DC["Dispositivos"]
            UC["Usuarios"]
            LC["Logs de Acceso"]
            AC["Alertas"]
        end
    end
    
    subgraph Database["Capa de Datos"]
        MongoDB[("MongoDB")]
        
        subgraph Collections["Colecciones"]
            sensors["sensors"]
            devices["devices"]
            users["users"]
            logs["access_logs"]
            alerts["alerts"]
        end
    end
    
    subgraph Frontend["Capa Frontend"]
        React["App React<br/>(Vite + TypeScript)"]
        
        subgraph Pages["Páginas"]
            Dashboard["Dashboard"]
            Controls["Controles"]
            Access["Logs de Acceso"]
            Events["Eventos/Alertas"]
        end
    end
    
    ESP_A <-->|MQTT| MQTT
    ESP_B <-->|MQTT| MQTT
    ESP_A -->|HTTP POST| API
    ESP_B -->|HTTP POST| API
    
    MQTT <--> MQTT_C
    MQTT_C --- API
    
    API --> Controllers
    Controllers <--> MongoDB
    MongoDB --- Collections
    
    React -->|HTTP REST| API
    React --- Pages
```

## Diagrama de Arquitectura ASCII

Para entornos que no renderizan diagramas Mermaid:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA SMARTROOM                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CAPA DE HARDWARE                                    │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐            │
│  │      ESP8266-A (Acceso)      │    │   ESP8266-B (Ambiental)      │            │
│  │  ┌─────────────────────────┐ │    │  ┌─────────────────────────┐ │            │
│  │  │ • Lector RFID (MFRC522) │ │    │  │ • DHT11 (Temp/Humedad)  │ │            │
│  │  │ • Ultrasónico (HC-SR04) │ │    │  │ • LDR (Sensor de Luz)   │ │            │
│  │  │ • Servomotor (Puerta)   │ │    │  │ • PIR (Sensor Movim.)   │ │            │
│  │  │ • LED Alarma            │ │    │  │ • Servomotor (Ventana)  │ │            │
│  │  └─────────────────────────┘ │    │  │ • LED Luz               │ │            │
│  └──────────────┬──────────────┘    └──────────────┬──────────────┘            │
└─────────────────┼──────────────────────────────────┼────────────────────────────┘
                  │                                  │
                  │  WiFi (HTTP POST / MQTT)         │  WiFi (HTTP POST / MQTT)
                  │                                  │
┌─────────────────┼──────────────────────────────────┼────────────────────────────┐
│                 ▼                                  ▼     CAPA DE COMUNICACIÓN    │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                       BROKER MQTT (Mosquitto)                             │  │
│  │           Topics: rfid/allowed/update, room/control/*                     │  │
│  └────────────────────────────────────┬─────────────────────────────────────┘  │
└───────────────────────────────────────┼─────────────────────────────────────────┘
                                        │
                                        │ MQTT Subscribe/Publish
                                        │
┌───────────────────────────────────────┼─────────────────────────────────────────┐
│                                       ▼                    CAPA BACKEND         │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                    API EXPRESS.JS (Node.js + TypeScript)                  │  │
│  │                                                                           │  │
│  │   ┌────────────────────────────────────────────────────────────────────┐ │  │
│  │   │                           RUTAS                                    │ │  │
│  │   │  /api/sensors  /api/devices  /api/users  /api/logs  /api/alerts   │ │  │
│  │   └────────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                           │  │
│  │   ┌────────────────────────────────────────────────────────────────────┐ │  │
│  │   │                       CONTROLADORES                                 │ │  │
│  │   │  SensorController | DeviceController | UserController | ...        │ │  │
│  │   └────────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                           │  │
│  │   ┌────────────────────────────────────────────────────────────────────┐ │  │
│  │   │                         SERVICIOS                                   │ │  │
│  │   │  UserService | Cliente MQTT                                        │ │  │
│  │   └────────────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────┬───────────────────────────────────┘  │
└─────────────────────────────────────────┼───────────────────────────────────────┘
                                          │
                                          │ Mongoose ODM
                                          │
┌─────────────────────────────────────────┼───────────────────────────────────────┐
│                                         ▼                   CAPA DE DATOS       │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                              MONGODB                                      │  │
│  │                                                                           │  │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │   │ sensors  │ │ devices  │ │  users   │ │access_   │ │  alerts  │      │  │
│  │   │          │ │          │ │          │ │  logs    │ │          │      │  │
│  │   └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          ▲
                                          │ API HTTP REST
                                          │
┌─────────────────────────────────────────┼───────────────────────────────────────┐
│                                         │                  CAPA FRONTEND        │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                   APLICACIÓN REACT (Vite + TypeScript)                    │  │
│  │                                                                           │  │
│  │   ┌──────────────────────────────────────────────────────────────────┐   │  │
│  │   │                           PÁGINAS                                 │   │  │
│  │   │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │  │
│  │   │   │Dashboard │ │Controles │ │  Acceso  │ │ Eventos  │           │   │  │
│  │   │   └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   │  │
│  │   └──────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                           │  │
│  │   ┌──────────────────────────────────────────────────────────────────┐   │  │
│  │   │                       STACK TECNOLÓGICO                           │   │  │
│  │   │   React 19 | React Router | Tailwind CSS | Recharts | Lucide    │   │  │
│  │   └──────────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Descripción de Componentes

### Capa de Hardware

#### ESP8266-A (Nodo de Control de Acceso)

**Propósito**: Gestiona el acceso físico a la habitación mediante autenticación basada en RFID.

**Componentes**:
- **Lector RFID MFRC522**: Lee UIDs de tarjetas RFID para autenticación
- **Sensor Ultrasónico HC-SR04**: Detecta presencia cerca de la puerta
- **Servomotor SG90**: Controla el mecanismo de cerradura de la puerta
- **LED Alarma**: Indicador visual para intentos de acceso no autorizados

**Responsabilidades**:
- Leer y validar tarjetas RFID
- Controlar servo de puerta basado en autenticación
- Detectar presencia prolongada sin RFID válido
- Generar alertas de seguridad
- Registrar intentos de acceso en el backend

#### ESP8266-B (Nodo de Control Ambiental)

**Propósito**: Monitorea condiciones ambientales y controla sistemas de confort de la habitación.

**Componentes**:
- **DHT11**: Sensor de temperatura y humedad
- **LDR (Fotorresistor)**: Sensor de nivel de luz
- **HC-SR501 PIR**: Sensor de detección de movimiento
- **Servomotor SG90**: Controla mecanismo de ventana
- **LED**: Control de iluminación de la habitación

**Responsabilidades**:
- Monitorear temperatura, humedad y niveles de luz
- Detectar movimiento en la habitación
- Control automático de ventana basado en temperatura
- Control automático de luz basado en luz ambiental
- Soportar modo manual vía comandos MQTT
- Enviar lecturas de sensores al backend

### Capa de Comunicación

#### Broker MQTT (Mosquitto)

**Propósito**: Habilita comunicación bidireccional en tiempo real entre backend y dispositivos ESP8266.

**Topics**:
| Topic | Publicador | Suscriptor | Payload |
|-------|------------|------------|---------|
| `rfid/allowed/update` | Backend | ESP8266-A | Array JSON de UIDs permitidos |
| `room/control/lights` | Backend | ESP8266-B | `"on"` / `"off"` |
| `room/control/window` | Backend | ESP8266-B | `"open"` / `"closed"` |
| `room/control/door` | Backend | ESP8266-A | `"open"` / `"closed"` / `"locked"` |
| `room/control/manual` | Backend | ESP8266-B | `true` / `false` |

#### HTTP/REST

**Propósito**: Método de comunicación principal para datos de sensores y peticiones a la API.

**Endpoints**: Dispositivos ESP8266 envían POST de datos de sensores y logs a la API REST del backend.

### Capa Backend

#### Servidor API Express.js

**Propósito**: Hub central para procesamiento de datos, almacenamiento y coordinación de dispositivos.

**Estructura**:
```
backend/src/
├── app.ts              # Configuración de la app Express
├── server.ts           # Punto de entrada del servidor
├── config/
│   ├── config.ts       # Configuración de entorno
│   └── response.ts     # Utilidades de respuesta
├── controllers/
│   ├── sensors_controller.ts
│   ├── devices_controller.ts
│   ├── user_controller.ts
│   ├── acess_logs_controller.ts
│   └── alerts_controller.ts
├── models/
│   ├── sensors_model.ts
│   ├── device_model.ts
│   ├── user_model.ts
│   ├── access_logs_model.ts
│   └── alerts_model.ts
├── routes/
│   ├── index.ts
│   ├── sensors_routes.ts
│   ├── devices_routes.ts
│   ├── user_routes.ts
│   ├── access_logs_routes.ts
│   └── alert_routes.ts
├── services/
│   └── user_service.ts
└── mqtt/
    └── mqtt_client.ts
```

**Responsabilidades**:
- Exponer API REST para operaciones CRUD
- Validar y procesar datos entrantes
- Almacenar datos en MongoDB
- Publicar mensajes MQTT para control de dispositivos
- Sincronizar UIDs RFID permitidos a dispositivos

### Capa de Datos

#### MongoDB

**Propósito**: Almacenamiento persistente para todos los datos de la aplicación.

**Colecciones**:

| Colección | Descripción |
|-----------|-------------|
| `sensors` | Lecturas de sensores en series de tiempo |
| `devices` | Estado actual de dispositivos controlables |
| `users` | Cuentas de usuario con asociaciones RFID |
| `access_logs` | Registro histórico de intentos de acceso |
| `alerts` | Alertas de seguridad y ambientales |

**Relaciones**:
- `access_logs.user_id` → `users._id` (referencia opcional)
- Todas las colecciones tienen campo `source` para identificación de dispositivo

### Capa Frontend

#### Aplicación React

**Propósito**: Interfaz de usuario para monitoreo y control.

**Estructura**:
```
frontend/src/
├── App.tsx             # Componente raíz
├── main.tsx            # Punto de entrada
├── api/
│   ├── sensorsApi.ts
│   ├── controlsApi.ts
│   ├── usersApi.ts
│   ├── logsApi.ts
│   └── alertsApi.ts
├── components/
│   ├── Clock.tsx           # Componente de reloj
│   ├── ControlPanel.tsx    # Panel de control de dispositivos
│   ├── ControlSwitch.tsx   # Componente switch genérico
│   ├── DoorSwitch.tsx      # Switch de control de puerta
│   ├── LightSwitch.tsx     # Switch de control de luz
│   ├── ManualSwitch.tsx    # Toggle modo Manual/Auto
│   └── WindowSwitch.tsx    # Switch de control de ventana
├── hooks/
│   └── useFetch.ts         # Hook de obtención de datos
├── layouts/
│   └── Layout.tsx          # Wrapper de layout principal
├── pages/
│   ├── Dashboard.tsx   # Vista general de sensores
│   ├── Controls.tsx    # Controles de dispositivos
│   ├── Access.tsx      # Logs de acceso
│   └── Events.tsx      # Alertas y eventos
└── types/
    ├── Sensors.ts
    ├── User.ts
    ├── Logs.ts
    └── Alerts.ts
```

**Páginas**:
- **Dashboard**: Visualización de datos de sensores en tiempo real con gráficos
- **Controles**: Interfaz de control manual de dispositivos
- **Acceso**: Visor de logs de acceso con detalles de usuario
- **Eventos**: Gestión e historial de alertas

## Diagramas de Flujo de Datos

### Flujo de Datos de Sensores

```mermaid
sequenceDiagram
    participant ESP as ESP8266-B
    participant API as API Backend
    participant DB as MongoDB
    participant FE as Frontend

    loop Cada 30 segundos
        ESP->>ESP: Leer sensores (DHT11, LDR, PIR)
        ESP->>API: POST /api/sensors
        API->>DB: Insertar documento sensor
        API-->>ESP: 201 Creado
    end

    FE->>API: GET /api/sensors
    API->>DB: Consultar sensores
    DB-->>API: Documentos de sensores
    API-->>FE: Respuesta JSON
    FE->>FE: Actualizar dashboard
```

### Flujo de Control de Acceso

```mermaid
sequenceDiagram
    participant Card as Tarjeta RFID
    participant ESP as ESP8266-A
    participant MQTT as Broker MQTT
    participant API as API Backend
    participant DB as MongoDB

    Card->>ESP: Escanear tarjeta
    ESP->>ESP: Leer UID
    ESP->>ESP: Verificar lista permitidos
    
    alt UID está permitido
        ESP->>ESP: Abrir servo de puerta
        ESP->>API: POST /api/logs (authorized: true)
        API->>DB: Insertar log de acceso
    else UID no permitido
        ESP->>ESP: Parpadear LED alarma
        ESP->>API: POST /api/logs (authorized: false)
        API->>DB: Insertar log de acceso
    end
```

### Flujo de Control de Dispositivos

```mermaid
sequenceDiagram
    participant User as Usuario
    participant FE as Frontend
    participant API as API Backend
    participant MQTT as Broker MQTT
    participant ESP as ESP8266-B
    participant DB as MongoDB

    User->>FE: Clic "Encender luces"
    FE->>API: PATCH /api/devices/lights
    API->>DB: Actualizar estado dispositivo
    API->>MQTT: Publicar room/control/lights "on"
    MQTT->>ESP: Entregar mensaje
    ESP->>ESP: digitalWrite(LED_LUZ, HIGH)
    API-->>FE: 200 OK
    FE->>FE: Actualizar UI
```

## Consideraciones de Escalabilidad

### Limitaciones de la Arquitectura Actual

1. **Instancia única de MongoDB**: Sin replicación ni sharding
2. **Instancia única de backend**: Sin balanceo de carga
3. **Frontend basado en polling**: Sin actualizaciones en tiempo real vía WebSocket
4. **Configuración de dispositivos hardcodeada**: Limitado a nodos ESP8266 predefinidos

### Opciones de Escalabilidad Futura

1. **Base de datos**: Replica set de MongoDB para alta disponibilidad
2. **Backend**: Múltiples instancias de API detrás de balanceador de carga
3. **Tiempo real**: Agregar WebSocket o Server-Sent Events para actualizaciones en vivo
4. **Gestión de dispositivos**: Registro y descubrimiento dinámico de dispositivos
5. **Microservicios**: Dividir en servicios de sensores, acceso y control

---

## Documentación Relacionada

- [Documentación Técnica](./TECHNICAL.md) - Información técnica detallada
- [Guía de Configuración](./SETUP.md) - Configuración del entorno de desarrollo
- [Referencia de API](./API.md) - Documentación de API REST
- [Contribución](./CONTRIBUTING.md) - Cómo contribuir

---

*Última actualización: Diciembre 2024*
