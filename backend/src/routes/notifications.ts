import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../db/connection.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to get all rows from sql.js result
function getAll(db: any, sql: string, params: any[] = []): any[] {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results: any[] = [];
  while (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    results.push(columns.reduce((obj: any, col: string, i: number) => {
      obj[col] = values[i];
      return obj;
    }, {}));
  }
  stmt.free();
  return results;
}

// Helper to get single row
function getRow(db: any, sql: string, params: any[] = []): any {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  if (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    stmt.free();
    return columns.reduce((obj: any, col: string, i: number) => {
      obj[col] = values[i];
      return obj;
    }, {});
  }
  stmt.free();
  return null;
}

// Get user notifications
router.get('/', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { unreadOnly, type, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const db = getDatabase();
    
    let query = `SELECT * FROM notifications WHERE user_id = ?`;
    const params: any[] = [req.user!.id];
    
    if (unreadOnly === 'true') {
      query += ` AND read = 0`;
    }
    
    if (type && type !== 'all') {
      query += ` AND type = ?`;
      params.push(type);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);
    
    const notifications = getAll(db, query, params);
    const total = getRow(db, 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ?', [req.user!.id]);
    const unread = getRow(db, 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0', [req.user!.id]);
    
    res.json({
      notifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / Number(limit))
      },
      unreadCount: unread?.count || 0
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count
router.get('/unread/count', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    const result = getRow(db, 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0', [req.user!.id]);
    
    res.json({ count: result?.count || 0 });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    db.run(`UPDATE notifications SET read = 1, read_at = datetime('now') WHERE id = ? AND user_id = ?`, [id, req.user!.id]);
    saveDatabase();
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all as read
router.patch('/read-all', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    
    db.run(`UPDATE notifications SET read = 1, read_at = datetime('now') WHERE user_id = ? AND read = 0`, [req.user!.id]);
    saveDatabase();
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Delete notification
router.delete('/:id', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    db.run(`DELETE FROM notifications WHERE id = ? AND user_id = ?`, [id, req.user!.id]);
    saveDatabase();
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Clear all notifications
router.delete('/', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    
    db.run(`DELETE FROM notifications WHERE user_id = ?`, [req.user!.id]);
    saveDatabase();
    
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

// Create notification (internal use / testing)
router.post('/', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { title, message, type = 'info', referenceId, referenceType, targetUserId } = req.body;
    const db = getDatabase();
    
    if (!title || !message) {
      res.status(400).json({ error: 'Title and message are required' });
      return;
    }
    
    const notifId = uuidv4();
    const userId = targetUserId || req.user!.id;
    
    db.run(`
      INSERT INTO notifications (id, user_id, title, message, type, reference_id, reference_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [notifId, userId, title, message, type, referenceId || null, referenceType || null]);
    
    saveDatabase();
    
    res.status(201).json({ 
      message: 'Notification created',
      notificationId: notifId 
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

export default router;
