/*
 Navicat Premium Dump SQL

 Source Server         : shop
 Source Server Type    : MySQL
 Source Server Version : 90200 (9.2.0)
 Source Host           : localhost:3306
 Source Schema         : shop_db

 Target Server Type    : MySQL
 Target Server Version : 90200 (9.2.0)
 File Encoding         : 65001

 Date: 16/04/2025 18:24:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of categories
-- ----------------------------
BEGIN;
INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES (1, '电子产品', '2025-03-28 17:37:48', '2025-03-28 17:37:48');
INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES (2, '服装', '2025-03-28 17:37:48', '2025-03-28 17:37:48');
INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES (3, '食品', '2025-03-28 17:37:48', '2025-03-28 17:37:48');
INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES (4, '家居用品', '2025-03-28 17:37:48', '2025-03-28 17:37:48');
INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES (5, '图书', '2025-03-28 17:37:48', '2025-03-28 17:37:48');
COMMIT;

-- ----------------------------
-- Table structure for merchants
-- ----------------------------
DROP TABLE IF EXISTS `merchants`;
CREATE TABLE `merchants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `payment_info` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of merchants
-- ----------------------------
BEGIN;
INSERT INTO `merchants` (`id`, `name`, `payment_info`, `created_at`, `updated_at`) VALUES (1, '测试商家', '{\"name\": \"张三\", \"wechat_account\": \"wx_test_123\"}', '2025-03-31 19:07:28', '2025-03-31 19:07:28');
COMMIT;

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(50) NOT NULL,
  `sender_id` int NOT NULL,
  `sender_username` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'customer',
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of messages
-- ----------------------------
BEGIN;
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (10, 'room_4', 4, 'customer1', 'customer', '我是客户', '2025-04-08 17:54:10');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (11, 'room_4', 5, 'merchant1', 'merchant', '我是商家', '2025-04-08 17:55:00');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (12, 'room_4', 4, 'customer1', 'customer', '什么事', '2025-04-08 17:55:07');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (13, 'room_4', 5, 'merchant1', 'merchant', '买东西吗', '2025-04-08 17:55:23');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (14, 'room_4', 5, 'merchant1', 'merchant', '很不错', '2025-04-08 18:04:35');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (15, 'room_4', 4, 'customer1', 'customer', '不买', '2025-04-08 18:04:43');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (16, 'room_4', 4, 'customer1', 'customer', '111', '2025-04-08 18:08:11');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (17, 'room_4', 5, 'merchant1', 'merchant', '222', '2025-04-08 18:08:23');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (18, 'room_4', 4, 'customer1', 'customer', '3333', '2025-04-08 18:08:26');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (19, 'room_4', 5, 'merchant1', 'merchant', '44444', '2025-04-08 18:08:32');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (20, 'room_4', 5, 'merchant1', 'merchant', '44444', '2025-04-08 18:08:33');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (21, 'room_4', 5, 'merchant1', 'merchant', '4', '2025-04-08 18:08:34');
INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `sender_username`, `role`, `message`, `created_at`) VALUES (22, 'room_4', 5, 'merchant1', 'merchant', '44444', '2025-04-08 18:08:35');
COMMIT;

-- ----------------------------
-- Table structure for payment_orders
-- ----------------------------
DROP TABLE IF EXISTS `payment_orders`;
CREATE TABLE `payment_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('wechat','alipay','usdt','trx','bank_card') NOT NULL,
  `status` enum('pending','completed','failed','cancelled','paid') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_deadline` datetime DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of payment_orders
-- ----------------------------
BEGIN;
INSERT INTO `payment_orders` (`id`, `user_id`, `product_id`, `amount`, `payment_method`, `status`, `created_at`, `updated_at`, `payment_deadline`, `total_price`) VALUES (8, 4, 1, 1.00, 'wechat', 'failed', '2025-04-01 14:51:34', '2025-04-01 15:33:26', '2025-04-01 15:06:34', 10.00);
INSERT INTO `payment_orders` (`id`, `user_id`, `product_id`, `amount`, `payment_method`, `status`, `created_at`, `updated_at`, `payment_deadline`, `total_price`) VALUES (9, 4, 2, 1.00, 'wechat', 'pending', '2025-04-01 15:38:41', '2025-04-01 15:38:41', '2025-04-01 15:53:42', 10.00);
INSERT INTO `payment_orders` (`id`, `user_id`, `product_id`, `amount`, `payment_method`, `status`, `created_at`, `updated_at`, `payment_deadline`, `total_price`) VALUES (10, 4, 1, 1.00, 'wechat', 'pending', '2025-04-02 10:13:03', '2025-04-02 10:13:03', '2025-04-02 10:28:04', 10.00);
COMMIT;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `image_url` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `merchant_id` int NOT NULL,
  `supported_payment_methods` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `merchant_id` (`merchant_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`merchant_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of products
-- ----------------------------
BEGIN;
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (1, '微信', 10.00, '测试商品1', 999, '/public/uploads/1743389920073-WechatIMG67.jpg', 1, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 10:58:40', '2025-03-31 10:58:40');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (2, '微信', 10.00, '测试商品1', 999, '/public/uploads/1743390219536-WechatIMG67.jpg', 1, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:03:39', '2025-03-31 11:03:39');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (3, '商品1', 111.00, '测试1', 999, '/public/uploads/1743390722860-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:12:02', '2025-03-31 11:12:02');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (4, '商品1', 111.00, '测试1', 999, '/public/uploads/1743390787707-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:13:07', '2025-03-31 11:13:07');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (5, '商品1', 111.00, '测试1', 999, '/public/uploads/1743390974763-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:16:14', '2025-03-31 11:16:14');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (6, '商品1', 111.00, '测试1', 999, '/public/uploads/1743390996438-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:16:36', '2025-03-31 11:16:36');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (7, '商品1', 111.00, '测试1', 999, '/public/uploads/1743391358024-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:22:38', '2025-03-31 11:22:38');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (8, '商品1', 111.00, '测试1', 999, '/public/uploads/1743391518312-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:25:18', '2025-03-31 11:25:18');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (9, '商品1', 111.00, '测试1', 999, '/public/uploads/1743391563545-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:26:03', '2025-03-31 11:26:03');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (10, '商品1', 111.00, '测试1', 999, '/public/uploads/1743391914700-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:31:54', '2025-04-01 11:27:32');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (11, '商品1', 111.00, '测试1', 999, '/public/uploads/1743392239154-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:37:19', '2025-03-31 11:37:19');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (12, '商品1', 111.00, '测试1', 999, '/public/uploads/1743392292069-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:38:12', '2025-03-31 11:38:12');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (13, '商品1', 111.00, '测试1', 999, '/public/uploads/1743392324397-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:38:44', '2025-03-31 11:38:44');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (14, '商品1', 111.00, '测试1', 999, '/public/uploads/1743392362167-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:39:22', '2025-03-31 11:39:22');
INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `image_url`, `category_id`, `merchant_id`, `supported_payment_methods`, `created_at`, `updated_at`) VALUES (15, '商品1', 111.00, '测试1', 999, '/public/uploads/1743392393574-WechatIMG67.jpg', 4, 1, '[\"wechat\",\"alipay\"]', '2025-03-31 11:39:53', '2025-03-31 11:39:53');
COMMIT;

-- ----------------------------
-- Table structure for rooms
-- ----------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_id` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of rooms
-- ----------------------------
BEGIN;
INSERT INTO `rooms` (`id`, `room_id`, `user_id`, `created_at`, `updated_at`) VALUES (6, 'room_4', 5, '2025-04-08 17:51:59', '2025-04-08 17:51:59');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','merchant','system') NOT NULL DEFAULT 'customer',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_info` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `updated_at`, `balance`, `payment_info`) VALUES (1, 'root', '$2b$10$0igIux3lO/wjveN2TntT2.h1dkZIe4Vzxk4.DKlwtEwU8gW.Wfh7K', 'merchant', '2025-03-31 10:30:26', '2025-03-31 10:30:26', 0.00, NULL);
INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `updated_at`, `balance`, `payment_info`) VALUES (2, 'wulin', '$2b$10$/HXMy7YdYFJgEjgVy0KvfOxjz.izK2gDskkaZSghq.mrKDujwcGCW', 'customer', '2025-03-31 11:58:42', '2025-03-31 11:58:42', 0.00, NULL);
INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `updated_at`, `balance`, `payment_info`) VALUES (3, 'system', '$2b$10$0igIux3lO/wjveN2TntT2.h1dkZIe4Vzxk4.DKlwtEwU8gW.Wfh7K', 'system', '2025-03-31 18:12:09', '2025-03-31 18:16:36', 0.00, NULL);
INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `updated_at`, `balance`, `payment_info`) VALUES (4, 'customer1', '$2b$10$0igIux3lO/wjveN2TntT2.h1dkZIe4Vzxk4.DKlwtEwU8gW.Wfh7K', 'customer', '2025-03-31 18:14:10', '2025-03-31 18:16:47', 0.00, NULL);
INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `updated_at`, `balance`, `payment_info`) VALUES (5, 'merchant1', '$2b$10$0igIux3lO/wjveN2TntT2.h1dkZIe4Vzxk4.DKlwtEwU8gW.Wfh7K', 'merchant', '2025-03-31 18:14:10', '2025-04-03 16:48:51', 0.00, '{\"alipay\":{\"name\":\"杨武林\",\"account\":\"18559023244\",\"qrcode\":\"http://localhost:7001/public/uploads/2973e0fb-d415-430b-9e5d-e5ad0393f669.png\"},\"wechat\":{\"name\":\"keanu\",\"account\":\"18559023244\",\"qrcode\":\"http://localhost:7001/public/uploads/3fea6075-0419-4fe5-8f81-002791e29b33.png\"}}');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
