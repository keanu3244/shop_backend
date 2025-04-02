// app/io/controller/chat.js
"use strict";

const Controller = require("egg").Controller;

class ChatController extends Controller {
  async index() {
    const { ctx, app } = this;
    const socket = ctx.socket;
    const user = socket.user;

    socket.join(user.id.toString());

    socket.emit("message", {
      senderId: 0,
      receiverId: user.id,
      content: "欢迎使用客服！有什么可以帮助你的吗？",
      createdAt: new Date(),
    });

    socket.on("message", async (data) => {
      const { content, receiverId } = data;

      const message = await ctx.service.message.create({
        senderId: user.id,
        receiverId: receiverId || 0,
        content,
      });

      if (receiverId) {
        socket.to(receiverId.toString()).emit("message", {
          senderId: user.id,
          receiverId,
          content,
          createdAt: message.createdAt,
        });
      } else {
        const admins = await ctx.service.user.findAdmins();
        for (const admin of admins) {
          socket.to(admin.id.toString()).emit("message", {
            senderId: user.id,
            receiverId: admin.id,
            content,
            createdAt: message.createdAt,
          });
        }
      }

      socket.emit("message", {
        senderId: user.id,
        receiverId: receiverId || 0,
        content,
        createdAt: message.createdAt,
      });
    });

    socket.on("shipOrder", async (data) => {
      const { orderId } = data;
      const order = await ctx.service.order.findById(orderId);
      if (!order) return;

      const product = await ctx.service.product.findById(order.product_id);
      if (product.merchant_id !== user.id) return;

      await ctx.service.order.updateShippingStatus(orderId, "shipped");

      // 存储发货通知消息
      const message = await ctx.service.message.create({
        senderId: 0,
        receiverId: order.user_id,
        content: `您的订单 ${orderId} 已发货，请注意查收！`,
      });

      socket.to(order.user_id.toString()).emit("message", {
        senderId: 0,
        receiverId: order.user_id,
        content: `您的订单 ${orderId} 已发货，请注意查收！`,
        createdAt: message.createdAt,
      });
    });

    socket.on("disconnect", () => {
      console.log(`用户 ${user.id} 已断开连接`);
    });
  }
}

module.exports = ChatController;
