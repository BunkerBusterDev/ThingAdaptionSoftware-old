import config from 'config';

let contentInstance = [];

for(let i=0; i<config.uploadArray.length; i++) {
    contentInstance[i] = {}
    contentInstance[i].name = config.uploadArray[i].name;
    contentInstance[i].content = '';
    contentInstance[i].isNew = false;
}

exports.getContentInstance = (name) => {
    if(name) {
        for(let i=0; i<contentInstance.length; i++) {
            if(contentInstance[i].name == name) {
                return contentInstance[i].content;
            }
        }
    } else {
        return contentInstance;
    }
};

exports.setContentInstance = (name, content) => {
    for(let i=0; i<contentInstance.length; i++) {
        if(contentInstance[i].name == name) {
            contentInstance[i].content = content;
            contentInstance[i].isNew = true;
        }
    }
};