const {
    Router
} = require('express');
const trackingRoute = Router();
const connection = require('../db/db.js');

trackingRoute.get('/', (req, res) => {
    res.json('aqui no hay nada')
});

trackingRoute.post('/', (req, res) => {
    data = req.body;
    console.log(data);
    const sql = `UPDATE correspondencia SET fk_estatus = ${data.value} WHERE correspondencia.id_Correspondencia = ${data.id}`
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results) {
            console.log("dato cambiado");
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ success: true }));


        } else {
            console.log("error");
            return res.status(500);
            
        }

    });
    
   
});

module.exports = trackingRoute;