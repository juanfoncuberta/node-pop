"use strict";

const mongoose = require('mongoose');
const maxTags = 4;
const anuncioSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    sale:{
        type:Boolean,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        enum: ['work,', 'lifestyle,', 'motor','mobile']
    }

});

anuncioSchema.statics.list = function(filter){
    const query = this.find(filter);

    return query.exec();
}
const Anuncio = mongoose.model('Anuncio',anuncioSchema);


function arrayLimit(val){
    return val.length <=4;
}

module.exports = Anuncio;


