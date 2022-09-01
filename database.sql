create database aura;

create table user_table(
    "id" int PRIMARY KEY,
    "name" varchar(30),
    "phone_no" int,
    "email" varchar(200),
    "password" varchar(10),
    "reset_code" varchar(10),
    "age" int,
    "role" varchar,
    "status" int,
    "avatar" varchar,
    "cover_image" varchar,
    "gender" varchar,
    "date_of_birth" varchar,
    "is_active" bool,
    "address_id" int,
    "uninstall" int,
    "created_at" varchar(64),
    "update_at" varchar(64),
    "created_by" varchar(64),
    "update_by" varchar(64)
);