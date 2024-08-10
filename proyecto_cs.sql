-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-08-2024 a las 02:32:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_cs`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id_cita` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `informacion_vehiculo` varchar(200) DEFAULT NULL,
  `fecha_planeada` datetime NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `observaciones` varchar(200) DEFAULT 'Sin observaciones'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id_cita`, `id_cliente`, `informacion_vehiculo`, `fecha_planeada`, `fecha_registro`, `observaciones`) VALUES
(10, 16, 'ABC-123, Renault, Rojo, logan', '2024-08-12 08:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(11, 16, 'ABC-123, Renault, Rojo, logan', '2024-08-13 09:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(12, 21, 'DEF-456, Renault, Negro, logan', '2024-08-12 09:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(13, 21, 'DEF-456, Renault, Negro, logan', '2024-08-13 10:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(14, 22, 'GHI-789, Renault, Blanco, logan', '2024-08-12 10:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(15, 22, 'GHI-789, Renault, Blanco, logan', '2024-08-13 11:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(16, 23, 'JKL-012, Renault, Azul, logan', '2024-08-12 11:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(17, 23, 'JKL-012, Renault, Azul, logan', '2024-08-13 14:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(18, 24, 'MNÑ-345, Kia, Rojo, Picanto', '2024-08-12 14:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(19, 24, 'MNÑ-345, Kia, Rojo, Picanto', '2024-08-13 15:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(20, 25, 'OPQ-678, Kia, Negro, Soluto', '2024-08-12 15:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(21, 25, 'OPQ-678, Kia, Negro, Soluto', '2024-08-13 16:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(22, 26, 'RST-901, Kia, Blanco, Picanto', '2024-08-12 16:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(23, 26, 'RST-901, Kia, Blanco, Picanto', '2024-08-14 08:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(24, 27, 'UVW-234, Kia, Azul, Soluto', '2024-08-13 08:00:00', '2024-08-07 20:03:57', 'Sin observaciones'),
(25, 27, 'UVW-234, Kia, Azul, Soluto', '2024-08-14 09:00:00', '2024-08-07 20:03:57', 'Sin observaciones');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mantenimientos`
--

