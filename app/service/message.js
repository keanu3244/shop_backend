// app/service/message.js
"use strict";

const Service = require("egg").Service;

class MessageService extends Service {
  async create({ senderId, receiverId, content }) {
    const { app } = this;
    const result = await app.mysql.insert("messages", {
      sender_id: senderId,
      receiver_id: receiverId, // 可能为 null
      content,
    });
    if (result.affectedRows !== 1) {
      throw new Error("消息存储失败");
    }
    return {
      id: result.insertId,
      senderId,
      receiverId,
      content,
      createdAt: new Date(),
    };
  }

  async getHistory(userId, targetId) {
    const { app } = this;
    return await app.mysql.select("messages", {
      where: {
        OR: [
          { sender_id: userId, receiver_id: targetId },
          { sender_id: targetId, receiver_id: userId },
          { sender_id: userId, receiver_id: null }, // 广播消息
        ],
      },
      orders: [["created_at", "asc"]],
    });
  }
}

module.exports = MessageService;
