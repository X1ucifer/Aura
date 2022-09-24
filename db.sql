CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  
create database aura;

CREATE TABLE logins(
    id uuid DEFAULT uuid_generate_v4(),
    userid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    successfullogin VARCHAR(64),
    failedlogin VARCHAR(64),
    invalidloginattempt INTEGER DEFAULT 0
);

CREATE TABLE users(
    id uuid UNIQUE NOT NULL,
    firstname VARCHAR(64),
    lastname VARCHAR(64),
    phone VARCHAR(64),
    gender VARCHAR(8),
    dateofbirth DATE,
    status INTEGER DEFAULT 0,
    createdby VARCHAR(64) DEFAULT 'user' NOT NULL,
    createdat VARCHAR(64) NOT NULL,
    updatedby VARCHAR(64) DEFAULT 'user' NOT NULL,
    updatedat VARCHAR(64) NOT NULL,
    FOREIGN KEY (id) REFERENCES logins (userid)
);
