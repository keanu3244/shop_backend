// app/io/middleware/auth.js
module.exports = (app) => {
  return async (ctx, next) => {
    const authHeader = ctx.socket && ctx.socket.handshake.query.token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.status = 401;
      ctx.body = { status: "error", message: "未登录或 token 无效" };
      return;
    }
    const token = authHeader.split(" ")[1]; // 提取 token（Bearer <token>）

    // 使用 app.jwt.verify 验证 token
    const decoded = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    ctx.socket.user = decoded; // 为Socket存储用户信息
    ctx.socket.authenticated = true;
    await next();
  };
};
