/**
 * Hispachan Files Front End
 */
'use strict';

import jQuery from 'jquery';
import NProgress from 'nprogress';
import Vue from 'vue';
import {Archiver, archiverState} from './components/archiver';
import {Settings, defaultSettings} from './components/settings';
import renderPostMessage from './components/renderer';
import Thread from './components/thread';

class HispachanFiles {
    constructor() {
        this.data = { archiver: archiverState, settings: defaultSettings };
        // Mostrar barra de carga inicial
        NProgress.start();
        // Si no coloco jQuery en una variable global, la perra de semantic-ui deja de funcionar
        window.jQuery = jQuery;
        window.$ = jQuery;
        this.settings = new Settings(this);
        this.assignEvents();
    }
    
    // Eventos básicos
    assignEvents() {
        let that = this;
        // Clásico
        $(document).ready(() => { that.documentReady() });
    }

    documentReady() {
        let that = this;
        $('#sideToggle').click(e=> {
            $('#mainSb').sidebar('toggle');
            return false;
        });

        $('#mainTabs .item').tab();
        
        $('#saveBtn').click(e=> {
            if(that.data.archiver.working) return;
            let archiver = new Archiver(that.data.archiver.url, that);
            archiver.start();
        })
        
        $('#threadSearch').search({
            apiSettings: {
                url: '/ui-search?q={query}'
            },
            type: 'standard'
        });
        
        $('#settingsBtn').click(e=>that.settings.showModal());
        
        $(document.body).on('click', '#copyBtn', e=> {
            if(document.queryCommandSupported('copy'))
            {
                $('#copyBox').select();
                document.execCommand('copy');
            }
            else
            {
                prompt('Tu navegador no soporta el copiado. Pulsa Ctrl+C para copiar manualmente.', $('#copyBox').val())
            }
        });
        
        // Estamos en un Hilo
        if($('#hispaBox').length)
        {
            let hB = $('#hispaBox');
            let th = new Thread(hB.prop('hf-board'), hB.prop('hf-id'));
            this.threadControl = th;
            th.setEvents($);
        }
        
        // Uso Vue para el parseado
        Vue.use(require('vue-moment'));
        Vue.filter('renderPostMessage', renderPostMessage);
        
        this.app = new Vue({
            el: document.body,
            data: this.data,
            created: function () {
                NProgress.done();
            }
        });
    }
}

window.hispachanFiles = new HispachanFiles();