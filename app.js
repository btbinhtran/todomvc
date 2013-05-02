
/**
 * Module dependencies.
 */

var model = require('tower-model')
  , view = require('tower-view')
  , adapter = require('tower-adapter')
  , query = require('tower-query')
  , router = require('tower-router')
  , route = router.route
  , noop = console.log;

require('tower-memory-adapter');

/**
 * Models
 */

model('todo')
  .attr('title')
  .attr('completed', 'boolean', false)
  .query('completed') // query('todo.completed')
    .where('completed').eq(true);
  //.query('remaining')
  //  .where('completed').eq(false);

/**
 * Routes
 */

route('/:filter')
  .on('request', function(context){
    alert(context.path);
    // toggle: completed: !this.get('completed')
  });

/**
 * Views
 */

view('body')
  .child('todos');

view('todos', '#todoapp') // XXX: dispatcher is `#todoapp`
  .child('todo')
  .on('keypress', '#new-todo', createOnEnter)
  .on('click', '#clear-completed', clearCompleted)
  .on('click', '#toggle-all', toggleAllComplete);
  // .on('toggle-complete', noop)
  // .on('clear-completed', noop)

view('todo')
  .on('render', function(x){
    //this.model
    //  .on('create', create) // XXX: need to impl
      //.on('reset')
      //.on('change')
      //.on('filter')
      //.on('all')
  })
  .on('remove', noop)
  // on(event, selector, fn)
  // on(event, selector, dispatcher, fn)
  .on('click', '#toggle-edit', noop)

function create(todo) {
  view('todo'); //...
}

// https://github.com/addyosmani/todomvc/blob/gh-pages/architecture-examples/backbone/js/views/app.js
// https://github.com/addyosmani/todomvc/blob/gh-pages/architecture-examples/backbone/js/views/todos.js
function createOnEnter(e) {

}

function clearCompleted() {
  model('todo').query('completed').destroy();
  return false;
}

function toggleAllComplete() {
  var completed = this.allCheckbox.checked;

  model('todo').save({ completed: completed });
}

router.start();

exports.router = router;
exports.model = model;
exports.view = view;
exports.query = query;
exports.adapter = adapter;
// query().start('todo').use('memory').action('save', [{}]).execute();