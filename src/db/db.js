const mysql = require('mysql2');

//Constante de conexion a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: '',
    database: 'sicodi',
    multipleStatements: true
});

//Verificacion

connection.connect( error => {
    if(error){
        console.log("error en conexion")
    } else{
        console.log("conexion exitosa")
    }
})

module.exports = connection;