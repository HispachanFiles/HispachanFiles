/**
 * Maneja la configuración (client-side) de Hispachan Files
 */
'use strict';
import settings from '../../settings';

export class Settings
{
    constructor(app)
    {
        this.app = app;
        if(localStorage.hfSettings)
        {
            app.data.settings = JSON.parse(localStorage.hfSettings);
        }
        this.data = app.data.settings;
        this.loadStyles();
    }
    
    loadStyles()
    {
        let styleLink = document.getElementById('mainStyle');
        mainStyle.href = '/stylesheets/'+ this.data.style +'.css';
        if(this.data.useCustomCSS)
        {
            $('<style id="customStyle"></style>').text(this.data.customCSS).appendTo('body');
        }
    }
    
    updateStyles()
    {
        this.data = this.app.data.settings;
        let styleLink = document.getElementById('mainStyle');
        mainStyle.href = '/stylesheets/'+ this.data.style +'.css';
        $('#customStyle').remove();
        if(this.data.useCustomCSS)
        {
            $('<style id="customStyle"></style>').text(this.data.customCSS).appendTo('body');
        }
    }
    
    showModal()
    {
        let that = this;
        let previousSettings = this.app.data.settings;
        $('#hfSettings').modal({
            closable: false,
            onDeny()
            {
                that.app.data.settings = previousSettings;
            },
            onApprove : function() {
                that.saveSettings();
                that.updateStyles();
            }
        }).modal('show');
    }
    
    saveSettings()
    {
        localStorage.hfSettings = JSON.stringify(this.app.data.settings);
    }
}

export const defaultSettings = 
{
    style: settings.styles.defaultStyle,
    useCustomCSS: false,
    customCSS: ''
}