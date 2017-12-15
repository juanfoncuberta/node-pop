"use strict";
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Usuario = require('../../models/Usuarios');

router.post('/',async(req,res,next)=>{
    //creamos un usuario en memoria
let token = '';  
    try{
        
        req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
        if(req.body.name){
            const usuario = new Usuario(req.body);
            usuario.save((err,nuevoUsuario)=>{
                if(err){
                    next(err);
                    return;
                }
                token = makeToken(nuevoUsuario,next);             
            });
        }else{            
            const logUser = await Usuario.listOne(req.body);
            token = await makeToken(logUser,next);
        }
        res.json({success:true,token:token});       
        return;
       
    }catch(err){
        next(err);
    }

});


router.get('/',async (req,res,next)=>{
    
        try{
            
            const listado = await Usuario.list();
       
            res.json({success:true,result:listado});
            return;
    
        }catch(err){
            next(err);
        }
    
    });



//process.env.JWT_SECRET
function makeToken(usuario,next){

    return new Promise((resolve,reject)=>{
        console.log('gol',process.env.JWT_EXPIRES_IN);
        const tokenUser={_id:usuario.id,mail:usuario.mail}
        jwt.sign({user_id: tokenUser._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRES_IN,
        },(err,token)=>{
            if(err){
            
                next(err);
                return;
            
            }
            resolve(token);
            
        // res.json({success:true,token:token})
            
            
    });
    });
}

module.exports = router;