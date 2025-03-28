// app/controller/category.js
"use strict";

const Controller = require("egg").Controller;

class CategoryController extends Controller {
  // 创建分类
  async create() {
    const { ctx } = this;
    const { name } = ctx.request.body;

    // 参数校验
    if (!name) {
      ctx.body = {
        code: 200,
        status: "error",
        message: "分类名称不能为空",
      };
      ctx.status = 400;
      return;
    }

    // 验证用户角色（假设只有 merchant 可以创建分类）
    const user = ctx.state.user;
    if (!user || user.role !== "merchant") {
      ctx.body = {
        code: 200,
        status: "error",
        message: "只有商家可以创建分类",
      };
      ctx.status = 403;
      return;
    }

    try {
      const category = await ctx.service.category.create({ name });
      ctx.body = {
        code: 200,
        status: "ok",
        message: "分类创建成功",
        data: category,
      };
      ctx.status = 201;
    } catch (error) {
      ctx.body = {
        code: 200,
        status: "error",
        message: error.message || "分类创建失败",
      };
      ctx.status = 500;
    }
  }

  // 获取分类列表
  async list() {
    const { ctx } = this;

    try {
      const categories = await ctx.service.category.list();
      ctx.body = {
        code: 200,
        status: "ok",
        message: "获取分类列表成功",
        data: categories,
      };
      ctx.status = 200;
    } catch (error) {
      ctx.body = {
        code: 200,
        status: "error",
        message: error.message || "获取分类列表失败",
      };
      ctx.status = 500;
    }
  }
}

module.exports = CategoryController;
