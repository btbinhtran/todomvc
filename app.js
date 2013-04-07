
/**
 * Module dependencies.
 */

var router = require('tower-router')
  , route = require('tower-route')
  , model = require('tower-model')
  , graph = require('tower-graph');

model('todo')
  .attr('title')
  .attr('completed', 'boolean', false);

route('/:filter')
  .on('request', function(context){
    // toggle: completed: !this.get('completed')
  });