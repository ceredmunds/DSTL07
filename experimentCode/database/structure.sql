-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 18, 2021 at 03:14 PM
-- Server version: 5.7.26
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `test_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `test_table`
--
DROP TABLE IF EXISTS `test_table`;
CREATE TABLE IF NOT EXISTS `test_table` (
  `trial_index` int(11) NOT NULL,
  `test_part` text,
  `trial_type` text,
  `stimulus` text,
  `time_elapsed` int(11) DEFAULT NULL,
  `rt` int(11) DEFAULT NULL,
  `key_press` int(11) DEFAULT NULL,
  `correct_response` text,
  `correct` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
