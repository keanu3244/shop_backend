// app/service/message.js
"use strict";

const Service = require("egg").Service;

class MessageService extends Service {
  async create({ senderId, receiverId, content }) {
    const { app } = this;
    const result = await app.mysql.insert("messages", {
      sender_id: senderId,
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

  async getHistory(roomId) {
    const { app } = this;
    try {
      const query = `
      SELECT *
      FROM messages
      WHERE room_id = ?
      ORDER BY created_at ASC
    `;
      const results = await app.mysql.query(query, [roomId]);

      return results;
    } catch (err) {
      console.error("查询历史消息失败:", err.message);
      throw err;
    }
  }
}

module.exports = MessageService;
