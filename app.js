
/**
 * Module dependencies.
 */

var model = require('tower-model')
  , view = require('tower-view')
  , router = require('tower-router')
  , route = router.route
  , noop = console.log;

/**
 * Models.
 */

model('todo')
  .attr('title')
  .attr('completed', 'boolean', false)
  //.scope('completed')
  //  .where('completed').eq(true);
  //.scope('remaining')
  //  .where('completed').eq(false);

/**
 * Routes.
 */

route('/:filter')
  .on('request', function(context){
    console.log(context);
    // toggle: completed: !this.get('completed')
  });

/**
 * Views.
 */

view(document)
  .child('todos');

view('todos', '#todoapp')
  .child('todo')
  .on('keypress', '#new-todo', createOnEnter)
  .on('click', '#clear-completed', clearCompleted)
  .on('click', '#toggle-all', toggleAllComplete);
  // .on('toggle-complete', noop)
  // .on('clear-completed', noop)

view('todo')
  .on('create', function(){
    this.model
      .on('create', create)
      //.on('reset')
      //.on('change')
      //.on('filter')
      //.on('all')
  })
  .on('remove', noop)
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

console.log(view)