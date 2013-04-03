TODO Web应用介绍
===============
功能介绍
---------------------
1. 用户的注册，登录和注销。
2. Todo的标题添加，完成，编辑（标题，截止日期，备注）与删除。

结构介绍
-------------------
使用Express命令所生成的结构为
```
  -public/
    |__images/
    |__javascript/
    |__stylesheets/
  -routes/
    |__index.js
    |__user.js
  -views/
    |__index.jade
    |__layout.jade
  -app.js
  -package.json
```
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
TODO Web应用开发
===============

1. 修改pakcage.json。首先我先修改package.json，修改应用信息与引用其他库的信息。

```json
{
  "name": "ToDo Web App", // 应用名称
  "description": "A demo app", // 应用的描述
  "version": "0.0.1",     // 应用开发版本号
  "private": true,
  "author": "Huang Xiaojie<huangxiaojie@email.com>", // 开发者信息
  "scripts": {
    "start": "nodemon server.js"
  },
  "dependencies": {
    "express": "latest",   // express库
    , "jade": "latest"     // jade模版库
    , "mongoose":"latest"  // mongodb的nodejs库
    , "connect-mongo": "latest" // connect库的mongo模块
    , "connect-flash": "latest" // connect的flash模块
    , "passport": "latest"      // passport库，用户认证模块
    , "passport-local": "latest" // passport库的本地用户模块
    , "passport-facebook": "latest" // passport库的facebook模块
    , "passport-twitter": "latest"  // passport库的twitter模块
    , "passport-github": "latest"   // passport库的github模块
    , "passport-google-oauth": "latest" // passport库的google-oauth模块
    , "underscore": "latest"
    , "gzippo": "latest"     
    , "async": "latest"
    , "nodemon": "latest"
    , "view-helpers": "latest"
  }
}
```
2. 编辑server.js。

```Javascript

```
