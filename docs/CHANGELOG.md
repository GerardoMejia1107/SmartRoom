# Changelog

Todos los cambios notables a este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [Sin Liberar]

### Agregado
- Documentación inicial del proyecto
  - Documentación técnica (TECHNICAL.md)
  - Documentación de arquitectura con diagramas (ARCHITECTURE.md)
  - Guía de configuración (SETUP.md)
  - Referencia de API (API.md)
  - Guías de contribución (CONTRIBUTING.md)
  - Plantilla de changelog (CHANGELOG.md)
- README.md actualizado con visión general del proyecto y enlaces a documentación
- Nuevos componentes de frontend:
  - Clock.tsx - Componente de reloj
  - DoorSwitch.tsx - Control de puerta
  - LightSwitch.tsx - Control de luz
  - ManualSwitch.tsx - Toggle modo manual/auto
  - WindowSwitch.tsx - Control de ventana
- Dependencia react-hot-toast para notificaciones

### Cambiado
- Optimización de interfaz de usuario para evitar loops infinitos
- Limpieza de comentarios en el código

### Obsoleto
- (Sin obsolescencias aún)

### Eliminado
- Directorio `arduino/` (código movido a proyectos PlatformIO)

### Corregido
- (Sin correcciones aún)

### Seguridad
- (Sin actualizaciones de seguridad aún)

---

## Cómo Actualizar Este Changelog

Al hacer cambios al proyecto, actualizar este archivo como parte de tu pull request:

### Categorías

- **Agregado**: Nuevas funcionalidades
- **Cambiado**: Cambios en funcionalidad existente
- **Obsoleto**: Funcionalidades que serán eliminadas en versiones futuras
- **Eliminado**: Funcionalidades eliminadas
- **Corregido**: Correcciones de bugs
- **Seguridad**: Correcciones y actualizaciones de seguridad

### Formato

```markdown
## [Versión] - AAAA-MM-DD

### Categoría
- Descripción del cambio ([#NUMERO_PR](enlace-al-pr)) por @usuario
```

### Ejemplo de Entrada

```markdown
## [1.0.0] - 2025-01-15

### Agregado
- Autenticación de usuarios con JWT ([#42](https://github.com/GerardoMejia1107/SmartRoom/pull/42)) por @contribuidor
- Notificaciones por email para alertas ([#45](https://github.com/GerardoMejia1107/SmartRoom/pull/45)) por @desarrollador

### Cambiado
- Actualizado driver de MongoDB a versión 8 ([#43](https://github.com/GerardoMejia1107/SmartRoom/pull/43))

### Corregido
- Resuelto problema con lecturas de sensores mostrando valores null ([#44](https://github.com/GerardoMejia1107/SmartRoom/pull/44))
```

### Guías de Versiones

- **Versión mayor (X.0.0)**: Cambios que rompen compatibilidad, adiciones de funcionalidades mayores
- **Versión menor (0.X.0)**: Nuevas funcionalidades, cambios que no rompen compatibilidad
- **Versión patch (0.0.X)**: Correcciones de bugs, mejoras menores

---

## Historial de Versiones

<!-- Versiones futuras serán agregadas arriba de esta línea -->

---

*Para la lista completa de cambios, ver el [historial de commits](https://github.com/GerardoMejia1107/SmartRoom/commits/main).*
