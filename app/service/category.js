// app/service/category.js
"use strict";

const Service = require("egg").Service;

class CategoryService extends Service {
  async create({ name }) {
    const { app } = this;
    const existingCategory = await app.mysql.get("categories", { name });
    if (existingCategory) {
      throw new Error("分类已存在");
    }

    const result = await app.mysql.insert("categories", { name });
    if (result.affectedRows !== 1) {
      throw new Error("分类创建失败");
    }

    return {
      id: result.insertId,
      name,
    };
  }

  async list() {
    const { app } = this;
    const categories = await app.mysql.select("categories", {
      columns: ["id", "name"],
    });
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  async findByName(name) {
    const { app } = this;
    return await app.mysql.get("categories", { name });
  }
}

module.exports = CategoryService;
