'use strict';

const postMeta = require('./parsePost');

/**
 * Obtener los datos de cada hilo.
 * @param {Cheerio} thread
 * @param {Cheerio} $
 * @return {Object} data
 */
function threadMeta(thread, $) {
    // Objeto para almacenar los datos
    var data = {};
    // Metadatos básicos
    data = postMeta(thread);
    data.board = $('input[name="board"]').val();
    data.subject = $('span.filetitle').first().text().replace(/(\r\n|\n|\r)/gm, "");
    var replies = thread.find(".reply");
    data.replyCount = replies.length;
    var omitted = thread.find(".omittedposts");
    if(omitted.length > 0)
    {
        var oX = omitted.text();
        var oM = oX.match(/\d+/g);
        if(oM.length > 0)
        {
            data.omittedPosts = parseInt(oM[0]);
            data.replyCount += parseInt(oM[0]);
            data.omittedImages = (oM.length > 1) ? parseInt(oM[1]) : 0;
        }
    }
    data.replies = [];
    replies.each((i, el) => {
        data.replies.push(postMeta($(el), $));
    });
    
    return data;
}

module.exports = threadMeta;