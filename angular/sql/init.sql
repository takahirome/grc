-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: 2017 年 5 月 02 日 11:01
-- サーバのバージョン： 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `rds_grc`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `rank`
--

CREATE TABLE `rank` (
  `id` int(100) NOT NULL,
  `domain` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `keyword` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `rank` int(100) NOT NULL,
  `title` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `url` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'active',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- テーブルのデータのダンプ `rank`
--

INSERT INTO `rank` (`id`, `domain`, `keyword`, `rank`, `title`, `description`, `url`, `status`, `timestamp`) VALUES
(1, 'nodejs.org', 'Node.js', 1, 'Node.js', 'Event-driven I/O server-side JavaScript environment based on V8. Includes API documentation, change-log, examples and announcements.', 'https://nodejs.org/', 'active', '2017-05-01 04:28:25');

-- --------------------------------------------------------

--
-- テーブルの構造 `stock`
--

CREATE TABLE `stock` (
  `id` int(100) NOT NULL,
  `userid` int(100) NOT NULL,
  `domain` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `keyword` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'active',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- テーブルのデータのダンプ `stock`
--

INSERT INTO `stock` (`id`, `userid`, `domain`, `keyword`, `status`, `timestamp`) VALUES
(1, 1, 'nodejs.org', 'Node.js', 'active', '2017-05-01 04:29:35');

-- --------------------------------------------------------

--
-- テーブルの構造 `user`
--

CREATE TABLE `user` (
  `id` int(100) NOT NULL,
  `email` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'active',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- テーブルのデータのダンプ `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `status`, `timestamp`) VALUES
(1, 'test@grc.com', 'password', 'active', '2017-05-01 04:26:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rank`
--
ALTER TABLE `rank`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rank`
--
ALTER TABLE `rank`
 MODIFY `id` int(100) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
 MODIFY `id` int(100) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
 MODIFY `id` int(100) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;