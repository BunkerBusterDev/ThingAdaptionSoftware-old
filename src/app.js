import wdt from 'lib/wdt';

import data from 'data';
import AeClient from 'ae_client';
import ThingConnector from 'thing_connector';

let initState = 'init_aeClient';

const initialize = async () => {
    console.log(`[initState] : ${initState}`);
    try {
        if (initState === 'init_aeClient') {
            const { state } = await AeClient.initialize();
            initState = state;
        } else if(initState === 'init_thingConnector') {
            const { state } = await ThingConnector.initialize();
            initState = state;
        } else if(initState ==='connect_aeClient') {
            const { state } = await AeClient.connect();
            initState = state;
        } else if(initState === 'start_sensing') {
            wdt.set_wdt('app/onSensing', 1, ThingConnector.startSensing);
            initState = 'ready';
        } else if(initState === 'ready') {
            console.log(data.getData());
            // wdt.del_wdt('app/initialize');
        }
    } catch (e) {
        console.log(e);
    }
}

wdt.set_wdt('app/initialize', 1, initialize);