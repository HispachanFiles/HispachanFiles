/**
 * Hispachan Files
 * 
 * Archivo de configuración.
 * Este archivo es visible desde los navegadores, no pongas información delicada aquí.
 */
'use strict';

module.exports=
{
    
    /* Configuración del sitio */
    site:
    {
        // Se muestra en la barra de título y el menú superior.
        title: 'Hispachan Files',
        // Se muestra en la barra de título de la página principal y en los motores de búsqueda.
        subtitle: 'Archivo de Hispachan',
        // Se muestra en los motores de búsqueda y cáncerbook
        description: 'Hispachan Files permite almacenar hilos de hispachan.org',
        // URL Base
        // Es importante que configures esto ya que es usado en varias partes.
        // Si usas https://, necesitas configurar un certificado en server-settings.js
        url: 'http://localhost:8000',
    },
    
    /* Características del sitio */
    features:
    {
        // Establecer en false para desactivar la búsqueda de hilos
        threadSearch: true,
        // Establecer en false para desactivar la descarga en zip de hilos
        zipDownload: true,
        // Establecer en false para desactivar el acceso externo a la API
        apiEnabled: true
    },
    
    /* Estilos */
    styles:
    {
        // Estilos (S)CSS disponibles (colocalos en /public/stylesheets/)
        available: ['Hispachan', 'Hispablue', 'Hispabook', 'Hispanaranja', 'Hispasecta', 'Hispagirl', 'Hispahack', 'Hispademon',  'Hispanight', 'Hispaenie', 'Hispagris', 'Hispamierda'],
        // Estilo por defecto
        defaultStyle: 'Hispachan'
    },
    
    /* Miscelaneo */
    misc:
    {
        // Correo electrónico de contacto.
        // De momento, se usa para los links de contacto, pero en un futuro
        // se enviarán automáticamente los reportes de hilos a esta dirección.
        email: 'zeta@pagalacoca.com',
    }
    
}