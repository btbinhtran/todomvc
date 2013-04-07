
/**
 * Module dependencies.
 */

var model = require('tower-model')
  , view = require('tower-view')
  //, router = require('tower-router')
  //, route = router.route;
  , route = require('tower-route');

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
    // toggle: completed: !this.get('completed')
  });

/**
 * Views.
 */

view('index')
  .on('keypress', '#new-todo', createOnEnter)
  .on('click', '#clear-completed', clearCompleted)
  .on('click', '#toggle-all', toggleAllComplete);

view('todo')
  .on('create', function(){
    this.model
      .on('create', create)
      //.on('reset')
      //.on('change')
      //.on('filter')
      //.on('all')
  });

function create(todo) {
  view('todo'); //...
}

// https://github.com/addyosmani/todomvc/blob/gh-pages/architecture-examples/backbone/js/views/app.js
// https://github.com/addyosmani/todomvc/blob/gh-pages/architecture-examples/backbone/js/views/todos.js
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

console.log(model('todo'))