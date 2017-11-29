'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233' });  // wss://s1.ripple.com

api.connect().then(() => {
    api.getFee().then(fee => {
        console.log(JSON.stringify(fee, null, 2));
        process.exit();
    });
});
