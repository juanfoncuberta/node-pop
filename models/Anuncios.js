"use strict";

const mongoose = require('mongoose');
const maxTags = 4;
const anuncioSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true
    },
    sale:{
        type:Boolean,
        required:true,
        index:true
    },
    price:{
        type:Number,
        required:true,
        index:true
    },
    photo:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        index:true,
        enum: ['work,', 'lifestyle,', 'motor','mobile']
    }

});

anuncioSchema.statics.list = function(filter,limit,skip){
    const query = this.find(filter);
    query.limit(limit);
    query.skip(skip);

    return query.exec();
}
const Anuncio = mongoose.model('Anuncio',anuncioSchema);


function arrayLimit(val){
    return val.length <=4;
}

module.exports = Anuncio;


