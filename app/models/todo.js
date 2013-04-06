/**
*
* Module dependencies.
*
**/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
*
* Todo Schema
*
**/
var TodoSchema = new Schema({
  title: {type: String, default: '', trim: true},
  user: {type: Schema.ObjectId, ref: 'User'},
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, default: Date.now},
  done: {type: Boolean, default: false},
  memo: {type: String, default: '', trim: true}
});

/**
*
* Validations
*
**/

TodoSchema.path('title').validate(function (title) {
  return title.length > 0;
}, 'Todo title cannot be blank');

/**
*
* Statics
*
**/

TodoSchema.statics = {
  /**
  * Find todo by id
  *
  * @param {ObjectId} id
  * @param {Function} cb
  * @api public
  **/
  load: function (id, cb) {
    this.findOne({_id: id})
      .populate('user', 'name')
      .exec(cb);
  },

  /**
  *
  * List Todo
  * @param {Object} options
  * @param {Function} cb
  * @api public
  **/
  list: function (options, cb) {
    // var criteria = options.criteria || {};
    this.find({user: options.user})
      .populate('user', 'name')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }

};

mongoose.model('Todo', TodoSchema);



