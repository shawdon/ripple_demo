'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233' });  // wss://s1.ripple.com
const address = 'rKRH6WRAzVkikgAowNT1NYGA7KxQ8i8jAT';  // rD5L3TRgJSwbhjptesyGJMyLFg8VEVKa8b real net

api.connect().then(() => {
    api.getBalances(address).then(balances => {
        console.log(JSON.stringify(balances, null, 2));
        process.exit();
    });
});
