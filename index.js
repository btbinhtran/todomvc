
/**
 * Module dependencies.
 */

var model = require('tower-model')
  , query = require('tower-query')
  , router = require('tower-router')
  , route = require('tower-route')
  , scope = require('tower-scope')
  , template = require('tower-template')
  , memory = require('tower-memory-adapter')
  , directive = require('tower-directive')
  , keyboard = require('tower-keyboard-directive')
  , collection = require('tower-collection')
  , text = require('tower-inflector');

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

route('/:filter', function(context){
  model('todo')
    .where('completed').eq('completed' === context.params.filter)
    .all(function(err, records){
      collection('todos').reset(records);
    });
});

route('/', function(){
  model('todo').all(function(err, records){
    collection('todos').reset(records);
  });
});

/**
 * Scopes.
 */

scope('body')
  .attr('todos', { type: 'array', value: collection('todos') })
  .attr('completed', 'integer', 0)
  .attr('remaining', 'integer', function(){
    return collection('todos').length;
  })
  .attr('remainingText', function(){

  }, 'remaining')
  .action('newTodo', newTodo)
  .action('clearCompleted', clearCompleted)
  .action('toggleCompleted', toggleCompleted)
  .action('remove', removeTodo);

/**
 * Custom directives.
 */

directive('data-list', function(ctx, element, attr){
  var self = this;
  var val = attr.value.split(/ +/);
  element.removeAttribute('data-list');

  if (val.length > 1) {
    var name = val[0];
    var prop = val[2];
  } else {
    var prop = val[0];
  }

  // e.g. todos
  var data = ctx.get(prop);
  var array = data;
  if (array instanceof collection.Collection)
    array = array.toArray();
  var fn = template(element);
  var parent = element.parentNode;
  parent.removeChild(element);
  var id = 0;
  var elements = {};

  //ctx.on('change ' + prop, function(array){
  data.on('add', function(records){
    change(records);
  });

  function change(records) {
    for (var i = 0, n = records.length; i < n; i++) {
      records[i].attrs.id = ++id;
      var childScope = scope('todo').init({
          parent: ctx
        , todo: records[i]
        , i: i
      });
      var childElement = fn.clone(childScope);
      elements[id] = childElement;
      $(parent).prepend(childElement);
    }
  }

  data.on('remove', function(records){
    for (var i = 0, n = records.length; i < n; i++) {
      var attrs = records[i].attrs;
      if (elements[attrs.id]) {
        $(elements[attrs.id]).remove(); 
        delete elements[attrs.id];
      }
    }
  });

  data.on('reset', function(records){
    for (var key in elements) {
      $(elements[key]).remove();
      delete elements[key];
    }
    change(records);
  });
});

directive('href', function(ctx, element, attr){
  if (element.getAttribute('href').charAt(0) !== '/') return;

  $(element).on('click', function(e){
    e.preventDefault();
    router.dispatch(element.getAttribute('href'));
    return false;
  });
});

/**
 * Keyboard directives.
 */

keyboard('enter');

/**
 * Templates.
 */

template(document.body)(scope.root());

/**
 * Create a new `todo`.
 */

function newTodo(event) {
  var title = $(event.target).val();
  $(event.target).val('');
  // callback b/c adapters can be async (AJAX, sockets, etc.)

  model('todo').create({ title: title, completed: false }, function(err, todo){
    collection('todos').push(todo);
  });
}

/**
 * Remove an existing `todo`.
 */

function removeTodo(todo, i, event) {
  todo.remove(function(){
    collection('todos').remove(todo);
  });
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

function toggleCompleted(event) {
  var completed = $(event.target).is(':checked');

  model('todo').update({ completed: completed }, function(err, records){
    console.log(records);
  });
}

router.start();