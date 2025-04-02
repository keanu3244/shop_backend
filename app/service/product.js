// app/service/product.js
"use strict";

const Service = require("egg").Service;

class ProductService extends Service {
  // 创建商品
  async create({
    title,
    imageUrl,
    stock,
    categoryId,
    merchantId,
    description,
    price,
    supportedPaymentMethods,
  }) {
    const { app, ctx } = this;
    try {
      const result = await app.mysql.insert("products", {
        title,
        image_url: imageUrl,
        stock,
        category_id: categoryId,
        merchant_id: merchantId,
        description,
        price,
        supported_payment_methods: JSON.stringify(["wechat", "alipay"]),
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
        categoryId,
        description,
        price,
        imageUrl: fullImageUrl, // 返回给前端时使用完整路径
        supported_payment_methods: supportedPaymentMethods,
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
          "category_id",
          "description",
          "price",
          "supported_payment_methods",
        ],
      });

      // 拼接完整的 imageUrl 并处理 supported_payment_methods
      return products.map((product) => {
        let supportedPaymentMethods = ["wechat", "alipay"]; // 默认值
        if (product.supported_payment_methods) {
          try {
            supportedPaymentMethods = JSON.parse(
              product.supported_payment_methods
            );
          } catch (error) {
            ctx.logger.warn(
              `解析 supported_payment_methods 失败，product id: ${product.id}, 值: ${product.supported_payment_methods}`
            );
          }
        }

        return {
          id: product.id,
          title: product.title,
          imageUrl: `${ctx.request.protocol}://${ctx.request.host}${product.image_url}`,
          stock: product.stock,
          categoryId: product.category_id,
          description: product.description,
          price: product.price,
          supportedPaymentMethods,
        };
      });
    } catch (error) {
      ctx.logger.error("获取商品列表失败:", error);
      throw error;
    }
  }

  async findById(id) {
    const { app, ctx } = this;
    try {
      const product = await app.mysql.get("products", { id });
      if (!product) {
        throw new Error("商品不存在");
      }

      return {
        id: product.id,
        title: product.title,
        imageUrl: `${ctx.request.protocol}://${ctx.request.host}${product.image_url}`,
        stock: product.stock,
        categoryId: product.category_id,
        description: product.description,
        price: product.price,
        supportedPaymentMethods: product.supported_payment_methods,
        merchant_id: product.merchant_id,
      };
    } catch (error) {
      ctx.logger.error("获取商品失败:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
