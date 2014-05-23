/**
 * @file 应用程序启动器
 * @author fzcs
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

GLOBAL.smart = require("smartcore");

var http        = smart.lang.http
  , app         = smart.util.express()
  , middleware  = smart.framework.middleware
  , loader      = smart.framework.loader
  , log         = smart.framework.log
  , route       = smart.framework.route;

/**
 * 初始化smartcore模块
 */
loader.initialize();

/**
 * 初始化express模块
 */
loader.express(app);

app.use(middleware.loadCompany);  // 加载用户的公司信息
app.use(middleware.lang);         // 设定语言
app.use(middleware.authenticate); // 认证
app.use(middleware.csrftoken);    // 生成CsrfToken
app.use(middleware.timeout);      // 设定超时
app.use(middleware.urlstamp);     // 设定URL变更标识

/**
 * 路由
 */
route.api(app);
route.website(app);
route.redirect(app);
smart.ctrl.dispatcher.dispatch(app);
/**
 * 启动服务
 */
http.createServer(app).listen(app.get("port"), function(){
  log.info("Express server listening on port " + app.get("port"));
});
