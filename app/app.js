// app.js
"use strict";

module.exports = (app) => {
  app.beforeStart(async () => {
    try {
      console.log("Starting app_worker...");
      // 测试 MySQL 连接
      const result = await app.mysql.query("SELECT 1 + 1 AS result");
      console.log("MySQL connection test:", result[0].result);
    } catch (error) {
      console.error("App startup error:", error);
      throw error; // 抛出错误以确保日志输出
    }
  });

  // // 监听连接
  // io.on("connection", (socket) => {
  //   console.log(
  //     `用户已连接: ${socket.id}, 用户ID: ${socket.user.id}, 角色: ${socket.user.role}`
  //   );

  //   // 加入房间
  //   socket.on("join", async (room) => {
  //     if (!room) {
  //       socket.emit("error", { message: "房间 ID 不能为空" });
  //       return;
  //     }

  //     socket.join(room);
  //     console.log(`用户 ${socket.user.id} 加入房间: ${room}`);

  //     // 发送欢迎消息
  //     const welcomeMessage = {
  //       user: "系统",
  //       text: "欢迎进入客服房间！",
  //       role: "system",
  //       createdAt: new Date(),
  //     };
  //     socket.emit("message", welcomeMessage);

  //     // 存储系统消息
  //     await app.service.chat.saveMessage({
  //       userId: socket.user.id,
  //       room,
  //       message: welcomeMessage.text,
  //       role: welcomeMessage.role,
  //     });

  //     // 通知商家（你自己）
  //     io.to("merchant_room").emit("userJoined", {
  //       userId: socket.user.id,
  //       room,
  //     });
  //   });

  //   // 接收用户消息
  //   socket.on("sendMessage", async (data, callback) => {
  //     const { room, message } = data;
  //     if (!room || !message) {
  //       socket.emit("error", { message: "房间 ID 和消息内容不能为空" });
  //       if (callback) callback({ status: "error" });
  //       return;
  //     }

  //     const chatMessage = {
  //       user:
  //         socket.user.role === "customer"
  //           ? `用户 ${socket.user.id}`
  //           : socket.user.role === "merchant"
  //           ? "商家"
  //           : "系统",
  //       text: message,
  //       role: socket.user.role,
  //       createdAt: new Date(),
  //     };

  //     // 广播消息到房间
  //     io.to(room).emit("message", chatMessage);

  //     // 存储消息
  //     await app.service.chat.saveMessage({
  //       userId: socket.user.id,
  //       room,
  //       message: chatMessage.text,
  //       role: chatMessage.role,
  //     });

  //     if (callback) callback({ status: "ok" });
  //   });

  //   // 商家（客服）发送消息
  //   socket.on("merchantSendMessage", async (data, callback) => {
  //     const { room, message } = data;
  //     if (!room || !message) {
  //       socket.emit("error", { message: "房间 ID 和消息内容不能为空" });
  //       if (callback) callback({ status: "error" });
  //       return;
  //     }

  //     // 验证是否为商家
  //     if (socket.user.role !== "merchant") {
  //       socket.emit("error", { message: "无权限发送客服消息" });
  //       if (callback) callback({ status: "error" });
  //       return;
  //     }

  //     const chatMessage = {
  //       user: "商家",
  //       text: message,
  //       role: socket.user.role,
  //       createdAt: new Date(),
  //     };

  //     // 广播消息到房间
  //     io.to(room).emit("message", chatMessage);

  //     // 存储消息
  //     await app.service.chat.saveMessage({
  //       userId: socket.user.id,
  //       room,
  //       message: chatMessage.text,
  //       role: chatMessage.role,
  //     });

  //     if (callback) callback({ status: "ok" });
  //   });

  //   // 商家加入房间
  //   socket.on("merchantJoin", () => {
  //     if (socket.user.role !== "merchant") {
  //       socket.emit("error", { message: "无权限加入商家房间" });
  //       return;
  //     }
  //     socket.join("merchant_room");
  //     console.log(`商家 ${socket.user.id} 加入 merchant_room`);
  //   });

  //   // 断开连接
  //   socket.on("disconnect", () => {
  //     console.log(
  //       `用户已断开: ${socket.id}, 用户ID: ${socket.user.id}, 角色: ${socket.user.role}`
  //     );
  //   });
  // });

  process.on("uncaughtException", (err) => {
    console.error("未捕获的异常:", err);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("未处理的Promise拒绝:", reason);
  });

  // app.io = io;
};
