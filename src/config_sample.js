let count = 0;
let config = {};
let thing = {};
let uploadArray = [];
let downloadArray = [];

// build thing
thing.parentHostName = 'localhost';
thing.parentPort = '3105';
thing.host = 'xxx.xxx.xxx.xxx';
thing.port = '50212';

// build upload
count = 5;
for(let i=0; i<count; i++) {
    uploadArray[i] = {};
    uploadArray[i].id = `illum#${i+1}`;
    uploadArray[i].name = `container_illum_${i+1}`;
}
count = uploadArray.length;
uploadArray[count] = {};
uploadArray[count].id = 'led#1';
uploadArray[count].name = 'container_led_1';

// build download
count = 1;
for(let i=0; i<count; i++) {
    downloadArray[i] = {};
    downloadArray[i].id = `led#${i+1}`;
    downloadArray[i].name = `container_led_${i+1}`;
}

config.thing = thing;
config.uploadArray = uploadArray;
config.downloadArray = downloadArray;

module.exports = config;
