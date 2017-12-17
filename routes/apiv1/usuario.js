"use strict";
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const i18n = require("i18n");

const {check,validationResult} = require('express-validator/check');
const {matchedData,santize} = require('express-validator/filter');


const Usuario = require('../../models/Usuarios');

router.post('/',
[check('email').exists().withMessage(i18n.__('is_required')).isEmail().withMessage(i18n.__('must_be_email')),
check('name').optional().isLength({ min: 1 }).withMessage(i18n.__('not_empty')),
check('password').exists().withMessage(i18n.__('is_required'))
],async(req,res,next)=>{
    //creamos un usuario en memoria
    //req.checkBody("email", "Enter a valid email address.").isEmail();
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({success:false, error: `${errors.array()[0].param} - ${errors.array()[0].msg}`});
    }
 
let token = '';  
    try{
    
      if(req.get('Accept-Language'))
            i18n.setLocale(req.get('Accept-Language'));
   
        req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
        if(req.body.name){
            const checkUser =await Usuario.listOne({email:req.body.email});
            if(checkUser){
                res.json({success:false,error:i18n.__('email_exist')});
                return;

            }
            const usuario = new Usuario(req.body);

            usuario.save(async (err,nuevoUsuario)=>{
             
                if(err){
                    next(err);
                    return;
                }
                token = await makeToken(nuevoUsuario,next);
                res.json({success:true,token:token});             
            });
        }else{            
            const logUser = await Usuario.listOne(req.body);
            
            if(!logUser){
                res.json({success:false,error:i18n.__('user_not_found')});
                return;
            }
            token = await makeToken(logUser,next);
            res.json({success:true,token:token});
        }
     
               
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


function makeToken(usuario,next){

    return new Promise((resolve,reject)=>{
      
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