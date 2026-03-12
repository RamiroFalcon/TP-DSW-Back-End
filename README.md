# TP DSW - Backend

Sistema de gestión de reservas de canchas deportivas desarrollado con Node.js, Express y MySQL.

**Stack Tecnológico:** Node.js + TypeScript + Express + MySQL + JWT + Jest

---

## Descripción del Proyecto

API REST para la gestión completa de un sistema de reservas de canchas deportivas que permite:

- Registro y autenticación de usuarios con JWT
- Búsqueda avanzada de canchas por deporte, localidad y disponibilidad
- Consulta de horarios disponibles en tiempo real
- Creación de reservas con cálculo automático de precio
- Gestión de servicios adicionales (luces, pelota, vestuario)
- Sistema de pagos asociados a reservas
- Control de precios históricos por cancha
- Panel de administración para gestión de recursos

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior
- **pnpm** gestor de paquetes
- **MySQL** v8.0 o superior
- **Git**

---

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/RamiroFalcon/TP-DSW-Back-End.git
cd TP-DSW-Back-End
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar la base de datos

Conectarse a MySQL y ejecutar el script de creación:

```bash
# Conectarse a MySQL
mysql -u root -p

# Dentro de MySQL, ejecutar:
CREATE DATABASE tp;
USE tp;
source docs/mysql-commands.sql;
exit;
```

Esto creará todas las tablas necesarias:
- `usuario` - Usuarios del sistema (clientes y administradores)
- `localidad` - Ciudades/zonas donde están las canchas
- `tipocancha` - Tipos de deportes (fútbol, tenis, paddle)
- `cancha` - Canchas disponibles
- `reserva` - Reservas realizadas
- `servicio` - Servicios adicionales ofrecidos
- `reserva_servicio` - Relación muchos a muchos entre reservas y servicios
- `pago` - Pagos asociados a reservas
- `precio` - Historial de precios por cancha

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
# En Linux/Mac
cp .env.example .env

# En Windows (PowerShell)
Copy-Item .env.example .env
```

Editar el archivo `.env` con tus credenciales:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=tp

# JWT
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=development
```

**Importante:** El archivo `.env` contiene información sensible y NO debe subirse a GitHub (ya está en `.gitignore`).

### 5. Ejecutar el servidor

```bash
# Modo desarrollo con hot-reload
pnpm start:dev

# Modo producción
pnpm build
pnpm start
```

Si todo está correcto, verás:

```
Conexión a MySQL exitosa
Server running on http://localhost:3000
```

---

## Estructura del Proyecto

```
src/
├── auth/                    # Autenticación JWT y middleware de autorización
│   ├── auth.service.ts      # Lógica de login, registro y tokens
│   ├── jwt.service.ts       # Generación y verificación de JWT
│   ├── auth.middleware.ts   # Middleware para proteger rutas
│   └── auth.controller.ts
│
├── cancha/                  # Gestión de canchas deportivas
│   ├── cancha.entity.ts     # Interfaces TypeScript
│   ├── cancha.repository.ts # Acceso a datos
│   ├── cancha.service.ts    # Lógica de negocio
│   └── cancha.controller.ts
│
├── disponibilidad/          # Consulta de horarios disponibles
│   └── disponibilidad.service.ts  # Calcula franjas horarias libres
│
├── busqueda-cancha/         # Búsqueda avanzada de canchas
│   └── busqueda-cancha.service.ts # Filtra por deporte, localidad, fecha
│
├── reserva/                 # Sistema de reservas
│   ├── reserva.entity.ts
│   ├── reserva.repository.ts
│   ├── reserva.service.ts   # Cálculo automático de precio total
│   └── reserva.cotroller.ts
│
├── servicio/                # Servicios adicionales (luces, pelota, etc)
├── reserva-servicio/        # Relación muchos a muchos
├── precio/                  # Historial de precios por cancha
├── pago/                    # Gestión de pagos
├── usuario/                 # Gestión de usuarios
├── localidad/               # Localidades
├── tipo_cancha/             # Tipos de cancha
│
├── database/
│   └── connection.ts        # Pool de conexiones MySQL
│
├── shared/
│   └── repository.ts        # Interface base para repositorios
│
├── __tests__/               # Tests unitarios e integración
│   ├── setup.ts
│   ├── unit/                # Tests unitarios
│   └── integration/         # Tests de integración
│
├── app.ts                   # Configuración Express y rutas
└── swagger.ts               # Documentación OpenAPI
```

