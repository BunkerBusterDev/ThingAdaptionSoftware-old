import { upload_arr } from 'conf';

let data = [];

for(let i=0; i<upload_arr.length; i++) {
    data[i] = {}
    data[i].cntname = upload_arr[i].name;
    data[i].con = ''
}

exports.getData = (cntname) => {
    if(cntname) {
        for(let i=0; i<data.length; i++) {
            if(data[i].cntname == cntname) {
                return data[i].con;
            }
        }
    } else {
        return data;
    }
};

exports.setData = (cntname, con) => {
    for(let i=0; i<data.length; i++) {
        if(data[i].cntname == cntname) {
            data[i].con = con;
        }
    }
};