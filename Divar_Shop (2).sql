-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 27, 2022 at 05:34 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Divar_Shop`
--
CREATE DATABASE IF NOT EXISTS `Divar_Shop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `Divar_Shop`;

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(1000) NOT NULL,
  `link` varchar(1000) NOT NULL,
  `parent` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`id`, `name`, `icon`, `link`, `parent`) VALUES
(1, ' کامپیوتر و لوازم جانبی', 'fa-duotone fa-house-chimney', '/prod?id=1', 0),
(2, 'تجهیزات شبکه', 'fa-duotone fa-house-chimney', '/prod?id=2', 0),
(3, 'الکترونیکی و ماشین های اداری', 'fa-duotone fa-house-chimney', '/prod?id=3', 0),
(4, 'اثاثه و ملزومات', 'fa-duotone fa-house-chimney', '/prod?id=4', 0),
(5, 'روتر', 'fa-duotone fa-house-chimney', '/prod?id=5', 2),
(6, 'رک', '', '', 2),
(7, 'هدست', '', '', 1),
(8, 'لپ تاپ', '', '', 1),
(9, 'کیس', '', '', 1),
(10, 'یخچال', '', '', 3),
(11, 'شربت سرد کن', '', '', 3),
(12, 'کتری برقی', '', '', 3),
(13, 'تلفن', '', '', 3),
(14, 'پرینتر', '', '', 3),
(15, 'میز', '', '', 4),
(16, 'صندلی', '', '', 4),
(17, 'چوب لباسی', '', '', 4),
(18, 'چادر چتری', '', '', 4),
(19, 'فالیچه', '', '', 4),
(20, 'گاوصندوق', '', '', 4),
(21, 'وایت برد', '', '', 4),
(22, 'مبل', '', '', 4),
(23, 'کمد', '', '', 4),
(24, 'شلف', '', '', 4);

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `price` int(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `registrations` varchar(1000) NOT NULL DEFAULT '[]',
  `imgs` varchar(1000) NOT NULL DEFAULT '[]',
  `options` varchar(1000) NOT NULL DEFAULT '{}',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `category_id`, `title`, `description`, `price`, `date`, `registrations`, `imgs`, `options`, `active`, `code`) VALUES
(31, 7, 'Test', 'khube', 10000, '1669204781330', '[\"9\",\"10\",\"11\",\"8\"]', '[\"http://localhost:3002/upload/3338409562654.jpeg\"]', '[{\"key\":\"وضعیت\",\"value\":\"در حد نو\"}]', 1, 123987),
(32, 6, 'Samsung', 'kjhube', 12345, '1669206760756', '[\"1\"]', '[\"http://localhost:3002/upload/3338413521480.jpeg\",\"http://localhost:3002/upload/3338413521496.jpg\",\"http://localhost:3002/upload/3338413521508.jpeg\"]', '[{\"key\":\"وضعیت\",\"value\":\"کار کرده\"},{\"key\":\"abad\",\"value\":\"2d3\"},{\"key\":\"wazn\",\"value\":\"12312\"}]', 1, 98567),
(33, 8, 'MMD', 'leihfoasjfpodsu', 120000, '1669207839056', '[]', '[\"http://localhost:3002/upload/3338415678092.jpeg\",\"http://localhost:3002/upload/3338415678108.jpeg\"]', '[{\"key\":\"وضعیت\",\"value\":\"نیاز به تعمیر\"},{\"key\":\"brand\",\"value\":\"samsung\"},{\"key\":\"cpu\",\"value\":\"i7\"}]', 1, 81237);

-- --------------------------------------------------------

--
-- Table structure for table `Registered_Users`
--

CREATE TABLE `Registered_Users` (
  `id` int(11) NOT NULL,
  `User_Name` varchar(100) NOT NULL,
  `Profile` varchar(1000) NOT NULL DEFAULT 'null',
  `First_Name` varchar(50) NOT NULL DEFAULT 'null',
  `Last_Name` varchar(50) NOT NULL DEFAULT 'null',
  `Phone_Number` varchar(50) NOT NULL DEFAULT 'null'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `acl` int(11) NOT NULL,
  `profile` varchar(10000) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `phonenumber` varchar(100) NOT NULL DEFAULT '',
  `ldp` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `username`, `email`, `password`, `acl`, `profile`, `firstname`, `lastname`, `phonenumber`, `ldp`) VALUES
(1, 'admin', 'admin@admin.com', 'admin', 1, NULL, 'ادمین', NULL, '', 0),
(2, 'admin2', 'admin@admin.com', 'admin', 0, NULL, 'محمد', 'رضایی', '', 0),
(8, 'mahdi.nemati@divar.ir', 'mahdi.nemati@divar.ir', '1669204686989', 0, NULL, NULL, NULL, '', 1),
(9, 'masoumeh.ahangari@divar.ir', 'masoumeh.ahangari@divar.ir', '1669204859369', 0, NULL, NULL, NULL, '', 0),
(10, 'masoumeh@divar.ir', 'masoumeh@divar.ir', '1669205004305', 0, NULL, NULL, NULL, '', 0),
(11, 'authentication@divar.ir', 'authentication@divar.ir', '1669205043696', 0, NULL, NULL, NULL, '', 0),
(12, 'masoud.sajjad@divar.ir', 'masoud.sajjad@divar.ir', '1669205833667', 0, NULL, NULL, NULL, '', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Registered_Users`
--
ALTER TABLE `Registered_Users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `Registered_Users`
--
ALTER TABLE `Registered_Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
