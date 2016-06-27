'use strict';

const https = require('https');
const request = require('request');
const urlParse = require('url-parse');
const cheerio = require('cheerio');
const thParse = require('../components/parsers/parseThread');
const thTest = require('../components/testThread');
const archiver = require('../components/archiver/');

module.exports = socket => {
    // Solicitud de almacenamiento de hilo.
    socket.on('queueThread', url => {
        let urlInfo;
        try { urlInfo = urlParse(url); }
        catch (e) {
            socket.emit('queueFailed', 'URL Inválida');
        }
        if (urlInfo.hostname != 'www.hispachan.org' && urlInfo.hostname != 'www.hispachanfiles.org') {
            socket.emit('queueFailed', 'Esta URL no pertenece a Hispachan ni a Hispachan Files');
            return;
        }
        if (!/\/(.+)\/res\/(\d+)(\.html)?/.test(urlInfo.pathname)) {
            socket.emit('queueFailed', 'Esta URL no pertenece a ningún hilo.');
            return;
        }

        // Obtener información del thread
        request(url, (err, res, body) => {
            try {
                if (res.statusCode == 404) { socket.emit('queueFailed', 'El Hilo está en 404.'); return; }
                if (err) { socket.emit('queueFailed', 'Se ha producido un error al obtener datos del hilo.'); return; }

                let $ = cheerio.load(body);
                let threadRaw = $('[id^="thread"]');
                let thread = thParse(threadRaw, $);
                if (thread.length < 1) { socket.emit('queueFailed', 'Se ha producido un error al obtener datos del hilo.'); return; }

                // Verificar que el hilo cumpla con los requistos
                let testResult = thTest(thread);
                if (testResult) {
                    socket.emit('queueFailed', testResult);
                }
                else {
                    // Poner el hilo en la cola de guardado
                    archiver.addToQueue(thread, socket);
                    socket.emit('queueSuccess', thread);
                }
            }
            catch(e)
            {
                socket.emit('queueFailed', 'Se ha producido un error al obtener datos del hilo.'); return; 
            }
        });
    });
}