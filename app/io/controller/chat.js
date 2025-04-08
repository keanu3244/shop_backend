// app/io/controller/chat.js
module.exports = (app) => {
  return {
    async connection(socket, data) {
      socket.emit("receiveMessage", {
        status: "ok",
        type: "system",
        data: { msg: "连接成功!", connection: true },
      }); // 响应回调
      const userId = socket.socket.user.id;
      const roomId = socket.res.req.args[0].roomId
        ? socket.res.req.args[0].roomId
        : `room_${userId}`;
      console.log("当前房间", roomId);
      socket.join(roomId);
      const roomExists = await app.mysql.get("rooms", { room_id: roomId });
      if (!roomExists && socket.socket.user.role === "customer") {
        await app.mysql.insert("rooms", { room_id: roomId, user_id: userId });
      }
    },
    async sendMessage(socket, data) {
      const user = socket.socket.user;
      const userId = user.id;
      const roomId = socket.res.req.args[0].roomId
        ? socket.res.req.args[0].roomId
        : `room_${userId}`;
      console.log("socket.res.req.args", socket.res.req.args);
      const message = socket.res.req.args[0].msg;
      const messageData = {
        role: user.role,
        room_id: roomId,
        sender_id: userId,
        sender_username: user.username,
        message,
        created_at: new Date(),
      };
      console.log("插入", messageData);

      await app.mysql.insert("messages", messageData);
      socket.to(roomId).emit("receiveMessage", {
        type: "message",
        data: {
          role: user.role,
          userId,
          username: user.username,
          message,
          timestamp: new Date().toISOString(),
        },
      });
      socket.emit("sendMessage", {
        status: "ok",
        data: { msg: "消息发送成功" },
      });
    },
    async message(socket) {
      console.log("message", socket);
      socket.emit("receiveMessage", {
        status: "ok",
        data: { msg: "连接成功啦", socket },
      }); // 响应回调
    },
    registerEvents(socket) {
      socket.on("connect", () => {
        const id = socket.id;

        // socket.emit("join");
      });
      socket.on("joinRoom", async (roomId) => {
        try {
          if (!socket.authenticated) {
            socket.emit("error", { message: "未认证，请重新登录" });
            return;
          }
          socket.join(roomId);
          socket.emit("joinedRoom", {
            roomId,
            message: `您已加入聊天室 ${roomId}`,
          });
          socket.to(roomId).emit("userJoined", {
            userId: socket.user.userId,
            message: `${socket.user.username} 加入了聊天室`,
          });
          console.log(`${socket.user.username} 加入了聊天室 ${roomId}`);
        } catch (err) {
          console.error("加入聊天室失败:", err.message);
          socket.emit("error", { message: "加入聊天室失败，请稍后重试" });
        }
      });

      socket.on("sendMessage", async (data) => {
        console.log("sendMessage接受", data);
        try {
          const { roomId, message } = data;
          if (!roomId || !message) {
            socket.emit("error", { message: "无效的消息数据" });
            return;
          }
          const messageData = {
            userId: socket.user.userId,
            username: socket.user.username,
            role: socket.user.role, // 确保包含 role
            message,
            timestamp: new Date().toISOString(),
          };
          await app.mysql.insert("messages", {
            sender_id: socket.user.userId,
            message,
            created_at: new Date(),
          });
          socket.to(roomId).emit("receiveMessage", messageData);
          socket.emit("receiveMessage", messageData);
          socket.emit("sendMessage", { status: "ok" }); // 响应回调
        } catch (err) {
          console.error("发送消息失败:", err.message);
          socket.emit("error", { message: "发送消息失败，请稍后重试" });
          socket.emit("sendMessage", { status: "error", message: err.message });
        }
      });

      socket.on("leaveRoom", async (roomId) => {
        try {
          if (!socket.authenticated) {
            socket.emit("error", { message: "未认证，请重新登录" });
            return;
          }
          socket.leave(roomId);
          socket.emit("leftRoom", {
            roomId,
            message: `您已离开聊天室 ${roomId}`,
          });
          socket.to(roomId).emit("userLeft", {
            userId: socket.user.userId,
            message: `${socket.user.username} 离开了聊天室`,
          });
          console.log(`${socket.user.username} 离开了聊天室 ${roomId}`);
        } catch (err) {
          console.error("离开聊天室失败:", err.message);
          socket.emit("error", { message: "离开聊天室失败，请稍后重试" });
        }
      });

      socket.on("getHistory", async (data) => {
        try {
          if (!socket.authenticated) {
            socket.emit("error", { message: "未认证，请重新登录" });
            return;
          }
          const { targetId } = data;
          const userId = socket.user.userId;
          const history = await this.getHistory(userId, targetId);
          socket.emit("chatHistory", history);
        } catch (err) {
          console.error("获取聊天历史失败:", err.message);
          socket.emit("error", { message: "获取聊天历史失败，请稍后重试" });
        }
      });
    },

    async getHistory(userId, targetId) {},
  };
};
