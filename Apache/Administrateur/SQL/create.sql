CREATE DATABASE authentification;

USE authentification;

CREATE TABLE users(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `player` VARCHAR(50) NOT NULL,
    `mail` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL ,
    `logged` VARCHAR(50) NOT NULL 
); 

CREATE TABLE banned(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `mail` VARCHAR(50) NOT NULL
);