import net from 'net';

import { sleep } from 'lib/sleep';
import { thing, upload_arr, download_arr } from 'conf';

let state = '';
let upload_client = null;
let thing_download_count = 0;

const onReceive = (data) => {
    if (state === 'wait' || state === 'connected') {
        let data_arr = data.toString().split('<EOF>');

        if(data_arr.length >= 2) {
            for (let i = 0; i < data_arr.length - 1; i++) {
                let line = data_arr[i];
                let sink_obj = JSON.parse(line.toString());

                if (sink_obj.cntname == null || sink_obj.con == null) {
                    console.log('Received: data format mismatch');
                }
                else {
                    if (sink_obj.con == 'hello') {
                        console.log('Received: ' + line);

                        thing_download_count++;
                    }
                    else {
                        for (let j = 0; j < upload_arr.length; j++) {
                            if (upload_arr[j].cntname == sink_obj.cntname) {
                                console.log('ACK : ' + line + ' <----');
                                break;
                            }
                        }

                        for (j = 0; j < download_arr.length; j++) {
                            if (download_arr[j].cntname == sink_obj.cntname) {
                                let g_down_buf = JSON.stringify({id: download_arr[i].id, con: sink_obj.con});
                                console.log(g_down_buf + ' <----');
                                // control_led(sink_obj.con);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

const onError = (err) => {
    console.log(`[AE Client] : ${err}`);
}

const onClose = () => {
    console.log('[AE Client] : close');
    upload_client.destroy();
}

exports.initialize = () => {
    return new Promise(async (resolve, reject) => {
        upload_client = new net.Socket();

        upload_client.on('data', onReceive);
        upload_client.on('error', onError);
        upload_client.on('close', onClose);

        if(upload_client) {
            console.log('[AE Client] : init success');
            resolve({state: 'init_thingConnector'});
        } else {
            reject('[AE Client] : init failed')
        }
    });
}

exports.connect = () => {
    return new Promise(async (resolve, reject) => {
        if(state != 'wait') {
            state = 'wait';
            try {
                upload_client.connect(thing.parentPort, thing.parentHost, () => {
                    console.log('[AE Client] : Connected');
                    
                    thing_download_count = 0;
                    for (var i = 0; i < download_arr.length; i++) {
                        console.log('download Connected - ' + download_arr[i].name + ' hello');
                        let cin = {cntname: download_arr[i].name, con: 'hello'};
                        upload_client.write(JSON.stringify(cin) + '<EOF>');
                    }

                    sleep(1000).then(() => {
                        if (thing_download_count >= download_arr.length) {
                            state = '';
                            thing_download_count = 0;
                            state = 'connected';
                            resolve({state: 'start_sensing'});
                        }
                    });
                });
            } catch (e) {
                reject(e);
            }
        }
    });
}