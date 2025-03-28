/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1742982972543_3145";

  // add your middleware config here
  config.middleware = ["errorHandler"];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mysql = {
    client: {
      host: "127.0.0.1",
      port: "3306",
      user: "root",
      password: "187872546Ab!",
      database: "shop_db",
    },
    app: true,
    agent: false,
  };

  // CORS 配置
  config.cors = {
    origin: "*", // 允许所有来源，生产环境应指定具体域名
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };

  config.jwt = {
    secret: "123456",
  };

  config.security = {
    csrf: {
      enable: false, // 禁用 CSRF
    },
  };

  // config/config.default.js
  exports.multipart = {
    mode: "file", // 使用文件模式
    fileSize: "10mb", // 限制文件大小
    whitelist: [".jpg", ".jpeg", ".png", ".gif"], // 允许的文件类型
  };

  return {
    ...config,
    ...userConfig,
  };
};
