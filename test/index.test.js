var login = require('..');
var test = require('tape');

test('gets an id back', function (t) {
  login({
    username: 'brianlovestests',
    password: 'ground control to major tom'
  }, function (err, id, raw) {
    t.notOk(err, 'no errors');
    t.same(id, '5bf795720e483fb2af6bd238b1f7d93280ff4f71abd8ae3be585ce20e48d4303');
    t.ok(raw, 'raw data passed back');
    t.same(raw.id, '4XvRFyT9SeufGJStbyy9TVCNR2ssOXn+3Y4xbMdGUfuM3D1ximKRqxrFUg1X8icUBCaeOMwitm5pwpwhWSeb9A==');
    t.end();
  });
});
