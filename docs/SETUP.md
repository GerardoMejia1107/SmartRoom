# SmartRoom Setup Guide

This guide provides step-by-step instructions for setting up the SmartRoom development environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Firmware Setup](#firmware-setup)
- [Database Setup](#database-setup)
- [MQTT Broker Setup](#mqtt-broker-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x or higher | Backend and frontend runtime |
| npm | 9.x or higher | Package management |
| MongoDB | 6.x or higher | Database |
| Git | 2.x or higher | Version control |
| PlatformIO | Latest | Firmware development |

### Optional Software

| Software | Purpose |
|----------|---------|
| Docker | Containerized deployment |
| VS Code | Recommended IDE |
| MongoDB Compass | Database GUI |
| MQTT Explorer | MQTT debugging |

### Hardware (for full IoT functionality)

- 2x ESP8266 NodeMCU v2 boards
- DHT11 temperature/humidity sensor
- MFRC522 RFID reader module
- HC-SR04 ultrasonic sensor
- HC-SR501 PIR motion sensor
- 2x SG90 servo motors
- LDR (photoresistor) with 10kΩ resistor
- LEDs with appropriate resistors
- Breadboard and jumper wires
- 5V power supply (for servos)

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/GerardoMejia1107/SmartRoom.git
cd SmartRoom

# Install backend dependencies
cd backend
npm install

# Create environment file
cp .env.example .env  # Edit with your MongoDB URI

# Start backend (requires MongoDB running)
npm run nodemon

# In a new terminal, install and start frontend
cd ../frontend
npm install
npm run dev
```

Open your browser to `http://localhost:5173` to view the application.

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs the following key packages:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `mqtt` - MQTT client
- `dotenv` - Environment configuration
- `cors` - Cross-origin resource sharing
- `typescript` - TypeScript compiler

### 3. Configure Environment

Create a `.env` file in the `backend/` directory:

```bash
touch .env
```

Add the following configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/smartroom
```

### 4. Verify TypeScript Configuration

The `tsconfig.json` should already be configured. Key settings:

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

### 5. Start Development Server

```bash
npm run nodemon
```

The backend will start on `http://localhost:3000`.

### 6. Verify Backend is Running

```bash
curl http://localhost:3000/
# Expected output: Hello, World!

curl http://localhost:3000/api/sensors
# Expected output: [] (empty array if no data)
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This installs the following key packages:
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `recharts` - Data visualization
- `lucide-react` - Icons
- `tailwindcss` - CSS framework
- `vite` - Build tool

### 3. Configure API Endpoint (if needed)

If your backend is not running on `localhost:3000`, update the API base URL in the API files located in `frontend/src/api/`.

### 4. Start Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

### 5. Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## Firmware Setup

### 1. Install PlatformIO

**Option A: VS Code Extension (Recommended)**

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the [PlatformIO IDE extension](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide)

**Option B: CLI Installation**

```bash
pip install platformio
```

### 2. Open Firmware Project

There are two firmware projects:

- `SmartRoom_IO/` - Access control node (RFID, door)
- `SmartRoom_IO_2/` - Environmental control node (DHT11, LDR, PIR)

Open the desired project folder in VS Code with PlatformIO.

### 3. Configure WiFi and Backend

Edit `src/main.cpp` in each project:

```cpp
// Update these values
const char *WIFI_SSID = "YOUR_WIFI_SSID";
const char *WIFI_PASS = "YOUR_WIFI_PASSWORD";
const char *BACKEND_URL = "http://YOUR_BACKEND_IP:3000/api/sensors";
```

Edit `lib/mqtt_config.cpp`:

```cpp
// Update MQTT broker settings
const char* MQTT_HOST = "mqtt://YOUR_MQTT_BROKER_IP";
const char* MQTT_USER = "your_mqtt_username";
const char* MQTT_PASSWORD = "your_mqtt_password";
```

### 4. Install Libraries

PlatformIO will automatically install libraries defined in `platformio.ini`:

**SmartRoom_IO (Access Control):**
- MFRC522
- PubSubClient
- ArduinoJson

**SmartRoom_IO_2 (Environmental):**
- DHT sensor library
- Adafruit Unified Sensor
- PubSubClient
- ArduinoJson

### 5. Build and Upload

```bash
# Using PlatformIO CLI
cd SmartRoom_IO  # or SmartRoom_IO_2
pio run --target upload

# Or use the PlatformIO IDE upload button in VS Code
```

### 6. Monitor Serial Output

```bash
pio device monitor --baud 115200

# Or use VS Code's built-in Serial Monitor
```

---

## Database Setup

### Option A: Local MongoDB Installation

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
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Start MongoDB service

### Option B: Docker

```bash
docker run -d --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7
```

### Option C: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URI` in your `.env` file

### Verify MongoDB Connection

```bash
# Using mongosh
mongosh mongodb://localhost:27017/smartroom

# Or using MongoDB Compass
# Connect to: mongodb://localhost:27017
```

---

## MQTT Broker Setup

### Option A: Mosquitto (Local)

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
1. Download Mosquitto from [mosquitto.org](https://mosquitto.org/download/)
2. Run the installer
3. Start the Mosquitto service

### Option B: Docker

```bash
docker run -d --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto:2
```

### Configure Authentication (Optional but Recommended)

Create `/etc/mosquitto/passwd`:
```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd smartroom
```

Update `/etc/mosquitto/mosquitto.conf`:
```conf
listener 1883
password_file /etc/mosquitto/passwd
allow_anonymous false
```

Restart Mosquitto:
```bash
sudo systemctl restart mosquitto
```

### Test MQTT Connection

```bash
# Subscribe to all topics (terminal 1)
mosquitto_sub -h localhost -t "#" -v

# Publish a test message (terminal 2)
mosquitto_pub -h localhost -t "test/topic" -m "Hello MQTT"
```

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | API server port | `3000` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |

### Example `.env` File

```env
# backend/.env

# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/smartroom

# Add these if you externalize MQTT config
# MQTT_HOST=mqtt://localhost
# MQTT_USER=smartroom
# MQTT_PASSWORD=your_password
```

---

## Running the Application

### Start All Services

**Terminal 1 - MongoDB (if not running as service):**
```bash
mongod --dbpath /path/to/data
```

**Terminal 2 - MQTT Broker (if not running as service):**
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

### Using Docker Compose (Alternative)

Create a `docker-compose.yml` in the project root:

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

Run:
```bash
docker-compose up -d
```

---

## Running Tests

### Backend Tests

Currently, the backend does not have automated tests configured. To run tests once added:

```bash
cd backend
npm test
```

### Frontend Tests

Currently, the frontend does not have automated tests configured. To run tests once added:

```bash
cd frontend
npm test
```

### Manual API Testing

Use curl or an API client like Postman:

```bash
# Create a sensor reading
curl -X POST http://localhost:3000/api/sensors \
  -H "Content-Type: application/json" \
  -d '{
    "temperature_c": "25.5",
    "humidity_pct": "60.0",
    "light_pct": "45",
    "low_light": false,
    "motion": false,
    "source": "test"
  }'

# Get all sensors
curl http://localhost:3000/api/sensors

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "rfid_uid": "A1B2C3D4",
    "role": "user"
  }'
```

---

## Building for Production

### Backend

```bash
cd backend

# Compile TypeScript
npx tsc

# Output will be in dist/ directory
node dist/server.js
```

### Frontend

```bash
cd frontend

# Build for production
npm run build

# Output will be in dist/ directory
# Serve with any static file server
npm run preview  # Preview locally
```

### Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB (Atlas or dedicated server)
- [ ] Enable MQTT authentication and TLS
- [ ] Configure CORS for specific origins
- [ ] Set up reverse proxy (nginx)
- [ ] Enable HTTPS/TLS
- [ ] Configure logging and monitoring
- [ ] Set up automated backups

---

## Troubleshooting

### Common Issues

#### "Cannot find module" Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check connection string
mongosh mongodb://localhost:27017
```

#### CORS Error in Browser
Ensure the backend CORS configuration allows your frontend origin:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  // or origin: '*' for development
}));
```

#### ESP8266 Not Connecting to WiFi
- Verify 2.4GHz WiFi (ESP8266 doesn't support 5GHz)
- Check credentials in firmware
- Check serial monitor for debug output

#### MQTT Connection Issues
- Verify broker is running: `sudo systemctl status mosquitto`
- Check port 1883 is accessible
- Verify credentials match broker configuration

### Getting Help

- Check the [Technical Documentation](./TECHNICAL.md)
- Review [Architecture](./ARCHITECTURE.md) for system overview
- Open an issue on GitHub for bugs
- See [Contributing](./CONTRIBUTING.md) for contribution guidelines

---

*Last updated: December 2024*
