import wdt from 'lib/wdt';

import UploadClient from 'uploadClient';
import UdpConnector from 'udpConnector';

let initState = 'init_upload';

const initialize = async () => {
    console.log(`[initState] : ${initState}`);
    try {
        if (initState === 'init_upload') {
            const { state } = await UploadClient.initialize();
            initState = state;
        } else if(initState === 'connect_thing') {
            const { state } = await UdpConnector.initialize();
            initState = state;
        } else if(initState ==='connect_upload') {
            const { state } = await UploadClient.connectUpload();
            initState = state;
        } else if(initState === 'ready') {
            wdt.del_wdt('app/initialize');
        }
    } catch (e) {
        console.log(e);
    }
}

wdt.set_wdt('app/initialize', 2, initialize);