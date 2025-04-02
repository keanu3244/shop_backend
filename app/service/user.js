"use strict";

const Service = require("egg").Service;
const bcrypt = require("bcrypt");

class UserService extends Service {
  async getBalance(userId) {
    const { app } = this;
    const user = await app.mysql.get("users", { id: userId });
    return user.balance || 0;
  }

  async updateBalance(userId, newBalance) {
    const { app } = this;
    const result = await app.mysql.update(
      "users",
      { balance: newBalance },
      { where: { id: userId } }
    );
    if (result.affectedRows !== 1) {
      throw new Error("更新用户余额失败");
    }
  }

  async findAdmins() {
    const { app } = this;
    return await app.mysql.select("users", {
      where: { role: "system" },
    });
  }
  // 注册用户
  async register({ username, password, role }) {
    const { app } = this;
    const hashedPassword = await bcrypt.hash(password, 10); // 加密密码
    const result = await app.mysql.insert("users", {
      username,
      password: hashedPassword,
      role,
    });
    return result;
  }

  // 根据用户名查找用户
  async findByUsername(username) {
    const { app } = this;
    const user = await app.mysql.get("users", { username });
    return user;
  }
}

module.exports = UserService;
