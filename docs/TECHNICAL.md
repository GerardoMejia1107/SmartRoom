# SmartRoom Technical Documentation

This document provides comprehensive technical documentation for the SmartRoom IoT smart room automation system.

## Table of Contents

- [Project Overview](#project-overview)
- [Goals and Objectives](#goals-and-objectives)
- [High-Level Architecture](#high-level-architecture)
- [Data Flow](#data-flow)
- [Hardware Components](#hardware-components)
- [Software Stack](#software-stack)
- [Data Models](#data-models)
- [API Contract](#api-contract)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing Strategy](#testing-strategy)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

SmartRoom is an IoT-based smart room automation system that monitors and controls various aspects of a room environment. The system integrates hardware sensors and actuators with a modern web application to provide real-time monitoring and control capabilities.

### Key Features

- **Environmental Monitoring**: Temperature, humidity, and light level sensing
- **Motion Detection**: PIR-based motion detection with alert generation
- **Access Control**: RFID-based door access with user authentication
- **Automated Control**: Automatic window and light control based on sensor readings
- **Manual Override**: Remote control of devices via web interface
- **Alert System**: Real-time alerts for security and environmental events
- **Access Logging**: Complete audit trail of access attempts

---

## Goals and Objectives

1. **Automation**: Automate room environment control (lighting, ventilation) based on sensor data
2. **Security**: Provide secure RFID-based access control with comprehensive logging
3. **Monitoring**: Real-time monitoring of environmental conditions
4. **Accessibility**: User-friendly web interface for remote monitoring and control
5. **Scalability**: Modular design supporting multiple rooms and sensors
6. **Reliability**: Robust MQTT-based communication for real-time updates

---

## High-Level Architecture

The SmartRoom system consists of the following major components:

### Components Overview

| Component | Technology | Description |
|-----------|------------|-------------|
| **Sensors/Actuators** | ESP8266 (NodeMCU) | Microcontrollers with sensors and actuators |
| **Backend API** | Node.js + Express + TypeScript | REST API server handling data persistence and business logic |
| **Database** | MongoDB | Document database for storing sensor data, users, and logs |
| **MQTT Broker** | Mosquitto (or similar) | Message broker for real-time device communication |
| **Frontend** | React + TypeScript + Vite | Web-based dashboard and control interface |

### Component Interactions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SmartRoom System                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐              ┌──────────────────┐                    │
│  │   ESP8266-A      │              │   ESP8266-B      │                    │
│  │   (Access)       │              │   (Environment)  │                    │
│  │  - RFID Reader   │              │  - DHT11 Sensor  │                    │
│  │  - Servo (Door)  │              │  - LDR Sensor    │                    │
│  │  - Ultrasonic    │              │  - PIR Motion    │                    │
│  │  - LED Alarm     │              │  - Servo (Window)│                    │
│  └────────┬─────────┘              └────────┬─────────┘                    │
│           │                                 │                               │
│           │  HTTP POST / MQTT               │  HTTP POST / MQTT            │
│           │                                 │                               │
│           ▼                                 ▼                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         MQTT Broker (Mosquitto)                       │  │
│  │                    Topic-based pub/sub messaging                      │  │
│  └──────────────────────────────────────┬───────────────────────────────┘  │
│                                         │                                   │
│                                         ▼                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Backend API (Node.js + Express)                    │  │
│  │    REST Endpoints: /api/sensors, /api/devices, /api/users, etc.      │  │
│  └──────────────────────────────────┬───────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         MongoDB Database                              │  │
│  │   Collections: sensors, devices, users, access_logs, alerts          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                     ▲                                       │
│                                     │                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                   Frontend (React + Vite + Tailwind)                  │  │
│  │        Dashboard | Controls | Access Logs | Events/Alerts            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Sensor Data Flow

1. **ESP8266 sensors** read environmental data (temperature, humidity, light, motion)
2. **HTTP POST** sends sensor readings to backend `/api/sensors` endpoint
3. **Backend** validates and stores data in MongoDB `sensors` collection
4. **Frontend** polls or fetches sensor data to display on dashboard

### Access Control Flow

1. **RFID card** is scanned at ESP8266-A reader
2. **ESP8266** checks UID against allowed list (synced via MQTT)
3. **Door servo** opens if authorized; LED alarm blinks if unauthorized
4. **HTTP POST** logs access attempt to backend `/api/logs` endpoint
5. **Frontend** displays access logs in real-time

### Device Control Flow

1. **User** clicks control button on frontend dashboard
2. **Frontend** sends PATCH request to backend `/api/devices/{type}`
3. **Backend** publishes command to MQTT topic
4. **ESP8266** subscribes to topic and executes command (e.g., toggle LED, open window)
5. **Backend** updates device state in MongoDB

### Alert Flow

1. **ESP8266** detects anomaly (e.g., prolonged presence without valid RFID)
2. **HTTP POST** sends alert to backend `/api/alerts` endpoint
3. **Backend** stores alert in MongoDB `alerts` collection
4. **Frontend** displays alert notification to user

---

## Hardware Components

### Recommended Hardware

| Component | Model | Purpose |
|-----------|-------|---------|
| Microcontroller | ESP8266 NodeMCU v2 | WiFi-enabled microcontroller |
| Temperature/Humidity | DHT11 | Environmental monitoring |
| Light Sensor | LDR (Photoresistor) | Light level detection |
| Motion Sensor | HC-SR501 PIR | Motion detection |
| RFID Reader | MFRC522 | Access card reading |
| Ultrasonic Sensor | HC-SR04 | Proximity/presence detection |
| Servo Motor | SG90 9G | Door/window actuation |
| LED | Standard 5mm LED | Status indicators |

### ESP8266-A Wiring (Access Control)

| Component | Pin | GPIO |
|-----------|-----|------|
| RFID SDA/SS | D2 | GPIO4 |
| RFID RST | D1 | GPIO5 |
| RFID SCK | D5 | GPIO14 |
| RFID MISO | D6 | GPIO12 |
| RFID MOSI | D7 | GPIO13 |
| Servo Door | D4 | GPIO2 |
| Ultrasonic TRIG | D0 | GPIO16 |
| Ultrasonic ECHO | D8 | GPIO15 |
| LED Alarm | D3 | GPIO0 |

### ESP8266-B Wiring (Environmental)

| Component | Pin | GPIO |
|-----------|-----|------|
| DHT11 DATA | D4 | GPIO2 |
| Servo Window | D5 | GPIO14 |
| LDR | A0 | ADC |
| LED Light | D6 | GPIO12 |
| PIR | D1 | GPIO5 |

### Power Requirements

- ESP8266: 3.3V logic (5V USB power)
- Servos: 5V (separate power supply recommended for multiple servos)
- Sensors: 3.3V-5V compatible

---

## Software Stack

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express | 5.x | HTTP server framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Mongoose | 8.x | MongoDB ODM |
| MQTT.js | 5.x | MQTT client library |
| dotenv | 17.x | Environment configuration |
| cors | 2.x | Cross-origin resource sharing |
| nodemon | 3.x | Development hot-reload |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.x | UI library |
| Vite | 7.x | Build tool and dev server |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| React Router | 7.x | Client-side routing |
| Recharts | 3.x | Data visualization |
| Lucide React | 0.x | Icon library |

### Firmware (PlatformIO)

| Library | Version | Purpose |
|---------|---------|---------|
| PubSubClient | 2.8 | MQTT client for Arduino |
| ArduinoJson | 7.4.2 | JSON parsing/serialization |
| DHT sensor library | 1.4.6 | DHT11/DHT22 sensor support |
| MFRC522 | 1.3.6 | RFID reader library |
| Adafruit Unified Sensor | 1.1.15 | Sensor abstraction layer |

---

## Data Models

### Sensor Reading

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

### Device State

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

### User

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "rfid_uid": "A3299BF4",
  "role": "user",
  "active": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

### Access Log

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

### Alert

```json
{
  "_id": "ObjectId",
  "type": "unauthorized_presence",
  "description": "Presence >30s without valid RFID",
  "duration_ms": 30000,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "resolved": false,
  "source": "esp32-A"
}
```

---

## API Contract

Base URL: `http://localhost:3000/api`

### Sensors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sensors` | Get all sensor readings |
| GET | `/sensors/:id` | Get sensor reading by ID |
| POST | `/sensors` | Create new sensor reading |
| PUT | `/sensors/:id` | Update sensor reading |
| DELETE | `/sensors/:id` | Delete sensor reading |

### Devices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/devices` | Get all devices state |
| PATCH | `/devices/available` | Toggle manual control mode |
| PATCH | `/devices/door` | Update door state |
| PATCH | `/devices/window` | Update window state |
| PATCH | `/devices/lights` | Update lights state |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/allowed` | Get all allowed RFID UIDs |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Access Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/logs` | Get all access logs |
| GET | `/logs/:id` | Get access log by ID |
| POST | `/logs` | Create new access log |
| PUT | `/logs/:id` | Update access log |
| DELETE | `/logs/:id` | Delete access log |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/alerts` | Get all alerts |
| GET | `/alerts/:id` | Get alert by ID |
| POST | `/alerts` | Create new alert |
| PUT | `/alerts/:id` | Update alert |
| DELETE | `/alerts/:id` | Delete alert |

For detailed API reference with request/response examples, see [API.md](./API.md).

---

## Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/smartroom

# MQTT Configuration (configure in mqtt_client.ts)
# MQTT_HOST=mqtt://192.168.1.35
# MQTT_USER=your_username
# MQTT_PASSWORD=your_password
```

### MQTT Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| `rfid/allowed/update` | Backend → ESP | List of allowed RFID UIDs |
| `room/control/lights` | Backend → ESP | Light control commands |
| `room/control/window` | Backend → ESP | Window control commands |
| `room/control/door` | Backend → ESP | Door control commands |
| `room/control/manual` | Backend → ESP | Manual override toggle |

---

## Deployment

### Local Development

See [SETUP.md](./SETUP.md) for detailed local development setup instructions.

### Production Deployment

#### Backend (Node.js)

1. **Build the application**:
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. **Using systemd service**:
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

3. **Using Docker**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY dist/ ./dist/
   EXPOSE 3000
   CMD ["node", "dist/server.js"]
   ```

#### Frontend (Static Build)

1. **Build the application**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Serve with nginx**:
   ```nginx
   server {
       listen 80;
       server_name smartroom.example.com;

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

#### MQTT Broker (Mosquitto)

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

#### Firmware Deployment

1. Open PlatformIO IDE or VS Code with PlatformIO extension
2. Connect ESP8266 via USB
3. Update WiFi credentials and backend URL in source code
4. Build and upload:
   ```bash
   cd SmartRoom_IO  # or SmartRoom_IO_2
   pio run --target upload
   ```

---

## Testing Strategy

### Backend Testing

Currently, the backend does not have automated tests configured. To add testing:

1. **Install test dependencies**:
   ```bash
   npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
   ```

2. **Add test script to package.json**:
   ```json
   {
     "scripts": {
       "test": "jest"
     }
   }
   ```

3. **Example unit test**:
   ```typescript
   // src/__tests__/sensors.test.ts
   import request from 'supertest';
   import app from '../app';

   describe('Sensors API', () => {
     it('GET /api/sensors should return sensor data', async () => {
       const res = await request(app).get('/api/sensors');
       expect(res.statusCode).toBe(200);
     });
   });
   ```

### Frontend Testing

1. **Install test dependencies**:
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
   ```

2. **Run tests**:
   ```bash
   npm run test
   ```

### Integration Testing

1. Use tools like Postman or curl to test API endpoints
2. Monitor MQTT messages with MQTT Explorer
3. Verify sensor data flow from ESP8266 to database

### Hardware Testing

1. Use Serial Monitor (115200 baud) for debugging ESP8266
2. Test RFID reader with known cards
3. Verify servo range of motion
4. Test sensor readings with multimeter

---

## Security Considerations

### Network Security

- **Network Segmentation**: Keep IoT devices on a separate VLAN
- **Firewall Rules**: Restrict inbound connections to necessary ports only
- **TLS/SSL**: Use HTTPS for frontend and API in production
- **MQTT Security**: Enable authentication and TLS for MQTT broker

### Authentication & Authorization

- Currently, the API does not implement authentication
- For production, consider adding:
  - JWT-based authentication for API endpoints
  - Role-based access control (admin, user, guest roles exist in model)
  - API rate limiting

### Secrets Management

- **Never commit credentials** to version control
- Use environment variables for sensitive configuration
- For production, use a secrets manager (HashiCorp Vault, AWS Secrets Manager)
- Rotate MQTT and database credentials regularly

### Firmware Security

- Update WiFi credentials before deployment
- Consider using secure boot on ESP8266/ESP32
- Validate and sanitize RFID UID input
- Implement watchdog timer for reliability

### Database Security

- Use MongoDB authentication in production
- Enable network encryption for MongoDB connections
- Regular database backups
- Limit database user permissions

---

## Troubleshooting

### Common Issues

#### ESP8266 Not Connecting to WiFi

1. Verify WiFi credentials in firmware
2. Check WiFi signal strength
3. Ensure router supports 2.4GHz (ESP8266 doesn't support 5GHz)
4. Try resetting the ESP8266

#### MQTT Connection Failed

1. Verify MQTT broker is running
2. Check broker IP address and port
3. Verify MQTT credentials
4. Check firewall rules for port 1883

#### Backend Not Starting

1. Check if MongoDB is running
2. Verify `MONGO_URI` environment variable
3. Check for port conflicts (default: 3000)
4. Review console logs for errors

#### Sensor Readings Not Appearing

1. Check serial monitor for ESP8266 output
2. Verify HTTP POST URL is correct
3. Ensure backend CORS is configured
4. Check MongoDB connection

#### RFID Not Reading Cards

1. Verify SPI wiring (SCK, MISO, MOSI, SS)
2. Check RFID module power supply
3. Test with known working cards
4. Check serial output for version register

#### Servo Not Moving

1. Verify servo power supply (5V separate from ESP)
2. Check signal wire connection
3. Test servo with different PWM values
4. Ensure servo is not mechanically blocked

### Debug Commands

```bash
# Check MongoDB status
mongosh --eval "db.serverStatus()"

# Check backend logs
journalctl -u smartroom-backend -f

# Test MQTT connection
mosquitto_sub -h localhost -t "#" -v

# Test API endpoint
curl http://localhost:3000/api/sensors
```

### Log Locations

| Component | Log Location |
|-----------|--------------|
| Backend | Console (stdout) / journalctl |
| MongoDB | `/var/log/mongodb/` |
| MQTT | `/var/log/mosquitto/` |
| ESP8266 | Serial Monitor (115200 baud) |

---

## Additional Resources

- [Setup Guide](./SETUP.md) - Development environment setup
- [API Reference](./API.md) - Detailed API documentation
- [Architecture](./ARCHITECTURE.md) - System architecture diagrams
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines
- [Changelog](./CHANGELOG.md) - Version history

---

*Last updated: December 2024*
