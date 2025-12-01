# SmartRoom

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SmartRoom is an IoT-based smart room automation system that provides real-time environmental monitoring, access control, and automated device management. The system integrates ESP8266 microcontrollers with a modern web application for comprehensive room automation.

## 🚀 Features

- **Environmental Monitoring**: Real-time temperature, humidity, and light level sensing
- **Motion Detection**: PIR-based motion detection with configurable alerts
- **Access Control**: RFID-based door access with user authentication
- **Automated Control**: Automatic window and light control based on sensor thresholds
- **Manual Override**: Remote device control via web dashboard
- **Alert System**: Real-time alerts for security and environmental events
- **Access Logging**: Complete audit trail of access attempts

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   ESP8266-A     │     │   ESP8266-B     │
│ (Access Control)│     │ (Environmental) │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │  HTTP/MQTT            │  HTTP/MQTT
         │                       │
         ▼                       ▼
    ┌─────────────────────────────────┐
    │         MQTT Broker             │
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

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Technical Documentation](docs/TECHNICAL.md) | Detailed technical specifications and system overview |
| [Architecture](docs/ARCHITECTURE.md) | System architecture with diagrams |
| [Setup Guide](docs/SETUP.md) | Development environment setup instructions |
| [API Reference](docs/API.md) | REST API documentation with examples |
| [Contributing](docs/CONTRIBUTING.md) | Guidelines for contributing to the project |
| [Changelog](docs/CHANGELOG.md) | Version history and release notes |

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Messaging**: MQTT (PubSubClient)

### Frontend
- **Library**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Firmware
- **Platform**: ESP8266 (NodeMCU v2)
- **Framework**: Arduino (PlatformIO)
- **Sensors**: DHT11, LDR, PIR, HC-SR04, MFRC522

## 📁 Project Structure

```
SmartRoom/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── mqtt/            # MQTT client
│   └── package.json
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── types/           # TypeScript types
│   └── package.json
├── SmartRoom_IO/            # ESP8266 firmware (Access)
│   ├── src/
│   └── platformio.ini
├── SmartRoom_IO_2/          # ESP8266 firmware (Environmental)
│   ├── src/
│   └── platformio.ini
├── arduino/                 # Additional Arduino sketches
└── docs/                    # Documentation
```

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+
- npm or yarn

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
echo "PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smartroom" > .env

# Start development server
npm run nodemon
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173`

### Firmware

1. Install [PlatformIO](https://platformio.org/)
2. Open `SmartRoom_IO` or `SmartRoom_IO_2` in your IDE
3. Update WiFi credentials in `src/main.cpp`
4. Build and upload to ESP8266

For detailed setup instructions, see [SETUP.md](docs/SETUP.md).

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | Required |

## 📊 Languages Breakdown

- **TypeScript**: Backend API, Frontend application
- **C++**: ESP8266 firmware (Arduino/PlatformIO)
- **HTML/CSS**: Frontend UI with Tailwind CSS

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) before submitting a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Gerardo Mejía**

- GitHub: [@GerardoMejia1107](https://github.com/GerardoMejia1107)

---

⭐ Star this repository if you find it useful!