---

## Scripts Disponibles

```bash
# Desarrollo con hot-reload
pnpm start:dev

# Desarrollo (alternativo)
pnpm dev

# Compilar TypeScript a JavaScript
pnpm build

# Modo producción
pnpm start

# Compilar con watch mode
pnpm watch

# Tests
pnpm test                    # Ejecutar todos los tests
pnpm test:watch              # Tests en modo watch
pnpm test:coverage           # Tests con reporte de cobertura
pnpm test:verbose            # Tests con output detallado
```

---

## API Endpoints Principales

### Autenticación (`/api/auth`)

```http
POST   /api/auth/register     # Registrar nuevo usuario
POST   /api/auth/login        # Iniciar sesión (obtener token JWT)
POST   /api/auth/refresh      # Renovar token
```

### Búsqueda y Disponibilidad

```http
GET    /api/buscar-canchas?deporte={deporte}&localidad={localidad}&fecha={fecha}
GET    /api/disponibilidad?id_cancha={id}&fecha={fecha}
```

### Canchas

```http
GET    /api/canchas           # Listar todas las canchas
GET    /api/canchas/:id       # Obtener cancha específica
POST   /api/canchas           # Crear cancha (requiere admin)
PUT    /api/canchas/:id       # Actualizar cancha (requiere admin)
DELETE /api/canchas/:id       # Eliminar cancha (requiere admin)
```

### Reservas

```http
GET    /api/reservas          # Listar reservas
GET    /api/reservas/:id      # Obtener reserva específica
POST   /api/reservas          # Crear reserva (calcula precio automático)
PUT    /api/reservas/:id      # Actualizar reserva
DELETE /api/reservas/:id      # Cancelar reserva
```

### Usuarios

```http
GET    /api/usuarios          # Listar usuarios (requiere admin)
GET    /api/usuarios/:id      # Obtener usuario (requiere auth)
POST   /api/usuarios          # Crear usuario (requiere admin)
PUT    /api/usuarios/:id      # Actualizar usuario
DELETE /api/usuarios/:id      # Eliminar usuario (requiere admin)
```

### Otros Recursos

- **Localidades:** `/api/localidades`
- **Tipos de Cancha:** `/api/tipo-canchas`
- **Servicios:** `/api/servicios`
- **Precios:** `/api/precios`
- **Pagos:** `/api/pagos`

### Documentación Swagger

```http
GET    /api/docs              # Documentación interactiva OpenAPI
```

---

## Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para autenticación.

### Obtener un token

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "cliente",
  "password": "cliente123"
}
```

Respuesta:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id_usuario": 1,
    "username": "cliente",
    "nombre": "Juan",
    "rol": "cliente"
  }
}
```

### Usar el token

Incluir el token en el header `Authorization` de las peticiones protegidas:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles y permisos

- **Cliente:** Puede crear reservas, ver sus propios datos, buscar canchas
- **Administrador:** Acceso completo, puede crear/editar/eliminar recursos

---

## Ejemplos de Uso

### 1. Buscar canchas disponibles

```bash
GET /api/buscar-canchas?deporte=futbol&localidad=Resistencia&fecha=2026-03-15
```

Retorna lista de canchas con sus horarios disponibles.

### 2. Consultar horarios disponibles

```bash
GET /api/disponibilidad?id_cancha=1&fecha=2026-03-15
```

Retorna franjas horarias disponibles:

```json
[
  { "hora_inicio": "08:00:00", "hora_fin": "09:00:00", "disponible": true },
  { "hora_inicio": "09:00:00", "hora_fin": "10:00:00", "disponible": false },
  { "hora_inicio": "10:00:00", "hora_fin": "11:00:00", "disponible": true }
]
```

### 3. Crear una reserva

