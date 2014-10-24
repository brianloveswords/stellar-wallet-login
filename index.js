module.exports = login;

const https = require('https');
const scrypt = require('js-scrypt');
const url = require('url');
const concat = require('concat-stream');

function login(opts, callback) {
  const username = opts.username || opts.user;
  const password = opts.password || opts.pass;
  const walletURL = opts.walletURL || 'https://wallet.stellar.org/wallets/show';

  if (!username || !password) {
    return callback(new Error('must provide a username and password'));
  }

  const hashInput = username.toLowerCase() + password;
  const options = {
    maxmem: 4,
    cost: Math.pow(2, 11),
    size: 32,
  };

  // The stellar wallet requires that the salt be the same as the hash
  // input (the concatenation of username + password).
  scrypt.hash(hashInput, hashInput, options, function (err, hash, raw) {
    const id = hash.toString('hex');

    const options = (url.parse(walletURL));
    options.method = 'POST';
    options.headers = {'Content-Type': 'application/json'};

    const req = https.request(options, function (res) {
      res.pipe(concat(function (data) {
        var response;

        try {
          response = JSON.parse(data);
        } catch (err) {
          return callback(new Error('Could not parse response as JSON: ' + data.toString()));
        }

        if (res.statusCode !== 200) {
          return callback(new Error('Could not login: ' + data.toString()));
        }

        return callback(null, response.data.authTokenHash, response.data);
      }));
    });

    req.on('error', function (err) {
      return callback(err);
    });

    req.write(JSON.stringify({id: id}));
    req.end();
  });
}
