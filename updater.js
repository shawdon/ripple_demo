'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const inspect = require('util').inspect;
const fs = require('fs');

const api = new RippleAPI({
    // server: 'wss://s.altnet.rippletest.net:51233' // Public rippled server
    server: 'wss://s2.ripple.com' // Public rippled server
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

var toExit = false;

api.on('ledger', ledger => {
    // console.log(JSON.stringify(ledger, null, 2));

    const options = {
        ledgerVersion: ledger.ledgerVersion,
        includeTransactions: true,
        // includeState: true,
        includeAllData: true,
    };
    api.getLedger(options).then(detailLedger => {
        console.log(detailLedger.ledgerVersion, detailLedger.closeTime, detailLedger.closeFlags, detailLedger.closeTimeResolution)
        // if (toExit) {process.exit(1)}
        // fs.writeFile('ledger.txt', JSON.stringify(detailLedger, null, 4), (err) => {
        //     if (err) throw err;
        //     console.log('The file has been saved!');
        // });
        // var content = JSON.stringify(detailLedger, null, 4);
        // if (content.indexOf('tfPartialPayment') != -1 || content.indexOf('131072') != -1) {
        //     // console.log(detailLedger)
        //     toExit = true
        // }
        // console.log('writen')
        // console.log(JSON.stringify(detailLedger, null, 4), '\n')
    });
});

function fail(message) {
    console.error("error", message);
    process.exit(1);
}

api.connect().catch(fail);
