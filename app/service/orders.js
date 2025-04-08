// app/service/order.js
"use strict";

const Service = require("egg").Service;

class OrderService extends Service {
  async create({
    userId,
    productId,
    quantity,
    totalPrice,
    paymentDeadline,
    paymentInfo,
  }) {
    const { app } = this;
    const result = await app.mysql.insert("payment_orders", {
      user_id: userId,
      product_id: productId,
      amount: quantity,
      total_price: totalPrice,
      status: "pending",
      payment_info: JSON.stringify(paymentInfo),
      payment_deadline: paymentDeadline,
    });
    if (result.affectedRows !== 1) {
      throw new Error("创建订单失败");
    }
    // 获取商家的收款信息
    const product = await app.mysql.get("products", { id: productId });
    let merchantPaymentInfo = null;
    if (product) {
      const merchant = await app.mysql.get("users", {
        id: product.merchant_id,
      });
      if (merchant && merchant.payment_info) {
        const paymentInfo = JSON.parse(merchant.payment_info);
        merchantPaymentInfo = paymentInfo[paymentMethod] || null;
      }
    }

    return { orderId: result.insertId, merchantPaymentInfo };
  }

  async findById(orderId) {
    const { app } = this;
    const order = await app.mysql.get("payment_orders", { id });
    if (order && order.payment_info) {
      order.payment_info = JSON.parse(order.payment_info);
    }

    // 获取商家的收款信息
    if (order) {
      const product = await app.mysql.get("products", { id: order.product_id });
      if (product) {
        const merchant = await app.mysql.get("users", {
          id: product.merchant_id,
        });
        if (merchant && merchant.payment_info) {
          order.merchant_payment_info = JSON.parse(merchant.payment_info);
        }
      }
    }

    return order;
  }

  async updateStatus(orderId, status) {
    const { app } = this;

    const updateData = {};
    if (status) {
      const allowedStatuses = [
        "pending",
        "completed",
        "failed",
        "cancelled",
        "paid",
      ];
      if (!allowedStatuses.includes(status)) {
        throw new Error(
          `无效的订单状态: ${status}，允许的值为: ${allowedStatuses.join(", ")}`
        );
      }
      updateData.status = status;
    }

    const result = await app.mysql.update("orders", updateData, {
      where: { id },
    });
    if (result.affectedRows !== 1) {
      throw new Error("更新订单失败");
    }
  }

  async updateShippingStatus(orderId, shippingStatus) {
    const { app } = this;
    const result = await app.mysql.update(
      "payment_orders",
      { shipping_status: shippingStatus, updated_at: new Date() },
      { where: { id: orderId } }
    );
    if (result.affectedRows !== 1) {
      throw new Error("更新发货状态失败");
    }
  }
}

module.exports = OrderService;
