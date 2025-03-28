// app/controller/product.js
"use strict";

const Controller = require("egg").Controller;
const path = require("path");
const fs = require("fs").promises;

class ProductController extends Controller {
  // 上传商品
  async upload() {
    const { ctx } = this;
    const { title, stock, category, description, price } = ctx.request.body;
    const file = ctx.request.files[0];

    if (!title || !stock || !category || !file || !price) {
      ctx.body = {
        code: 200,
        status: "error",
        message: "商品标题、库存、分类、图片和价格不能为空",
      };
      ctx.status = 400;
      return;
    }

    if (!description) {
      ctx.body = {
        code: 200,
        status: "error",
        message: "商品描述不能为空",
      };
      ctx.status = 400;
      return;
    }

    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      ctx.body = {
        code: 200,
        status: "error",
        message: "库存必须为非负整数",
      };
      ctx.status = 400;
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      ctx.body = {
        code: 200,
        status: "error",
        message: "价格必须为非负数",
      };
      ctx.status = 400;
      return;
    }

    const user = ctx.state.user;
    if (!user || user.role !== "merchant") {
      ctx.body = {
        code: 200,
        status: "error",
        message: "只有商家可以上传商品",
      };
      ctx.status = 403;
      return;
    }

    const categoryExists = await ctx.service.category.findByName(category);
    if (!categoryExists) {
      ctx.body = {
        code: 200,
        status: "error",
        message: "分类不存在",
      };
      ctx.status = 400;
      return;
    }

    try {
      const uploadDir = path.join(this.config.baseDir, "app/public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.filename}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.copyFile(file.filepath, filePath);

      const imageUrl = `/public/uploads/${fileName}`;

      const product = await ctx.service.product.create({
        title,
        imageUrl,
        stock: stockNum,
        category,
        merchantId: user.id,
        description,
        price: priceNum,
      });

      ctx.body = {
        code: 200,
        status: "ok",
        message: "商品上传成功",
        data: {
          id: product.id,
          title: product.title,
          imageUrl: product.imageUrl, // 使用完整路径
          stock: product.stock,
          category: product.category,
          description: product.description,
          price: product.price,
        },
      };
      ctx.status = 201;
    } catch (error) {
      ctx.body = {
        code: 200,
        status: "error",
        message: error.message || "商品上传失败",
      };
      ctx.status = 500;
    } finally {
      if (file && file.filepath) {
        await fs.unlink(file.filepath).catch(() => {});
      }
    }
  }

  // 获取商品列表
  async list() {
    const { ctx } = this;

    try {
      const products = await ctx.service.product.list();
      ctx.body = {
        code: 200,
        status: "ok",
        message: "获取商品列表成功",
        data: products,
      };
      ctx.status = 200;
    } catch (error) {
      ctx.logger.error("获取商品列表失败:", error);
      ctx.body = {
        code: 200,
        status: "error",
        message: error.message || "获取商品列表失败",
      };
      ctx.status = 500;
    }
  }
}

module.exports = ProductController;
