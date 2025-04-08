// app/router.js
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware, io } = app;
  const jwt = middleware.jwt(app.config.jwt); // 导入并初始化 jwt 中间件
  const auth = middleware.auth(); // 使用认证中间件

  router.get("/", controller.home.index);
  router.post("/user/register", controller.user.register);
  router.post("/user/login", controller.user.login);
  // router.post("/user/payment-info", controller.user.updatePaymentInfo);
  // 验证 token 路由
  router.get("/user/verify", auth, controller.user.verify);
  // 分类相关路由
  router.post("/categories", jwt, controller.category.create); // 创建分类
  router.get("/categories", controller.category.list); // 获取分类列表
  // 商品相关路由
  router.post("/products", jwt, controller.product.upload);
  router.get("/products", controller.product.list);
  // 支付相关路由
  router.post("/payment/create", auth, controller.payment.createOrder);
  router.get("/payment/check", auth, controller.payment.checkPayment);
  // 商家信息路由
  router.get("/merchant/info", auth, controller.merchant.info);
  router.post("/merchant/update", auth, controller.merchant.update);
  // 订单相关
  router.post("/orders", jwt, controller.orders.create);
  router.get("/orders/:id", jwt, controller.orders.get);
  router.post("/orders/:id/cancel", jwt, controller.orders.cancel);
  router.post("/orders/:id/confirm", jwt, controller.orders.confirmPayment); // 新增：确认付款
  router.post("/orders/:id/ship", jwt, controller.orders.ship); // 新增：商家发货
  router.post("/upload", jwt, controller.upload.upload); // 文件上传路由
  //聊天室相关
  // router.get("/chat/ping", controller.chat.ping);
  router.get("/messages/history", jwt, controller.message.history);
  router.get("/rooms", controller.rooms.index);
  //socket
  io.of("/").route("message", io.controller.chat.message);
  io.of("/").route("sendMessage", io.controller.chat.sendMessage);
  io.of("/").route("connection", io.controller.chat.connection);
};
