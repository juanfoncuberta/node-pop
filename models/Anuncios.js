"use strict";

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
    name:String,
    sale:Boolean,
    price:Number,
    photo:String,
    tags:[String]

});

anuncioSchema.statics.list = function(filter){
    const query = this.find(filter);

    return query.exec();
}
const Anuncio = mongoose.model('Anuncio',anuncioSchema);

module.exports = Anuncio;


