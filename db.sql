CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  
create database aura;

CREATE TABLE logins(
    id uuid DEFAULT uuid_generate_v4(),
    userid uuid UNIQUE NOT NULL,
    successfullogin INTEGER DEFAULT 0,
    failedlogindate VARCHAR(64),
    invalidloginattempt INTEGER DEFAULT 0
    FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE users(
    userid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
);
