'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const inspect = require('util').inspect;

const address = 'rKRH6WRAzVkikgAowNT1NYGA7KxQ8i8jAT';
const secret = 'snnAzn7BFoAM6AEQsiXH8nvFaJTdu';

const api = new RippleAPI();
const instructions = {
    fee: '0.000010',
    maxLedgerVersion: 5,
    sequence: 3
};

const payment = {
    source: {
        address: address,
        maxAmount: {
            value: '20',
            currency: 'XRP'
        },
        tag: 11111
    },
    destination: {
        address: 'rM8xv6pcPmcHpv4JVc35Wq7AQmF7oDuMAu',
        // address: 'rh8bX8NibTfS1M2jaNSbPWENSGU9AvRMyB',
        amount: {
            value: '20',
            currency: 'XRP'
        },
        tag: 22222
    }
};

function quit(message) {
    console.log("quit", message);
    process.exit(0);
}

function fail(message) {
    console.error("error", message);
    process.exit(1);
}

api.preparePayment(address, payment, instructions).then(prepared => {
    console.log('Payment transaction prepared...');
    console.log(JSON.stringify(prepared, null, 2))
    // process.exit(1)
    const signedData = api.sign(prepared.txJSON, secret);
    console.log('Payment transaction signed...');
    console.log(JSON.stringify(signedData, null, 2))
    // process.exit(1)
}).catch(fail);

console.log("exit")
