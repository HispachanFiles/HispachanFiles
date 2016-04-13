'use strict';
const Thread = require('../models/thread');
const rimraf = require('rimraf');
const fs = require('fs');

/**
 * Elimina un hilo de la base de datos y todos los archivos relacionados
 * 
 * @param {Object} thread
 * @param {Function} callback
 */
function deleteThread(thread, callback)
{
    Thread.findOneAndRemove({postId: thread.postId, board: thread.board}, (err, res)=>
    {
        if(err)
        {
            callback(err);
            return;
        }
        else
        {
            rimraf(`data/${thread.board}/${thread.postId}`, callback);
        }
    });
}

module.exports = deleteThread;