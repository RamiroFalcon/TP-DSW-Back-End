# TP DSW - Backend

Sistema de gestión de reservas de canchas deportivas desarrollado con Node.js, Express y MySQL.

---

##  Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **pnpm** (gestor de paquetes)
- **MySQL** (v8.0 o superior)
- **Git**

---

##  Instalación y Configuración

### 1 Clonar el repositorio

```bash
git clone https://github.com/RamiroFalcon/TP-DSW-Back-End.git
cd TP-DSW-Back-End
```

### 2 Instalar dependencias

```bash
pnpm install
```

### 3 Configurar la base de datos

#### Desde la terminal de MySQL

```bash
# Conectarse a MySQL
mysql -u root -p

# Dentro de MySQL, ejecutar:
CREATE DATABASE tp;
USE tp;
source docs/mysql-commands.sql;
exit;
```


### 4️⃣ Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
# En Linux/Mac
cp .env.example .env

# En Windows (PowerShell)
Copy-Item .env.example .env
```

Editar el archivo `.env` con tus credenciales de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=tp
```

> ⚠️ **Importante:** El archivo `.env` contiene información sensible y NO se sube a GitHub (ya está incluido en `.gitignore`).

### 5 Ejecutar el servidor

```bash
pnpm start:dev
```

Si todo está correcto, verás en la consola:

```
✅ Conexión a MySQL exitosa
✅ Server running on http://localhost:3000
```

---

##  Estructura del Proyecto

```
src/
├── auth/                 # Autenticación y login
├── cancha/              # Gestión de canchas
├── database/            # Configuración de conexión a BD
├── disponibilidad/      # Disponibilidad de canchas
├── localidad/           # Localidades
├── pago/                # Gestión de pagos
├── precio/              # Precios de canchas
├── reserva/             # Reservas
├── servicio/            # Servicios adicionales
├── tipo_cancha/         # Tipos de cancha
├── usuario/             # Gestión de usuarios
└── app.ts               # Punto de entrada de la aplicación
```

---

##  Scripts Disponibles

```bash
# Desarrollo con hot-reload
pnpm start:dev

# Desarrollo (alternativo)
pnpm dev

# Compilar TypeScript a JavaScript
pnpm build
```

---

##  Usuarios de Prueba

Una vez ejecutado el script SQL, tendrás estos usuarios disponibles:

| Usuario    | Contraseña      |  Rol 
|------------|-----------------|-----
| `cliente`  | `cliente123`    | Cliente 
| `admin`    | `admin123`      | Administrador 
| `cliente2` | `cliente321`    | Cliente 
| `martina`  | `marti123`      | Administrador 

---

##  API Endpoints

El servidor expone los siguientes endpoints:

- **Autenticación:** `/api/auth`
- **Usuarios:** `/api/usuarios`
- **Canchas:** `/api/canchas`
- **Tipos de Cancha:** `/api/tipo-canchas`
- **Localidades:** `/api/localidades`
- **Reservas:** `/api/reservas`
- **Precios:** `/api/precios`
- **Servicios:** `/api/servicios`
- **Pagos:** `/api/pagos`
- **Disponibilidad:** `/api/disponibilidad`
- **Búsqueda:** `/api/buscar-canchas`

