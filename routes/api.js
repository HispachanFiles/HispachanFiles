'use strict';

const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const js2xmlparser = require("js2xmlparser");
const parseThread = require('../components/parsers/parseThread.js');
const parseBoard = require('../components/parsers/parseBoard.js');
const publicSettings = require('../settings');

// Responder con XML o JSONP dependiendo de la solicitud
function parseResponse(req, res, data, root) {
    if ((typeof req.query.xml == 'undefined' && typeof req.body.xml == 'undefined')) {
        res.jsonp(data);
    }
    else {
        res.end('No soportado aún.');
    }
}

router.get('/', (req, res, next) => {
    res.render('api', {
        title: `Api - ${publicSettings.site.title}`,
        settings: publicSettings,
    });
});

router.get('/hispachan/:board/res/:th', (req, res, next) => {
    let data = {};
    let thId = req.params.th.split('.')[0];
    let board = req.params.board;

    // Enviar la solicitud a Hispachan
    request(`https://www.hispachan.org/${board}/res/${thId}.html`, (err, resp, body) => {
        if (res.statusCode == 404) {
            // El hilo está en 404.
            parseResponse(req, res, { status: 404 });
            return;
        }
        if (err) {
            // Otro error
            parseResponse(req, res, { status: 500 });
            return;
        }
        // Cargar HTML y parsear con Cheerio
        let $ = cheerio.load(body);
        let th = $('[id^="thread"]');

        data = (th.length > 0) ? parseThread(th.first(), $) : { status: 404 };
        parseResponse(req, res, data, 'thread');
    });
});

router.get('/hispachan/:board/:page?', (req, res, next) => {
    let data = {};
    let page = req.params.page || 0;
    let board = req.params.board;

    // Enviar la solicitud a Hispachan
    request(`https://www.hispachan.org/${board}/` + (page > 0 ? page + '.html' : ''), (err, resp, body) => {
        if (res.statusCode == 404) {
            parseResponse(req, res, { status: 404 });
            return;
        }
        if (err) {
            parseResponse(req, res, { status: 500 });
            return;
        }
        
        // Cargar HTML y parsear con Cheerio
        let $ = cheerio.load(body);
        let board = $('body');
        
        data = (board.find('input[name="board"]').length > 0) ? parseBoard(board, $, page) :  { status: 404 };
        parseResponse(req, res, data, 'board-page');
    });
});

router.get('/hispachan/', function(req, res, next) {
    let data = {};
    data.apiVersion = '0.3.0';
    request(`https://www.hispachan.org/${board}/res/${thId}.html`, (err, resp, body) => {
        if (res.statusCode == 404 || err) {
            parseResponse(req, res, { status: 500 });
            return;
        }
        let $ = cheerio.load(str);
        // Obtener un listado completo de boards
        if (board.find('input[name="board"]').length > 0) {
            let boardLinks = $('.barra').first().find('a[rel="board"]');
            data.boards = [];
            boardLinks.each((ix, el) => {
                data.boards.push({
                    path: $(el).attr('href'),
                    title: $(el).attr('title')
                });
            });
        }
        else {
            data = { status: 404 }
        }
        
        parseResponse(req,res,data, 'hispachan')
    });
});

module.exports = router;
