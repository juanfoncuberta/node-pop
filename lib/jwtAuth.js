"use strict"

const jwt = require('jsonwebtoken');
const i18n = require("i18n");

module.exports = ()=>{
    
        return function(req,res,next){
            //leer credenciales
            const token = req.body.token || req.query.token || req.get('x-access-token');
         ;

            if(!token){
                const err = new Error('No token provided');
                err.status = 401;
                next(err);
                return;
            }
            //comprobamos idioma de sesion
            if(req.headers.acceptlanguage)
                    i18n.setLocale(req.headers.acceptlanguage);
              
            //comprobar credenciales
            jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
                if(err){
                    console.log('Token error: ',err);
                    const error = new Error('Invalid token');
                    error.status = 401;
                    next(error);
                    return;
                }
                req.userId = decoded.user_id; //lo guardamos en el request para los siguientes middlewares
                next();
            });
            //continuar
        }
    
}

//exportamos un creador de middlewares de autenticacion