import NotificationModel from "../models/NotificationModel.js";

// Create notification controller
export const createNotification = async (req, res) => {
  try {
    const { userId, email, type, title, message, relatedId, relatedType } =
      req.body;

    if (!email || !type || !title || !message) {
      return res.status(400).json({
        error: "Email, type, title, and message are required",
      });
    }

    const notification = await NotificationModel.createNotification({
      userId,
      email,
      type,
      title,
      message,
      relatedId,
      relatedType,
    });

    res.status(201).json(notification);
  } catch (err) {
    console.error("Error creating notification:", err.message);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// Get notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    const { limit = 50 } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const notifications = await NotificationModel.getNotificationsByEmail(
      email,
      parseInt(limit)
    );
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Get unread notifications count
export const getUnreadCount = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const count = await NotificationModel.getUnreadCount(email);
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching unread count:", err.message);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const notification = await NotificationModel.markAsRead(id, email);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err.message);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await NotificationModel.markAllAsRead(email);
    res
      .status(200)
      .json({ message: "All notifications marked as read", ...result });
  } catch (err) {
    console.error("Error marking all notifications as read:", err.message);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const notification = await NotificationModel.deleteNotification(id, email);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error("Error deleting notification:", err.message);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// Get recent notifications
export const getRecentNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    const { days = 7 } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const notifications = await NotificationModel.getRecentNotifications(
      email,
      parseInt(days)
    );
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching recent notifications:", err.message);
    res.status(500).json({ error: "Failed to fetch recent notifications" });
  }
};
