# Contribuir a SmartRoom

¡Gracias por tu interés en contribuir a SmartRoom! Este documento proporciona guías e instrucciones para contribuir al proyecto.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Primeros Pasos](#primeros-pasos)
- [Cómo Contribuir](#cómo-contribuir)
- [Flujo de Trabajo de Desarrollo](#flujo-de-trabajo-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Mensajes de Commit](#mensajes-de-commit)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Guías para Issues](#guías-para-issues)
- [Pruebas](#pruebas)
- [Documentación](#documentación)

---

## Código de Conducta

Al participar en este proyecto, aceptas mantener un ambiente respetuoso e inclusivo para todos los contribuidores. Por favor:

- Sé respetuoso y considerado en tus comunicaciones
- Da la bienvenida a los nuevos y ayúdalos a empezar
- Enfócate en retroalimentación constructiva
- Acepta la responsabilidad de tus errores y aprende de ellos

---

## Primeros Pasos

### Prerrequisitos

Antes de contribuir, asegúrate de tener:

1. Leído el [README.md](../README.md) para visión general del proyecto
2. Configurado tu entorno de desarrollo siguiendo [SETUP.md](./SETUP.md)
3. Entendido la [ARCHITECTURE.md](./ARCHITECTURE.md) y [TECHNICAL.md](./TECHNICAL.md)

### Fork y Clonar

1. Hacer fork del repositorio en GitHub
2. Clonar tu fork localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/SmartRoom.git
   cd SmartRoom
   ```
3. Agregar remote upstream:
   ```bash
   git remote add upstream https://github.com/GerardoMejia1107/SmartRoom.git
   ```

---

## Cómo Contribuir

### Tipos de Contribuciones

Damos la bienvenida a varios tipos de contribuciones:

- 🐛 **Corrección de bugs**: Corregir problemas y mejorar la estabilidad
- ✨ **Nuevas funcionalidades**: Agregar nueva funcionalidad
- 📚 **Documentación**: Mejorar o agregar documentación
- 🧪 **Pruebas**: Agregar o mejorar cobertura de pruebas
- 🎨 **UI/UX**: Mejorar la interfaz de usuario
- ⚡ **Rendimiento**: Optimizar código y mejorar rendimiento
- 🔒 **Seguridad**: Corregir vulnerabilidades de seguridad

### Encontrar Issues para Trabajar

- Revisar la página de [Issues](https://github.com/GerardoMejia1107/SmartRoom/issues)
- Buscar issues etiquetados con `good first issue` para principiantes
- Issues etiquetados con `help wanted` necesitan asistencia de la comunidad
- No dudes en hacer preguntas en cualquier issue antes de empezar a trabajar

---

## Flujo de Trabajo de Desarrollo

### 1. Crear una Rama

Crear una rama descriptiva para tu trabajo:

```bash
# Sincronizar con upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crear rama de feature
git checkout -b <tipo>/<descripcion>
```

### Convención de Nombres de Ramas

Usar los siguientes prefijos:

| Prefijo | Descripción | Ejemplo |
|---------|-------------|---------|
| `feature/` | Nueva funcionalidad | `feature/agregar-alertas-temperatura` |
| `fix/` | Corrección de bug | `fix/lectura-sensor-null` |
| `docs/` | Documentación | `docs/actualizar-referencia-api` |
| `refactor/` | Refactorización de código | `refactor/cliente-mqtt` |
| `test/` | Agregar pruebas | `test/controlador-usuarios` |
| `chore/` | Tareas de mantenimiento | `chore/actualizar-dependencias` |

### 2. Hacer tus Cambios

- Escribir código limpio y legible
- Seguir el estilo de código existente
- Agregar comentarios para lógica compleja
- Actualizar documentación si es necesario

### 3. Probar tus Cambios

```bash
# Backend
cd backend
npm run lint  # Si está configurado
npm test      # Si existen pruebas

# Frontend
cd frontend
npm run lint
npm run build  # Asegurar que el build tenga éxito
```

### 4. Hacer Commit de tus Cambios

Seguir las guías de mensajes de commit abajo.

### 5. Hacer Push y Crear PR

```bash
git push origin <nombre-de-tu-rama>
```

Luego crear un Pull Request en GitHub.

---

## Estándares de Código

### TypeScript/JavaScript

- Usar TypeScript para todo código nuevo
- Seguir patrones de código existentes
- Usar nombres significativos de variables y funciones
- Preferir `const` sobre `let`; evitar `var`
- Usar async/await sobre callbacks o promesas crudas
- Manejar errores apropiadamente

**Ejemplo:**
```typescript
// Bien
const obtenerDatosSensor = async (sensorId: string): Promise<ISensor | null> => {
  try {
    const sensor = await Sensor.findById(sensorId);
    return sensor;
  } catch (error) {
    console.error('Error al obtener sensor:', error);
    return null;
  }
};

// Evitar
function obtenerDatosSensor(sensorId, callback) {
  Sensor.findById(sensorId, function(err, sensor) {
    callback(err, sensor);
  });
}
```

### React/Frontend

- Usar componentes funcionales con hooks
- Mantener componentes pequeños y enfocados
- Usar interfaces TypeScript para props
- Extraer lógica reutilizable en hooks personalizados

**Ejemplo:**
```tsx
interface TarjetaSensorProps {
  sensor: ISensor;
  onRefresh: () => void;
}

const TarjetaSensor: React.FC<TarjetaSensorProps> = ({ sensor, onRefresh }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3>{sensor.source}</h3>
      <p>Temperatura: {sensor.temperature_c}°C</p>
      <button onClick={onRefresh}>Actualizar</button>
    </div>
  );
};
```

### Arduino/C++

- Usar nombres descriptivos de constantes
- Comentar lógica compleja
- Seguir patrones de formato existentes
- Evitar operaciones bloqueantes en loop()

---

## Mensajes de Commit

Seguimos la especificación de [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<tipo>(<ámbito>): <asunto>

[cuerpo opcional]

[pie de página opcional]
```

### Tipos

| Tipo | Descripción |
|------|-------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Cambios de documentación |
| `style` | Cambios de estilo de código (formato, etc.) |
| `refactor` | Refactorización de código |
| `test` | Agregar o actualizar pruebas |
| `chore` | Tareas de mantenimiento |
| `perf` | Mejoras de rendimiento |

### Ámbitos

| Ámbito | Descripción |
|--------|-------------|
| `backend` | Cambios de API Backend |
| `frontend` | Cambios de Frontend |
| `firmware` | Firmware ESP8266 |
| `docs` | Documentación |
| `deps` | Dependencias |

### Ejemplos

```bash
# Funcionalidad
feat(backend): agregar alertas de umbral de temperatura

# Corrección de bug
fix(frontend): resolver problema de renderizado de gráfico de sensores

# Documentación
docs: actualizar referencia de API con nuevos endpoints

# Refactorización
refactor(backend): extraer lógica MQTT a módulo separado

# Dependencias
chore(deps): actualizar mongoose a versión 8.x
```

### Guías para el Asunto

- Usar modo imperativo ("agregar" no "agregado")
- No capitalizar la primera letra
- Sin punto al final
- Mantenerlo bajo 72 caracteres

---

## Proceso de Pull Request

### Antes de Enviar

- [ ] El código sigue las guías de estilo del proyecto
- [ ] Auto-revisado el código para errores obvios
- [ ] Agregadas/actualizadas pruebas (si aplica)
- [ ] Actualizada documentación (si aplica)
- [ ] Todas las pruebas pasan localmente
- [ ] Mensajes de commit siguen convenciones
- [ ] Rama está actualizada con main

### Título del PR

Seguir el mismo formato que los mensajes de commit:
```
feat(backend): agregar autenticación de usuarios
```

### Plantilla de Descripción del PR

```markdown
## Descripción
[Describir qué hace este PR]

## Tipo de Cambio
- [ ] Corrección de bug
- [ ] Nueva funcionalidad
- [ ] Cambio que rompe compatibilidad
- [ ] Actualización de documentación

## Issues Relacionados
Fixes #[numero_de_issue]

## Pruebas
[Describir cómo probar los cambios]

## Lista de Verificación
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado una auto-revisión
- [ ] He agregado pruebas que prueban que mi fix/feature funciona
- [ ] Pruebas nuevas y existentes pasan localmente
- [ ] He actualizado la documentación
```

### Proceso de Revisión

1. Un mantenedor revisará tu PR
2. Atender cualquier cambio solicitado
3. Una vez aprobado, un mantenedor fusionará tu PR

### Después del Merge

- Eliminar tu rama
- Hacer pull de los últimos cambios a tu rama main local

---

## Guías para Issues

### Reportar Bugs

Usar la plantilla de reporte de bugs al crear issues:

```markdown
**Describe el bug**
Una descripción clara de qué es el bug.

**Para Reproducir**
Pasos para reproducir el comportamiento:
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

**Comportamiento esperado**
Lo que esperabas que sucediera.

**Capturas de pantalla**
Si aplica, agregar capturas de pantalla.

**Entorno:**
- OS: [ej., Windows 11]
- Navegador: [ej., Chrome 120]
- Versión de Node.js: [ej., 18.17.0]

**Contexto adicional**
Cualquier otra información relevante.
```

### Solicitudes de Funcionalidades

```markdown
**¿Tu solicitud de funcionalidad está relacionada con un problema?**
Una descripción clara del problema.

**Describe la solución que te gustaría**
Una descripción clara de lo que quieres que suceda.

**Describe alternativas que has considerado**
Cualquier solución o funcionalidad alternativa que hayas considerado.

**Contexto adicional**
Cualquier otro contexto o capturas de pantalla.
```

---

## Pruebas

### Pruebas de Backend

Al agregar pruebas para el backend:

```typescript
// Ejemplo de estructura de prueba
import request from 'supertest';
import app from '../app';

describe('API de Sensores', () => {
  describe('GET /api/sensors', () => {
    it('debería retornar todos los sensores', async () => {
      const response = await request(app)
        .get('/api/sensors')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/sensors', () => {
    it('debería crear una nueva lectura de sensor', async () => {
      const datosSensor = {
        temperature_c: '25.5',
        humidity_pct: '60.0',
        light_pct: '45',
        low_light: false,
        motion: false
      };

      const response = await request(app)
        .post('/api/sensors')
        .send(datosSensor)
        .expect(201);
      
      expect(response.body.temperature_c).toBe('25.5');
    });
  });
});
```

### Pruebas de Frontend

Al agregar pruebas para el frontend:

```typescript
// Ejemplo de prueba de componente
import { render, screen } from '@testing-library/react';
import TarjetaSensor from './TarjetaSensor';

describe('TarjetaSensor', () => {
  const sensorMock = {
    _id: '123',
    temperature_c: '25.5',
    humidity_pct: '60.0',
    light_pct: '45',
    low_light: false,
    motion: false,
    source: 'esp8266-B'
  };

  it('renderiza datos del sensor correctamente', () => {
    render(<TarjetaSensor sensor={sensorMock} />);
    
    expect(screen.getByText('25.5°C')).toBeInTheDocument();
    expect(screen.getByText('esp8266-B')).toBeInTheDocument();
  });
});
```

---

## Documentación

### Cuándo Actualizar Documentación

- Agregar nuevas funcionalidades
- Cambiar endpoints de API
- Modificar opciones de configuración
- Actualizar dependencias
- Cambiar arquitectura

### Archivos de Documentación

| Archivo | Propósito |
|---------|-----------|
| `README.md` | Visión general del proyecto e inicio rápido |
| `docs/TECHNICAL.md` | Detalles técnicos y especificaciones |
| `docs/ARCHITECTURE.md` | Arquitectura del sistema |
| `docs/SETUP.md` | Guía de configuración de desarrollo |
| `docs/API.md` | Referencia de API |
| `docs/CONTRIBUTING.md` | Guías de contribución |
| `docs/CHANGELOG.md` | Historial de versiones |

### Estilo de Documentación

- Usar lenguaje claro y conciso
- Incluir ejemplos de código donde sea útil
- Mantener formato consistente
- Actualizar la fecha de "Última actualización"

---

## ¿Preguntas?

Si tienes preguntas sobre contribuir:

1. Revisar documentación existente
2. Buscar issues existentes
3. Abrir un nuevo issue con tu pregunta

¡Gracias por contribuir a SmartRoom! 🏠💡

---

*Última actualización: Diciembre 2024*
