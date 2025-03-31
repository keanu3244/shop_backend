// app/controller/merchant.js
const Controller = require("egg").Controller;

class MerchantController extends Controller {
  async info() {
    const { ctx, app } = this;
    const user = ctx.state.user;

    if (user.role !== "merchant") {
      ctx.status = 403;
      ctx.body = { status: "error", message: "仅限商家访问" };
      return;
    }

    let merchant = await app.mysql.get("merchants", { user_id: user.id });

    if (!merchant) {
      // 如果商家记录不存在，创建一条
      const now = new Date();
      await app.mysql.insert("merchants", {
        user_id: user.id,
        created_at: now,
        updated_at: now,
      });
      merchant = { user_id: user.id, tron_address: null };
    }

    ctx.body = {
      status: "ok",
      merchant: {
        tronAddress: merchant.tron_address,
      },
    };
  }

  async update() {
    const { ctx, app } = this;
    const user = ctx.state.user;
    const { tronAddress } = ctx.request.body;

    if (user.role !== "merchant") {
      ctx.status = 403;
      ctx.body = { status: "error", message: "仅限商家访问" };
      return;
    }

    if (!tronAddress || !tronAddress.startsWith("T")) {
      ctx.status = 400;
      ctx.body = { status: "error", message: "请输入有效的 TRON 地址" };
      return;
    }

    const merchant = await app.mysql.get("merchants", { user_id: user.id });

    const now = new Date();
    if (!merchant) {
      await app.mysql.insert("merchants", {
        user_id: user.id,
        tron_address: tronAddress,
        created_at: now,
        updated_at: now,
      });
    } else {
      await app.mysql.update("merchants", {
        user_id: user.id,
        tron_address: tronAddress,
        updated_at: now,
      });
    }

    ctx.body = { status: "ok", message: "更新成功" };
  }
}

module.exports = MerchantController;
