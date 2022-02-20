import net from 'net';

import { thing, download_arr } from 'conf';

let upload_client = null;

const onReceive = () => {
        
}

const onError = (err) => {
    console.log(err);
}

const onClose = () => {
    console.log('[uploadClient] : Upload client is closed');
    upload_client.destroy();
}

const onConnect = () => {
    console.log('[uploadClient] : upload Connected');

    let thing_download_count = 0;
    for (let i = 0; i < download_arr.length; i++) {
        console.log('download Connected - ' + download_arr[i].name + ' hello');
        let cin = {cntname: download_arr[i].name, con: 'hello'};
        upload_client.write(JSON.stringify(cin) + '<EOF>');
    }

    if (thing_download_count >= download_arr.length) {
        tas_state = 'upload';
    }
}

exports.initialize = () => {
    return new Promise(async (resolve, reject) => {
        upload_client = new net.Socket();

        upload_client.on('data', onReceive);
        upload_client.on('error', onError);
        upload_client.on('close', onClose);

        if(upload_client) {
            console.log('[uploadClient] : Upload client is initialized');
            resolve({state: 'connect_thing'});
        } else {
            reject('[uploadClient] : Initializing upload client is failed')
        }
    });
}

exports.connectUpload = () => {
    return new Promise(async (resolve, reject) => {
        try {
            upload_client.connect(thing.parentPort, thing.parentHost, onConnect);
        } catch (e) {
            reject(e);
        }
    });
}