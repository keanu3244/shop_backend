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
    merchantPaymentInfo,
  }) {
    const { app } = this;
    const result = await app.mysql.insert("payment_orders", {
      user_id: userId,
      product_id: productId,
      amount: quantity,
      total_price: totalPrice,
      status: "pending",
      payment_deadline: paymentDeadline,
      merchant_payment_info: JSON.stringify(merchantPaymentInfo),
    });
    console.log("result111", result);
    if (result.affectedRows !== 1) {
      throw new Error("创建订单失败");
    }
    return { id: result.insertId };
  }

  async findById(orderId) {
    const { app } = this;
    return await app.mysql.get("payment_orders", { id: orderId });
  }

  async updateStatus(orderId, status) {
    const { app } = this;
    const result = await app.mysql.update(
      "payment_orders",
      { status, updated_at: new Date() },
      { where: { id: orderId } }
    );
    if (result.affectedRows !== 1) {
      throw new Error("更新订单状态失败");
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
