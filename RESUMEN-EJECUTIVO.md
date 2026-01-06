# 📋 RESUMEN EJECUTIVO DEL BACKEND

## 🎯 ¿Qué hace este backend?

Sistema de gestión de **reservas de canchas deportivas** con las siguientes funcionalidades principales:

### Funcionalidades Core
1. **Gestión de Usuarios** (CRUD completo)
   - Registro de clientes y administradores
   - Autenticación básica (⚠️ sin JWT ni bcrypt)
   - Roles: CLIENTE y ADMINISTRADOR

2. **Sistema de Reservas** (Lógica compleja)
   - Reservar canchas por fecha y horario
   - **Cálculo automático de precio** basado en:
     - Precio por hora de la cancha
     - Cantidad de horas reservadas
     - Servicios adicionales (luces, vestuario, etc.)
   - Sistema de precios históricos (vigencias)

3. **Búsqueda de Canchas**
   - Filtrar por localidad, deporte, tipo (fútbol 5/7/11)
   - Ver disponibilidad en tiempo real

4. **Servicios Adicionales**
   - Relación many-to-many con reservas
   - Ejemplos: iluminación, vestuarios, parrilla

5. **Gestión de Disponibilidad**
   - Ver horarios libres por día (franjas de 1 hora)
   - Detección automática de conflictos

6. **Pagos**
   - Registro de pagos de reservas
   - Estados: pendiente/completado

---

## 🏗️ Arquitectura del Sistema

### Estructura de Capas (Layered Architecture)

```
┌─────────────────────────────────────────┐
│          app.ts (Entry Point)           │
│  - Configura Express                    │
│  - Registra rutas de todos los módulos  │
└──────────────────┬──────────────────────┘
                   │
     ┌─────────────┴─────────────┐
     │    CAPA DE RUTAS          │
     │  usuario.routes.ts        │
     │  - Define endpoints HTTP  │
     │  - Inyecta dependencias   │
     └──────────┬────────────────┘
                │
     ┌──────────┴─────────────┐
     │   CAPA CONTROLLER      │
     │  usuario.controller.ts │
     │  - Maneja req/res HTTP │
     │  - Valida parámetros   │
     │  - Retorna códigos HTTP│
     └──────────┬─────────────┘
                │
     ┌──────────┴──────────────┐
     │   CAPA SERVICE          │
     │  usuario.ts             │
     │  - Lógica de negocio    │
     │  - Validaciones         │
     │  - Orquesta repositorios│
     └──────────┬──────────────┘
                │
     ┌──────────┴───────────────┐
     │   CAPA REPOSITORY        │
     │  usuario.repository.ts   │
     │  - Acceso a base de datos│
     │  - Queries SQL           │
     │  - Abstracción de BD     │
     └──────────┬───────────────┘
                │
     ┌──────────┴────────────┐
     │    BASE DE DATOS      │
     │     MySQL 8.0         │
     │  - 9 tablas           │
     │  - Relaciones FK      │
     └───────────────────────┘
```

### Flujo de una Petición (Ejemplo: GET /api/usuarios/1)

```
1. Cliente HTTP → GET /api/usuarios/1

2. app.ts → encuentra ruta registrada: /api/usuarios

3. usuario.routes.ts → mapea GET /id/:id al controller

4. usuario.controller.ts → obtenerPorId()
   - Lee req.params.id (convierte a number)
   - Llama al service

5. usuario.ts (Service) → obtenerPorId()
   - Valida que existe el usuario
   - Llama al repository

6. usuario.repository.ts → findById()
   - Ejecuta: SELECT * FROM usuario WHERE id_usuario = ?
   - Retorna el usuario o null

7. Respuesta sube por las capas:
   Repository → Service → Controller

8. Controller formatea respuesta:
   {success: true, data: {id_usuario: 1, nombre: "Juan", ...}}

9. Express envía JSON al cliente ← 200 OK
```

---

## 🗄️ Modelo de Base de Datos

