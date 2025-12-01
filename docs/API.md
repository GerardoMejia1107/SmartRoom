# SmartRoom API Reference

This document provides detailed API documentation for the SmartRoom backend REST API.

## Base URL

```
http://localhost:3000/api
```

## Authentication

> **Note**: The current API does not implement authentication. For production deployments, consider adding JWT-based authentication.

## Response Format

All API responses follow a consistent JSON format:

**Success Response:**
```json
{
  "data": [ /* array of objects */ ],
  "message": "Success"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "message": "Description of what went wrong"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request body or parameters |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server-side error |

---

## Endpoints

### Health Check

#### GET /

Check if the API is running.

**Request:**
```bash
curl http://localhost:3000/
```

**Response:**
```
Hello, World!
```

---

## Sensors API

### GET /api/sensors

Retrieve all sensor readings.

**Request:**
```bash
curl http://localhost:3000/api/sensors
```

**Response:**
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

Retrieve a specific sensor reading by ID.

**Parameters:**
| Name | Type | Location | Description |
|------|------|----------|-------------|
| id | string | path | MongoDB ObjectId |

**Request:**
```bash
curl http://localhost:3000/api/sensors/6789abc123def456ghi789jk
```

**Response:**
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

**Error Response (404):**
```json
{
  "error": "Sensor reading not found"
}
```

### POST /api/sensors

Create a new sensor reading.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| temperature_c | string | Yes | Temperature in Celsius |
| humidity_pct | string | Yes | Humidity percentage |
| light_pct | string | Yes | Light level percentage |
| low_light | boolean | Yes | Is light level low |
| motion | boolean | Yes | Is motion detected |
| source | string | No | Device identifier |

**Request:**
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

**Response (201):**
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

Update an existing sensor reading.

**Request:**
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

**Response:**
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

Delete a sensor reading.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/sensors/6789abc123def456ghi789jk
```

**Response (200):**
```json
{
  "message": "Sensor reading deleted"
}
```

---

## Devices API

### GET /api/devices

Retrieve all device states.

**Request:**
```bash
curl http://localhost:3000/api/devices
```

**Response:**
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

Toggle manual control mode.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| available | boolean | Yes | Enable/disable manual control |

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/devices/available \
  -H "Content-Type: application/json" \
  -d '{"available": true}'
```

**Response:**
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

Update door state.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| state | string | Yes | `"open"`, `"closed"`, or `"locked"` |

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/devices/door \
  -H "Content-Type: application/json" \
  -d '{"state": "open"}'
```

**Response:**
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

Update window state.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| state | string | Yes | `"open"` or `"closed"` |

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/devices/window \
  -H "Content-Type: application/json" \
  -d '{"state": "closed"}'
```

### PATCH /api/devices/lights

Update lights state.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| on | boolean | Yes | Turn lights on/off |

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/devices/lights \
  -H "Content-Type: application/json" \
  -d '{"on": true}'
```

---

## Users API

### GET /api/users

Retrieve all users.

**Request:**
```bash
curl http://localhost:3000/api/users
```

**Response:**
```json
[
  {
    "_id": "6789abc123def456ghi789jk",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "rfid_uid": "A3299BF4",
    "role": "user",
    "active": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

### GET /api/users/allowed

Retrieve all allowed RFID UIDs (for active users only).

**Request:**
```bash
curl http://localhost:3000/api/users/allowed
```

**Response:**
```json
["A3299BF4", "B4AA0CE5", "C5BB1DF6"]
```

### GET /api/users/:id

Retrieve a specific user by ID.

**Request:**
```bash
curl http://localhost:3000/api/users/6789abc123def456ghi789jk
```

**Response:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "rfid_uid": "A3299BF4",
  "role": "user",
  "active": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

### POST /api/users

Create a new user.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name |
| email | string | Yes | User's email (unique) |
| rfid_uid | string | Yes | RFID card UID (unique) |
| role | string | No | `"admin"`, `"user"`, or `"guest"` (default: `"user"`) |
| active | boolean | No | Is user active (default: `true`) |

**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "rfid_uid": "D6CC2EG7",
    "role": "user"
  }'
```

**Response (201):**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "rfid_uid": "D6CC2EG7",
  "role": "user",
  "active": true,
  "createdAt": "2025-01-15T10:35:00.000Z",
  "updatedAt": "2025-01-15T10:35:00.000Z"
}
```

**Error Response (400 - Duplicate Email):**
```json
{
  "error": "Email already exists"
}
```

### PUT /api/users/:id

Update an existing user.

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/6789abc123def456ghi789jk \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith-Johnson",
    "role": "admin"
  }'
```

