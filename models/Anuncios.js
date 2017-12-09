"use strict";

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
    nombre:{type:String},
    venta:{type:Boolean},
    precio:{type:Number},
    foto:{type:String},
    tags:[String]

});


const Anuncio = mongoose.model('Anuncio',anuncioSchema);

module.exports = Anuncio;


