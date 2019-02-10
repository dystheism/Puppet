'use strict';

import config from './config';
const io = require('socket.io')();

let app = {
    io: io,
    print: function() {
        console.log('[running] Socket.io');
    }
};

// Socket.io Commands
io.on('connection', socket => {
    console.log('[*] Websocket connection found!' + '\n');

    const marionette = require('./libraries/marionette/puppeteer_middleware');
    marionette.socketHandler(socket);
    /* socketHandler [events] list.
    * todo
    */

});

io.listen(config.port.socket);

module.exports = app;
