# 🏗️ Arquitectura del Backend - Sistema de Reservas de Canchas

## 📚 Índice
1. [Visión General](#visión-general)
2. [Arquitectura en Capas](#arquitectura-en-capas)
3. [Flujo de una Request](#flujo-de-una-request)
4. [Módulos Principales](#módulos-principales)
5. [Patrones de Diseño](#patrones-de-diseño)

---

## 🎯 Visión General

Este backend implementa un **sistema de gestión de reservas de canchas deportivas** usando:
- **Node.js + TypeScript** para el runtime y lenguaje
- **Express** como framework web
- **MySQL** como base de datos relacional
- **Patrón Repository** para acceso a datos

### Características Principales:
✅ API REST completa con 12 módulos  
✅ Arquitectura en capas (Routes → Controller → Service → Repository)  
✅ Cálculo automático de precios con servicios adicionales  
✅ Gestión de disponibilidad de horarios  
✅ Sistema de autenticación básico  
✅ Relaciones muchos a muchos (reserva-servicio)  

---

## 🏛️ Arquitectura en Capas

El proyecto sigue una **arquitectura en capas** (Layered Architecture) con separación de responsabilidades:

```
┌─────────────────────────────────────────────┐
│           CLIENTE (Frontend)                │
└─────────────────────────────────────────────┘
                    ↓ HTTP Request
┌─────────────────────────────────────────────┐
│  1. ROUTES LAYER (usuario.routes.ts)       │  ← Define las rutas URL
│     - Define endpoints (GET, POST, etc)     │
│     - Mapea URL a Controller                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  2. CONTROLLER LAYER (usuario.controller.ts)│  ← Maneja HTTP
│     - Valida entrada                        │
│     - Maneja Request/Response               │
│     - Envía respuestas al cliente           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  3. SERVICE LAYER (usuario.ts)              │  ← Lógica de negocio
│     - Reglas de negocio                     │
│     - Validaciones complejas                │
│     - Coordina múltiples repositorios       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  4. REPOSITORY LAYER (usuario.repository.ts)│  ← Acceso a datos
│     - Consultas SQL                         │
│     - Operaciones CRUD                      │
│     - Interacción directa con BD            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         BASE DE DATOS (MySQL)               │
└─────────────────────────────────────────────┘
```

### Ventajas de esta arquitectura:
✅ **Separación de responsabilidades** - Cada capa tiene un propósito claro  
✅ **Facilita testing** - Puedes testear cada capa independientemente  
✅ **Mantenibilidad** - Cambios en una capa no afectan las demás  
✅ **Reutilización** - Services pueden ser usados por múltiples controllers  

---

## 🔄 Flujo de una Request (Ejemplo: Crear Usuario)

Veamos cómo fluye una petición paso a paso:

### 1️⃣ **Cliente hace una petición:**
```http
POST /api/usuarios
Content-Type: application/json

{
  "dni": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@mail.com",
  "username": "juanp",
  "password": "pass123",
  "rol": "cliente",
  "id_localidad": 1
}
```

### 2️⃣ **Routes recibe y rutea** (`usuario.routes.ts`)
```typescript
// Mapea POST /api/usuarios al método crear del controller
router.post('/', controller.crear);
```

### 3️⃣ **Controller procesa** (`usuario.controller.ts`)
```typescript
crear = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extrae el body de la request
    const usuario = await this.service.crearUsuario(req.body);
    
    // Devuelve respuesta exitosa con código 201
    res.status(201).json({
      success: true,
      data: usuario,
      message: 'Usuario creado exitosamente'
    });
  } catch (error) {
    // Maneja errores y devuelve 400
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
```

### 4️⃣ **Service ejecuta lógica** (`usuario.ts`)
```typescript
async crearUsuario(data: UsuarioCreate): Promise<Usuario> {
  // Aquí podrías agregar validaciones adicionales
  // Por ejemplo: verificar que el DNI no exista
  return this.repository.create(data);
}
```

### 5️⃣ **Repository interactúa con BD** (`usuario.repository.ts`)
```typescript
async create(data: UsuarioCreate): Promise<Usuario> {
  // Validar campos obligatorios
  if (!data.email || !data.username || !data.password) {
    throw new Error('Email, username y password son obligatorios');
  }

  // Ejecutar INSERT en MySQL
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO usuario (dni, nombre, ...) VALUES (?, ?, ...)',
    [data.dni, data.nombre, ...]
  );
  
  // Retornar el usuario creado con su ID
  return { id_usuario: result.insertId, ...data };
}
```

### 6️⃣ **Respuesta al cliente:**
```json
{
  "success": true,
  "data": {
    "id_usuario": 5,
    "dni": "12345678",
    "nombre": "Juan",
    "apellido": "Pérez",
    ...
  },
  "message": "Usuario creado exitosamente"
}
```

---

## 📦 Módulos Principales

### 1. **Usuario** (`src/usuario/`)
**Propósito:** Gestión de usuarios del sistema (clientes y administradores)

**Archivos clave:**
- `usuario.entity.ts` - Interfaces y tipos de datos
- `usuario.routes.ts` - Endpoints HTTP
- `usuario.controller.ts` - Manejo de requests
- `usuario.ts` (Service) - Lógica de negocio
- `usuario.repository.ts` - Consultas SQL

**Endpoints principales:**
```
POST   /api/usuarios              → Crear usuario
GET    /api/usuarios              → Listar todos
GET    /api/usuarios/id/:id       → Buscar por ID
GET    /api/usuarios/dni/:dni     → Buscar por DNI
GET    /api/usuarios/rol/:rol     → Filtrar por rol
PUT    /api/usuarios/:id          → Actualizar
DELETE /api/usuarios/:id          → Eliminar
```

**Conceptos importantes:**
- Usa **enum** para los roles (cliente/administrador)
- DTOs separados para Create, Update y Login
- Validación de campos obligatorios en Repository

---

### 2. **Reserva** (`src/reserva/`)
**Propósito:** Gestión de reservas de canchas con cálculo de precios

**Lógica de negocio compleja:**

#### 🧮 Cálculo Automático de Precios
```typescript
// Fórmula: Precio Total = Precio Cancha + Precio Servicios
// Precio Cancha = Precio por Hora × Cantidad de Horas

private async calcularPrecioTotal(data): Promise<number> {
  let precio_total = 0;

  // 1. Calcular precio de la cancha
  const precioPorHora = await this.obtenerPrecioVigente(...);
  const horas = this.calcularHoras(...);
  precio_total += precioPorHora * horas;

  // 2. Sumar precios de servicios adicionales
  if (data.id_servicios) {
    const sumaServicios = await consultarPreciosServicios(...);
    precio_total += sumaServicios;
  }

  return precio_total;
}
```

#### 📅 Gestión de Precios con Vigencia
```typescript
// Los precios pueden cambiar en el tiempo
// Se busca el precio más reciente anterior a la fecha de reserva
private async obtenerPrecioVigente(id_cancha, fecha): Promise<number> {
  // SELECT precio WHERE fecha_vigencia <= fecha_reserva
  // ORDER BY fecha_vigencia DESC LIMIT 1
}
```

**Endpoints principales:**
```
POST   /api/reservas                    → Crear reserva (calcula precio auto)
GET    /api/reservas                    → Listar todas con detalles
GET    /api/reservas/:id                → Obtener una con servicios
PUT    /api/reservas/:id                → Actualizar y recalcular precio
DELETE /api/reservas/:id                → Eliminar
POST   /api/reservas/calcular-precio    → Calcular precio en tiempo real
POST   /api/reservas/:id/servicios      → Agregar servicios
DELETE /api/reservas/:id/servicios/:sid → Quitar servicio
```

**Flujo de crear reserva:**
1. Cliente envía datos (cancha, fecha, horario, servicios)
2. Service calcula automáticamente el precio total
3. Repository guarda la reserva con el precio calculado
4. Si hay servicios, crea relaciones en tabla `reserva_servicio`

---

### 3. **Disponibilidad** (`src/disponibilidad/`)
**Propósito:** Consultar horarios disponibles de una cancha

**Algoritmo de disponibilidad:**
```typescript
async obtenerHorariosDisponibles(id_cancha, fecha) {
  // 1. Obtener todas las reservas del día
  const reservasDelDia = await obtenerReservas(...);
  
  // 2. Generar franjas de 1 hora (08:00 a 22:00)
  const franjas = [];
  for (let hora = 8; hora < 22; hora++) {
    // 3. Verificar si la franja está ocupada
    const ocupada = reservasDelDia.some(reserva => 
      hayConflictoDeHorario(franja, reserva)
    );
    
    franjas.push({
      hora_inicio: `${hora}:00`,
      hora_fin: `${hora+1}:00`,
      disponible: !ocupada
    });
  }
  
  return franjas;
}
```

**Respuesta ejemplo:**
```json
[
  { "hora_inicio": "08:00", "hora_fin": "09:00", "disponible": true },
  { "hora_inicio": "09:00", "hora_fin": "10:00", "disponible": false },
  { "hora_inicio": "10:00", "hora_fin": "11:00", "disponible": true },
  ...
]
```

---

### 4. **Auth** (`src/auth/`)
**Propósito:** Autenticación de usuarios

**Flujo de login:**
```typescript
async login(datos: LoginDto) {
  // 1. Buscar usuario por username
  const usuario = await this.usuarioRepository.findByUsername(username);
  
  // 2. Verificar que existe
  if (!usuario) throw new Error('Credenciales incorrectas');
  
  // 3. Comparar contraseña (⚠️ en texto plano, debería usar hash)
  if (usuario.password !== datos.password) {
    throw new Error('Credenciales incorrectas');
  }
  
  // 4. Retornar usuario SIN la contraseña
  const { password, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
}
```

⚠️ **Nota de seguridad:** Actualmente las contraseñas se guardan en texto plano. En producción deberías usar **bcrypt** para hashearlas.

---

### 5. **Cancha** (`src/cancha/`)
**Propósito:** Gestión de canchas deportivas

**Relaciones:**
- Pertenece a un `tipo_cancha` (fútbol 5, tenis, etc)
- Pertenece a una `localidad`
- Tiene múltiples `precios` con vigencia
- Tiene múltiples `reservas`

**Campos importantes:**
```typescript
interface Cancha {
  id_cancha: number;
  nombre: string;
  estado: string;           // disponible, mantenimiento
  id_tipo: number;          // FK a tipo_cancha
  id_localidad: number;     // FK a localidad
  hora_apertura: string;    // 08:00:00
  hora_cierre: string;      // 22:00:00
}
```

---

### 6. **Servicio** (`src/servicio/`)
**Propósito:** Servicios adicionales que se pueden agregar a reservas

**Ejemplos:**
- Estacionamiento ($500)
- Seguridad ($800)
- Filmación de partidos ($1200)
- Alquiler de pecheras ($600)
- Barra de bebidas ($2000)

**Relación con Reserva:**
```
Reserva ←→ Reserva_Servicio ←→ Servicio
(muchos a muchos)
```

---

## 🎨 Patrones de Diseño Utilizados

### 1. **Repository Pattern**
Encapsula el acceso a datos. Todos los queries SQL están en los repositories.

**Ventajas:**
- Separa lógica de negocio del acceso a datos
- Facilita cambiar de BD (por ejemplo, de MySQL a PostgreSQL)
- Simplifica testing con mocks

**Ejemplo:**
```typescript
// Mal ❌ - SQL en el Service
async crearUsuario(data) {
  const result = await pool.query('INSERT INTO usuario...');
}

// Bien ✅ - Delegar en Repository
async crearUsuario(data) {
  return this.repository.create(data);
}
```

---

### 2. **Dependency Injection (Manual)**
Los controllers y services reciben sus dependencias por constructor.

**Ejemplo:**
```typescript
// usuario.routes.ts
const repository = new UsuarioRepository();
const service = new UsuarioService(repository);  // Inyectar repository
const controller = new UsuarioController(service); // Inyectar service
```

**Ventajas:**
- Facilita testing (puedes inyectar mocks)
- Reduce acoplamiento entre clases

---

### 3. **DTO Pattern (Data Transfer Object)**
Interfaces para definir la forma de los datos que viajan entre capas.

**Ejemplo:**
```typescript
// Diferentes DTOs para diferentes operaciones
interface UsuarioCreate { ... }    // Para crear (sin ID)
interface UsuarioUpdate { ... }    // Para actualizar (todo opcional)
interface LoginDto { ... }         // Solo username y password
```

---

### 4. **Service Layer Pattern**
Capa intermedia que contiene toda la lógica de negocio.

**Responsabilidades del Service:**
- Validaciones complejas
- Cálculos (ej: precio total)
- Orquestación de múltiples repositories
- Transformación de datos

---

## 🔌 Conexión a Base de Datos

**Archivo:** `src/database/connection.ts`

```typescript
// Pool de conexiones a MySQL
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tp',
  waitForConnections: true,  // Esperar si no hay conexiones disponibles
  connectionLimit: 10,       // Máximo 10 conexiones simultáneas
  queueLimit: 0             // Sin límite de cola
});
```

**¿Por qué usar un Pool?**
- Reutiliza conexiones en lugar de crear una nueva cada vez
- Mejora el rendimiento
- Maneja automáticamente la concurrencia

---

## 📊 Modelo de Datos (Tablas Principales)

```
┌─────────────┐       ┌──────────────┐
│  localidad  │       │  tipocancha  │
└──────┬──────┘       └───────┬──────┘
       │                      │
       │ 1:N                  │ 1:N
       ↓                      ↓
┌─────────────────────────────────┐
│           cancha                │
│  - id_cancha                    │
│  - nombre                       │
│  - estado                       │
│  - id_tipo (FK)                 │
│  - id_localidad (FK)            │
└──────┬──────────────────┬───────┘
       │ 1:N              │ 1:N
       ↓                  ↓
┌─────────────┐    ┌──────────────┐
│   reserva   │    │    precio    │
│ - fecha     │    │ - valor_hora │
│ - horario   │    │ - vigencia   │
│ - precio_   │    └──────────────┘
│   total     │
└──────┬──────┘
       │ N:M
       ↓
┌──────────────────┐
│ reserva_servicio │ ← Tabla intermedia
└──────┬───────────┘
       │ N:M
       ↓
┌─────────────┐
│  servicio   │
│ - nombre    │
│ - precio    │
└─────────────┘
```

---

## 🚀 Mejores Prácticas Implementadas

✅ **Variables de entorno** - Credenciales en `.env`  
✅ **Manejo de errores** - Try-catch en todos los controllers  
✅ **Respuestas consistentes** - Formato `{ success, data, message }`  
✅ **Validaciones** - En múltiples capas  
✅ **Código tipado** - TypeScript en todo el proyecto  
✅ **Separación de responsabilidades** - Arquitectura en capas  
✅ **Logging** - Console.log para debug (mejorable con winston)  

---

## 🔜 Próximas Mejoras Sugeridas

1. **Seguridad:**
   - Hashear contraseñas con bcrypt
   - Implementar JWT para autenticación
   - Middleware de autenticación

2. **Validación:**
   - Usar librería como Zod o Joi
   - Validar tipos de datos en runtime

3. **Testing:**
   - Tests unitarios (Jest)
   - Tests de integración
   - Cobertura de código

4. **Documentación:**
   - Swagger/OpenAPI para la API
   - JSDoc en funciones complejas

5. **Performance:**
   - Caché con Redis
   - Paginación en listados
   - Índices en BD

6. **Observabilidad:**
   - Logger profesional (Winston)
   - Métricas (Prometheus)
   - Trazas distribuidas

---

## 📖 Recursos de Aprendizaje

- [Express.js Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [MySQL2 Package](https://github.com/sidorares/node-mysql2)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**¿Dudas?** Revisa el código comentado en los archivos o consulta esta guía. 🚀
