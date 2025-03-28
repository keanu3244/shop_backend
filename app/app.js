// app.js
"use strict";

module.exports = (app) => {
  app.beforeStart(async () => {
    try {
      console.log("Starting app_worker...");
      // 测试 MySQL 连接
      const result = await app.mysql.query("SELECT 1 + 1 AS result");
      console.log("MySQL connection test:", result[0].result);
    } catch (error) {
      console.error("App startup error:", error);
      throw error; // 抛出错误以确保日志输出
    }
  });
};
