// app/controller/rooms.js
const Controller = require("egg").Controller;

class RoomsController extends Controller {
  async index() {
    const { ctx } = this;

    // 权限检查：仅允许商家访问
    if (ctx.state.user.role !== "merchant") {
      ctx.status = 403;
      ctx.body = { status: "error", message: "仅限商家访问" };
      return;
    }

    try {
      // 获取所有聊天室
      const rooms = await ctx.app.mysql.select("rooms");

      ctx.body = {
        status: "ok",
        data: rooms,
      };
    } catch (error) {
      ctx.logger.error("获取聊天室列表失败:", error.message);
      ctx.status = 500;
      ctx.body = { status: "error", message: "获取聊天室列表失败" };
    }
  }
}

module.exports = RoomsController;
