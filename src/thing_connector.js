import dgram from 'dgram';

import data from 'data';
import { thing } from 'conf';
import { sleep } from 'lib/sleep';

let state = '';
let socket = null;
let res_data = '';

const onListening = () => {
    console.log('[Thing Connector] : start');
}

const onMessage = (message) => {
    res_data = message.toString();
    res_data = res_data.replace('data', '"data"')
    res_data = res_data.replace(/\t/gi, '')
    res_data = res_data.replace(/\r\n/gi, '');

    if(res_data.includes('data') && res_data.includes('}]}')) {
        res_data = res_data.substring(res_data.indexOf('data')-2, res_data.length);
        let tmp_arr = JSON.parse(res_data).data;

        //// 임시 데이터 ///
        for(let i=1; i<5; i++) {
            tmp_arr[i] = {
                count: `${i}`,
                type: tmp_arr[0].type,
                mac: tmp_arr[0].mac.replace('200', `20${i}`),
                illum: (tmp_arr[0].illum*1+(Math.random()*2-1)).toFixed(2),
                rxTick: `${(Math.random()*(1000)).toFixed(2)}`
            }
        }
        for(let i=0; i<tmp_arr.length; i++) {
            const cntname = `cnt_illum_${tmp_arr[i].count*1+1}`;
            const con = `${tmp_arr[i].illum}`;
            data.setData(cntname, con);
        }
    }
}

const onClose = () => {
    console.log('[Thing Connector] : close');
}

const onSensing = () => {
    return new Promise(async (resolve, reject) => {
        const msg = new Buffer.from('AT+PRINT=SENSOR_DATA\r\n');
        console.log("[Thing Connector] : request")
        await socket.send(msg, 0, msg.length, thing.port, thing.host, (err) => {
            if (err) {
                reject(`[Thing Connector] : request failed\r\n${err}`);
            } else {
                resolve(true);
            }
        });
    });
}

exports.initialize = () => {
    return new Promise(async (resolve, reject) => {
        if(state != 'wait') {
            state = 'wait';
            socket = dgram.createSocket('udp4');
            socket.on('listening', onListening);
            socket.on('message', onMessage);        
            socket.on('close', onClose);
    
            try {
                socket.bind(thing.port);
                await onSensing();
                
                sleep(1000).then(() => {
                    if(res_data != '') {
                        state = '';
                        res_data = '';
                        resolve({state: 'connect_aeClient'});
                    }
                });
            } catch (e) {
                reject(e);
            }
        }
    });
}

exports.startSensing = () => {
    onSensing();
}