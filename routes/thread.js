'use strict';

const express = require('express');
const router = express.Router();
const publicSettings = require('../settings');
const serverSettings = require('../server-settings');
const Thread = require('../models/thread');
const async = require('async');
const js2xmlparser = require("js2xmlparser");
const delThread = require('../components/deleteThread');

router.get('/:board/res/:postId', (req, res, next) => {
    let postId = req.params.postId.split('.')[0];
    let board = req.params.board;
    
    // Buscar el hilo en la base de datos
    Thread.findOne({ board: board, postId: postId }, (err, data) => {
        err = err || !data;
        // JSON Solicitado
        if (typeof req.query.json != 'undefined') {
            res.jsonp(!err ? data : {status: 404});
            return;
        }
        // XML Solicitado
        if (typeof req.query.xml != 'undefined') {
            res.contentType("application/xml");
            res.end(js2xmlparser('thread', !err ? data : {status: 404}, { arrayMap: { replies: "reply" } }));
            return;
        }
        // No existe el hilo / Se ha producido un error
        if (err)
        {
            next();
            return;
        }
        // ZIP Solicitado
        if (typeof req.query.zip != 'undefined') {
            // TBD
            res.end('La descarga en zip aún no está implementada.');
            return;
        }
        // Renderizar HTML
        res.render('hispachan/thread', {
            title: `${data.subject || data.message.substr(0,30)+'...'} - ${publicSettings.site.title}`,
            settings: publicSettings,
            thread: data,
        });
    });
});

// Eliminar hilos
router.all('/:board/del/:postId', (req, res) => {
    let key = req.body.key || req.query.key;
    let postId = req.params.postId.split('.')[0];
    let board = req.params.board;
    
    if(key == serverSettings.delPass)
    {
        Thread.findOne({ board: board, postId: postId }, (err, data)=>
        {
            err = err || !data;
            if(!err)
            {
                delThread(data, e => e? res.end('Error.') : res.end('Hilo Eliminado.'));
            }
            else res.end('El hilo no existe.');
        });
    }
    else res.end('Contraseña Incorrecta.');
});

// Búsqueda
router.get('/ui-search', (req, res)=>
{
    let q = req.query.q;
    let r = [];
    if(!q)
    {
        res.jsonp({results: []});
        return;
    }
    Thread.find({ $or: [{ subject: { $regex: q, $options: 'i' } }, { message: { $regex: q, $options: 'i' } }] }, (err, result)=>
    {
        if(result) 
        {
            result.forEach(el=>{
            let re = {};
            if(el.subject) re.title = el.subject;
            re.description = el.message.substr(0, 120);
            re.image = el.file.thumb;
            re.url = `/${el.board}/res/${el.postId}.html`;
            r.push(re);
        });
        res.jsonp({ results: r });
        }
        else res.jsonp({results: []});
    });
});

module.exports = router;
