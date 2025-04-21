-- Create the appdb database
CREATE DATABASE IF NOT EXISTS appdb;

-- Use the appdb database
USE appdb;

-- Create the apptb table
CREATE TABLE `appdb`.`apptb` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `appdb`.`pages` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  reference VARCHAR(255) NOT NULL UNIQUE,
  count INT DEFAULT 0,
  create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_id INT NOT NULL
);