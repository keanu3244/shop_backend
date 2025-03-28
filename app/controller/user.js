"use strict";

const Controller = require("egg").Controller;
const bcrypt = require("bcrypt");

class UserController extends Controller {
  // 统一响应格式
  #response({ status, message, data = {}, code = 200, httpStatus = 200 }) {
    const { ctx } = this;
    ctx.body = { code, status, message, data };
    ctx.status = httpStatus;
  }

  // 参数校验
  #validateParams(params, requiredFields, validRoles = null) {
    const { ctx } = this;
    for (const field of requiredFields) {
      if (!params[field]) {
        this.#response({
          status: "error",
          message: `${field} 不能为空`,
        });
        return false;
      }
    }

    if (validRoles && params.role && !validRoles.includes(params.role)) {
      this.#response({
        status: "error",
        message: `角色必须是 ${validRoles.join(" 或 ")}`,
      });
      return false;
    }

    return true;
  }

  // 注册
  async register() {
    const { ctx } = this;
    const { username, password, role } = ctx.request.body;

    // 参数校验
    if (
      !this.#validateParams(
        { username, password, role },
        ["username", "password", "role"],
        ["customer", "merchant"]
      )
    ) {
      return;
    }

    try {
      // 检查用户名是否已存在
      const existingUser = await ctx.service.user.findByUsername(username);
      if (existingUser) {
        return this.#response({
          status: "error",
          message: "用户名已存在",
        });
      }

      // 注册用户
      await ctx.service.user.register({ username, password, role });

      this.#response({
        status: "ok",
        message: "注册成功",
        data: { username, role },
        httpStatus: 201,
      });
    } catch (error) {
      this.#response({
        status: "error",
        message: error.message,
        httpStatus: 500,
      });
    }
  }

  // 登录
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    // 参数校验
    if (
      !this.#validateParams({ username, password }, ["username", "password"])
    ) {
      return;
    }

    try {
      // 查找用户
      const user = await ctx.service.user.findByUsername(username);
      if (!user) {
        return this.#response({
          status: "error",
          message: "用户名或密码错误",
        });
      }

      // 验证密码
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return this.#response({
          status: "error",
          message: "用户名或密码错误",
        });
      }

      // 生成 JWT token
      const token = ctx.app.jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        ctx.app.config.jwt.secret,
        { expiresIn: "24h" }
      );

      this.#response({
        status: "ok",
        message: "登录成功",
        data: { username: user.username, role: user.role, token },
      });
    } catch (error) {
      this.#response({
        status: "error",
        message: error.message,
        httpStatus: 500,
      });
    }
  }
  // 验证 token 接口
  async verify() {
    const { ctx, service } = this;

    // token 验证已在中间件中完成，用户信息存储在 ctx.state.user
    const { id } = ctx.state.user;
    try {
      // 根据用户 ID 查找用户
      const user = await service.auth.findUserById(id);
      ctx.body = {
        status: "ok",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
      this.#response({
        status: "ok",
        message: "验证成功",
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
          },
        },
      });
    } catch (error) {
      ctx.status = 404;
      ctx.body = { status: "error", message: error.message };
    }
  }
}

module.exports = UserController;
