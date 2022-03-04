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
    console.log("ThningAdaptionSoftware restart");
    initState = 'init-applicationEntityConnector';

    await ApplicationEntityConnector.restart();
    await ThingConnector.restart();
    await WatchdogTimer.deleteWatchdogTimer('app/onSensing');

    await WatchdogTimer.deleteWatchdogTimer('app/initialize');
    await WatchdogTimer.setWatchdogTimer('app/initialize', 1, initialize);
}

=======
import WatchdogTimer from 'lib/watchdogTimer';

import ApplicationEntityConnector from 'applicationEntityConnector';
import ThingConnector from 'thingConnector';

let initState = 'init-applicationEntityConnector';

const initialize = async () => {
    console.log(`[initState] : ${initState}`);
    try {
        if(initState === 'init-applicationEntityConnector') {
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
        console.log(error);
        initState = 'init-applicationEntityConnector';
        
        ApplicationEntityConnector.restart();
        ThingConnector.restart();
        WatchdogTimer.deleteWatchdogTimer('app/onSensing');
    }
}

exports.restart = function() {
    console.log("ThingAdaptionSoftware restart");
    initState = 'init-applicationEntityConnector';
    
    ApplicationEntityConnector.restart();
    ThingConnector.restart();
    WatchdogTimer.deleteWatchdogTimer('app/onSensing');

    WatchdogTimer.deleteWatchdogTimer('app/initialize');
    WatchdogTimer.setWatchdogTimer('app/initialize', 1, initialize);
}

>>>>>>> dev
WatchdogTimer.setWatchdogTimer('app/initialize', 1, initialize);