create table users(
    id int auto_increment primary key,
    email text not null,
    password text not null,
    date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);