CREATE DATABASE IF NOT EXISTS TurnoSport;

use TurnoSport;

CREATE TABLE localidades (
    id_localidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL
);

-- Usuarios genéricos
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    apellido VARCHAR(120) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    email VARCHAR(160)
);

-- Subtipo Cliente (especialización de usuario)
CREATE TABLE clientes (
    id_usuario INT PRIMARY KEY,
    direccion VARCHAR(180),
    id_localidad INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    FOREIGN KEY (id_localidad) REFERENCES localidades (id_localidad)
);

-- Subtipo Administrador (especialización de usuario)
CREATE TABLE administradores (
    id_usuario INT PRIMARY KEY,
    cargo VARCHAR(120),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

-- Tipos de cancha
CREATE TABLE tipo_canchas (
    id_tipo_cancha INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    deporte VARCHAR(120) NOT NULL
);

-- Canchas
CREATE TABLE canchas (
    id_cancha INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    estado ENUM('Disponible','Reservada','Mantenimiento') DEFAULT 'Disponible',
    id_tipo_cancha INT NOT NULL,
    FOREIGN KEY (id_tipo_cancha) REFERENCES tipo_canchas (id_tipo_cancha)
);

-- Reservas
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cancha INT NOT NULL,
    id_cliente INT NOT NULL,
    fecha DATE NOT NULL,
    hora_ini TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('Pendiente','Confirmada','Cancelada','Finalizada') DEFAULT 'Pendiente',
    CHECK (hora_fin > hora_ini),
    FOREIGN KEY (id_cancha) REFERENCES canchas (id_cancha),
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_usuario)
);

-- Localidades
INSERT INTO localidades (id_localidad, nombre) VALUES
    (1, 'Rosario'),
    (2, 'Funes');

-- Usuarios base
INSERT INTO usuarios (id_usuario, nombre, apellido, dni, telefono, email) VALUES
    (1, 'Juan', 'Pérez', '30123456', '+54 341 5551111', 'juan.perez@example.com'),
    (2, 'María', 'Gómez', '32123457', '+54 341 5552222', 'maria.gomez@example.com'),
    (3, 'Lucía', 'Fernández', '33123458', '+54 341 5553333', 'lucia.fernandez@example.com');

-- Clientes (subtipo de usuario)
INSERT INTO clientes (id_usuario, direccion, id_localidad) VALUES
    (1, 'San Martín 123', 1),
    (2, 'Belgrano 456', 2);

-- Administrador (subtipo de usuario)
INSERT INTO administradores (id_usuario, cargo) VALUES
    (3, 'Encargado General');

-- Tipos de cancha
INSERT INTO tipo_canchas (id_tipo_cancha, nombre, deporte) VALUES
    (1, 'Fútbol 5', 'Fútbol'),
    (2, 'Pádel Techada', 'Pádel');

-- Canchas
INSERT INTO canchas (id_cancha, nombre, estado, id_tipo_cancha) VALUES
    (1, 'Cancha 1 F5', 'Disponible', 1),
    (2, 'Cancha Pádel Norte', 'Disponible', 2);


-- Reservas
INSERT INTO reservas (id_reserva, id_cancha, id_cliente, fecha, hora_ini, hora_fin, estado) VALUES
    (1, 1, 1, '2024-05-10', '18:00:00', '19:30:00', 'Confirmada'),
    (2, 2, 2, '2024-05-11', '20:00:00', '21:30:00', 'Pendiente');