**Response:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "name": "Jane Smith-Johnson",
  "email": "jane.smith@example.com",
  "rfid_uid": "D6CC2EG7",
  "role": "admin",
  "active": true,
  "createdAt": "2025-01-15T10:35:00.000Z",
  "updatedAt": "2025-01-15T10:40:00.000Z"
}
```

### DELETE /api/users/:id

Delete a user.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/6789abc123def456ghi789jk
```

**Response (200):**
```json
{
  "message": "User deleted"
}
```

---

## Access Logs API

### GET /api/logs

Retrieve all access logs.

**Request:**
```bash
curl http://localhost:3000/api/logs
```

**Response:**
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

Retrieve a specific access log by ID.

**Request:**
```bash
curl http://localhost:3000/api/logs/6789abc123def456ghi789jk
```

**Response:**
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

Create a new access log entry.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| uid | string | Yes | RFID card UID |
| authorized | boolean | Yes | Was access authorized |
| door_action | string | No | `"open"`, `"deny"`, or `"lock"` (default: `"deny"`) |
| user_id | string | No | MongoDB ObjectId of associated user |
| source | string | No | Device identifier |

**Request:**
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

**Response (201):**
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

Update an existing access log.

**Request:**
```bash
curl -X PUT http://localhost:3000/api/logs/6789abc123def456ghi789jk \
  -H "Content-Type: application/json" \
  -d '{
    "door_action": "lock"
  }'
```

### DELETE /api/logs/:id

Delete an access log entry.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/logs/6789abc123def456ghi789jk
```

---

## Alerts API

### GET /api/alerts

Retrieve all alerts.

**Request:**
```bash
curl http://localhost:3000/api/alerts
```

**Response:**
```json
[
  {
    "_id": "6789abc123def456ghi789jk",
    "type": "unauthorized_presence",
    "description": "Presence >30s without valid RFID",
    "duration_ms": 30000,
    "timestamp": "2025-01-15T10:30:00.000Z",
    "resolved": false,
    "source": "esp32-A"
  }
]
```

### GET /api/alerts/:id

Retrieve a specific alert by ID.

**Request:**
```bash
curl http://localhost:3000/api/alerts/6789abc123def456ghi789jk
```

### POST /api/alerts

Create a new alert.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Alert type (see below) |
| description | string | Yes | Alert description |
| duration_ms | number | No | Duration in milliseconds |
| resolved | boolean | No | Is alert resolved (default: `false`) |
| source | string | No | Device identifier |

**Alert Types:**
- `unauthorized_presence` - Detected presence without valid RFID
- `motion_alert` - Motion detected in restricted area
- `temp_high` - Temperature exceeded threshold
- `humidity_high` - Humidity exceeded threshold
- `forced_door` - Door forced open

**Request:**
```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "type": "unauthorized_presence",
    "description": "Presence >30s without valid RFID",
    "duration_ms": 30000,
    "source": "esp32-A"
  }'
```

**Response (201):**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "type": "unauthorized_presence",
  "description": "Presence >30s without valid RFID",
  "duration_ms": 30000,
  "timestamp": "2025-01-15T10:35:00.000Z",
  "resolved": false,
  "source": "esp32-A"
}
```

### PUT /api/alerts/:id

Update an existing alert (e.g., mark as resolved).

**Request:**
```bash
curl -X PUT http://localhost:3000/api/alerts/6789abc123def456ghi789jk \
  -H "Content-Type: application/json" \
  -d '{
    "resolved": true
  }'
```

**Response:**
```json
{
  "_id": "6789abc123def456ghi789jk",
  "type": "unauthorized_presence",
  "description": "Presence >30s without valid RFID",
  "duration_ms": 30000,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "resolved": true,
  "source": "esp32-A"
}
```

### DELETE /api/alerts/:id

Delete an alert.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/alerts/6789abc123def456ghi789jk
```

---

## Error Handling

### Validation Errors

When required fields are missing or invalid:

```json
{
  "error": "ValidationError",
  "message": "Path `email` is required."
}
```

### Not Found Errors

When a resource is not found:

```json
{
  "error": "NotFound",
  "message": "Resource with ID xyz not found"
}
```

### Server Errors

When an unexpected error occurs:

```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

> **Note**: Rate limiting is not currently implemented. For production, consider adding rate limiting middleware.

---

## CORS

The API is configured to accept requests from any origin in development:

```typescript
app.use(cors({
  origin: "*",
  methods: ["GET, POST, PUT, DELETE, PATCH"],
  allowedHeaders: ["Content-Type, Authorization"],
}));
```

For production, restrict to specific origins.

---

## Pagination

> **Note**: Pagination is not currently implemented. All endpoints return all matching records. For production with large datasets, consider implementing pagination.

Example future pagination format:
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Related Documentation

- [Technical Documentation](./TECHNICAL.md) - System overview and details
- [Architecture](./ARCHITECTURE.md) - System architecture diagrams
- [Setup Guide](./SETUP.md) - Development environment setup

---

*Last updated: December 2024*
