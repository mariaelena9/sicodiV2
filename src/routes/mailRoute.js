const {
    Router
} = require('express');
const mailRoute = Router();
const connection = require('../db/db.js');

mailRoute.get('/', (req, res) => {

    const sql = ("SELECT  correspondencia.id_Correspondencia, asunto, fechaEmision,fechaRecepcion,fechaLimite,correspondencia.descripcion,observaciones,status,correspondencia.fk_UsuarioD,correspondencia.fk_UsuarioO, tipocorrespondencia.nombre as tipo_correspondencia,usuarios.nombre as user_origin_name,usuarios.apellidoPaterno as user_origin_apepat, usuarios.apellidoMaterno as user_origin_apemat, dependencias.nombreDependencia as dependencia_origen, estatus.descripcion as estatus_descripcion FROM correspondencia, tipocorrespondencia, usuarios, dependencias, estatus WHERE correspondencia.fk_TipoCo = tipocorrespondencia.id_Tipo && correspondencia.fk_UsuarioO = usuarios.id_Usuario  && dependencias.id_Dependencia = correspondencia.fk_DependenciaO && correspondencia.fk_estatus = estatus.id_Estatus;");


    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            getUserDestInfo(results)

            //getUserData(results)
        } else {
            res.send('Sin resultados');
        }
    });

    async function getUserDestInfo(originResults) {


        originResults.forEach(function callback(value, index) {
            const id = value.fk_UsuarioD;

            const sql = (`SELECT nombre, apellidoMaterno,apellidoPaterno,telefono,correoElectronico,cargo FROM usuarios WHERE usuarios.id_Usuario = ${id}`)
            connection.query(sql, (error, results) => {
                if (error) throw error;
                if (results.length > 0) {
                    originResults[index].destination_user = results[0];
                    console.log(originResults)



                } else {
                    res.send('Sin resultados');
                }
                if (index == originResults.length - 1) {
                    console.log(index)
                    res.json(originResults);
                }

            });
        });

        //console.log(results[0].fk_UsuarioD)

    }



});


mailRoute.get('/usuario/enviados=:id',  async (req, res) => {
    const respuesta =  await userSentMails(req.params.id);
    if(respuesta.length > 0){
        for (let i = 0; i < respuesta.length; i++) {
            const element = respuesta[i];

            let data_origen = await getUserData(element.fk_UsuarioO);
            let data_destination = await getUserData(element.fk_UsuarioD);
            let data_dependencia_origen = await getDependencia(element.fk_DependenciaO);
            let data_dependencia_destination = await getDependencia(element.fk_DependenciaD);
            let data_tipo_correspondencia = await getTipoCorrespondencia(element.fk_TipoCo);

            
            element.origen_user = data_origen[0];
            element.destination_user = data_destination[0];
            element.data_dependencia_destination = data_dependencia_destination[0];
            element.data_dependencia_origen = data_dependencia_origen[0];
            element.data_tipo_correspondencia = data_tipo_correspondencia[0];
        }
        res.json(respuesta);
    }
});

mailRoute.get('/usuario/recibidos=:id',  async (req, res) => {
    
    
    const respuesta =  await userMails(req.params.id);
    

    if(respuesta.length > 0){
        
        for (let i = 0; i < respuesta.length; i++) {
            const element = respuesta[i];

            let data_origen = await getUserData(element.fk_UsuarioO);
            let data_destination = await getUserData(element.fk_UsuarioD);
            let data_dependencia_origen = await getDependencia(element.fk_DependenciaO);
            let data_dependencia_destination = await getDependencia(element.fk_DependenciaD);
            let data_tipo_correspondencia = await getTipoCorrespondencia(element.fk_TipoCo);
            let categoria = await getCategoriaCorrespondencia(element.fk_catcorrespo);

            
            element.origen_user = data_origen[0];
            element.destination_user = data_destination[0];
            element.data_dependencia_destination = data_dependencia_destination[0];
            element.data_dependencia_origen = data_dependencia_origen[0];
            element.data_tipo_correspondencia = data_tipo_correspondencia[0];
            element.categoria = categoria[0];
        }
        //console.log(respuesta[0].fk_UsuarioO);
       
        
    }
    res.json(respuesta);
    
   
    

});

mailRoute.get('/find/:id',  async (req, res) => {
    console.log(req.params.id);
    
    const element = await SingleMail(req.params.id);
 
    let data_origen = await getUserData(element[0].fk_UsuarioO);
    let data_destination = await getUserData(element[0].fk_UsuarioD);
    let data_dependencia_origen = await getDependencia(element[0].fk_DependenciaO);
    let data_dependencia_destination = await getDependencia(element[0].fk_DependenciaD);
    let data_tipo_correspondencia = await getTipoCorrespondencia(element[0].fk_TipoCo);
    try {
        element[0].origen_user = data_origen[0];
        element[0].destination_user = data_destination[0];
        element[0].data_dependencia_destination = data_dependencia_destination[0];
        element[0].data_dependencia_origen = data_dependencia_origen[0];
        element[0].data_tipo_correspondencia = data_tipo_correspondencia[0];
    } catch{    
        
    } finally {
        res.json(element);
    };
    

    
    
    
    });



userMails = function(id_user){
    const sql = (`SELECT * FROM correspondencia WHERE correspondencia.fk_UsuarioD = ${id_user}`);
    return new Promise(function(resolve, reject){
      connection.query(
          sql, 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )};

  SingleMail = function(id){
    const sql= `SELECT * FROM correspondencia WHERE id_Correspondencia = ${id}`;
    return new Promise(function(resolve, reject){
      connection.query(
          sql, 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
                  console.log(rows)
              }
          }
      )}
  )};

  userSentMails = function(id_user){
    const sql = (`SELECT * FROM correspondencia WHERE correspondencia.fk_UsuarioO = ${id_user}`);
    return new Promise(function(resolve, reject){
      connection.query(
          sql, 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )};

  getUserData = function(id_user){
    const sql = (`SELECT * FROM usuarios WHERE usuarios.id_Usuario = ${id_user}`);
    return new Promise(function(resolve, reject){
      connection.query(
          sql, 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )};

  getDependencia = function(id_user){
    const sql = (`SELECT * FROM dependencias WHERE dependencias.id_Dependencia = ${id_user}`);
    return new Promise(function(resolve, reject){
      connection.query(
          sql, 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )};

  getTipoCorrespondencia = function(id_user){
    const sql = (`SELECT * FROM tipocorrespondencia WHERE tipocorrespondencia.id_Tipo = ${id_user}`);
    return new Promise(function(resolve, reject){
      connection.query(
          sql, 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )};

  getCategoriaCorrespondencia = function(id){
    const sql = (`SELECT * FROM categoria_correspondencia WHERE categoria_correspondencia.id = ${id}`);
    return new Promise(function(resolve, reject){
      connection.query(
          sql, 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )};

module.exports = mailRoute;