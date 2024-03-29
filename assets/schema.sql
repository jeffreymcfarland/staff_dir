DROP DATABASE IF EXISTS staff_directoryDB;

CREATE DATABASE staff_directoryDB;

USE staff_directoryDB;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    dep_name VARCHAR(45),
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(45),
    salary DECIMAL(10,3),
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE manager(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    employee_id INT NOT NULL,
    PRIMARY KEY (id)
);