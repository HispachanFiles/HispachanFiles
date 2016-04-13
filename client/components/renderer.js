/**
 * Ayuda a renderizar los mensajes de los posts
 */
'use strict';

export default function renderPostMessage(text)
{
    // Links
    text = text.replace(/(https?:\/\/[^\s]+)/g, url => `<a target="_blank" href="${url}">${url}</a>`);
    // BBCode
    text = text.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');
    text = text.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
    text = text.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');
    text = text.replace(/\[s\](.*?)\[\/s\]/g, '<s>$1</s>');
    // Descansa en paz, dulce príncipe
    text = text.replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '<span class="spoiler">$1</span>');
    // Code
    text = text.replace(/\[code\](.*?)\[\/code\]/g, '<div class="code">$1</code>');
    // Reflinks
    text = text.replace(/\>\>([r]?[l]?[f]?[q]?[0-9,\-,\,]+)/g, ref => {
        var rP = ref.substr(2);
        if($('[name="'+rP+'"]').length)
        {
            return `<a href="#${rP}" data-ref="${rP}">${ref}</a>`;
        }
        else
        {
            return `<a class="ref-futura" data-ref="${rP}">${ref}</a>`;
        }
    });
    // textoverde :^)
    text = text.replace(/^\>([^\>\n].+)$/gm, '<span class="unkfunc">&gt;$1</span>');
    // Saltos de línea
    text = text.replace(/\n/g, "<br />");
    
    return text;
}