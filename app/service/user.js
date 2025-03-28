"use strict";

const Service = require("egg").Service;
const bcrypt = require("bcrypt");

class UserService extends Service {
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
