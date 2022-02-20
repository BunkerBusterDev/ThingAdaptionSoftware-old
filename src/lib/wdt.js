let events = require('events');
let wdt = new events.EventEmitter();

let wdt_value_q = {};
let wdt_tick_q = {};
let wdt_callback_q = {};
let wdt_param1_q = {};
let wdt_param2_q = {};
let wdt_param3_q = {};

setInterval(() =>  {
    wdt.emit('watchdog');
}, 1000);

wdt.on('watchdog', () => {
    for (let id in wdt_value_q) {
        if(wdt_value_q.hasOwnProperty(id)) {
            ++wdt_tick_q[id];
            if((wdt_tick_q[id] % wdt_value_q[id]) === 0) {
                wdt_tick_q[id] = 0;
                if(wdt_callback_q[id]) {
                    wdt_callback_q[id](id, wdt_param1_q[id], wdt_param2_q[id], wdt_param3_q[id]);
                }
            }
        }
    }
});

exports.set_wdt = (id, sec, callback_func, param1, param2, param3) => {
    wdt_value_q[id] = sec;
    wdt_tick_q[id] = 0;
    wdt_callback_q[id] = callback_func;
    wdt_param1_q[id] = param1;
    wdt_param2_q[id] = param2;
    wdt_param3_q[id] = param3;
};

exports.get_wdt_callback = (id) => {
    return wdt_callback_q[id];
};

exports.get_wdt_value = (id) => {
    return wdt_value_q[id];
};

exports.del_wdt = (id) => {
    delete wdt_value_q[id];
    delete wdt_tick_q[id];
    delete wdt_callback_q[id];
};