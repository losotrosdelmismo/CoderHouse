const { normalize, schema } = require('normalizr');


// defino el esquema de los usuarios (o comentadores)
const user = new schema.Entity('users');

// defino el esquema de los comentarios, que son realizados por un usuario
const comment = new schema.Entity('comments', {
    commenter: user
});

// defino el esquema de los articulos, que tienen un autor y una cantidad de comentarios
const article = new schema.Entity('articles', {
    author: user,
    comments: [comment]
});

// creamos el objeto normalizado
const normalizedData = normalize();

module.exports = normalizedData;