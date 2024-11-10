use registration_db;

create table users(
	id int auto_increment primary key,
    firstName varchar(100) not null,
    lastName varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(255) not null
);

select * from users;