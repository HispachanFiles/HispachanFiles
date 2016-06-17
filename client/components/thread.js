/**
 * Contiene distintos eventos para los hilos
 */
'use strict';

export default class Thread
{
    constructor(board, id)
    {
        this.board = board;
        this.postId = id;
    }
    
    // Expandir Imágenes
    // TODO: Expandir WEBM
    expandThumb(imgEl)
    {
        let expandUrl = $(imgEl).parent().parent().prop('href');
        if(expandUrl.substr(-4) == 'webm') return;
        
        if($(imgEl).is('[expand]'))
        {
            // Fix para imágenes muy altas
            if ($(imgEl).height() >= $(window).height() && $(window).scrollTop() > $(imgEl).offset().top - 64) {
                $(window).scrollLeft(0).scrollTop($(imgEl).offset().top - 64);
            }
            $(imgEl).prop('src', $(imgEl).data('thumbUrl'));
            $(imgEl).removeAttr('expand');
            $(imgEl).removeAttr('style');
        }
        else
        {
            $(imgEl).data('thumbUrl', $(imgEl).prop('src'));
            $(imgEl).prop('src', expandUrl);
            $(imgEl).attr('expand','');
            $(imgEl).css({
                'max-width': '98%',
                'max-height': '100%',
            });
        }
        
        return false;
    }
    
    setEvents($)
    {
        let that = this;
        
        // Expandir imágenes
        $('img.thumb').click(ev=> that.expandThumb(ev.currentTarget));
    }
}