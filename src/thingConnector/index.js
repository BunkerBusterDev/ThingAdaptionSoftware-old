import dgram from 'dgram';

import config from 'config';
import { sleep } from 'lib/sleep';

import ContentInstance from 'thingConnector/contentInstance';

let state = '';
let thingConnector = null;
let responseData = '';

const onListening = () => {
    console.log('[Thing Connector] : start');
}

const onMessage = (message) => {
    if(state === 'wait' || state === 'connected') {
        responseData = message.toString();
        responseData = responseData.replace('data', '"data"')
        responseData = responseData.replace(/\t/gi, '')
        responseData = responseData.replace(/\r\n/gi, '');

        if(responseData.includes('data') && responseData.includes('}]}')) {
            responseData = responseData.substring(responseData.indexOf('data')-2, responseData.length);
            let dataArray = JSON.parse(responseData).data;

            //// 임시 데이터 ///
            for(let i=1; i<5; i++) {
                dataArray[i] = {
                    count: `${i}`,
                    type: dataArray[0].type,
                    mac: dataArray[0].mac.replace('200', `20${i}`),
                    illum: (dataArray[0].illum*1+(Math.random()*2-1)).toFixed(2),
                    rxTick: `${(Math.random()*(1000)).toFixed(2)}`
                }
            }

            for(let i=0; i<dataArray.length; i++) {
                const name = `container_illum_${dataArray[i].count*1+1}`;
                const content = `${dataArray[i].illum}`;
                ContentInstance.setContentInstance(name, content);
            }
        }
    }
}

const onClose = () => {
    console.log('[Thing Connector] : close');
    restart();
}

const onSensing = () => {
    return new Promise(async (resolve, reject) => {
        if(state === 'wait' || state === 'connected') {
            const message = new Buffer.from('AT+PRINT=SENSOR_DATA\r\n');
            await thingConnector.send(message, 0, message.length, config.thing.port, config.thing.host, (error) => {
                if (error) {
                    reject(`[Thing Connector] : request sensor data failed\r\n${error}`);
                } else {
                    resolve(true);
                }
            });
        }
    });
}

exports.initialize = () => {
    return new Promise(async (resolve, reject) => {
        if(state != 'wait') {
            state = 'wait';
            thingConnector = dgram.createSocket('udp4');
            thingConnector.on('listening', onListening);
            thingConnector.on('message', onMessage);        
            thingConnector.on('close', onClose);
    
            try {
                thingConnector.bind(config.thing.port);
                await onSensing();
                
                sleep(1000).then(() => {
                    if(responseData != '') {
                        responseData = '';
                        state = 'connected';
                        resolve({state: 'connect-applicationEntityConnector'});
                    }
                });
            } catch (error) {
                reject(error);
            }
        }
    });
}

exports.startSensing = () => {
    onSensing();
}

exports.restart = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if(thingConnector) {
                thingConnector.close();
            }
            resolve();
        } catch (error) {
            reject('[Thing Connector] : not running');
        }
    });
}