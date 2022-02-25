import dgram from 'dgram';

import config from 'config';
import { sleep } from 'lib/sleep';

import ApplicationEntityConnector from 'applicationEntityConnector';

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
            let thingDataArray = JSON.parse(responseData).data;

            //// 임시 데이터 ///
            for(let i=1; i<10; i++) {
                thingDataArray[i] = {
                    count: `${i}`,
                    type: thingDataArray[0].type,
                    mac: thingDataArray[0].mac.replace('200', `20${i}`),
                    illum: (thingDataArray[0].illum*1+(Math.random()*2-1)).toFixed(2),
                    rxTick: `${(Math.random()*(1000)).toFixed(2)}`
                }
            }

            if(state === 'connected') {
                let contentInstanceArray = [];
                for(let i=0; i<thingDataArray.length; i++) {
                    contentInstanceArray[i] = {};
                    contentInstanceArray[i].containerName = `container_illum_${thingDataArray[i].count*1+1}`;
                    contentInstanceArray[i].content = `${thingDataArray[i].illum}`;
                    ApplicationEntityConnector.uploadContentInstance(contentInstanceArray[i].containerName, contentInstanceArray[i].content);
                }
                // ApplicationEntityConnector.uploadContentInstanceAll(contentInstanceArray);
            }
        }
    }
}

const onError = () => {
    console.log('[Thing Connector] : close');
    state = '';
    restart();
}

const onSensing = () => {
    return new Promise((resolve, reject) => {
        if(state === 'wait' || state === 'connected') {
            const message = new Buffer.from('AT+PRINT=SENSOR_DATA\r\n');
            thingConnector.send(message, 0, message.length, config.thing.port, config.thing.host, (error) => {
                if (error) {
                    state = '';
                    reject(`[Thing Connector] : request sensor data failed\r\n${error}`);
                } else {
                    resolve(true);
                }
            });
        }
    });
}

exports.initialize = () => {
    return new Promise((resolve, reject) => {
        if(state != 'wait') {
            state = 'wait';
            thingConnector = dgram.createSocket('udp4');
            thingConnector.on('listening', onListening);
            thingConnector.on('message', onMessage);        
            thingConnector.on('error', onError);
    
            try {
                thingConnector.bind(config.thing.port);
                onSensing().then(() => {
                    sleep(1000).then(() => {
                        if(responseData != '') {
                            responseData = '';
                            state = 'connected';
                            resolve({state: 'connect-applicationEntityConnector'});
                        } else {
                            reject('[Thing Connector] : UDP message is sent but no response');
                        }
                    });
                });
            } catch (error) {
                state = '';
                reject(`[Thing Connector] : ${error}`);
            }
        }
    });
}

exports.startSensing = () => {
    onSensing();
}

exports.restart = () => {
    return new Promise((resolve, reject) => {
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