CREATE TABLE `mantenimientos` (
  `id_mantenimiento` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_mecanico` int(11) DEFAULT NULL,
  `informacion_vehiculo` varchar(200) NOT NULL,
  `descripcion_del_mantenimiento` varchar(200) NOT NULL,
  `como_llego` varchar(255) DEFAULT NULL,
  `como_salio` varchar(255) DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT current_timestamp(),
  `fecha_finalizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado` enum('en_proceso','finalizado') DEFAULT 'en_proceso'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mantenimientos`
--

INSERT INTO `mantenimientos` (`id_mantenimiento`, `id_cliente`, `id_mecanico`, `informacion_vehiculo`, `descripcion_del_mantenimiento`, `como_llego`, `como_salio`, `fecha_inicio`, `fecha_finalizacion`, `estado`) VALUES
(11, 16, 15, 'ABC-123, Renault, Rojo, logan', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/1oyaDk8MZs8sGRDEW2gfSAAqzZM1DTpd2/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(12, 21, 15, 'DEF-456, Renault, Negro, logan', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1siJHPAk1AjT5lw9UBvktE7HORCiy5rXl/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(13, 22, 15, 'GHI-789, Renault, Blanco, logan', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/1HsQ_StyQRL65Dgv0v91qZZlu-BkW9auD/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(14, 23, 18, 'JKL-012, Renault, Azul, logan', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1QiUQIeB0Tq32Uje_u_VyhmdTR2iDEEkJ/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(15, 24, 18, 'MNÑ-345, Kia, Rojo, Picanto', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/13D2Zw-afw0z1goRABLfv5-gVcIWsyz5q/view?usp=sharing', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(16, 25, 18, 'OPQ-678, Kia, Negro, Soluto', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1g7srRcNHPpeQnI5eOrvMQga9tbHOf24n/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(17, 26, 19, 'RST-901, Kia, Blanco, Picanto', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/1oyaDk8MZs8sGRDEW2gfSAAqzZM1DTpd2/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(18, 27, 19, 'UVW-234, Kia, Azul, Soluto', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1siJHPAk1AjT5lw9UBvktE7HORCiy5rXl/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(19, 16, 19, 'XYZ-567, Chevrolet, Rojo, Camaro', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/1HsQ_StyQRL65Dgv0v91qZZlu-BkW9auD/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(20, 21, 20, 'JOS-890, Chevrolet, Negro, Aveo', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1QiUQIeB0Tq32Uje_u_VyhmdTR2iDEEkJ/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(21, 22, 20, 'DAR-123, Chevrolet, Blanco, Camaro', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/13D2Zw-afw0z1goRABLfv5-gVcIWsyz5q/view?usp=sharing', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(22, 23, 20, 'XXX-456, Chevrolet, Azul, Aveo', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1g7srRcNHPpeQnI5eOrvMQga9tbHOf24n/view?usp=drive_link', '', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'en_proceso'),
(23, 16, 15, 'ABC-123, Renault, Rojo, logan', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/1oyaDk8MZs8sGRDEW2gfSAAqzZM1DTpd2/view?usp=drive_link', 'https://drive.google.com/file/d/1Kapme8lotg0SOZOZHExitBo4QoJZgJLc/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(24, 21, 15, 'DEF-456, Renault, Negro, logan', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1siJHPAk1AjT5lw9UBvktE7HORCiy5rXl/view?usp=drive_link', 'https://drive.google.com/file/d/1sSHsbbUoICGTbrrIFX1KasU2icAjbpx-/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(25, 22, 15, 'GHI-789, Renault, Blanco, logan', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/1HsQ_StyQRL65Dgv0v91qZZlu-BkW9auD/view?usp=drive_link', 'https://drive.google.com/file/d/1bxVIcfGKFJl-uTZW7UvTC0MUBbq01mhR/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(26, 23, 18, 'JKL-012, Renault, Azul, logan', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1QiUQIeB0Tq32Uje_u_VyhmdTR2iDEEkJ/view?usp=drive_link', 'https://drive.google.com/file/d/1ClareeXxOAWC0d-7XG3q2jECq0yTHlXl/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(27, 24, 18, 'MNÑ-345, Kia, Rojo, Picanto', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/13D2Zw-afw0z1goRABLfv5-gVcIWsyz5q/view?usp=sharing', 'https://drive.google.com/file/d/1Kapme8lotg0SOZOZHExitBo4QoJZgJLc/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(28, 25, 18, 'OPQ-678, Kia, Negro, Soluto', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1g7srRcNHPpeQnI5eOrvMQga9tbHOf24n/view?usp=drive_link', 'https://drive.google.com/file/d/1sSHsbbUoICGTbrrIFX1KasU2icAjbpx-/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(29, 26, 19, 'RST-901, Kia, Blanco, Picanto', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/1oyaDk8MZs8sGRDEW2gfSAAqzZM1DTpd2/view?usp=drive_link', 'https://drive.google.com/file/d/1bxVIcfGKFJl-uTZW7UvTC0MUBbq01mhR/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(30, 27, 19, 'UVW-234, Kia, Azul, Soluto', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1siJHPAk1AjT5lw9UBvktE7HORCiy5rXl/view?usp=drive_link', 'https://drive.google.com/file/d/1ClareeXxOAWC0d-7XG3q2jECq0yTHlXl/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(31, 16, 19, 'XYZ-567, Chevrolet, Rojo, Camaro', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/1HsQ_StyQRL65Dgv0v91qZZlu-BkW9auD/view?usp=drive_link', 'https://drive.google.com/file/d/1Kapme8lotg0SOZOZHExitBo4QoJZgJLc/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(32, 21, 20, 'JOS-890, Chevrolet, Negro, Aveo', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1QiUQIeB0Tq32Uje_u_VyhmdTR2iDEEkJ/view?usp=drive_link', 'https://drive.google.com/file/d/1sSHsbbUoICGTbrrIFX1KasU2icAjbpx-/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(33, 22, 20, 'DAR-123, Chevrolet, Blanco, Camaro', 'Mantenimiento preventivo', 'https://drive.google.com/file/d/13D2Zw-afw0z1goRABLfv5-gVcIWsyz5q/view?usp=sharing', 'https://drive.google.com/file/d/1bxVIcfGKFJl-uTZW7UvTC0MUBbq01mhR/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado'),
(34, 23, 20, 'XXX-456, Chevrolet, Azul, Aveo', 'Mantenimiento correctivo', 'https://drive.google.com/file/d/1g7srRcNHPpeQnI5eOrvMQga9tbHOf24n/view?usp=drive_link', 'https://drive.google.com/file/d/1ClareeXxOAWC0d-7XG3q2jECq0yTHlXl/view?usp=drive_link', '2024-08-07 14:43:31', '2024-08-07 14:43:31', 'finalizado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `numero_telefono` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `rol` enum('cliente','mecanico','administrador') DEFAULT 'cliente',
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `fecha_ultima_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `usuario`, `contraseña`, `nombre_completo`, `numero_telefono`, `email`, `estado`, `rol`, `fecha_registro`, `fecha_ultima_actualizacion`) VALUES
(14, 'Admin', '123456', 'Name - Administrador', '1234567890', 'a@example.com', 'activo', 'administrador', '2024-08-07 12:04:23', '2024-08-07 15:31:03'),
(15, 'Mecanico', '654321', 'Name - Mecanico', '0987654321', 'm@example.com', 'activo', 'mecanico', '2024-08-07 12:04:23', '2024-08-07 18:19:01'),
(16, 'Cliente', '000000', 'Name - Cliente', '0101010101', 'c@example.com', 'activo', 'cliente', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(17, 'Dark', '2005', 'Santiago Macias', '3123694858', 'sm@example.com', 'activo', 'administrador', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(18, 'MWilmer', '2006', 'Wilmer Rueda', '3123456789', 'wgrs@example.com', 'activo', 'mecanico', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(19, 'MGabo', '2005', 'Gabriel Zuluaga', '3123456789', 'gezr@example.com', 'activo', 'mecanico', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(20, 'MJosh', '2004', 'Camilo Hernandez', '3123456789', 'cjht@example.com', 'activo', 'mecanico', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(21, 'CVale', '000001', 'Valentina Cantillo', '3123456789', 'vc@example.com', 'activo', 'cliente', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(22, 'CMalena', '000002', 'Malena Castro', '3123456789', 'mc@example.com', 'activo', 'cliente', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(23, 'CRichard', '000003', 'Richard Gomez', '3123456789', 'rg@example.com', 'activo', 'cliente', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(24, 'CJeffrey', '000004', 'Jeffrey Infante', '31234567899', 'ji@example.com', 'activo', 'cliente', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(25, 'CJean', '000005', 'Jean Macias', '3123456789', 'jm@example.com', 'activo', 'cliente', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(26, 'CXimena', '000006', 'Ximena Marquez', '3123456789', 'xm@example.com', 'activo', 'cliente', '2024-08-07 12:04:23', '2024-08-07 12:04:23'),
(27, 'CBryan', '000007', 'Bryan Fernnadez', '3123456789', 'bf@example.com', 'activo', 'cliente', '2024-08-07 12:04:23', '2024-08-07 12:04:23');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  ADD PRIMARY KEY (`id_mantenimiento`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_mecanico` (`id_mecanico`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  MODIFY `id_mantenimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  ADD CONSTRAINT `mantenimientos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `mantenimientos_ibfk_2` FOREIGN KEY (`id_mecanico`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