### Tablas Principales

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   USUARIO   │         │   RESERVA    │         │   CANCHA    │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id_usuario  │◄────────│ id_usuario   │─────────► id_cancha   │
│ nombre      │         │ id_cancha    │         │ nombre      │
│ email       │         │ fecha        │         │ precio      │
│ password    │         │ hora_inicio  │         │ ubicacion   │
│ rol         │         │ hora_fin     │         │ id_tipo     │
└─────────────┘         │ precio_total │         │ id_localidad│
                        └──────┬───────┘         └──────┬──────┘
                               │                        │
                               │                 ┌──────┴──────┐
                        ┌──────┴─────────┐      │ TIPO_CANCHA │
                        │ RESERVA_SERVICIO│      ├─────────────┤
                        ├────────────────┤      │ id_tipo     │
                        │ id_reserva     │      │ nombre      │
                        │ id_servicio    │      │ deporte     │
                        └─────┬──────────┘      │ jugadores   │
                              │                  └─────────────┘
                       ┌──────┴──────┐
                       │  SERVICIO   │         ┌─────────────┐
                       ├─────────────┤         │   PRECIO    │
                       │ id_servicio │         ├─────────────┤
                       │ nombre      │         │ id_cancha   │
                       │ precio      │         │ valor_por_  │
                       └─────────────┘         │   hora      │
                                               │ fecha_      │
                                               │   vigencia  │
                                               └─────────────┘
```

### Relaciones Clave

- **Usuario 1:N Reserva** - Un usuario puede tener muchas reservas
- **Cancha 1:N Reserva** - Una cancha puede tener muchas reservas
- **Reserva N:M Servicio** - Una reserva puede tener múltiples servicios
- **Cancha N:1 TipoCancha** - Cada cancha tiene un tipo (fútbol 5/7/11)
- **Cancha 1:N Precio** - Una cancha puede tener múltiples precios históricos

---

## 💡 Conceptos Técnicos Importantes

### 1. Repository Pattern
**¿Qué es?** Encapsula TODA la lógica de acceso a datos en una clase separada.

**Ventajas:**
- Cambiar de MySQL a PostgreSQL solo requiere modificar repositorios
- Facilita testing (puedes mockear el repository)
- Centraliza queries SQL

**Ejemplo:**
```typescript
// ❌ MALO: Controller con SQL directo
async obtenerUsuario(req, res) {
  const [rows] = await pool.query('SELECT * FROM usuario WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
}

// ✅ BUENO: Controller usa repository
async obtenerUsuario(req, res) {
  const usuario = await this.service.obtenerPorId(req.params.id);
  res.json({success: true, data: usuario});
}
```

### 2. Dependency Injection (DI) Manual
**¿Qué es?** En vez de crear instancias dentro de clases, se inyectan desde afuera.

**Implementación actual:**
```typescript
// usuario.routes.ts
const repository = new UsuarioRepository();
const service = new UsuarioService(repository);
const controller = new UsuarioController(service);
```

**Ventajas:**
- Control del ciclo de vida de objetos
- Facilita testing (inyectar mocks)
- Desacoplamiento de clases

### 3. DTO (Data Transfer Object)
**¿Qué es?** Interfaces TypeScript que definen la forma de los datos.

**Ejemplo:**
```typescript
export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  password: string; // Se retorna sin este campo
  rol: RolUsuario;
}

export interface UsuarioCreate {
  nombre: string;
  email: string;
  password: string;
  // Sin id_usuario (auto-increment)
}
```

**Ventajas:**
- Validación de tipos en compilación
- Autocomplete en VS Code
- Documentación implícita

### 4. Environment Variables (.env)
**¿Por qué?** Separar configuración del código.

**Ejemplo:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mi_password_secreta
```

**Ventajas:**
- No commitear credenciales en Git
- Diferentes configuraciones por entorno (dev/prod)
- Seguridad mejorada

---

## 🔍 Algoritmos Clave del Sistema

### 1. Cálculo de Precio de Reserva
**Ubicación:** `src/reserva/reserva.ts` → `calcularPrecioTotal()`

