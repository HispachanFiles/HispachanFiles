/**
 * Front End Archivador de Hispachan Files
 */
'use strict';

import io from 'socket.io-client';
import urlParse from 'url-parse';
import settings from '../../settings';

export class Archiver
{
    constructor(url, parent)
    {
        this.socket      = io();
        this.url         = url;
        this.parent      = parent;
        this.progressObj = $('#archiverProgress');
    }
    
    // Inicia el archivado
    start()
    {
        let that = this;
        this.resetProgress();
        this.parent.data.archiver.hasData = false;
        this.parent.data.archiver.data    = {};
        this.parent.data.archiver.started = true;
        this.parent.data.archiver.working = true;
        this.parent.data.archiver.done    = false;
        
        // Verificar que la url sea válida
        let urlError = this.checkUrl();
        if(urlError)
        {
            this.displayError(urlError, true);
            return;
        }
        
        // Asignar Eventos
        this.socket.on('queueFailed', reason => {
            that.displayError(reason, true);
        });
        this.socket.on('queueSuccess', threadData => {
            that.parent.app.$set('archiver.data', threadData);
            that.setProgress('Esperando turno en cola...');
            that.parent.data.archiver.hasData = true;
        });
        this.socket.on('progressReport', (data1, data2, data3) => this.setProgress(data1, data2, data3))
        this.socket.on('archiverDone', ()=> {
            that.parent.data.archiver.done = true;
            that.parent.data.archiver.working = false;
            that.closeConnection();
            that.setProgress({ label:'ratio', text: { ratio: ' ', active: 'Terminado.', success: 'Terminado.' }, value: 100, total: 100 });
        });
        
        // Solicitar almacenamiento del hilo
        this.socket.emit('queueThread', this.url);
        this.setProgress('Procesando URL...');
    }
    
    // Muestra un error y opcionalmente desconecta el socket y desbloquea el campo de entrada de URL.
    displayError(reason, unlock=false)
    {
        this.setProgress({
            label: 'ratio',
            text: {success: reason, ratio:'Error'},
            value:1,
            total:1
        }).removeClass('success').addClass('error').removeClass('indicating');
        if(unlock)
        {
            this.parent.data.archiver.working = false;
            this.closeConnection();
        }
    }
    
    // Verifica localmente la URL, para evitar cargar innecesariamente el servidor
    checkUrl()
    {
        let url = urlParse(this.url);
        if(url.hostname != 'www.hispachan.org' && url.hostname != 'www.hispachanfiles.org')
        {
            return 'Esta URL no pertenece a Hispachan ni a Hispachan Files';
        }
        if(!/\/(.+)\/res\/(\d+)(\.html)?/.test(url.pathname))
        {
            return 'Esta URL no pertenece a ningún hilo.';
        }
        this.parent.data.archiver.endUrl = settings.site.url + url.pathname;
    }
    
    // Establece el estado la barra de progreso (perdón por el código desastroso)
    setProgress(data, data2, data3)
    {
        if(typeof data == 'object') this.progressObj.progress(data);
        else if(typeof data == 'string') this.progressObj.progress({
            label:'ratio',
            text: {
                ratio: data2 ? '{value} de {total}' : '', 
                active: data,
                success: data
            },
            value: data2 || 0,
            total: data3 || 100
        });
        return this.progressObj;
    }
    
    // Reinicia la barra de progreso
    resetProgress()
    {
        this.progressObj.removeClass('error success').addClass('indicating');
        this.setProgress({
            label: 'ratio',
            text: {ratio: ''},
            value: 0,
            total: 100
        });
    }
    
    // Cierra el socket
    closeConnection()
    {
        this.socket.disconnect();
    }
}

// Hilo "vacío". Usado como placeholder para Vue
export let emptyThread = {
    id: 0,
    posterName: '',
    date: '',
    message: '',
    file: {
        url: '',
        size: '',
        resolution: '',
        name: '',
        thumb: ''
    },
    board: '',
    subject: '',
    replyCount: 0,
    replies: []
}

// Estado por defecto del archivador. Usado por Vue.
export const archiverState=
{
    working: false,
    started: false,
    done: false,
    url: '',
    endUrl: '',
    hasData: false,
    data: emptyThread
}
