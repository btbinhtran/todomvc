
/**
 * Module dependencies.
 */

var model = require('tower-model')
  , view = require('tower-view')
  , adapter = require('tower-adapter')
  , query = require('tower-query')
  , router = require('tower-router')
  , route = require('tower-route');

/**
 * Models
 */

model('todo')
  .attr('title')
  .attr('completed', 'boolean', false)
  .query('completed') // query('todo.completed')
    .where('completed').eq(true)
  .query('remaining')
    .where('completed').eq(false);

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

view('todos', '#todoapp')
  .child('todo')
  .on('keypress', '#new-todo', create)
  .on('click', '#clear-completed', clear)
  .on('click', '#toggle-all', toggle);
  // .on('toggle-complete', noop)
  // .on('clear-completed', noop)

view('todo')
  .on('remove', remove)
  // on(event, selector, fn)
  // on(event, selector, dispatcher, fn)
  //.on('click', '#toggle-edit', noop)

/**
 * Create a new `todo`.
 */

function create(todo) {
  view('todo').render(todo).prepend();
}

/**
 * Remove an existing `todo`.
 */

function remove(context) {

}

/**
 * Clear all completed todos.
 */

function clear() {
  // view('todo').remove();
  model('todo').query('completed').remove();
  return false;
}

/**
 * Toggle completed todos.
 */

function toggle() {
  var completed = this.allCheckbox.checked;

  model('todo').save({ completed: completed });
}

router.start();
if ('undefined' != typeof window) view.init();