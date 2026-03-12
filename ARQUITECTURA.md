# Arquitectura del Backend - Sistema de Reservas de Canchas

## Índice
1. [Visión General](#visión-general)
2. [Arquitectura en Capas](#arquitectura-en-capas)
3. [Módulos del Sistema](#módulos-del-sistema)
4. [Autenticación JWT](#autenticación-jwt)
5. [Base de Datos](#base-de-datos)
6. [Testing](#testing)

---

## Visión General

Sistema de reservas de canchas deportivas construido con:
- **Node.js + TypeScript + Express** - Backend
- **MySQL** - Base de datos
- **JWT + bcrypt** - Autenticación y seguridad
- **Jest** - Testing
- **Patrón Repository** - Acceso a datos

**Principios:** Arquitectura en capas, separación de responsabilidades, código tipado

---

## Arquitectura en Capas

```
Cliente → Routes → Controller → Service → Repository → MySQL
```

**4 Capas principales:**

1. **Routes** - Define endpoints (GET /api/reservas)
2. **Controller** - Maneja HTTP (req/res, status codes)
3. **Service** - Lógica de negocio (cálculos, validaciones)
4. **Repository** - Queries SQL (CRUD)

**Flujo de ejemplo (Crear Reserva):**
```typescript
// 1. Cliente POST /api/reservas con datos
// 2. Routes aplica middleware de autenticación JWT
// 3. Controller extrae req.body y llama service
// 4. Service calcula precio total automáticamente
// 5. Repository ejecuta INSERT y relaciones
// 6. Controller retorna 201 con reserva creada
```

**Ventajas:** Testeable, mantenible, escalable, código organizado

---

## Módulos del Sistema

El backend tiene 12 módulos principales:

### 1. Auth (Autenticación)
- Registro con bcrypt (hash de contraseñas)
- Login y generación de tokens JWT
- Middleware: `authenticateToken`, `requireAdmin`, `requireOwnerOrAdmin`

### 2. Reserva (Sistema de reservas)
**Lógica clave:** Cálculo automático de precio total
```
Precio Total = (Precio/hora × Horas) + Servicios adicionales
```
- Busca precio vigente según fecha
- Calcula duración (hora_fin - hora_inicio)
- Suma servicios extras (luces, pelota, etc)

### 3. Disponibilidad
Genera franjas horarias (8:00-9:00, 9:00-10:00...) y marca ocupadas según reservas existentes
```json
[
  {"hora_inicio": "10:00", "hora_fin": "11:00", "disponible": true},
  {"hora_inicio": "11:00", "hora_fin": "12:00", "disponible": false}
]
```

### 4. Busqueda Cancha
Filtra canchas por deporte, localidad y fecha, retornando horarios disponibles de cada una

### 5. Usuario
CRUD de usuarios con roles (cliente/administrador). Endpoints protegidos por JWT

### 6. Cancha, Servicio, Precio, Pago, Localidad, Tipo Cancha
Módulos CRUD estándar que siguen el patrón Routes→Controller→Service→Repository

---

## Autenticación JWT

### Generación de Token
```typescript
// jwt.service.ts
generateToken(payload: {id_usuario, username, rol}): string
```
Token expira en 24h, firmado con `JWT_SECRET`

### Middleware de Protección
```typescript
// authenticateToken - Verifica token válido
router.get('/perfil', authenticateToken, controller.get);

// requireAdmin - Solo administradores
router.delete('/usuarios/:id', authenticateToken, requireAdmin, controller.delete);

// requireOwnerOrAdmin - Dueño o admin
router.put('/usuarios/:id', authenticateToken, requireOwnerOrAdmin, controller.update);
```

### Flujo de Login
1. Usuario envía username + password
2. Service busca usuario y compara contraseña con bcrypt
3. Si es válido, genera JWT y retorna
4. Cliente guarda token y lo envía en header: `Authorization: Bearer <token>`

---

## Base de Datos

### Conexión MySQL
```typescript
// Pool de 10 conexiones reutilizables
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});
```

### Modelo Relacional Simplificado
```
usuario → reserva ← cancha
           ↓
    reserva_servicio ← servicio
           ↓
         pago

cancha → precio (historial)
cancha → tipo_cancha
cancha → localidad
```

**Relaciones clave:**
- `usuario` 1:N `reserva`
- `cancha` 1:N `reserva`
- `reserva` N:M `servicio` (via reserva_servicio)
- `cancha` 1:N `precio` (vigencia por fecha)

---

## Testing

### Configuración Jest
```javascript
// jest.config.js
{
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
}
```

### Estructura
```
src/__tests__/
├── unit/                    # Tests unitarios
│   ├── jwt.service.test.ts
│   └── auth.middleware.test.ts
└── integration/             # Tests de integración
    └── auth.routes.test.ts
```

### Ejemplo Test Unitario
```typescript
describe('JwtService', () => {
  test('debe generar token válido', () => {
    const token = jwtService.generateToken(payload);
    expect(token.split('.')).toHaveLength(3);
  });
});
```

### Ejecutar Tests
```bash
pnpm test              # Todos los tests
pnpm test:coverage     # Con cobertura
pnpm test:watch        # Modo watch
```

---

## Deployment

### Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tp

JWT_SECRET=clave_secreta_segura
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=production
```

### Opciones de Deploy

**1. VPS/Servidor**
```bash
git clone repo
pnpm install --production
pnpm build
pm2 start dist/app.js
```

**2. Docker**
```yaml
# docker-compose.yml
services:
  backend:
    build: .
    ports: ["3000:3000"]
    depends_on: [mysql]
  mysql:
    image: mysql:8.0
    volumes: [./docs/mysql-commands.sql:/docker-entrypoint-initdb.d/init.sql]
```

**3. Cloud (Railway/Render/Heroku)**
- Conectar repo GitHub
- Configurar variables de entorno
- Deploy automático en cada push

### Consideraciones Producción
- Usar `JWT_SECRET` fuerte y único
- HTTPS obligatorio
- CORS restrictivo (no `*`)
- Rate limiting en endpoints públicos
- Logs estructurados
- Backups diarios de MySQL

---

## Patrones Implementados

**Repository Pattern** - Centraliza SQL en repositorios
```typescript
class CanchaRepository {
  async findAll(): Promise<Cancha[]> {
    const [rows] = await pool.query('SELECT * FROM cancha');
    return rows as Cancha[];
  }
}
```

**DTO Pattern** - Diferentes interfaces según operación
```typescript
interface CanchaCreate { ... }   // Para crear (sin ID)
interface CanchaUpdate { ... }   // Para actualizar (todo opcional)
```

**Dependency Injection** - Inyectar dependencias por constructor
```typescript
class ReservaService {
  constructor(private repository: ReservaRepository) {}
}
```

---

## Conclusión

Arquitectura sólida en capas que separa responsabilidades claramente. Usa autenticación JWT, cálculo automático de precios, consulta de disponibilidad en tiempo real, y está preparada para escalar agregando nuevos módulos o migrando a TypeORM.

**Documentación relacionada:**
- [README.md](README.md) - Guía de instalación y uso
- [docs/JWT-IMPLEMENTATION.md](docs/JWT-IMPLEMENTATION.md) - Detalles de autenticación
- [docs/mysql-commands.sql](docs/mysql-commands.sql) - Schema de base de datos

