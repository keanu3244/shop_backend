// app/controller/message.js
"use strict";

const Controller = require("egg").Controller;

class MessageController extends Controller {
  async history() {
    const { ctx } = this;
    const user = ctx.state.user;
    const { targetId } = ctx.query;

    try {
      const messages = await ctx.service.message.getHistory(
        user.id,
        targetId || 0
      );
      ctx.body = {
        status: "ok",
        data: messages,
      };
      ctx.status = 200;
    } catch (error) {
      ctx.logger.error("获取消息历史失败:", error.message);
      ctx.body = {
        status: "error",
        message: error.message || "获取消息历史失败",
      };
      ctx.status = 500;
    }
  }
}

module.exports = MessageController;
