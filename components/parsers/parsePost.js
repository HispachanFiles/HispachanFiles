'use strict';

/**
 * Obtener los datos de cada post.
 * @param {Cheerio} post
 * @param {Cheerio} $
 * @return {Object} data
 */

function postMeta(post, $) {
    let data = {};
    // ID de posteo
    data.postId = parseInt(post.find('.reflink').first().find('a').last().text().trim());
    // Nombre del posteador (en boards con campo de nombre)
    data.posterName = post.find("span.postername").first().text().trim();
    
        
    // Bandera
    if (post.find(".bandera").length > 0) {
        let bandera = post.find(".bandera").first();
        data.posterCountry = bandera.attr("alt");
        data.posterCountryName = bandera.attr("title");
        data.flag = bandera.attr("src");
    }
        
    // Fecha y Hora
    let dateRe    = /(\d{1,2})\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2})/;
    let dateParts = post.find('[title*="Horario"]').first().text().trim().match(dateRe);
    // Workaround temporal para hilos < Abril 2015
    if(post.find('small').length)
    {
        let pObj  = post.find('small').first().parent().text().split('\n');
        let pDate = pObj[5] || pObj[2];
        if (pObj[10]) pDate = pObj[10]; // idk, solo funciona
        dateRe = /(\d{1,2})\/(\d{1,2})\/(\d{1,2}).*(\d{1,2}):(\d{1,2}).*/;
        let dP = pDate.match(dateRe);
        dateParts = [dP[0], dP[3], dP[2], dP[1], dP[4], dP[5]];
    }
    let date      = new Date(
        parseInt('20' + dateParts[3]),
        parseInt(dateParts[2]) -1,
        parseInt(dateParts[1]),
        parseInt(dateParts[4]),
        parseInt(dateParts[5])
        );
    data.date = date;
        
    // Mensaje
    let html = post.find('blockquote').first().html();
    // Convertir HTML a BBCode de Hispa
    html = html.replace(/<div class="code(.*?)">(.*?)<\/div>/gmi, "[code]$2[/code]"); // [code]
    html = html.replace(/<b(.*?)>(.*?)<\/b>/gmi, "[b]$2[/b]"); // [b]
	html = html.replace(/<i(.*?)>(.*?)<\/i>/gmi, "[i]$2[/i]"); // [i]
    html = html.replace(/<span style="border-bottom(.*?)">(.*?)<\/b>/gmi, "[u]$2[/u]"); // [u] (que mierda zeta?)
    html = html.replace(/<strike(.*?)>(.*?)<\/strike>/gmi, "[s]$2[/s]"); // [s]
    html = html.replace(/<span class="spoiler(.*?)">(.*?)<\/spoiler>/gmi, "[spoiler]$2[/spoiler]"); // [spoiler]
    html = html.replace(/<a id="embed(.*?)">(.*?)<\/a>/gmi, ""); // [Reproducir]
    post.find('blockquote').first().html(html); 
    post.find('.abbrev').first().remove();
    // Resultado del dado
    let dC = post.find('blockquote').first().find('font[color="red"]');
    if(dC.length > 0)
    {
        data.dado = dC.first().text().substr(2).trim();
        dC.remove();
    }
    data.message = post.find('blockquote').first().text().trim().replace(/(\r\n|\r)/gm, "\n");
    
    // Archivo
    if (post.children('.filesize').length >= 1 || post.find('.activa').children('.filesize').length >= 1) {
        let fileInfo = post.find('.filesize').first();
        let fileMeta = fileInfo.children('span[style^="font-size"]').first();
        let fileMetaR = fileMeta.text().replace(/(\r\n|\n|\r|[()])/gm, "").split(',');
        let fileSize = fileMetaR[0].trim();
        let fileRes = (fileMetaR.length > 2) ? fileMetaR[1].trim() : '';
        let fileON = (fileMetaR.length > 2) ? fileMetaR[2].trim() : fileMetaR[1].trim();
        data.file = {
            url: fileInfo.find('a').first().attr('href'),
            size: fileSize,
            resolution: fileRes,
            name: fileON,
            thumb: post.find('img.thumb').first().attr('src')
        };
        // Workaround temporal para hilos original importados desde Web Archive al viejo hispafiles
        if(data.file.url.substr(0, 5) == '/web/')
        {
            data.file.url = 'http://web.archive.org' + data.file.url;
            data.file.thumb = 'http://web.archive.org' + data.file.thumb;
        }
    }
    
    return data;
}

module.exports = postMeta;