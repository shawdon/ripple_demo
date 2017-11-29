'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const inspect = require('util').inspect;
const assert = require('assert');
const bunyan = require('bunyan');

const address = 'rKRH6WRAzVkikgAowNT1NYGA7KxQ8i8jAT';
const secret = 'snnAzn7BFoAM6AEQsiXH8nvFaJTdu';

const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233'
});
const instructions = {
    fee: '0.000010',
    maxLedgerVersionOffset: 5,
    // sequence: 9
};

var log = bunyan.createLogger({
    name: "bunyan-test",
    level: 4,
    streams: [
        {
          level: bunyan.DEBUG,
          stream: process.stdout,  // log DEBUG and above to stdout
        },
        {
          level: bunyan.INFO,
          type: 'rotating-file',
          path: './myapp.log',     // log INFO and above to a file
          period: '1d',            // daily rotation
          count: 3,                // keep 3 back copies
        }
    ],
    src: true,
});

const payment = {
    source: {
        address: address,
        maxAmount: {
            value: '10',
            currency: 'XRP'
        },
        tag: 11111
    },
    destination: {
        // address: address,
        address: 'rMVc9QGsa6g6AynmPdmwWMsVa5oTJWPUqL',
        amount: {
            value: '19.9',
            currency: 'XRP'
        },
        tag: 22222
    }
};

function quit(message) {
    log.info("quit", message);
    process.exit(0);
}

function fail(message) {
    log.error("error", message);
    process.exit(1);
}

// api.connect().then(() => {
//     log.info('Connected...');
//     return api.preparePayment(address, payment, instructions).then(prepared => {
//         log.info('Payment transaction prepared...');
//         log.info(JSON.stringify(prepared, null, 2))
//         // process.exit(1)
//         const signedTX = api.sign(prepared.txJSON, secret);
//         log.info('Payment transaction signed...');
//         log.info(JSON.stringify(signedTX, null, 2))
//         // process.exit(1)
//         api.submit(signedTX.signedTransaction).then(quit, fail);
//     });
// }).catch(fail);

/* Verify a transaction is in a validated RCL version */
function verifyTransaction(hash, options) {
    log.info('Verifing Transaction');
    return api.getTransaction(hash, options).then(data => {
        log.info('Final Result: ', data.outcome.result);
        log.info('Validated in Ledger: ', data.outcome.ledgerVersion);
        log.info('Sequence: ', data.sequence);
        return data.outcome.result === 'tesSUCCESS';
    }).catch(error => {
        /* if transaction not in latest validated ledger,
           try again until max ledger hit */
        log.info('getTransaction error: ', error)
        if (error instanceof api.errors.PendingLedgerVersionError) {
            return new Promise((resolve, reject) => {
                setTimeout(() => verifyTransaction(hash, options)
                    .then(resolve, reject), 1000);
            });
        }
        log.info(99999999999)
        return error;
    });
}

api.connect().then(() => {
    log.info('Connected...');
    return api.preparePayment(address, payment, instructions);
}).then(prepared => {
    log.info('Payment transaction prepared...');
    log.info(prepared);
    return api.getLedger().then(ledger => {
        log.info('Current Ledger', ledger.ledgerVersion);

        const signedData = api.sign(prepared.txJSON, secret);
        log.info('Payment transaction signed...');
        log.info(signedData)

        return api.submit(signedData.signedTransaction).then(data => {
            log.info('ret:', data)
            log.info('Tentative Result: ', data.resultCode);
            log.info('Tentative Message: ', data.resultMessage);
            /* if transaction was not successfully submitted throw error */
            assert.strictEqual(data.resultCode, 'tesSUCCESS');
            /* if successfully submitted fire off validation workflow */
            const options = {
                minLedgerVersion: ledger.ledgerVersion,
                maxLedgerVersion: prepared.instructions.maxLedgerVersion
            };
            // return new Promise((resolve, reject) => {
            //     setTimeout(() => verifyTransaction(signedData.id, options).then(resolve, reject), 1000);
            // });
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                     verifyTransaction(signedData.id, options).then(resolve, reject)
                    }, 1000);
            });
        });
    });
}).then((info) => {
    log.info('info:', info)
    api.disconnect().then(() => {
        log.info('api disconnected');
        // process.exit();
    });
}).catch(fail);
