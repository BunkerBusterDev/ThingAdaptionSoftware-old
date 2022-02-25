import WatchdogTimer from 'lib/watchdogTimer';

import ApplicationEntityConnector from 'applicationEntityConnector';
import ThingConnector from 'thingConnector';

let initState = 'init-applicationEntityConnector';

const initialize = async () => {
    console.log(`[initState] : ${initState}`);
    try {
        if (initState === 'init-applicationEntityConnector') {
            const { state } = await ApplicationEntityConnector.initialize();
            initState = state;
        } else if(initState === 'init-thingConnector') {
            const { state } = await ThingConnector.initialize();
            initState = state;
        } else if(initState ==='connect-applicationEntityConnector') {
            const { state } = await ApplicationEntityConnector.connect();
            initState = state;
        } else if(initState === 'start-sensing') {
            WatchdogTimer.setWatchdogTimer('app/onSensing', 1, ThingConnector.startSensing);
            initState = 'ready';
        } else if(initState === 'ready') {
            WatchdogTimer.deleteWatchdogTimer('app/initialize');
        }
    } catch (error) {
        restart();
    }
}

global.restart = async () => {
    await ApplicationEntityConnector.restart();
    await ThingConnector.restart();
    await WatchdogTimer.deleteWatchdogTimer('app/onSensing');

    initState = 'init-applicationEntityConnector';
    await WatchdogTimer.deleteWatchdogTimer('app/initialize');
    await WatchdogTimer.setWatchdogTimer('app/initialize', 1, initialize);
}

WatchdogTimer.setWatchdogTimer('app/initialize', 1, initialize);