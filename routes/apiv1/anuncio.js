"use strict";

const express = require('express');
const router = express.Router();

const Anuncio = require('../../models/Anuncios');


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
        if(tag){    filter.tag = ['apple','mac']}
        if(sale){   filter.sale =sale   }
        if(maxPrice){ price['$lte']=maxPrice}
        if(minPrice){ price['$gte']=minPrice}
        if(Object.keys(price).length){filter.price = price;};
       
       console.log(filter);
        
        const listado = await Anuncio.list(filter);
        for(let i = 0;i<listado.length;i++){
            listado[i].photo='url/'+listado[i].photo;
            console.log(listado[i].photo);
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
    //creamos un agente en memoria
    const anuncio = new Anuncio(req.body);

    //lo persistimos en la coleccion de agentes
    anuncio.save((err,anuncioGuardado)=>{
        if(err){
            next(err);
            return;
        }
        res.json({success:true,result:anuncioGuardado});
    });

});




module.exports = router;