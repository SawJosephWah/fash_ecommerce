import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";

import { orderCreateValidator, orderIdValidator, orderStatusValidator, validateConfirmSession } from "../validators/order";
import { changeOrderStatus, confirmSessionId, createOrderAndCheckOutSession, getAllOrders, getOrderByUser } from "../controllers/orderController";
import { validate } from "../middlewares/validatorMiddleware";
import { param } from "express-validator";


const router = Router();

router.post(
    "/create-order",
    protect,
    orderCreateValidator,
    validate,
    createOrderAndCheckOutSession
);

router.get(
  "/confirm/:session_id",
  validateConfirmSession,
  validate,
  confirmSessionId
);

// User Routes
router.get("/", protect, getOrderByUser);

// Admin Routes
router.get("/all", protect, restrictTo('admin'), getAllOrders);

router.patch(
  "/:orderId",
  protect,
  restrictTo('admin'),
  orderIdValidator,
  orderStatusValidator,
  validate, // Your middleware that checks validationResult(req)
  changeOrderStatus
);
export default router;