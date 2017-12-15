"use strict";

const express = require('express');
const router = express.Router();
const jwtAuth = require('../../lib/jwtAuth');
const Anuncio = require('../../models/Anuncios');


router.use(jwtAuth());
/**
 * GET /anuncio
 * Obtener lista de anuncios
 */
router.get('/',async (req,res,next)=>{

    try{
        const name = req.query.name;
        const sale = req.query.sale;
        const photo = req.query.photo;
        const tag = req.query.tag;
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);
        const sort = req.query.sort;
        const fields = req.query.fields;
        const maxPrice = req.query.maxPrice;
        const minPrice = req.query.minPrice;
      
        const filter ={};
        let price = {};
        if(name){   filter.name = new RegExp('^' + name, "i");; }
        if(photo){  filter.photo = photo;   }
        if(tag){    filter.tags = {$in:tag.split(' ')}}
        if(sale){   filter.sale =sale   }
        if(maxPrice){ price['$lte']=maxPrice}
        if(minPrice){ price['$gte']=minPrice}
        if(Object.keys(price).length){filter.price = price;};
       
       console.log(filter);
        
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
