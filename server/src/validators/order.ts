import { body, param } from "express-validator";

export const orderCreateValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),
  body("items.*.productId")
    .isMongoId()
    .withMessage("productId must be a valid MongoDB ID"),
  body("items.*.name").notEmpty().withMessage("Each item must have a name"),
  body("items.*.price")
    .isFloat({ gt: 0 })
    .withMessage("Each item must have a price > 0"),
  body("items.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Each item must have a quantity > 0"),
  body("items.*.size").notEmpty().withMessage("Each item must have a size"),
  body("items.*.color").notEmpty().withMessage("Each item must have a color"),
  body("bill")
    .isFloat({ gt: 0 })
    .withMessage("bill is required and must be > 0")
];

export const validateConfirmSession = [
  param("session_id")
    .notEmpty()
    .withMessage("Session ID is required")
    .isString()
    .withMessage("Invalid Stripe Session ID format")
];

export const orderIdValidator = [
  param("orderId").isMongoId().withMessage("Invalid order id"),
];

export const orderStatusValidator = [
  body("status")
    .isIn(["pending", "paid", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),
];