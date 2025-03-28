// app/service/auth.js
const Service = require("egg").Service;

class AuthService extends Service {
  // 根据用户 ID 查找用户
  async findUserById(id) {
    const { app } = this;
    const user = await app.mysql.get("users", { id });
    if (!user) {
      throw new Error("用户不存在");
    }
    return user;
  }
}

module.exports = AuthService;
