#TODO Web应用介绍#

##概要##

TODO 网页应用是是使用nodejs与mongodb的一个练习项目。整个项目是参考[madhums nodejs-express-mongoogse-demo](https://github.com/madhums/nodejs-express-mongoose-demo.git)这个项目。

##功能介绍##

1. 用户的注册，登录和注销。
2. Todo的标题添加，完成，编辑（标题，截止日期，备注）与删除。

##结构介绍##

在这次练习中对默认生成的结构进行修改成下面这样。

```
  -app/
    |__controllers
    |__models
    |__views
  -config/
    |__middlewares (自定义middleware)
    |__config.js (应用的设置部分)
    |__express.js (exress设置)
    |__passport.js (passport设置)
    |__routes.js （routes设置）
  -public/
    |_css/
    |_img/
    |_js/
  -test/ (单元测试)
  -package.json
  -server.js
```

#TODO Web应用开发#

##修改pakcage.json##

修改package.json中的应用信息与引用其他库的信息。添加了以下模块：
  1. express
  2. jade
  3. mongoose
  4. conncet-mongose
  5. connect-flash
  6. password
  7. password-local
  8. password-facebook
  9. password-twitter
  10. password-github
  11. password-google-oauth
  12. underscore
  13. gzippo
  14. async
  15. nodemon
  16. dateformat


##编辑server.js##

  1. 添加mongodb链接信息。
  2. 导入应用的数据模块，使用fs库读入app/models下的mongoose的Schema。
  3. 导入passport模块设置。
  4. 导入express设置。
  5. 导入路由routes设置。
  6. 设置监听接口port，并启动程序。

```Javascript
var express = require('express')
  , fs = require('fs')
  , passport = require('passport')

// 导入设置
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')

// 设置mongodb链接信息
mongoose.connect(config.db)

// 导入todo应用中的数据模块（models)
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

// 导入passport模块置
require('./config/passport')(passport, config)

var app = express()
// express设置
require('./config/express')(app, config, passport)

// 导入路由（routes）设置
require('./config/routes')(app, passport, auth)

// 设定监听接口（port），并启动应用。
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)
```

##编辑和修改config内容##
### 修改config.js ###
config.js文件根据应用的发布欢迎进行设置。主要包括开发阶段（development），成品阶段(production),以及测试阶段（test）设置。在本次练习中有以下设置。

+ 根目录设置

```Javascript
  root: require('path').normalize(__dirname + '/..'),
```

+ 应用名称设置

```Javascript
  app: {
    name: 'Todo App Demo'
  },
```

+ mongodb的链接信息设置

```Javascript
  db: 'mongodb://localhost/todo'
```

+ passport的facebook，twitter，github以及google的认证信息设置。
}


### 编辑express.js ###
主要编辑修改express.js的设置。
+ 依赖包导入部分

```Javascipt
  var express = require('express')
    , mongoStore = require('connect-mongo')(express) // Connect的Mongodb session存储模块
    , flash = require('connect-flash') // session存储闪存信息模块
    , helpers = require('view-helpers') //express的中间件，提供一些helper方法。
```

+ app.configure设置部分

```Javascript
  // express/mongo session存储
  app.use(express.session({
    secret: 'todo-demo',
    store: new mongoStore({
      url: config.db,
      collection : 'sessions'
    })
  }))

  // connect flash的闪存信息
  app.use(flash())

  // 使用passport的session
  app.use(passport.initialize())
  app.use(passport.session())

  // 以下是404与500的报错页面转向设置。
  app.use(function(err, req, res, next){
    // treat as 404
    if (~err.message.indexOf('not found')) return next()

      // log it
      console.error(err.stack)

      // error page
      res.status(500).render('500', { error: err.stack })
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', { url: req.originalUrl })
    })

  }))
```

### 编辑passport.js ###
在passport.js中设置用户登录的本地策略与使用第三方认证（twitter，facebook，github，google）的策略设置。

### 编辑routes.js ###
在routes.js中设定应用程序的路由。主要是user和todo两个部分。


