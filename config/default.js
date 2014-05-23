/**
 * @file 应用程序配置文件
 * @author fzcs
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

module.exports = {

  /**
   * 数据库连接信息
   */
  "db": {
      "host": "127.0.0.1"       /* 数据库服务器地址 */
    , "port": 27017         /* 数据库服务器端口 */
    , "pool": 5             /* 连接池个数 */
    , "prefix": ""          /* collection名的前缀 */
    , "dbname": "PaySample" /* 数据库名称 */

    /**
     * 默认的collection名称前面会自动添加prefix
     * 如果需要指定自定义的名称，则可以在schema里明确指出
     */
    , "schema": {
        "User": "Users" /* 用户表不加前缀 */
      }
    }

  /**
   * 测试用数据库
   */
  , "testdb": {
      "host": "mongo"
    , "port": 27017
    , "dbname": "smartcoretest"
    , "pool": 5
    }

  /**
   * 邮件设定
   */
  , "mail": {
      "service": "Gmail"        /* 邮件服务器 */
    , "auth": {                 /* 认证信息 */
        "user": "smart@gmail.com"
      , "pass": "smart"
      }
    }

  /**
   * 应用程序设定
   */
  , "app": {
      "port": 3002                      /* 应用程序端口 */
    , "views": "views"                  /* ejs的模板存放位置，应用程序需要根据实际路径进行设定 */
    , "public": "/"                     /* 静态文件的存放位置的父路径，即static的父路径 */
    , "static": "static"                /* 静态文件的存放位置 */
    , "cookieSecret": "PaySample"          /* cookie secret */
    , "sessionSecret": "PaySample"         /* express的session secret */
    , "sessionKey": "PaySample.sid"        /* express的session key */
    , "sessionTimeout": 720             /* Session超时时间，小时（24 * 30 即一个月） */
    , "tmp": "/tmp"                     /* 保存临时文件用路径（如上传文件等） */
    , "hmackey": "PaySample"               /* sha256加密用key字符串 */
    , "timeout": 3                              /* 请求超时时间（秒） */

    /**
     * 多客户相关设定
     */
    , "domain": {
      "multiTenant": "off"             /* 是否对应多客户 */
    }

    /**
     * 多国语言相关设定
     */
    , "i18n": {
        "cache": "memory"   /* 缓存类型，现在只支持内存缓存 */
      , "lang": "zh"        /* 缺省的语言 */
      , "category": "PaySample" /* 多国语言词条的分类，与数据库i18ns表中得分类对应 */
      }

    /**
     * 无需认证即可访问的资源列表
     */
    , "ignoreAuth": [

        /* 静态资源 */
        "^\/stylesheets"
      , "^\/javascripts"
      , "^\/vendor"
      , "^\/images"
      , "^\/video"

        /* 登陆，注册相关 */
      , "^\/$"
      , "^\/simplelogin.*"
      , "^\/simplelogout.*"
      , "^\/login.*"
      , "^\/register.*"

      , "^\/HealthCheck.*"
      
      , "^\/pay_notify"
      ]

    /**
     * 限定请求超时对象外的资源列表
     */
    , "ignoreTimeout": [
        "/^\/file\/upload.*"
      ]
    }

  /**
   * RabbitMQ连接信息
   */
  , "mq": {
      "host": "mq"                  /* MQ服务器的地址 */
    , "port": 5672                  /* MQ服务器的端口 */
    , "user": "guest"               /* MQ服务器的用户名 */
    , "password": "guest"           /* MQ服务器的密码 */
    , "queue_join": "smartJoin"     /*  */
    , "queue_apn": "smartApn"       /*  */
    , "queue_thumb": "smartThumb"   /*  */
    , "queue_photo": "smartPhoto"   /*  */
    , "queue_notice": "smartNotice" /*  */
    , "maxListeners": 0             /*  */
    }
  };
