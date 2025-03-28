// app/service/product.js
"use strict";

const Service = require("egg").Service;

class ProductService extends Service {
  // 创建商品
  async create({
    title,
    imageUrl,
    stock,
    category,
    merchantId,
    description,
    price,
  }) {
    const { app, ctx } = this;
    ctx.logger.info("创建商品，title:", title);

    try {
      const result = await app.mysql.insert("products", {
        title,
        image_url: imageUrl,
        stock,
        category,
        merchant_id: merchantId,
        description,
        price,
      });

      if (result.affectedRows !== 1) {
        throw new Error("商品创建失败");
      }

      // 拼接完整的 imageUrl
      const fullImageUrl = `${ctx.request.protocol}://${ctx.request.host}${imageUrl}`;

      return {
        id: result.insertId,
        title,
        image_url: imageUrl, // 数据库中仍存储相对路径
        stock,
        category,
        description,
        price,
        imageUrl: fullImageUrl, // 返回给前端时使用完整路径
      };
    } catch (error) {
      ctx.logger.error("创建商品失败:", error);
      throw error;
    }
  }

  // 获取商品列表
  async list() {
    const { app, ctx } = this;
    ctx.logger.info("获取商品列表");

    try {
      const products = await app.mysql.select("products", {
        columns: [
          "id",
          "title",
          "image_url",
          "stock",
          "category",
          "description",
          "price",
        ],
      });

      // 拼接完整的 imageUrl
      return products.map((product) => ({
        id: product.id,
        title: product.title,
        imageUrl: `${ctx.request.protocol}://${ctx.request.host}${product.image_url}`, // 拼接完整路径
        stock: product.stock,
        category: product.category,
        description: product.description,
        price: product.price,
      }));
    } catch (error) {
      ctx.logger.error("获取商品列表失败:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
