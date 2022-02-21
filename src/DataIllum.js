let Illum = {
    Mode : '',
    P1 : 0.0,
    P2 : 0.0,
    P3 : 0.0,
    P4 : 0.0,
    P5 : 0.0,
    P6 : 0.0,
    P7 : 0.0,
    P8 : 0.0,
    P9 : 0.0,
    P10 : 0.0
};


exports.setMode = (mode) => {
    Illum['Mode'] = mode;
}

exports.getIllum = (num) => {

    if(!num) {
        return Illum;
    }

    return Illum[`P${num}`];
};

exports.setIllum = (num, illum) => {
    Illum[`P${num}`] = illum;
};