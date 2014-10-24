module.exports = login;

const nets = require('nets');
const scrypt = require('js-scrypt');
const url = require('url');
const concat = require('concat-stream');

function login(opts, callback) {
  const username = opts.username || opts.user;
  const password = opts.password || opts.pass;
  const walletURL = opts.url || 'https://wallet.stellar.org/wallets/show';

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
  scrypt.hash(hashInput, hashInput, options, function (err, hash) {
    const id = hash.toString('hex');

    const options = {
      url: walletURL,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id}),
    };

    nets(options, function (err, res, body) {
      if (err)
        return callback(err);

      var response;
      try {
        response = JSON.parse(body);
      } catch (error) {
        return callback(new Error('Could not parse response as JSON: ' + body.toString()));
      }

      if (res.statusCode !== 200) {
        return callback(new Error('Could not login: ' + body.toString()));
      }

      return callback(null, response.data.authTokenHash, response.data);
    });
  });
}
