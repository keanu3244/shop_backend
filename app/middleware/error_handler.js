// app/middleware/error_handler.js
module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 记录错误日志
      ctx.app.emit("error", err, ctx);
      const status = err.status || 500;
      const message = status === 500 ? "服务器内部错误" : err.message;

      ctx.body = {
        code: 200,
        status: "error",
        message,
      };
      ctx.status = status;
    }
  };
};
