
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
  .action('remove', removeTodo);

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
  var fn = template(element);
  var parent = element.parentNode;
  parent.removeChild(element);
  var lastIndex = array.length ? array.length - 1 : 0;

  scope.on('change ' + prop, function(array){
    for (var i = lastIndex, n = array.length; i < n; i++) {
      var childScope = scopes('todo').init({
          parent: scope
        , todo: array[i].attrs
      });
      var childElement = fn.clone(childScope);
      $(parent).prepend(childElement);
    }
    lastIndex = n;
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
  console.log(event);
  var title = $(event.target).val();
  $(event.target).val('');
  // callback b/c adapters can be async (AJAX, sockets, etc.)

  model('todo').create({ title: title }, function(err, todo){
    model('todo').find(function(err, todos){
      scopes('body').set('todos', todos);
    });
  });
}

/**
 * Remove an existing `todo`.
 */

function removeTodo(todo) {
  console.log('removeTodo', todo);
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