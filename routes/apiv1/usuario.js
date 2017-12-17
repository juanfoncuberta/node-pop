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
[check('email').exists().withMessage('is_required').isEmail().withMessage('must_be_email').trim().normalizeEmail(),
check('name').optional().isLength({ min: 1 }).withMessage('not_empty'),
check('password').exists().withMessage('is_required')
],async(req,res,next)=>{

    const errors = validationResult(req);
   if (!errors.isEmpty()) {
       const msg = errors.array()[0].msg;;
      return res.status(422).json({success:false, error: `${errors.array()[0].param} - ${req.__(msg)}`});
    }
 

let token = '';  
    try{

         req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
        if(req.body.name){
            const checkUser =await Usuario.listOne({email:req.body.email});
            if(checkUser){
                res.json({success:false,error:req.__('email_exist')});
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
                res.json({success:false,error:req.__('user_not_found')});
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
            

            
            
    });
    });
}

module.exports = router;