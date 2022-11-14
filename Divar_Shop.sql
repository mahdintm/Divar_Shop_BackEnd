-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 14, 2022 at 07:52 PM
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
  `options` varchar(1000) NOT NULL,
  `parent` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`id`, `name`, `icon`, `link`, `options`, `parent`) VALUES
(1, 'کالا تستی', 'fa-duotone fa-house-chimney', '/prod?id=1', '{\"cpu\":\"پردازنده\"}', 0),
(2, 'کالا دیجیتال', 'fa-duotone fa-house-chimney', '/prod?id=2', '{\"cpu\":\"پردازنده\"}', 0),
(3, 'میز صندلی', 'fa-duotone fa-house-chimney', '/prod?id=3', '{\"cpu\":\"پردازنده\"}', 0),
(4, 'لپ تاپ', 'fa-duotone fa-house-chimney', '/prod?id=4', '{\"cpu\":\"پردازنده\"}', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `price` int(11) NOT NULL,
  `date` varchar(100) NOT NULL,
  `registrations` varchar(1000) NOT NULL DEFAULT '[]',
  `imgs` varchar(1000) NOT NULL DEFAULT '[]',
  `options` varchar(1000) NOT NULL DEFAULT '{}'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `category_id`, `title`, `description`, `price`, `date`, `registrations`, `imgs`, `options`) VALUES
(1, 2, 'Asus U1412', 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک....', 1700000, '784365874236', '[\"1\"]', '[\"http://localhost:3000/_nuxt/static/img/Item1.png\"]', '[{\"key\":\"پردازنده\",\"value\":\"i7-7700k\"}]'),
(2, 2, 'Apple Macbook pro2018', 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک....', 1700000, '784365874236', '[]', '[]', '[{\"key\":\"cpu\",\"value\":\"i7-7700k\"}]'),
(3, 2, 'Dell Inspairon', 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک....', 2700000, '784365874236', '[]', '[]', '[{\"key\":\"cpu\",\"value\":\"i7-7700k\"}]'),
(4, 2, 'Lenovo', 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک....', 4700000, '784365874236', '[]', '[]', '[{\"key\":\"cpu\",\"value\":\"i7-7700k\"}]'),
(5, 2, 'Lenovo', 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک....', 4700000, '784365874236', '[]', '[]', '[{\"key\":\"cpu\",\"value\":\"i7-7700k\"}]'),
(6, 2, 'Lenovo', 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک....', 4700000, '784365874236', '[]', '[]', '[{\"key\":\"cpu\",\"value\":\"i7-7700k\"}]'),
(7, 2, 'Apple Macbook pro2018', 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک....', 1700000, '784365874236', '[]', '[]', '[{\"key\":\"cpu\",\"value\":\"i7-7700k\"}]'),
(8, 3, 'میز و صندلی مدل G4', 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک....', 1700000, '784365874236', '[]', '[]', '[{\"key\":\"cpu\",\"value\":\"i7-7700k\"}]');

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
  `username` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `acl` int(11) NOT NULL,
  `profile` varchar(10000) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `phonenumber` varchar(100) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `username`, `email`, `password`, `acl`, `profile`, `firstname`, `lastname`, `phonenumber`) VALUES
(1, 'admin', 'admin@admin.com', 'admin', 1, 'https://media.allure.com/photos/605247e1bddfa641546fa160/1:1/w_2264,h_2264,c_limit/billie%20eilish.jpg', 'مهدی', 'نعمتی', '');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Registered_Users`
--
ALTER TABLE `Registered_Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
