README.md
#TODO Web应用介绍#

##概要##

TODO 网页应用是是使用nodejs与mongodb的一个练习项目。主要参考了[madhums nodejs-express-mongoogse-demo](https://github.com/madhums/nodejs-express-mongoose-demo.git)的结构并使用了大部分代码。

##功能介绍##

1. 用户的注册，登录和注销。
2. Todo的标题添加，完成，编辑（标题，截止日期，备注）与删除。

## 安装与应用 ##

```sh
> git clone git://github.com/mh1979/nodejs-express-mongoose-todo.git
> cd nodejs-express-mongoose-todo && npm install
> npm start
```

## 应用结构 ##

对由express命令生成的文件结构框架进行修改。建立一个app文件夹，把原先的routes文件夹重命名为controllers，添加于app文件夹下。将views文件间移动到app下，新建models文件夹。添加config文件夹，将应用设定congifg.js与express与passport以及routes设定放入config文件夹内。最后修改完的文件夹结构如下：

```
  -app\
    |__controllers
    |__models
    |__views
  -config\
    |__middlewares (自建的中间控件)
    |__config.js (应用的全局设置，应用名，db的链接与facebook，twitter等认证信息)
    |__express.js (express的设置)
    |__passport.js (passport的设置）
    |__routes.js (引用中页面跳转与程序关联设置)
  -public\
    |__css\
    |__img\
    |__js\
  -package.json
  -server.js
```

## 使用主要模块介绍 ##

### mongoose模块 ###
monngoose模块是mongodb的node.js下一个封装包。在本例中我在app的models下建立了user和todo两个mongoose的Schema模块。

### passport模块 ###
使用passport作为本地用户的注册，登录与注销。同时也可使用facebook，twitter，github与google的注册用户登录。

google使用oauth2协议授权需要对如下设置。

+ config/passport.js

```Javascript
var GoogleStrategy =require('passport-google-oauth').OAuth2Strategy
```

+ config/routes.js, 注意，使用oauth返回方法会产生错误。

```Javascript
  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}), users.signin)
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)
```
