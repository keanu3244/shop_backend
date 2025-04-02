// app/service/merchant.js
"use strict";

const Service = require("egg").Service;

class MerchantService extends Service {
  async findById(merchantId) {
    const { app } = this;
    return await app.mysql.get("merchants", { id: merchantId });
  }
}

module.exports = MerchantService;
