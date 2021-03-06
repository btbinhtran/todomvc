
/**
 * Module dependencies.
 */

var resource = require('tower-resource');
var router = require('tower-router');
var route = require('tower-route');
var content = require('tower-content');
var template = require('tower-template');
var memory = require('tower-memory-adapter');
var directive = require('tower-directive');
var keyboard = require('tower-keyboard-directive');
var collection = require('tower-collection');

/**
 * Resources.
 */

resource('todo')
  .attr('title')
  .attr('completed', 'boolean', false);

/**
 * Collections.
 */

collection('todos');

/**
 * Routes.
 */

route('/:filter', function(context){
  // XXX: collection('todos').subscribe(query)
  // .unsubscribe on exit, or collection automatically
  // unsubscribes if another is subscribed to.
  resource('todo')
    .where('completed').eq('completed' === context.params.filter)
    .all(function(err, records){
      collection('todos').reset(records);
    });
});

route('/', function(){
  resource('todo').all(function(err, records, query){
    collection('todos').reset(records);
    // XXX: collection('todos').subscribe(query, records);
  });
});

/**
 * Content.
 */

content('body')
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
  var elements = {};

  //ctx.on('change ' + prop, function(array){
  data.on('add', function(records){
    change(records);
  });

  function change(records) {
    for (var i = 0, n = records.length; i < n; i++) {
      var id = records[i].get('id');
      var childScope = content('todo').init({
        parent: ctx,
        todo: records[i],
        i: i
      });
      var childElement = fn.clone(childScope);
      elements[id] = childElement;
      $(parent).prepend(childElement);
    }
  }

  data.on('remove', function(records){
    for (var i = 0, n = records.length; i < n; i++) {
      var id = records[i].get('id');
      if (elements[id]) {
        $(elements[id]).remove(); 
        delete elements[id];
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

directive('data-checked', function(_scope, element, attr){
  $(element).on('change', handle);

  function handle(event) {
    _scope.get('todo').set('completed', event.target.checked);
    // XXX: doesn't handle nested
    // _scope.set(attr.value, event.target.checked);
  }

  _scope.on('remove', function(){
    $(element).off('change', handle);
  });
});

/**
 * Keyboard directives.
 */

keyboard('enter');

/**
 * Templates.
 */

template(document.body)(content.root());

/**
 * Create a new `todo`.
 */

function newTodo(event) {
  var title = $(event.target).val();
  $(event.target).val('');
  // callback b/c adapters can be async (AJAX, sockets, etc.)

  resource('todo').create({ title: title, completed: false }, function(err, todo){
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
  resource('todo').query('completed').remove();
  return false;
}

/**
 * Toggle completed todos.
 */

function toggleCompleted(completed) {
  resource('todo').update({ completed: completed }, function(err, records){
    // XXX: for some reason duplicate records are being passed back.
    collection('todos').reset(records);
  });
}

router.start();