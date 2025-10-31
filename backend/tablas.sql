/* Tabla usuarios*/

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `mail` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `contraseña_hash` varchar(200) COLLATE utf8mb4_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mail_UNIQUE` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci

/* Tabla alumnos*/

CREATE TABLE `alumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `dni` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni_UNIQUE` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci

/* Tabla materias*/

CREATE TABLE `materias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `codigo` int NOT NULL,
  `año` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`),
  UNIQUE KEY `codigo_UNIQUE` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci

/* Tabla notas*/

CREATE TABLE `notas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumnos_id` int NOT NULL,
  `materias_id` int NOT NULL,
  `nota1` int NOT NULL,
  `nota2` int NOT NULL,
  `nota3` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notas_alumnos_idx` (`alumnos_id`),
  KEY `notas_materias_idx` (`materias_id`),
  CONSTRAINT `notas_alumnos` FOREIGN KEY (`alumnos_id`) REFERENCES `alumnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `notas_materias` FOREIGN KEY (`materias_id`) REFERENCES `materias` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci
