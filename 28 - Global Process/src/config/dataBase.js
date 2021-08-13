const mysql = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: '2da-Entrega-Final'
    },
    pool: { min: 0, max: 7 }
}


const sqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: __dirname + '/../persistencia/baseDeDatos.sqlite'
    },
    useNullAsDefault: true
}

module.exports = sqlite3;
