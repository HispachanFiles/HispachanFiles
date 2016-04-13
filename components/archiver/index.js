/**
 * Archivador de Hispachan Files
 * 
 * Aquí es donde ocurre toda la magia
 */
'use strict';

const mongoose = require('mongoose');
const mkdirp   = require('mkdirp');
const fs       = require('fs');
const async    = require('async');
const request  = require('request');
const glob     = require('glob');

const Thread   = require('../../models/thread');
const Elapsed  = require('elapsed');

class Archiver {
    constructor() {
        this.queue = [];
        this.current = {};
    }

    // Añadir hilo a la cola.
    addToQueue(data, socket) {
        this.queue.push({ data: data, by: socket });
        if (this.queue.length < 2) {
            this.next();
        }
    }

    // Avanzar en la cola
    next() {
        this.current = this.queue.shift();
        this.start();
    }

    // Archivar Hilo
    start() {
        let that = this;
        let thread = this.current;
        // Establecer directorios para los datos del hilo
        thread.dataDir = `data/${thread.data.board}/${thread.data.postId}/`;
        thread.fileDir = thread.dataDir + 'src/';
        thread.thumbDir = thread.dataDir + 'thumb/';
        this.current.saved = 0;
        this.current.files = [];
        this.current.thumbs = [];
        
        // Almacenar todas las imágenes
        async.each(thread.data.replies, (el, cb) => {
            if (!el.file) {
                async.setImmediate(() => {
                    that.reportProgress('Guardando archivos...', ++that.current.saved, that.current.data.replyCount + 1);
                    cb(null, el);
                });
            }
            else {
                that.storeAttachment(el, cb);
            }
        }, ()=> async.waterfall([
            // Almacenar imagen de OP
            cb=> that.storeAttachment(thread.data, cb),
            // Almacenar en la base de datos
            (data, cb)=> {
                // Primero revisar si ya estaba
                let query = {'postId': data.postId, 'board': data.board};
                Thread.findOne(query, (err, d)=>
                {
                    if(d)
                    {
                        // El hilo ya estaba almacenado, actualizar
                        data.lastUpdate = Date.now();
                        Thread.update(query, data, cb)
                    }
                    else
                    {
                        // El hilo se almacena por primera vez
                        new Thread(data).save(cb);
                    }
                });
            },
            // Eliminar archivos que estén de mas (parece que no funciona elmio)
            // (data, cb)=> glob(that.current.dataDir + '*/*', cb),
            /*(files, cb)=> {
                // Fusión!
                let allFiles = [...that.current.files, ...that.current.thumbs];
                async.each(allFiles, (file, callback)=> {
                    let fname = file.split('/').reverse()[0];
                    if(allFiles.indexOf(fname) < 0)
                    {
                        // Borra esa mierda
                        fs.unlink(file, callback);
                    }
                    else
                    {
                        callback();
                    }
                }, cb);
            }*/
        ], err =>
        {
            if(err)
            {
                // Hubo un error
                if(that.current.by.connected) that.current.by.emit('queueFailed', 'Se ha producido un error en el servidor.');
                return;
            }
            // Verificar si el hilo tiene mas de 2 horas
            let elapsed = new Elapsed(thread.data.date, new Date());
            if(elapsed.hours < 2)
            {
                // TODO: Añadir un setInterval que verifique el hilo cada 5 minutos y lo elimine si da 404
                // antes de que cumpla 2 horas (excepto si lo eliminó OP, en ese caso se queda para arderle el culito)
            }
            // Reportar al navegador
            if (that.current.by.connected) {
                that.current.by.emit('archiverDone');
            }
            // Avanzar en la cola
            that.current = {};
            if (that.queue.length > 0) that.next();
        }));
    }

    // Reportar progreso al navegador
    reportProgress(text, current, total) {
        if (this.current.by.connected) {
            this.current.by.emit('progressReport', text, current, total);
        }
    }

    // Guardar archivos adjuntos de un post
    storeAttachment(post, callback) {
        let that = this;
        if (!post.file) return callback();
        async.waterfall([
            // Crear Directorios para archivos, si no existen
            cb => mkdirp(that.current.fileDir, cb),
            (made, cb) => mkdirp(that.current.thumbDir, cb),
            // Almacenar thumb
            (made, cb) => {
                // Ubicación final de la thumb
                let fileName  = post.file.thumb.split('/').reverse()[0];
                let thumbPath = that.current.thumbDir + fileName;
                that.current.thumbs.push(fileName);
                fs.exists(thumbPath, exists => {
                    if (exists) { 
                        cb(); 
                    }
                    else
                    {
                        // Descargar thumb
                        request(post.file.thumb).on('response', ()=>{cb()}).on('error', ()=>{cb()}).pipe(fs.createWriteStream(thumbPath));
                    }
                    // Establecer nueva ubicación
                    post.file.thumb = thumbPath;
                });
            },
            // Almacenar archivo
            cb => {
                // Ubicación final del archivo
                let fileName  = post.file.url.split('/').reverse()[0];
                let filePath = that.current.fileDir + post.file.url.split('/').reverse()[0];
                that.current.files.push(fileName);
                fs.exists(filePath, exists => {
                    if (exists) {
                        cb();
                    }
                    else{
                        // Descargar archivo
                        request(post.file.url).on('response',  ()=>{cb()}).on('error', ()=>{cb()}).pipe(fs.createWriteStream(filePath));
                    }
                    // Establecer nueva ubicación
                    post.file.url = filePath;
                });
            }
        ], err => {
            that.reportProgress('Guardando archivos...', ++that.current.saved, that.current.data.replyCount + 1);
            callback(null, post);
        });
    }
}

module.exports = new Archiver();