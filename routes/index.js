'use strict';

const express = require('express');
const router = express.Router();
const marked = require('marked');
const news = marked(require('fs').readFileSync('news.md', 'utf-8'));
const publicSettings = require('../settings');

router.get('/', (req, res)=>
{
    // CloudFlare server push
    res.set('Link', '</dist/app.min.js>; rel=preload, </semantic/semantic.min.css>; rel=prefetch, </stylesheets/css/nprogress.css>; rel=prefetch, </semantic/semantic.js>; rel=prefetch');
    res.render('index', {
    title: `${publicSettings.site.title} - ${publicSettings.site.subtitle}`,
    settings: publicSettings,
    news: news,
    });
});
    
module.exports = router;