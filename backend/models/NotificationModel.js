import pool from "../config/db.js";

const NotificationModel = {
  // Create a new notification
  createNotification: async ({
    userId,
    email,
    type,
    title,
    message,
    relatedId,
    relatedType,
  }) => {
    const query = `
      INSERT INTO notifications (user_id, email, type, title, message, related_id, related_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      userId,
      email,
      type,
      title,
      message,
      relatedId,
      relatedType,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get notifications for a user by email
  getNotificationsByEmail: async (email, limit = 50) => {
    const query = `
      SELECT * FROM notifications
      WHERE email = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [email, limit]);
    return result.rows;
  },

  // Get unread notifications count
  getUnreadCount: async (email) => {
    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE email = $1 AND is_read = FALSE
    `;
    const result = await pool.query(query, [email]);
    return parseInt(result.rows[0].count);
  },

  // Mark notification as read
  markAsRead: async (notificationId, email) => {
    const query = `
      UPDATE notifications
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND email = $2
      RETURNING *
    `;
    const result = await pool.query(query, [notificationId, email]);
    return result.rows[0];
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (email) => {
    const query = `
      UPDATE notifications
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
      WHERE email = $1 AND is_read = FALSE
      RETURNING COUNT(*) as updated_count
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Delete notification
  deleteNotification: async (notificationId, email) => {
    const query = `
      DELETE FROM notifications
      WHERE id = $1 AND email = $2
      RETURNING *
    `;
    const result = await pool.query(query, [notificationId, email]);
    return result.rows[0];
  },

  // Get recent notifications (last 7 days)
  getRecentNotifications: async (email, days = 7) => {
    const query = `
      SELECT * FROM notifications
      WHERE email = $1 AND created_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [email]);
    return result.rows;
  },
};

export default NotificationModel;
