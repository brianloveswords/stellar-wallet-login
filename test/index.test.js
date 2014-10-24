var login = require('..');
var test = require('tape');

test('gets an id back', function (t) {
  login({
    username: 'brianlovestests',
    password: 'ground control to major tom'
  }, function (err, id, raw) {
    console.log(err);
    console.log(id);
    console.log(raw);
    t.end();
  });
});
