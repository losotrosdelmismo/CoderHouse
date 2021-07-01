/*creamos la base de datos*/
CREATE DATABASE prueba CHARACTER SET utf8;
/*creamos la tabla*/
CREATE TABLE items (
    nombre varchar(255) NOT NULL,
    categorias varchar(255) NOT NULL,
    stock int unsigned,
    id int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id)
);
/*insertamos los datos*/
INSERT INTO items (nombre, categorias, stock) VALUES ("Fideos", "Harina", 20);
INSERT INTO items (nombre, categorias, stock) VALUES ("Leche", "Lacteos", 30);
INSERT INTO items (nombre, categorias, stock) VALUES ("Crema", "Lacteos", 15);

/*listo los items agregados*/
SELECT * FROM items

/*borro el item con ID 1*/
DELETE FROM items WHERE id = 1

/*actualizamos el item con ID 2*/
UPDATE items SET stock = 45 WHERE id = 2

/*listamos los items para chequear los cambios*/
SELECT * FROM items
