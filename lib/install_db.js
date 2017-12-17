

"use strict";
const crypto = require('crypto');
const Anuncio = require('../models/Anuncios');
const Usuarios = require('../models/Usuarios')
const User = require('../models/Usuarios');
const anuncioData = require('../data/Anuncio.json');
let usuarioData = require('../data/Usuario.json')
require('../lib/mongooseConnector');

function setHashPassword(userData){
    userData.forEach(user => {
        user.password = crypto.createHash('md5').update(user.password).digest('hex');
    });
    
}
async function reloadData() {
    try {

     
        await Anuncio.remove({});
        await Usuarios.remove({});
        await setHashPassword(usuarioData['usuarios']);
        const anuncioArray = Anuncio.insertMany(anuncioData['anuncios']);
        const usuarioArray = Usuarios.insertMany(usuarioData['usuarios']);

       await Promise.all([anuncioArray,usuarioArray])
       .then(()=>{
           console.log('Datos cargados correctamente');
            process.exit(0);})
        .catch((err)=>{
            console.log('Error al cargar los datos: ',err);
            process.exit(1);
        });
   
    } catch (err) {
        console.log('Error al cargar los datos: ',err);
        process.exit(1);
        
    }
  }
  reloadData('Anuncio');
