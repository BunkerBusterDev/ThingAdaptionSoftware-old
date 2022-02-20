let ip = require("ip");

let conf = {};
let thing = {};
let upload_arr = [];
let download_arr = [];

// build thing
thing.parentHostName = 'localhost';
thing.parentPort = '3105';

// build upload
for(let i=0; i<9; i++) {
    upload_arr[i] = {};
    upload_arr[i].id = `illum#${i}`;
    upload_arr[i].name = `cnt-illum-${i}`;
}

upload_arr[upload_arr.length] = {};
upload_arr[upload_arr.length].id = 'timer';
upload_arr[upload_arr.length].name = 'cnt-timer';

// build download
for(let i=0; i<0; i++) {
    download_arr[i] = {};
    download_arr[i].id = `led#${i}`;
    download_arr[i].name = `cnt-led-${i}`;
}

conf.thing = thing;
conf.upload = upload_arr;
conf.download = download_arr;

module.exports = conf;
