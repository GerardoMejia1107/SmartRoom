# SmartRoom

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SmartRoom es un sistema de automatización de habitaciones inteligentes basado en IoT que proporciona monitoreo ambiental en tiempo real, control de acceso y gestión automatizada de dispositivos. El sistema integra microcontroladores ESP8266 con una aplicación web moderna para una automatización completa de habitaciones.

## 🚀 Características

- **Monitoreo Ambiental**: Sensado en tiempo real de temperatura, humedad y nivel de luz
- **Detección de Movimiento**: Detección de movimiento basada en PIR con alertas configurables
- **Control de Acceso**: Acceso a puertas basado en RFID con autenticación de usuarios
- **Control Automatizado**: Control automático de ventanas y luces basado en umbrales de sensores
- **Modo Manual**: Control remoto de dispositivos a través del panel web
- **Sistema de Alertas**: Alertas en tiempo real para eventos de seguridad y ambientales
- **Registro de Accesos**: Historial completo de intentos de acceso

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐
│   ESP8266-A     │     │   ESP8266-B     │
│ (Control Acceso)│     │   (Ambiental)   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │  HTTP/MQTT            │  HTTP/MQTT
         │                       │
         ▼                       ▼
    ┌─────────────────────────────────┐
    │         Broker MQTT             │
    └─────────────────┬───────────────┘
                      │
    ┌─────────────────▼───────────────┐
    │   Backend API (Node.js/Express) │
    └─────────────────┬───────────────┘
                      │
    ┌─────────────────▼───────────────┐
    │           MongoDB               │
    └─────────────────────────────────┘
                      ▲
    ┌─────────────────┴───────────────┐
    │   Frontend (React + Vite)       │
    └─────────────────────────────────┘
```

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [Documentación Técnica](docs/TECHNICAL.md) | Especificaciones técnicas detalladas y visión general del sistema |
| [Arquitectura](docs/ARCHITECTURE.md) | Arquitectura del sistema con diagramas |
| [Guía de Configuración](docs/SETUP.md) | Instrucciones de configuración del entorno de desarrollo |
| [Referencia de API](docs/API.md) | Documentación de la API REST con ejemplos |
| [Contribución](docs/CONTRIBUTING.md) | Guías para contribuir al proyecto |
| [Changelog](docs/CHANGELOG.md) | Historial de versiones y notas de lanzamiento |

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Lenguaje**: TypeScript
- **Base de Datos**: MongoDB con Mongoose ODM
- **Mensajería**: MQTT (PubSubClient)

### Frontend
- **Librería**: React 19
- **Herramienta de Build**: Vite 7
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Íconos**: Lucide React
- **Notificaciones**: React Hot Toast

### Firmware
- **Plataforma**: ESP8266 (NodeMCU v2)
- **Framework**: Arduino (PlatformIO)
- **Sensores**: DHT11, LDR, PIR, HC-SR04, MFRC522

## 📁 Estructura del Proyecto

```
SmartRoom/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Manejadores de peticiones
│   │   ├── models/          # Esquemas de Mongoose
│   │   ├── routes/          # Rutas de la API
│   │   ├── services/        # Lógica de negocio
│   │   └── mqtt/            # Cliente MQTT
│   └── package.json
├── frontend/                # Aplicación React + Vite
│   ├── src/
│   │   ├── api/             # Funciones cliente de API
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Componentes de página
│   │   └── types/           # Tipos TypeScript
│   └── package.json
├── SmartRoom_IO/            # Firmware ESP8266 (Control de Acceso)
│   ├── src/
│   └── platformio.ini
├── SmartRoom_IO_2/          # Firmware ESP8266 (Ambiental)
│   ├── src/
│   └── platformio.ini
└── docs/                    # Documentación
```

## ⚡ Inicio Rápido

### Prerrequisitos

- Node.js 18+
- MongoDB 6+
- npm o yarn

### Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Crear archivo de entorno
echo "PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smartroom" > .env

# Iniciar servidor de desarrollo
npm run nodemon
```

### Frontend

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir el navegador en `http://localhost:5173`

### Firmware

1. Instalar [PlatformIO](https://platformio.org/)
2. Abrir `SmartRoom_IO` o `SmartRoom_IO_2` en tu IDE
3. Actualizar credenciales WiFi en `src/main.cpp`
4. Compilar y cargar al ESP8266

Para instrucciones detalladas de configuración, ver [SETUP.md](docs/SETUP.md).

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Por Defecto |
|----------|-------------|-------------|
| `PORT` | Puerto del servidor API | `3000` |
| `NODE_ENV` | Modo de entorno | `development` |
| `MONGO_URI` | Cadena de conexión MongoDB | Requerido |

## 📊 Desglose de Lenguajes

- **TypeScript**: API Backend, Aplicación Frontend
- **C++**: Firmware ESP8266 (Arduino/PlatformIO)
- **HTML/CSS**: Interfaz Frontend con Tailwind CSS


## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**Gerardo Mejía**

- GitHub: [@GerardoMejia1107](https://github.com/GerardoMejia1107)

---

⭐ ¡Dale una estrella a este repositorio si te resulta útil!
