// app/controller/payment.js
const Controller = require("egg").Controller;
const TronWeb = require("tronweb");

class PaymentController extends Controller {
  async createOrder() {
    const { ctx, app } = this;
    const { productId, amount } = ctx.request.body;

    // 验证用户身份
    const user = ctx.state.user;
    if (!user) {
      ctx.status = 401;
      ctx.body = { status: "error", message: "未登录" };
      return;
    }

    // 查询商品信息
    const product = await app.mysql.get("products", { id: productId });
    if (!product) {
      ctx.status = 404;
      ctx.body = { status: "error", message: "商品不存在" };
      return;
    }

    // 验证金额
    if (amount <= 0 || amount > product.price) {
      ctx.status = 400;
      ctx.body = { status: "error", message: "金额无效" };
      return;
    }

    // 获取商家的收款地址
    const merchant = await app.mysql.get("merchants", { user_id: user.id });
    if (!merchant || !merchant.tron_address) {
      ctx.status = 400;
      ctx.body = { status: "error", message: "商家未设置收款地址" };
      return;
    }

    // 创建支付订单
    const now = new Date();
    const order = await app.mysql.insert("payment_orders", {
      user_id: user.id,
      product_id: productId,
      amount,
      merchant_address: merchant.tron_address,
      status: "pending",
      created_at: now,
      updated_at: now,
    });

    ctx.body = {
      status: "ok",
      orderId: order.insertId,
      merchantAddress: merchant.tron_address,
      amount,
    };
  }
  async checkPayment() {
    const { ctx, app } = this;
    const { orderId } = ctx.request.query;

    // 验证用户身份
    const user = ctx.state.user;
    if (!user) {
      ctx.status = 401;
      ctx.body = { status: "error", message: "未登录" };
      return;
    }

    // 查询订单
    const order = await app.mysql.get("payment_orders", {
      id: orderId,
      user_id: user.id,
    });
    if (!order) {
      ctx.status = 404;
      ctx.body = { status: "error", message: "订单不存在" };
      return;
    }

    if (order.status !== "pending") {
      ctx.body = { status: "ok", orderStatus: order.status };
      return;
    }

    // 初始化 TronWeb
    const tronWeb = new TronWeb({
      fullNode: app.config.tron.fullNode,
      solidityNode: app.config.tron.solidityNode,
      eventServer: app.config.tron.eventServer,
      headers: { "TRON-PRO-API-KEY": app.config.tron.apiKey },
    });

    try {
      // 查询最近的交易记录
      const transactions = await tronWeb.trx.getTransactionsRelated(
        order.merchant_address,
        "to",
        10
      );

      // 查找匹配的交易
      let paymentConfirmed = false;
      for (const tx of transactions) {
        const txInfo = await tronWeb.trx.getTransactionInfo(tx.txID);
        if (
          txInfo &&
          txInfo.receipt &&
          txInfo.receipt.result === "SUCCESS" &&
          tronWeb.toDecimal(tx.raw_data.contract[0].parameter.value.amount) /
            1e6 ===
            order.amount &&
          tx.raw_data.contract[0].parameter.value.to_address ===
            tronWeb.address.toHex(order.merchant_address)
        ) {
          paymentConfirmed = true;
          break;
        }
      }

      if (paymentConfirmed) {
        // 更新订单状态
        await app.mysql.update("payment_orders", {
          id: orderId,
          status: "completed",
          updated_at: new Date(),
        });
        ctx.body = { status: "ok", orderStatus: "completed" };
      } else {
        ctx.body = { status: "ok", orderStatus: "pending" };
      }
    } catch (error) {
      ctx.app.logger.error("查询支付状态失败:", error.message);
      ctx.status = 500;
      ctx.body = { status: "error", message: "查询支付状态失败" };
    }
  }
}

module.exports = PaymentController;
