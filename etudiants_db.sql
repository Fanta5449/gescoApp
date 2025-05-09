-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Client: 127.0.0.1
-- Généré le: Ven 09 Mai 2025 à 16:10
-- Version du serveur: 5.5.27
-- Version de PHP: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `etudiants_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'admin1', 'password123'),
(2, 'admin2', 'securepass');

-- --------------------------------------------------------

--
-- Structure de la table `classes`
--

CREATE TABLE IF NOT EXISTS `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Contenu de la table `classes`
--

INSERT INTO `classes` (`id`, `name`) VALUES
(2, 'Licence 21'),
(3, 'Licence 3'),
(4, 'hhh'),
(7, 'Master1');

-- --------------------------------------------------------

--
-- Structure de la table `grades`
--

CREATE TABLE IF NOT EXISTS `grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `semester_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `exam_grade` float DEFAULT NULL,
  `grade` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `semester_id` (`semester_id`),
  KEY `subject_id` (`subject_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Contenu de la table `grades`
--

INSERT INTO `grades` (`id`, `student_id`, `semester_id`, `subject_id`, `exam_grade`, `grade`) VALUES
(7, 3, 1, 2, 20, 0),
(8, 3, 1, 3, 19, 0),
(9, 3, 2, 1, 18, 0),
(10, 4, 1, 1, 17, 0),
(11, 4, 2, 2, 16, 0),
(12, 5, 1, 3, 19, 0),
(13, 5, 2, 4, 18, 0),
(14, 6, 1, 3, 20, 0),
(15, 6, 2, 4, 19, 0),
(16, 3, 2, 1, 12, 0),
(17, 3, 2, 1, 12, 0),
(30, 11, 10, 8, 11, 11),
(31, 11, 10, 8, 12, 12);

-- --------------------------------------------------------

--
-- Structure de la table `semesters`
--

CREATE TABLE IF NOT EXISTS `semesters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `class_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Contenu de la table `semesters`
--

INSERT INTO `semesters` (`id`, `name`, `class_id`) VALUES
(1, 'Semestre 1', 1),
(2, 'Semestre 2', 1),
(3, 'Semestre 3', 1),
(4, 'Semestre 4', 1),
(6, 'kk', 1),
(7, 'lk', 1),
(10, 'ns', 4),
(12, 'semestre2', 7),
(13, 'semestre1', 7);

-- --------------------------------------------------------

--
-- Structure de la table `students`
--

CREATE TABLE IF NOT EXISTS `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `class_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;

--
-- Contenu de la table `students`
--

INSERT INTO `students` (`id`, `name`, `class_id`) VALUES
(3, 'Albert Einstein', 2),
(4, 'Isaac Newton', 2),
(5, 'Ada Lovelace', 3),
(6, 'Alan Turing', 3),
(11, 'Jean Dupont', 4),
(12, 'Marie Curie', 4),
(13, 'Albert Einstein', 4),
(14, 'Ada Lovelace', 4),
(15, 'Issa', 7),
(16, 'Marie Curie', 7),
(17, 'Albert Einstein', 7),
(18, 'Ada Lovelace', 7),
(19, 'Issa', 2),
(20, 'Marie Curie', 2),
(21, 'Albert Einstein', 2),
(22, 'Ada Lovelace', 2);

-- --------------------------------------------------------

--
-- Structure de la table `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `semester_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `semester_id` (`semester_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Contenu de la table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `semester_id`) VALUES
(1, 'Mathématiques', 1),
(2, 'Physique', 1),
(3, 'Informatique', 1),
(4, 'Chimie', 1),
(5, 'math', 6),
(8, 'math12', 10),
(9, 'mathemat', 12),
(10, 'virt', 12);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  ADD CONSTRAINT `grades_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Contraintes pour la table `semesters`
--
ALTER TABLE `semesters`
  ADD CONSTRAINT `semesters_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`);

--
-- Contraintes pour la table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`);

--
-- Contraintes pour la table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
