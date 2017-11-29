'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
var inspect = require('util').inspect;

const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233' // Public rippled server
});

api.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', () => {
    console.log('connected');
});
api.on('disconnected', (code) => {
    // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
    // will be 1000 if this was normal closure
    console.log('disconnected, code:', code);
});

// api.connect().then(() => {
//     /* begin custom code ------------------------------------ */
//     const myAddress = 'rKRH6WRAzVkikgAowNT1NYGA7KxQ8i8jAT';
//     console.log(api.getFee())

//     console.log('getting account info for', myAddress);
//     return api.getAccountInfo(myAddress);

// }).then(info => {
//     console.log(JSON.stringify(info, null, 2));
//     console.log(inspect(info, true, 2, true));
//     console.log('getAccountInfo done');

//     /* end custom code -------------------------------------- */
// }).then(() => {
//     return api.disconnect();
// }).then(() => {
//     console.log('done and disconnected.');
// }).catch(console.error);

const myAddresses = ['rKRH6WRAzVkikgAowNT1NYGA7KxQ8i8jAT', 'rh8bX8NibTfS1M2jaNSbPWENSGU9AvRMyB', 'rMVc9QGsa6g6AynmPdmwWMsVa5oTJWPUqL', 'rLCsDMh99xDYJLg8FtMY99mZdrWWvKwBfu', 'rH7HDXeGY4tAHnCDLPVSbKPG2nFqF54UYC'];

myAddresses.forEach(function (addr) {
    api.connect().then(() => {
        return api.getAccountInfo(addr);
    }).then(info => {
        console.log(addr)
        console.log(inspect(info, true, 2, true));
    }).catch(console.error);
}, this);


