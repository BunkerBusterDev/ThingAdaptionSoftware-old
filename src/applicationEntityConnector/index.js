import net from 'net';

import { sleep } from 'lib/sleep';
import config from 'config';

let state = '';
let applicationEntityConnector = null;
let thingDownloadCount = 0;

const onReceive = (data) => {
    if (state === 'wait' || state === 'connected') {
        let dataArray = data.toString().split('<EOF>');

        if(dataArray.length >= 2) {
            for (let i = 0; i < dataArray.length - 1; i++) {
                let line = dataArray[i];
                let lineToJson = JSON.parse(line.toString());

                if (lineToJson.containerName == null || lineToJson.content == null) {
                    console.log('Received: data format mismatch');
                }
                else {
                    if (lineToJson.content == 'hello') {
                        console.log(`Received: ${line}`);

                        thingDownloadCount++;
                    }
                    else {
                        for (let j = 0; j < config.uploadArray.length; j++) {
                            if (config.uploadArray[j].name === lineToJson.containerName) {
                                console.log(`ACK : ${line} <----`);
                                break;
                            }
                        }

                        for (let j = 0; j < config.downloadArray.length; j++) {
                            if (config.downloadArray[j].name === lineToJson.containerName) {
                                let strjson = JSON.stringify({id: config.downloadArray[i].id, content: lineToJson.content});
                                console.log(`${strjson} <----`);
                                // control_led(lineToJson.content);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

const onError = (error) => {
    console.log(`[Application Entity Connector] : ${error}`);
    state = '';
    restart();
}

const onClose = () => {
    console.log('[Application Entity Connector] : close');
    state = '';
    restart();
}

exports.initialize = () => {
    return new Promise((resolve, reject) => {
        applicationEntityConnector = new net.Socket();

        applicationEntityConnector.on('data', onReceive);
        applicationEntityConnector.on('error', onError);
        applicationEntityConnector.on('close', onClose);

        if(applicationEntityConnector) {
            console.log('[Application Entity Connector] : init success');
            resolve({state: 'init-thingConnector'});
        } else {
            reject('[Application Entity Connector] : init failed')
        }
    });
}

exports.connect = () => {
    return new Promise((resolve, reject) => {
        if(state != 'wait') {
            state = 'wait';
            try {
                applicationEntityConnector.connect(config.thing.parentPort, config.thing.parentHost, () => {
                    console.log('[Application Entity Connector] : Connected');
                    
                    thingDownloadCount = 0;
                    for (var i = 0; i < config.downloadArray.length; i++) {
                        console.log('download Connected - ' + config.downloadArray[i].name + ' hello');
                        let contentInstance = {containerName: config.downloadArray[i].name, content: 'hello'};
                        applicationEntityConnector.write(JSON.stringify(contentInstance) + '<EOF>');
                    }

                    sleep(1000).then(() => {
                        if (thingDownloadCount >= config.downloadArray.length) {
                            thingDownloadCount = 0;
                            state = 'connected';
                            resolve({state: 'start-sensing'});
                        }
                    });
                });
            } catch (error) {
                state = '';
                reject(error);
            }
        }
    });
}

exports.uploadContentInstance = (containerName, content) => {
    for(let i=0; i<config.uploadArray.length; i++) {
        if(config.uploadArray[i].name === containerName) {
            let cin = {containerName: containerName, content: content};
            console.log(`SEND : ${JSON.stringify(cin)} ---->`);
            applicationEntityConnector.write(JSON.stringify(cin) + '<EOF>');
        }
    }
}

exports.uploadContentInstanceAll = (contentInstanceArray) => {
    let checkUploadArray = true;

    for(let i=0; i<config.uploadArray.length; i++) {
        if(config.uploadArray[i].name != contentInstanceArray[i].containerName) {
            checkUploadArray = false;
        }
    }

    if(checkUploadArray) {
        applicationEntityConnector.write(JSON.stringify(contentInstanceArray) + '<EOF>');
    }
}

exports.restart = () => {
    return new Promise((resolve, reject) => {
        try {
            if(applicationEntityConnector) {
                applicationEntityConnector.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}