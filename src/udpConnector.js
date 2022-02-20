import dgram from 'dgram';

import wdt from 'lib/wdt';
import { thing, upload_arr } from 'conf';

let socket = null;
let res_data = '';

const onListening = () => {
    console.log('[udpConnector] : Listening UDP server start');
}

const onMessage = (message) => {
    res_data = message.toString();
    console.log(res_data);
}

const onClose = () => {
    console.log('[udpConnector] : Listening UDP server close');
}

const onSensing = () => {
    const msg = new Buffer.from('AT+PRINT=SENSOR_DATA\r\n');
    console.log("[udpConnector] : Send request message")
    socket.send(msg, 0, msg.length, thing.port, thing.host, (err) => {
        if (err) {
            console.log('[udpConnector] : Sending message failed', err);
            return;
        }
    });
}

exports.initialize = () => {
    return new Promise(async (resolve, reject) => {
        socket = dgram.createSocket('udp4');
        socket.on('listening', onListening);
        socket.on('message', onMessage);        
        socket.on('close', onClose);

        try {
            await socket.bind(thing.port);
            resolve({state: 'connect_upload'});
        } catch (e) {
            reject(e);
        }
    });
}