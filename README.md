# stellar-wallet-login

Get an authorization token for the Stellar Wallet with a username and
password. Works in node and in the browser (with browserify).

## Example

```js
var login = require('stellar-wallet-login');

login({
  user: 'awesome_username',
  pass: 'totally unguessable passphrase',
}, function(err, token, raw) {
  // `token` is the authorization token
  // `raw` is the raw data object returned from stellar.
})
```
