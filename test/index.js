var todomvc = 'undefined' == typeof window
  ? require('..')
  : require('todomvc'); // how to do this better?

var assert = require('assert');

describe('todomvc', function(){
  it('should test', function(){
    assert.equal(1 + 1, 2);
  });
});