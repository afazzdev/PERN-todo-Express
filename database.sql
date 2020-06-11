-- CREATE DATABASE perntodo;

CREATE TABLE todo
(
    todo_id BIGSERIAL NOT NULL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
); 

-- \i "C:/Users/Pondok Programmer/Documents/faizi/faizi/javascript/fullstack/PERN todo list/server/database.sql"