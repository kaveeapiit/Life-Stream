import express from "express";
import {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getRecentNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// Create a notification (internal use)
router.post("/", createNotification);

// Get notifications for a user
router.get("/user/:email", getNotifications);

// Get unread notifications count
router.get("/unread-count/:email", getUnreadCount);

// Get recent notifications
router.get("/recent/:email", getRecentNotifications);

// Mark notification as read
router.put("/read/:id", markAsRead);

// Mark all notifications as read for a user
router.put("/read-all/:email", markAllAsRead);

// Delete a notification
router.delete("/:id", deleteNotification);

export default router;
