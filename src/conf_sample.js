let conf = {};
let thing = {};
let upload_arr = [];
let download_arr = [];

// build thing
thing.parentHostName = 'localhost';
thing.parentPort = '3105';
thing.host = 'xxx.xxx.xxx.xxx';
thing.port = 'xxx';

// build upload
let count = 1;
for(let i=0; i<count; i++) {
    upload_arr[i] = {};
    upload_arr[i].id = `illum#${i+1}`;
    upload_arr[i].name = `cnt_illum_${i+1}`;
}
count = upload_arr.length;
upload_arr[count] = {};
upload_arr[count].id = 'led#1';
upload_arr[count].name = 'cnt_led_1';

// build download
count = 1;
for(let i=0; i<count; i++) {
    download_arr[i] = {};
    download_arr[i].id = `led#${i+1}`;
    download_arr[i].name = `cnt_led_${i+1}`;
}

conf.thing = thing;
conf.upload_arr = upload_arr;
conf.download_arr = download_arr;

module.exports = conf;
