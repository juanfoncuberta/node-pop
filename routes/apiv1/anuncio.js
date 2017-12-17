"use strict";

const express = require('express'),i18n = require("i18n");
const router = express.Router();
const jwtAuth = require('../../lib/jwtAuth');
const Anuncio = require('../../models/Anuncios');
const {check,validationResult} = require('express-validator/check');
const {matchedData,santize} = require('express-validator/filter');

router.use(jwtAuth());
router.use(i18n.init);

/**
 * GET /anuncio
 * Obtener lista de anuncios
 */
router.get('/',[check('sale').optional().isBoolean().withMessage(i18n.__('must_be_boolean'))
],async (req,res,next)=>{
    

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({success:false, error: `${errors.array()[0].param} - ${errors.array()[0].msg}`});
    }

 
    try{
        const name = req.query.name;
        const sale = req.query.sale;
        const tag = req.query.tag;
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);
        const sort = req.query.sort;
      
      //  const p = req.query.price.split('-');
       // console.log('pppppp',req.query.price.split('-').length);

        
      
        const filter ={};
        let price = {};
        if(req.query.price){
            const p = req.query.price.split('-');
            
            if(p.length ==1){
                price =p[0];
            }else{       
                price['$lte']=p[1] || Number.MAX_SAFE_INTEGER;
                price['$gte']=p[0] || 0;

            }
        }
        if(name){   filter.name = new RegExp('^' + name, "i");; }
        if(tag){    filter.tags = {$in:tag.split(' ')}}
        if(sale){   filter.sale =sale   }
        if(Object.keys(price).length){filter.price = price;};
       
    
        
        const listado = await Anuncio.list(filter);
        for(let i = 0;i<listado.length;i++){
            listado[i].photo='url/'+listado[i].photo;
           
        }
        res.json({success:true,result:listado});


    }catch(err){
        next(err);
    }

});


/**
 * POST /anuncio
 * Crea un anuncio
 */

router.post('/',(req,res,next)=>{
    //creamos un anuncio en memoria
    const anuncio = new Anuncio(req.body);
    console.log(req.body);
   
    //lo persistimos en la coleccion de anuncio
    anuncio.save((err,anuncioGuardado)=>{
        if(err){
            next(err);
            return;
        }
        res.json({success:true,result:anuncioGuardado});
    });

});

/**
 * GET /anuncio/tags
 * Devuelve lista de anuncios
 */


router.get('/tags',async(req,res,next)=>{
  
    const listado = await Anuncio.list();
    const tags = await getItem(listado);
    res.json({success:true,result:tags});

});


function getItem(list){
    let tags=[];
    list.forEach(item=> {
        item.tags.forEach(tag=>{
            console.log(tag);
            if(!tags.includes(tag)){
                tags.push(tag);
            }
        });
    });
    return tags;
}

module.exports = router;
