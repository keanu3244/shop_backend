// app/controller/order.js
"use strict";

const Controller = require("egg").Controller;

class OrderController extends Controller {
  async create() {
    const { ctx } = this;
    const { productId, quantity } = ctx.request.body;
    const user = ctx.state.user;

    if (!productId || !quantity) {
      ctx.body = {
        status: "error",
        message: "商品 ID 和数量不能为空",
      };
      ctx.status = 400;
      return;
    }

    try {
      const product = await ctx.service.product.findById(productId);
      if (!product) {
        ctx.body = {
          status: "error",
          message: "商品不存在",
        };
        ctx.status = 404;
        return;
      }

      const totalPrice = product.price * quantity;
      const paymentDeadline = new Date(Date.now() + 15 * 60 * 1000);

      const merchant = await ctx.service.merchant.findById(product.merchant_id);
      if (!merchant) {
        ctx.body = {
          status: "error",
          message: "商家不存在",
        };
        ctx.status = 404;
        return;
      }

      const order = await ctx.service.orders.create({
        userId: user.id,
        productId,
        quantity,
        totalPrice,
        paymentDeadline,
        merchantPaymentInfo: merchant.payment_info,
      });

      ctx.body = {
        status: "ok",
        message: "订单创建成功",
        data: {
          orderId: order.id,
        },
      };
      ctx.status = 201;
    } catch (error) {
      ctx.logger.error("创建订单失败:", error.message);
      ctx.body = {
        status: "error",
        message: error.message || "创建订单失败",
      };
      ctx.status = 500;
    }
  }

  async get() {
    const { ctx } = this;
    const { id } = ctx.params;
    const user = ctx.state.user;

    try {
      const order = await ctx.service.orders.findById(id);
      if (!order) {
        ctx.body = {
          status: "error",
          message: "订单不存在",
        };
        ctx.status = 404;
        return;
      }

      const product = await ctx.service.product.findById(order.product_id);
      if (
        order.user_id !== user.id &&
        (user.role !== "merchant" || product.merchant_id !== user.id)
      ) {
        ctx.body = {
          status: "error",
          message: "无权查看此订单",
        };
        ctx.status = 403;
        return;
      }

      if (
        order.status === "pending" &&
        new Date() > new Date(order.payment_deadline)
      ) {
        await ctx.service.orders.updateStatus(id, "failed");
        order.status = "failed";
      }

      ctx.body = {
        status: "ok",
        data: order,
      };
      ctx.status = 200;
    } catch (error) {
      ctx.logger.error("获取订单失败:", error.message);
      ctx.body = {
        status: "error",
        message: error.message || "获取订单失败",
      };
      ctx.status = 500;
    }
  }

  async cancel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const user = ctx.state.user;

    try {
      const order = await ctx.service.order.findById(id);
      if (!order) {
        ctx.body = {
          status: "error",
          message: "订单不存在",
        };
        ctx.status = 404;
        return;
      }

      if (order.user_id !== user.id) {
        ctx.body = {
          status: "error",
          message: "无权操作此订单",
        };
        ctx.status = 403;
        return;
      }

      if (order.status !== "pending") {
        ctx.body = {
          status: "error",
          message: "订单状态不支持取消",
        };
        ctx.status = 400;
        return;
      }

      await ctx.service.orders.updateStatus(id, "cancelled");
      ctx.body = {
        status: "ok",
        message: "订单已取消",
      };
      ctx.status = 200;
    } catch (error) {
      ctx.logger.error("取消订单失败:", error.message);
      ctx.body = {
        status: "error",
        message: error.message || "取消订单失败",
      };
      ctx.status = 500;
    }
  }

  async confirmPayment() {
    const { ctx } = this;
    const { id } = ctx.params;
    const user = ctx.state.user;

    try {
      const order = await ctx.service.order.findById(id);
      if (!order) {
        ctx.body = {
          status: "error",
          message: "订单不存在",
        };
        ctx.status = 404;
        return;
      }

      if (order.user_id !== user.id) {
        ctx.body = {
          status: "error",
          message: "无权操作此订单",
        };
        ctx.status = 403;
        return;
      }

      if (order.status !== "pending") {
        ctx.body = {
          status: "error",
          message: "订单状态不支持确认付款",
        };
        ctx.status = 400;
        return;
      }

      await ctx.service.orders.updateStatus(id, "paid");
      ctx.body = {
        status: "ok",
        message: "已确认付款，等待商家发货",
      };
      ctx.status = 200;
    } catch (error) {
      ctx.logger.error("确认付款失败:", error.message);
      ctx.body = {
        status: "error",
        message: error.message || "确认付款失败",
      };
      ctx.status = 500;
    }
  }

  async ship() {
    const { ctx } = this;
    const { id } = ctx.params;
    const user = ctx.state.user;

    try {
      const order = await ctx.service.order.findById(id);
      if (!order) {
        ctx.body = {
          status: "error",
          message: "订单不存在",
        };
        ctx.status = 404;
        return;
      }

      const product = await ctx.service.product.findById(order.product_id);
      if (product.merchant_id !== user.id || user.role !== "merchant") {
        ctx.body = {
          status: "error",
          message: "无权操作此订单",
        };
        ctx.status = 403;
        return;
      }

      if (order.status !== "paid") {
        ctx.body = {
          status: "error",
          message: "订单状态不支持发货",
        };
        ctx.status = 400;
        return;
      }

      await ctx.service.order.updateShippingStatus(id, "shipped");
      ctx.body = {
        status: "ok",
        message: "订单已发货",
      };
      ctx.status = 200;
    } catch (error) {
      ctx.logger.error("发货失败:", error.message);
      ctx.body = {
        status: "error",
        message: error.message || "发货失败",
      };
      ctx.status = 500;
    }
  }
}

module.exports = OrderController;
