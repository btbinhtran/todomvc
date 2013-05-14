
/**
 * Module dependencies.
 */

var model = require('tower-model')
  , query = require('tower-query')
  , router = require('tower-router')
  , route = require('tower-route')
  , scopes = require('tower-scope')
  , template = require('tower-template')
  , memory = require('tower-memory-adapter')
  , directive = require('tower-directive');

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

scopes('body')
  .attr('todos', 'array', [])
  .action('newTodo', newTodo)
  .action('clearCompleted', clearCompleted)
  .action('toggleCompleted', toggleCompleted)
  .action('removeTodo', removeTodo);

/**
 * Custom directives.
 */

directive('data-each', function(scope, element, attr){
  var self = this;
  var val = attr.value.split(/ +/);
  element.removeAttribute('data-each');

  if (val.length > 1) {
    var name = val[0];
    var prop = val[2];
  } else {
    var prop = val[0];
  }

  // e.g. todos
  var array = scope.get(prop);
  var templateFn = template(element);
  var parent = element.parentNode;
  parent.removeChild(element);

  scope.on('change ' + prop, function(){
    var childScope = scopes('todo').init();
    var childElement = templateFn.clone(childScope);
    parent.appendChild(childElement);
  });
});

/**
 * Templates.
 */

var fn = template('body', document.body);
fn(scopes.root());

/**
 * Create a new `todo`.
 */

function newTodo(event) {
  if (!enterKey(event)) return;
  var title = $(event.target).val();
  // callback b/c adapters can be async (AJAX, sockets, etc.)

  model('todo').create({ title: title }, function(err, todo){
    scopes('body').changed('todos');
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