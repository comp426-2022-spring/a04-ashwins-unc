function coinFlip() {
    let result;
    let flip = Math.random();

    if (flip < 0.5) {
        result = "heads";
    } else {
        result = "tails";
    }

    return result;
}

/** Multiple coin flips
 * 
 * Write a function that accepts one parameter (number of flips) and returns an array of 
 * resulting "heads" or "tails".
 * 
 * @param {number} flips 
 * @returns {string[]} results
 * 
 * example: coinFlips(10)
 * returns:
 *  [
      'heads', 'heads',
      'heads', 'tails',
      'heads', 'tails',
      'tails', 'heads',
      'tails', 'heads'
    ]
 */

function coinFlips(flips) {
    let coinArray = [];

    for (let i = 0; i < flips; i++) {
        coinArray.push(coinFlip());
    }

    return coinArray;
}

/** Count multiple flips
 * 
 * Write a function that accepts an array consisting of "heads" or "tails" 
 * (e.g. the results of your `coinFlips()` function) and counts each, returning 
 * an object containing the number of each.
 * 
 * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
 * { tails: 5, heads: 5 }
 * 
 * @param {string[]} array 
 * @returns {{ heads: number, tails: number }}
 */

function countFlips(array) {
    let tailsCount = 0;
    let headsCount = 0;

    for (let i = 0; i < array.length; i++) {
        if (array[i] == 'heads') {
            headsCount++;
        } else {
            tailsCount++;
        }
    }

    return {
        'tails': tailsCount,
        'heads': headsCount
    };

}

/** Flip a coin!
 * 
 * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
 * 
 * @param {string} call 
 * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
 * 
 * example: flipACoin('tails')
 * returns: { call: 'tails', flip: 'heads', result: 'lose' }
 */

function flipACoin(call) {
    let result;
    let flip = coinFlip();
    if (call == flip) {
        result = 'win';
    } else {
        result = 'lose';
    }

    let game = {
        'call': call,
        'flip': flip,
        'result': result
    };

    return game;

}


const express = require('express')


const app = express();

const database = require('./database.js');


const morgan = require('morgan');


const fs = require('fs');


const args = require('minimist')(process.argv.slice(2));


const help = (`
    server.js [options]
    
    --port  Set the port number for the server to listen on. Must be an integer between 1 and 65535.
    
    --debug If set to true, creates endlpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws
                an error with the message "Error test successful." Defaults to false.
                
    --log   If set to false, no log files are written. Defaults to true. Logs are always written to
                database.
    
    --help  Return this message and exit.
`)


if (args.help || args.h) {
    console.log(help);
    process.exit(0);
}


args['port', 'debug', 'log', 'help'];


const port = args.port || process.env.PORT || 5000;


const debug = args.debug;


const log = args.log;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


if (log == true) {
    const access_log = fs.createWriteStream('access.log', { flags: 'a' });
    app.use(morgan('combined', { stream: access_log }));
}

app.use((req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers[' referer '],
        useragent: req.headers[' user-agent ']
    };

    
    const statement = database.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    
    const info = statement.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method,
        logdata.url, logdata.protocol, logdata.httpversion, logdata.status,
        logdata.referer, logdata.useragent);
    next();
})


const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port));
})


if (debug) {
    app.get('/app/log/access', (req, res) => {
        try {
            const statement = database.prepare('SELECT * FROM accesslog').all();
            res.status(200).json(statement);
        } catch (e) {
            console.error(e);
        }
    })

    
    app.get('/app/error', (req, res) => {
        throw new Error('Error test successful.');
    })
}

app.get('/app/', (req, res) => {
    res.statusCode = 200; 
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
    res.end(res.statusCode + ' ' + res.statusMessage);
});



app.get('/app/flip/', (req, res) => {
    let flip = coin.coinFlip();
    res.status(200).json({ "flip": flip });
});


app.get('/app/flips/:number', (req, res) => {
    let raw = coin.coinFlips(req.params.number);
    let summary = coin.countFlips(raw);
    res.status(200).json({ "raw": raw, "summary": summary });
});


app.get('/app/flip/call/heads', (req, res) => {
    let heads = coin.flipACoin('heads');
    let call = heads.call;
    let flip = heads.flip;
    let result = heads.result;
    res.status(200).json({ "call": call, "flip": flip, "result": result });
});


app.get('/app/flip/call/tails', (req, res) => {
    let tails = coin.flipACoin('tails');
    let call = tails.call;
    let flip = tails.flip;
    let result = tails.result;
    res.status(200).json({ "call": call, "flip": flip, "result": result });
});


app.use(function (req, res) {
    res.status(404).send('404 NOT FOUND');
    res.type("text/plain");
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server has stopped');
    })
})