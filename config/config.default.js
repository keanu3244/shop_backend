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

  // 添加 TronGrid 配置
  config.tron = {
    fullNode: "https://api.shasta.trongrid.io", // 测试网
    solidityNode: "https://api.shasta.trongrid.io",
    eventServer: "https://api.shasta.trongrid.io",
    apiKey: "29715be8-3b1f-4ef5-a9e9-a3bddc81415b", // 替换为你的 API Key
  };

  // config.wechatPay = {
  //   appid: "your_wechat_appid",
  //   mchid: "your_wechat_mchid",
  //   privateKey: "your_wechat_private_key",
  //   serialNo: "your_wechat_serial_no",
  //   certPath: "path/to/your/wechat/apiclient_cert.pem",
  //   keyPath: "path/to/your/wechat/apiclient_key.pem",
  // };

  // config.alipay = {
  //   appId: "your_alipay_appid",
  //   privateKey: "your_alipay_private_key",
  //   alipayPublicKey: "your_alipay_public_key",
  //   gateway: "https://openapi.alipaydev.com/gateway.do",
  // };

  // 添加 baseUrl 配置
  config.baseUrl = "http://localhost:7001";

  return {
    ...config,
    ...userConfig,
  };
};
