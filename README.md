<center>
![Hispachan Files](public/images/md_banner.png)
</center>


Hispachan Files es una herramienta para guardar hilos de [hispachan.org](https://www.hispachan.org). También ofrece una API no-oficial para el mismo.

Utiliza [Node.js](https://nodejs.org/) en el servidor, [Mongo](https://www.mongodb.org/) como base de datos y [Vue.js](http://www.vuejs.org/) + [Semantic UI](http://semantic-ui.com/) para el front end.

Este es el primer proyecto de gran escala que hago en Node, así que si hay algo en mi código que te arda el culito, no seas marica y abre un pull request.

## Instalación Local

- Instala Node.js y Mongo
- Descarga / Clona el repositorio:
```
git clone --recursive https://github.com/HispachanFiles/HispachanFiles.git
```
- Edita los archivos de configuración (`settings.js` y `server-settings.js`).
- Abre una terminal en la carpeta del repositorio
- Instala las dependencias:
```
npm install
```
- Inicia el servidor:
```
npm start
```
- Abre http://localhost:8000 desde tu navegador

Listo, ahora tienes tu propio HispaFiles de uso personal <s>para guardar tus cepillos</s>.

## Cosas por hacer

Esta nueva versión de HispaFiles está hecha completamente desde cero, así que aún hay un par de cosas que hacen falta. Esto es lo que se me ocurre de momento:

 - [x] Expandir imágenes en la misma página
 - [ ] Expandir WEBMS
 - [x] Eliminar hilos si no cumplen 2 horas de antigüedad en Hispa
 - [ ] Añadir "backlinks" a las respuestas
 - [ ] Añadir preview de refs
 - [x] Añadir los demás estilos (a parte de Hispachan)
 - [ ] Añadir la opción de descarga en zip
 - [x] Añadir una página dedicada a los resultados de búsqueda
 - [ ] Añadir estadísticas publicas en la página principal (número de hilos guardados, espacio usado, etc)

Si se te ocurre algo mas, o encuentras un bug, puedes [contactarme](mailto:hispachanfiles@gmail.com) o abrir una issue. O incluso mejor, podrías hacer una pull request.
