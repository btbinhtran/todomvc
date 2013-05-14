
/**
 * Module dependencies.
 */

var model = require('tower-model')
  , query = require('tower-query')
  , router = require('tower-router')
  , route = require('tower-route')
  , scope = require('tower-scope')
  , template = require('tower-template');

/**
 * Models.
 */

model('todo')
  .attr('title')
  .attr('completed', 'boolean', false)
  .query('completed')
    .where('completed').eq(true)
  .query('remaining')
    .where('completed').eq(false);

/**
 * Routes.
 */

route('/:filter')
  .on('request', function(context){
    alert(context.path);
    // toggle: completed: !this.get('completed')
  });

/**
 * Scopes.
 */

scope('body')
  .action('newTodo', newTodo)
  .action('clearCompleted', clearCompleted)
  .action('toggleCompleted', toggleCompleted)
  .action('removeTodo', removeTodo);

/**
 * Templates.
 */

var fn = template('body', document.body);
fn(scope.root());

/**
 * Create a new `todo`.
 */

function newTodo(event) {
  if (!enterKey(event)) return;
  var title = $(event.target).val();
  // callback b/c adapters can be async (AJAX, sockets, etc.)
  model('todo').create({ title: title }, function(err, todo){
    scope('body').emit('change todos');
  });
}

/**
 * Remove an existing `todo`.
 */

function removeTodo(context) {
  console.log('removeTodo');
}

/**
 * Clear all completed todos.
 */

function clearCompleted() {
  // view('todo').remove();
  model('todo').query('completed').remove();
  return false;
}

/**
 * Toggle completed todos.
 */

function toggleCompleted() {
  var completed = this.allCheckbox.checked;

  model('todo').save({ completed: completed });
}

router.start();

function which(event) {
  return event.which || event.keyCode;
}

function enterKey(event) {
  return 13 === which(event);
}