'use strict';

const threadMeta = require('./parseThread');

/**
 * Obtener los datos de cada board.
 * @param {Cheerio} board
 * @param {Cheerio} $
 * @param {Number} page
 * @return {Object} data
 */
function boardMeta(board, $, page) {
    // Objeto para almacenar los datos
    var data = {};
    // Buscar hilos
    var threads = board.find('[id^="thread"]');
    data.board = $('input[name="board"]').val();
    data.page = page;
    data.threads = [];
    threads.each((i, el) => {
        data.threads.push(threadMeta($(el), $));
    });
    
    return data;
}

module.exports = boardMeta;