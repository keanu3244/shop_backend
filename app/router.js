// app/router.js
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;
  const jwt = middleware.jwt(app.config.jwt); // 导入并初始化 jwt 中间件

  router.get("/", controller.home.index);
  router.post("/user/register", controller.user.register);
  router.post("/user/login", controller.user.login);
  // 分类相关路由
  router.post("/categories", jwt, controller.category.create); // 创建分类
  router.get("/categories", controller.category.list); // 获取分类列表
  // 商品相关路由
  router.post("/products", jwt, controller.product.upload);
  router.get("/products", controller.product.list);
};
