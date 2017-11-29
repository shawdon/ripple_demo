'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
var inspect = require('util').inspect;

const api = new RippleAPI({
    server: 'ws://wallet-xrp-node.aws.huobiidc.com:5005' // Public rippled server
    // server: 'wss://s1.ripple.com' // Public rippled server
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
api.on('ledger', ledger => {
//   console.log(JSON.stringify(ledger, null, 2));
});

function fail(message) {
    console.error("error", message);
    process.exit(1);
}

api.connect().then(() => {
    /* begin custom code ------------------------------------ */
    const id = '9DDAF003426476991E4F02D8B6D174875E6079BD75DA4F0F5F2A5B2573886d24';

    console.log('getTransaction for', id);
    return api.getTransaction(id);

}).then(tx => {
    console.log(inspect(tx, true, 4, true));
    console.log('getTransaction done');

    /* end custom code -------------------------------------- */
}).then(() => {
    return api.disconnect();
}).then(() => {
    console.log('done and disconnected.');
}).catch(fail);
