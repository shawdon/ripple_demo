'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const inspect = require('util').inspect;
const assert = require('assert');

const address = 'rKRH6WRAzVkikgAowNT1NYGA7KxQ8i8jAT';
const secret = 'snnAzn7BFoAM6AEQsiXH8nvFaJTdu';
const signer1address = 'rh8bX8NibTfS1M2jaNSbPWENSGU9AvRMyB';
const signer1secret = 'shYuBrCWz2mXKs2KKTHaooGvCnnBB';
const signer2address = 'rLCsDMh99xDYJLg8FtMY99mZdrWWvKwBfu';
const signer2secret = 'snwqwot2DKJ832JyVqYbzq3UgSNfh';
const signer3address = 'rH7HDXeGY4tAHnCDLPVSbKPG2nFqF54UYC';
const signer3secret = 'ssJEyzNaQJV3DFUXMmji6VuxhSfn8';

const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233'
});

const instructions = {
    // fee: '0.000010',
    maxLedgerVersionOffset: 5,
    // sequence: 10
};
const multisignInstructions = {
    maxLedgerVersionOffset: 5,
    signersCount: 2
};

const signers = {
    threshold: 3,
    weights: [
        { address: signer1address, weight: 2 },
        { address: signer2address, weight: 1 },
        { address: signer3address, weight: 1 }
    ]
};
const regularKey = signer3address;

const payment = {
    source: {
        address: address,
        maxAmount: {
            value: '50',
            currency: 'XRP'
        },
        tag: 11111
    },
    destination: {
        // address: 'rM8xv6pcPmcHpv4JVc35Wq7AQmF7oDuMAu',
        address: 'rh8bX8NibTfS1M2jaNSbPWENSGU9AvRMyB',
        amount: {
            value: '100',
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

api.connect().then(() => {
    console.log('Connected...');
    // 以下方法无法获取 signer_list，使用：curl -X POST --data '{ "method": "account_objects", "params": [ { "account": "rKRH6WRAzVkikgAowNT1NYGA7KxQ8i8jAT", "ledger_index": 330556 } ] }' "https://api.altnet.rippletest.net:51234" 
    // return api.getSettings(address, { ledgerVersion: 330556 }).then(st => {
    //     console.log(JSON.stringify(st, null, 2))
    //     process.exit(0)
    // });

    return api.prepareSettings(address, { signers }, instructions).then(prepared => {
        console.log('Setting multi-sign transaction prepared...');
        console.log(JSON.stringify(prepared, null, 2));
        // process.exit(1)
        const signedTX = api.sign(prepared.txJSON, secret);
        console.log('Setting multi-sign transaction signed...');
        console.log(JSON.stringify(signedTX, null, 2));
        return api.submit(signedTX.signedTransaction).then(data => { console.log(data) });
    }).then(() => {
        // process.exit(1)
        return api.preparePayment(address, payment, multisignInstructions).then(prepared => {
            console.log('Payment transaction prepared...');
            console.log(JSON.stringify(prepared, null, 2));
            // process.exit(1)
            const signed1 = api.sign(
                prepared.txJSON, signer1secret, { signAs: signer1address });
            console.log('signed1')
            console.log(inspect(signed1, true, 2, true))
            const signed2 = api.sign(
                prepared.txJSON, signer2secret, { signAs: signer2address });
            console.log('signed2')
            console.log(inspect(signed2, true, 2, true))
            const combined = api.combine([
                signed1.signedTransaction, signed2.signedTransaction
            ]);
            console.log('combined')
            console.log(inspect(combined, true, 2, true))
            console.log('Payment transaction multi signed...');
            console.log(JSON.stringify(combined, null, 2));
            // process.exit(1)
            return api.submit(combined.signedTransaction).then(quit, fail);
        });
    });
}).catch(fail);
