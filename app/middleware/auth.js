// app/middleware/auth.js
module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const white = ["/user/login", "/user/register", "/"];
    if (white.includes(ctx.url)) {
      await next();
      return;
    }

    try {
      const authHeader = ctx.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        ctx.status = 401;
        ctx.body = { status: "error", message: "未登录或 token 无效" };
        return;
      }

      const token = authHeader.split(" ")[1]; // 提取 token（Bearer <token>）

      // 使用 app.jwt.verify 验证 token
      const decoded = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      ctx.state.user = decoded; // 将解码后的用户信息附加到 ctx.state.user

      await next();
    } catch (error) {
      // 使用 ctx.app.logger 记录错误
      ctx.app.logger.error("Token 验证失败:", error.message);
      ctx.status = 401;
      ctx.body = { status: "error", message: "token 无效或已过期" };
    }
  };
};