```bash
POST /api/reservas
Authorization: Bearer {token}
Content-Type: application/json

{
  "id_cancha": 1,
  "id_usuario": 2,
  "fecha": "2026-03-15",
  "hora_inicio": "10:00:00",
  "hora_fin": "12:00:00",
  "id_servicios": [1, 3]  // Opcional: IDs de servicios adicionales
}
```

El sistema calculará automáticamente:
- Precio por hora de la cancha (según fechas de vigencia)
- Cantidad de horas
- Precio de servicios adicionales
- **Precio total**

---

## Testing

El proyecto incluye tests unitarios e integración con Jest.

### Ejecutar tests

```bash
# Todos los tests
pnpm test

# Con coverage
pnpm test:coverage

# Modo watch (útil durante desarrollo)
pnpm test:watch
```

### Estructura de tests

```
src/__tests__/
├── setup.ts                          # Configuración global
├── unit/                             # Tests unitarios
│   ├── jwt.service.test.ts          # Tests del servicio JWT
│   └── auth.middleware.test.ts      # Tests de middleware
└── integration/                      # Tests de integración
    └── auth.routes.test.ts          # Tests de endpoints
```

### Configuración de tests

- **Framework:** Jest
- **Preset:** ts-jest con soporte ESM
- **Timeout:** 10 segundos
- **Environment:** Node.js
- **Coverage:** Todos los archivos `.ts` excepto interfaces

Ver [jest.config.js](jest.config.js) para configuración completa.

---

## Usuarios de Prueba

Una vez ejecutado el script SQL, tendrás estos usuarios disponibles:

| Usuario    | Contraseña   | Rol             | 
|------------|--------------|-----------------|
| `cliente`  | `cliente123` | Cliente         | 
| `admin`    | `admin123`   | Administrador   | 
| `cliente2` | `cliente321` | Cliente         | 
| `martina`  | `marti123`   | Administrador   | 

---

## Características Técnicas

### Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Autenticación basada en JWT
- Tokens con expiración configurable
- Middleware de autorización por roles
- Validación de ownership (usuarios solo ven sus propios datos)

### Cálculo Automático de Precios

El sistema calcula automáticamente el precio total de una reserva considerando:

1. **Precio por hora:** Busca el precio vigente según la fecha de reserva
2. **Cantidad de horas:** Calcula la diferencia entre hora_inicio y hora_fin
3. **Servicios adicionales:** Suma el precio de cada servicio seleccionado
4. **Total:** Suma todo y redondea a 2 decimales

### Gestión de Disponibilidad

- Consulta horarios disponibles en franjas de 1 hora
- Detecta solapamientos con reservas existentes
- Respeta horarios de apertura/cierre de cada cancha
- Búsqueda combinada por deporte, localidad y fecha

### Base de Datos

- **Motor:** MySQL 8.0
- **Conexiones:** Pool de 10 conexiones simultáneas
- **Encoding:** UTF-8
- **Relaciones:** Foreign keys con integridad referencial
- **Cascadas:** DELETE CASCADE en reserva_servicio

---

## Documentación Adicional

- [ARQUITECTURA.md](ARQUITECTURA.md) - Arquitectura detallada del sistema
- [docs/JWT-IMPLEMENTATION.md](docs/JWT-IMPLEMENTATION.md) - Detalles de implementación JWT
- [docs/mysql-commands.sql](docs/mysql-commands.sql) - Script de base de datos

---

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime
- **TypeScript** - Lenguaje
- **Express** - Framework web
- **MySQL2** - Driver de base de datos

### Seguridad
- **jsonwebtoken** - Generación y verificación de JWT
- **bcrypt** - Hashing de contraseñas

### Testing
- **Jest** - Framework de testing
- **ts-jest** - Transpilación TypeScript para Jest
- **Supertest** - Testing de endpoints HTTP

### Desarrollo
- **tsx** - Ejecución TypeScript con hot-reload
- **dotenv** - Gestión de variables de entorno
- **cors** - Habilitación de CORS
- **swagger-jsdoc / swagger-ui-express** - Documentación API

---

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Licencia

ISC

---

## Contacto

**Repositorio:** [github.com/RamiroFalcon/TP-DSW-Back-End](https://github.com/RamiroFalcon/TP-DSW-Back-End)

