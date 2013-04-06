/**
*
* Module dependencies.
*
**/
var mongoose = require('mongoose')
  , async = require('async')
  , Todo = mongoose.model('Todo')
  , _ = require('underscore');


/**
*
* Find todo by id
*
**/
exports.todo = function (req, res, next, id) {
  Todo.load(id, function (err, todo) {
    if (err) return next(err);
    if (!todo) return next(new Error('Failed to load todo ' + id));
    req.todo  = todo;
    next();
  });
}


/**
*
* Create a todo
*
**/
exports.create = function (req, res) {
  var todo = new Todo(req.body);
  todo.user = req.user;
  todo.save(function (err) {
    res.redirect('/todos');
  });
};

/**
*
* Update todo
*
**/
exports.update = function (req, res) {
  var todo = req.todo;
  todo = _.extend(todo, req.body);

  todo.save(function (err) {
    res.redirect('/todos');
  });
};

exports.done = function (req, res) {
  var todo = req.todo;
  todo.done = (todo.done) ?false: true;
  todo.save(function (err) {
    res.redirect('/todos');
  });
};

/**
*
* Delete a todo
*
**/
exports.destroy = function (req, res) {
  var todo = req.todo;
  todo.remove(function (err) {
    res.redirect('/todos');
  });
};

/**
*
* List of Todos
*
**/
function getTodoList(options, cb){
  Todo.list(options, function(err, todos) {
    if (err) return res.render('500');
    Todo.count().exec(function(err, count) {
      cb(err, todos, count);
    });
  });
};

exports.index = function (req, res) {

  var page = req.param('page') > 0 ? req.param('page') : 0;
  var user = req.user;
  var perPage = 10;
  var options = {
    perPage: perPage,
    page: page,
    user: user.id
  };

  getTodoList(options, function (err, todos, count) {
    res.render('todos/index', {
      title: 'ToDo List',
      todos: todos,
      page: page,
      pages: count / perPage
    });
  });
};











