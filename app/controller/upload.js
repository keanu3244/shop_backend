// app/controller/upload.js
"use strict";

const Controller = require("egg").Controller;
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;

    // 权限校验：确保用户已登录
    if (!ctx.state.user) {
      ctx.status = 401;
      ctx.body = { status: "error", message: "未登录或 token 无效" };
      return;
    }

    // 获取上传的文件
    const file = ctx.request.files[0];
    if (!file) {
      ctx.body = { status: "error", message: "未上传文件" };
      ctx.status = 400;
      return;
    }

    try {
      // 限制文件大小（例如 2MB）
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        ctx.body = { status: "error", message: "文件大小不能超过 2MB" };
        ctx.status = 400;
        return;
      }

      // 限制文件格式（仅允许图片）
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.mime)) {
        ctx.body = {
          status: "error",
          message: "仅支持 JPEG、PNG、GIF 格式的图片",
        };
        ctx.status = 400;
        return;
      }

      // 生成唯一的文件名
      const ext = path.extname(file.filename);
      const filename = `${uuidv4()}${ext}`;
      const targetPath = path.join(
        this.config.baseDir,
        "app/public/uploads",
        filename
      );

      // 确保 uploads 目录存在
      await fs.mkdir(path.dirname(targetPath), { recursive: true });

      // 删除旧文件（如果前端传递了 oldFileUrl）
      const oldFileUrl = ctx.request.body.oldFileUrl;
      if (oldFileUrl) {
        const oldFilePath = path.join(this.config.baseDir, "app", oldFileUrl);
        try {
          await fs.unlink(oldFilePath);
          ctx.logger.info(`成功删除旧文件: ${oldFilePath}`);
        } catch (error) {
          ctx.logger.warn(
            `删除旧文件失败: ${oldFilePath}, 错误: ${error.message}`
          );
        }
      }

      // 将文件从临时路径移动到目标路径
      await fs.copyFile(file.filepath, targetPath);
      ctx.logger.info(`文件上传成功: ${targetPath}`);

      // 返回文件的 URL
      const fileUrl = `${this.config.baseUrl}/public/uploads/${filename}`;
      ctx.body = { status: "ok", data: { url: fileUrl } };
      ctx.status = 200;
    } catch (error) {
      ctx.logger.error("文件上传失败:", error.message);
      ctx.body = { status: "error", message: "文件上传失败，请稍后重试" };
      ctx.status = 500;
    } finally {
      // 清理临时文件
      await ctx.cleanupRequestFiles();
    }
  }
}

module.exports = UploadController;
