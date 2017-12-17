const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true,
        index:true
    }

});

usuarioSchema.statics.list = function(filter){
    const query = this.find(filter);

    return query.exec();
}

usuarioSchema.statics.listOne = function(filter){
    
    const query = this.findOne(filter);

    return query.exec();;
}
const Usuario = mongoose.model('Usuario',usuarioSchema);

module.exports = Usuario;


