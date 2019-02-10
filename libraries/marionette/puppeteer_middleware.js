'use strict';

import * as Puppeteer from './puppeteer_model';

export function socketHandler(socket) {

    /**
     * Send client_identity message.
     */
    socket.emit('ready', {
        socketID: socket.id.toString()
    });

    socket.on('login', function(data) {
        console.log('[launch puppeteer STARTED]');
        Puppeteer.login(function(err, message) {
            if (err) {

            } else {
                socket.emit('response', {
                    api: 'login',
                    message: message
                });
            }
        });
    });

    socket.on('post', function(data) {
        console.log('[posting request]');
        Puppeteer.post(function(err, message) {
            if (err) {

            } else {
                socket.emit('response', {
                    api: 'login',
                    message: message
                });
            }
        });
    });

}