### 编辑middlewares/authorization.js ###

+ rquiresLogin, 如果用户没有登录将跳转到用户登录页面。
+ user.hasAuthorization， User模块的认证路由中间件
+ todo.hasAuthorization， Todo模块的认证路由中间件

在routes.js的使用例子：

```Javascript
  app.del('/todo/:id', auth.requires.Login, auth.todo.hasAuthorization, todo.destroy) //删除todo， 需要用户登录，并且是该todo的用户。
```

##编辑和修改app/models内容##

添加两个mongoose的Schema模块： user与todo。

### app/models/user.js ###

添加字段有
```Javascript
  var UserSchema = new Schema({
    name: String,       // 登录名
    email: String,      //邮件地址
    username: String,   // 用户名
    privoider: String,  // 认证供应商
    hashed_password: String, // 哈希密码
    salt: String,       //密码盐
    facebook: {},       // facebook登录信息
    twitter: {},        // twitter登录信息
    github: {},         // github登录信息
    google: {}          // google登录信息
  });
```

一个虚拟变量’password'
```Javascript
  UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt(); // 生成密码盐
    this.hashed_password = this.encryptPassword(password); // 生成哈希密码
  })
  .get(function () { return this._password; });
```

4个字段验证（name，email，username，hashed_password)非空。
Schema的save的前置挂钩函数。
三个方法：
  - authenticate： 检查密码是为同一个。
  - makeSalt： 生成密码盐。
  - encryptPassword: 加密密码生成哈希密码。

### app/models/todo.js ###

添加字段：

```Javascript
  var TodoSchema = new Schema({
    title: {type: String, default: '', trim: true}, // todo标题
    user: {type: Schema.ObjectId, ref: 'User'}, // 用户ID
    createdAt: { type: Date, default: Date.now }, // 创建日期
    deadline: { type: Date, default: Date.now},   // 截止日期
    done: {type: Boolean, default: false},        // 完成标志
    memo: {type: String, default: '', trim: true} // 注释
  });
```
两个认证： 1. title字段不能为空。 2. 截止日期不能小于创建日期。

2个公共方法：
  - load： 使用id寻找todo。
  - list： 获取todo列表

##编辑和修改app/controllers内容##
添加users.js和todos.js两个文件。

### users.js ####
模块输出函数
  - signin
  - authCallback
  - login： 跳转到用户登录页面
  - signup： 跳转到用户注册页面
  - logout： 注销跳转回登录页面
  - session： 跳转回根页面
  - create： 建立用户跳回到根页面
  - show： 显示用户信息
  - user：　用ｉｄ寻搜寻用户信息

### todos.js ###
模块输出函数
  - todo:　用ｉｄ搜寻todo信息
  - new：　跳转到新建todo页面
  - create: 新建todo并跳转到todo显示页面
  - edit: 跳转到编辑todo页面
  - update： 更新update跳转到todo显示页面
  - show： 跳转到todo显示页面
  - destroy： 删除todo后跳转会todo列表页面
  - index: 显示todo列表

注意在index中有使用分页信息，并且搜索的对象是用户自己的todo列表。

##编辑和修改app/views##
views中的文件结构如下:

```
  -todos\
    |__index.jade   // todos的index页面模版
    |__edit.jade    // todo的编辑页面模版
    |__form.jade    // todo的form模版
    |__new.jade     // todo新建页面模版
    |__show.jade    // todo显示页面模版
  -users\
    |__auth.jade    // 用户登录通用模版
    |__join.jade    // 用户登录页面
    |__show.jade    // 用户信息显示
    |__signup.jade  // 注册用户
  -includes\
    |__foot.jade
    |__footer.jade
    |__head.jade
    |__header.jade
  -layouts\
    |__default.jade // 全局通用页面
  -404.jade         // 无法找到页面
  -500.jade         // 报错页面
```
views使用jade模版编写页面，可以参考jade的文档[jade]（http://jade-lang.com/）。
