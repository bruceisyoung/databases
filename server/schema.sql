CREATE DATABASE chat;

USE chat;

CREATE TABLE users (
  id int not null auto_increment,
  name varchar(24) unique,
  primary key (id)
);

CREATE TABLE rooms (
  id int auto_increment,
  name varchar(24) unique,
  primary key (id)
);

CREATE TABLE messages (
  id int not null auto_increment,
  user_id int not null,
  room_id int not null,
  text varchar(255),
  createdAt timestamp,
  primary key (id),
  index users(user_id),
  foreign key (user_id) references users(id),
  index rooms(room_id),
  foreign key (room_id) references rooms(id)
);

CREATE TABLE friends (
  id int not null auto_increment,
  user_id int not null,
  friend_id int not null,
  primary key (id),
  foreign key (user_id) references users(id),
  index users(friend_id),
  foreign key (friend_id) references users(id)
);
