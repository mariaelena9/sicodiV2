const {
    Router
} = require('express');
const dependencesRoute = Router();
const connection = require('../db/db.js');

dependencesRoute.get('/', (req, res) => {
    
    const sql = (`SELECT * FROM dependencias`);
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
            //getUserData(results)
        } else {
            res.send('Sin resultados');
        }
    });
});

dependencesRoute.get('/get/:id', (req, res) => {
    
    const sql = (`SELECT * FROM dependencias WHERE dependencias.id_Dependencia = ${req.params.id}`);
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
            //getUserData(results)
        } else {
            res.send('Sin resultados');
        }
    });
});




module.exports = dependencesRoute;