**Fórmula:**
```
PRECIO_TOTAL = (PRECIO_CANCHA_POR_HORA × HORAS) + SUMA_SERVICIOS
```

**Ejemplo:**
```
Cancha: $2000/hora
Horario: 14:00 a 16:00 (2 horas)
Servicios: Luces ($500) + Vestuario ($300)

Cálculo:
- Cancha: 2000 × 2 = $4000
- Servicios: 500 + 300 = $800
- TOTAL: $4800
```

**Código simplificado:**
```typescript
const horas = calcularHoras('14:00:00', '16:00:00'); // 2
const precioPorHora = await obtenerPrecioVigente(id_cancha, fecha); // 2000
const precioCancha = precioPorHora * horas; // 4000

const precioServicios = servicios.reduce((sum, s) => sum + s.precio, 0); // 800

const total = precioCancha + precioServicios; // 4800
```

### 2. Sistema de Precios Históricos
**Ubicación:** `src/reserva/reserva.ts` → `obtenerPrecioVigente()`

**Problema:** Una cancha puede cambiar de precio en el tiempo (temporada alta, inflación, etc.)

**Solución:** Tabla `precio` con campo `fecha_vigencia`

**Query:**
```sql
SELECT valor_por_hora 
FROM precio 
WHERE id_cancha = ? AND fecha_vigencia <= '2024-06-15'
ORDER BY fecha_vigencia DESC 
LIMIT 1
```

**Ejemplo:**
```
Precios en BD:
- 2024-01-01: $1000
- 2024-06-01: $1200
- 2024-07-01: $1500

Si reservo para 2024-06-15:
→ Se usa $1200 (el más reciente antes/igual a la fecha)
```

### 3. Detección de Disponibilidad
**Ubicación:** `src/disponibilidad/disponibilidad.service.ts`

**Objetivo:** Determinar qué horarios están libres en una cancha.

**Algoritmo:**
1. Generar todas las franjas de 1 hora del día (08:00-09:00, 09:00-10:00, ...)
2. Para cada franja, verificar si colisiona con reservas existentes
3. Marcar como disponible/ocupada

**Fórmula de superposición:**
```
Dos franjas se superponen si:
inicio1 < fin2 AND fin1 > inicio2
```

**Ejemplo visual:**
```
Reserva existente: ████████████ (14:00 - 16:00)

Franjas:
13:00-14:00 [✅ LIBRE]  ┃     inicio=13, fin=14
14:00-15:00 [❌ OCUPADA]┃████ inicio=14, fin=15  ← se superpone
15:00-16:00 [❌ OCUPADA]┃████ inicio=15, fin=16  ← se superpone
16:00-17:00 [✅ LIBRE]  ┃     inicio=16, fin=17
```

**Código:**
```typescript
const conflicto = reservas.find(reserva => {
  const reservaInicio = timeToMinutes(reserva.hora_inicio); // 14:00 → 840
  const reservaFin = timeToMinutes(reserva.hora_fin);       // 16:00 → 960
  const franjaInicio = hora * 60;    // 15 → 900
  const franjaFin = (hora + 1) * 60; // 16 → 960

  // ¿Se superponen? 900 < 960 AND 960 > 840 = true ❌ ocupada
  return franjaInicio < reservaFin && franjaFin > reservaInicio;
});
```

---

## ⚠️ Problemas de Seguridad Actuales

### 1. Contraseñas en Texto Plano
**Ubicación:** `src/auth/auth.service.ts`

**Problema:**
```typescript
// ❌ Contraseña guardada como "mipassword123"
if (usuario.password !== datos.password) {
  throw new Error('Contraseña incorrecta');
}
```

**Solución recomendada:**
```typescript
import bcrypt from 'bcrypt';

// Al registrar usuario:
const hashedPassword = await bcrypt.hash(password, 10);

// Al hacer login:
const match = await bcrypt.compare(passwordIngresada, usuario.password_hash);
```

### 2. Sin JWT (JSON Web Tokens)
**Problema:** No hay sistema de sesión/autenticación.

