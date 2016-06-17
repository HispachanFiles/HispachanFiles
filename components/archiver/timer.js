/**
 * Temporizador de Hilos
 * 
 * Cada 5 minutos, revisa si el hilo está aún online, hasta que este cumpla
 * al menos 2 horas de antigüedad (en Hispachan).
 * 
 * Si se detecta un 404, y no está presente <!-- Mensaje de OP --> en
 * el cuerpo, es muy probable que haya sido eliminado por un mod, por lo tanto
 * se eliminará automáticamente de la base de datos.
 * 
 * >inb4 los hilos en /fun/
 * Estoy casi seguro de que duran mas de 2 horas, sobre todo tomando en consideración
 * el mínimo de respuestas.
 */
'use strict';

const delThread = require('../deleteThread');
const request = require('request');
const Elapsed  = require('elapsed');

class ArchiverTimer
{
    constructor(thread)
    {
        this.thread = thread;
        this.online = true;
        this.shouldDelete = false;
        this.interval = setInterval(()=>this.tick(), 300000); //5min
    }

    tick()
    {
        // Revisamos si el hilo sigue en línea
        this.checkOnline();
        if(this.shouldDelete)
        {
            // Hora del homicidio!
            delThread(this.thread, e => { if(e) { console.error(e) } });
        }
        // Revisamos si ya pasaron mas de 2 horas
        let elapsed = new Elapsed(this.thread.date, new Date());
        if(elapsed.hours.num >= 2 || !this.online)
        {
            // Hora del suicidio!
            clearInterval(this.interval);
        }
    }

    // Revisa si el hilo está online
    checkOnline()
    {
        let that = this;
        let url = `https://www.hispachan.org/${this.thread.board}/res/${this.thread.postId}.html`;
        // Relizar el request
        request(url, (err, res, body) => {
            if (err) return;
            // Está en 404. RIP.
            if (res.statusCode == 404) {
                that.online = false;
                // Lo borró OP, o un Mod? Si es lo segundo hay que eliminarlo sin piedad.
                that.shouldDelete = res.body.indexOf("En este caso fue OP quien decidió borrar su hilo") < 0;
            }
        });
    }
}

module.exports = ArchiverTimer;