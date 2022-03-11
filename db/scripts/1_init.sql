CREATE DATABASE LAPdb;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS travels;
DROP TABLE IF EXISTS expenses;

CREATE TABLE users (
    email varchar(255) PRIMARY KEY,
    password varchar(255),
    username varchar(255)
);

CREATE TABLE travels (
    name varchar(255),
    user_email varchar(255),
    daily_budget int,
    start_date varchar(255),
    end_date varchar(255),
    destination varchar(255),
    description varchar(255),
    PRIMARY KEY (name, user_email),
    CONSTRAINT fk_travel FOREIGN KEY(user_email) REFERENCES users(email) ON DELETE CASCADE    
);

CREATE TABLE expenses (
    user_email varchar(255),
    travel varchar(255),
    name varchar(255),
    amount real,
    category varchar(255),
    date varchar(255),
    place varchar(255),
    CONSTRAINT fk_expense FOREIGN KEY(user_email,travel) REFERENCES travels(user_email,name) ON DELETE CASCADE   
);
