
/**
 * Module dependencies.
 */

var router = require('tower-router')
  , route = require('tower-route')
  , model = require('tower-model')
  , graph = require('tower-graph')
  , view = require('tower-view');

model('todo')
  .attr('title')
  .attr('completed', 'boolean', false)
  //.scope('completed')
  //  .where('completed').eq(true);
  //.scope('remaining')
  //  .where('completed').eq(false);

route('/:filter')
  .on('request', function(context){
    // toggle: completed: !this.get('completed')
  });

view('index')
  .on('keypress', '#new-todo', createOnEnter)
  .on('click', '#clear-completed', clearCompleted)
  .on('click', '#toggle-all', toggleAllComplete)

// https://github.com/addyosmani/todomvc/blob/gh-pages/architecture-examples/backbone/js/views/app.js
function createOnEnter(e) {
  //if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
  //  return;
  //}
  //
  //model('todo').create(this.newAttributes());
  // this.$input.val('');
}

function clearCompleted() {
  model('todo').query('completed').destroy();
  return false;
}

function toggleAllComplete() {
  var completed = this.allCheckbox.checked;

  model('todo').save({ completed: completed });
}