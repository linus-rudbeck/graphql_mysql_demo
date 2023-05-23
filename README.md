# graphql_mysql_demo
 
Create database with this code:

```mysql
CREATE DATABASE multitier_shop;

USE multitier_shop;

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL UNIQUE,
  password_hash varchar(60),
  user_role varchar(255) NOT NULL,
  profile_pic_url varchar(255) DEFAULT NULL,
  PRIMARY KEY (user_id)
);


CREATE TABLE purchases (
  purchase_id INT NOT NULL AUTO_INCREMENT,
  product_name varchar(255) NOT NULL,
  price INT NOT NULL,
  purchase_time INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (purchase_id),
  FOREIGN KEY user_id REFERENCES users(user_id)
);
```