**Solución recomendada:**
```typescript
import jwt from 'jsonwebtoken';

// Al login exitoso:
const token = jwt.sign(
  {id: usuario.id, username: usuario.username, rol: usuario.rol},
  process.env.JWT_SECRET,
  {expiresIn: '24h'}
);

// En cada request protegido:
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 3. Falta Validación de Entrada
**Problema:** No se validan emails, longitud de passwords, etc.

**Solución recomendada:**
- Usar librerías como `joi` o `class-validator`
- Validar en el Service antes de guardar

---

## 🚀 Mejoras Pendientes

### Alta Prioridad
1. ✅ Variables de entorno (.env) → **YA IMPLEMENTADO**
2. ❌ Implementar bcrypt para passwords
3. ❌ Implementar JWT para autenticación
4. ❌ Validación de datos de entrada (joi/class-validator)
5. ❌ Manejo de transacciones en reservas (atomicidad)

### Media Prioridad
6. ❌ Middleware de autorización por roles
7. ❌ Paginación en listados (GET /api/usuarios?page=1&limit=10)
8. ❌ Logging con Winston/Morgan
9. ❌ Rate limiting (prevenir spam de requests)

### Baja Prioridad
10. ❌ Tests unitarios (Jest)
11. ❌ Documentación Swagger/OpenAPI
12. ❌ Migrations de base de datos (TypeORM/Prisma)
13. ❌ Optimización de queries (índices en BD)

---

## 📚 Guías de Lectura del Código

### Para entender el flujo completo:
1. **Empieza con:** `README.md` → Instrucciones de instalación
2. **Luego lee:** `ARQUITECTURA.md` → Visión general del sistema
3. **Estudia un módulo completo:** `src/usuario/`
   - `usuario.entity.ts` → Tipos/interfaces
   - `usuario.routes.ts` → Rutas HTTP
   - `usuario.controller.ts` → Manejo de HTTP
   - `usuario.ts` → Lógica de negocio
   - `usuario.repository.ts` → Queries SQL

### Para entender la lógica de negocio compleja:
1. **Sistema de precios:** `src/reserva/reserva.ts`
   - Lee `calcularPrecioTotal()` 
   - Lee `obtenerPrecioVigente()`

2. **Disponibilidad:** `src/disponibilidad/disponibilidad.service.ts`
   - Lee `obtenerHorariosDisponibles()`
   - Entiende el algoritmo de superposición

3. **Autenticación:** `src/auth/auth.service.ts`
   - Nota los comentarios de mejoras de seguridad

### Para modificar el código:
1. **Agregar nuevo campo a usuario:**
   - Modificar: `usuario.entity.ts` (interfaces)
   - Modificar: `usuario.repository.ts` (queries SQL)
   - Actualizar: Base de datos (ALTER TABLE)

2. **Agregar nueva funcionalidad:**
   - Seguir patrón: Routes → Controller → Service → Repository
   - Registrar ruta en `app.ts`

---

## 🎓 Conceptos para el TP

### ¿Qué hace único a este proyecto?
- **Sistema de precios dinámico** (vigencias)
- **Algoritmo de disponibilidad** (detección de conflictos)
- **Relación many-to-many** (reservas-servicios)
- **Arquitectura en capas** (separación de responsabilidades)

### ¿Qué patrones de diseño se usan?
- **Repository Pattern** (acceso a datos)
- **Dependency Injection** (manual, sin framework)
- **DTO Pattern** (interfaces TypeScript)
- **Layered Architecture** (Routes/Controller/Service/Repository)

### ¿Qué tecnologías se usan?
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** MySQL 8.0
- **ORM:** Ninguno (SQL raw con mysql2)
- **Autenticación:** Básica (⚠️ insegura)

---

## 📞 Contacto y Recursos

- **Repositorio:** (agregar URL del repo)
- **Documentación completa:** Ver `ARQUITECTURA.md`
- **Base de datos:** Ver `docs/dsw.sql`
- **Tests de API:** Ver `*.http` en cada carpeta de módulo
