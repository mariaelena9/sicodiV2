const {Router} = require('express');
const Router2 = Router();
const connection = require('../db/db.js');

//GET:
Router2.get('/getuser', (req, res) => {
    console.log('get user')
    const sql = (`select * from usuarios`)
    connection.query(sql, (error, results ) => {
        if(error) throw error;
            if(results.length > 0){
                res.json(results)
            }else{
                res.send('Sin resultados');
            }
    });

});

//POST:
Router2.post('/insertuser', (req, res) => {
    const sql = (`insert into usuarios set ? `)
    const usuario = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo
    }

    connection.query(sql, usuario, (error) => {
        if(error) throw error;
                res.send('Insert exitoso')
    });

});

//GET por id:
Router2.get('/getuser/:id', (req, res) => {
    const sql = (`select * from usuarios where id_Usuario = ${req.params.id}`)
    connection.query(sql, (error, results ) => {
        if(error) throw error;
            if(results.length > 0){
                res.json(results)
            }else{
                res.send('Sin resultados');
            }
    });

});


//Exportacion

module.exports = Router2;