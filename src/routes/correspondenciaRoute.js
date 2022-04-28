const {
    Router
} = require('express');
const correspondenciaRoute = Router();
const connection = require('../db/db.js');
const fileUpload = require("express-fileupload");
const path = require("path");
fs = require('fs')
const pdfPath = path.join(__dirname, '../uploads');


correspondenciaRoute.get('/', (req, res) => {
    const sql = (`SELECT * FROM tipocorrespondencia`);
    //const sql = (`SELECT * FROM tipocorrespondencia WHERE tipocorrespondencia.id_Tipo = ${id_user}`);
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
correspondenciaRoute.post('/insert', (req, res) => {
    console.log(req.body)
    const body_data = req.body;
   
    const sql ="INSERT INTO `correspondencia` (`fechaEmision`, `fechaRecepcion`, `fechaLimite`, `fk_DependenciaO`, `fk_UsuarioO`, `fk_DependenciaD`, `fk_UsuarioD`, `fk_TipoCo`, `asunto`, `descripcion`, `observaciones`, `status`, `fk_estatus`,`fk_catcorrespo`, `fileName`) VALUES ('"+ body_data.fechaEmision+"','"+body_data.fechaRecepcion+"','"+body_data.fechaLimite+"','"+body_data.fk_DependenciaO+"','"+body_data.fk_UsuarioO+"','"+body_data.fk_DependenciaD+"','"+body_data.fk_UsuarioD+"','"+body_data.fk_TipoCo+"','"+body_data.asunto+"','"+body_data.descripcion+"','"+body_data.observaciones+"','"+1+"','"+1+"','"+body_data.fk_catcorrespo+"','"+body_data.fileName+"')";

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results) {
            res.json(results);
            //getUserData(results)
        } else {
            res.send('Sin resultados');
        }
    });

    
    
});

correspondenciaRoute.post('/insert/file', async function(req, res) {
    //console.log(req.files.file.name)
    let pdfFile = req.files.file;
    let pdfName = req.files.file.name
    pdfFile.mv(`./pdf/${pdfName}`, function(err) {
        if (err)
          return res.status(500).send(err);
    
        res.send('File uploaded!');
      });
    
    //fs.writeFileSync('/test.pdf', req.files,'binary')
});
correspondenciaRoute.get('/id/:id', (req, res) => {
    
    const sql = (`SELECT * FROM tipocorrespondencia WHERE tipocorrespondencia.id_Tipo = ${req.params.id}`);
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

correspondenciaRoute.get('/categorias', (req, res) => {
    
    const sql = (`SELECT * FROM categoria_correspondencia WHERE 1`);
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


module.exports = correspondenciaRoute;