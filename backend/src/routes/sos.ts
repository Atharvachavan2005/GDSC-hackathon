import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../db/connection.js';
import { authenticate, AuthRequest, authorizeRoles } from '../middleware/auth.js';
import { getSocketIO } from '../socket/index.js';

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

// Get all SOS alerts (for authorities)
router.get('/', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const db = getDatabase();
    
    let query = `
      SELECT s.*, u.name as tourist_name, u.phone as tourist_phone, u.email as tourist_email,
             a.name as assigned_authority_name
      FROM sos_alerts s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN users a ON s.assigned_authority_id = a.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (status && status !== 'all') {
      query += ` AND s.status = ?`;
      params.push(status);
    }
    
    if (type && type !== 'all') {
      query += ` AND s.alert_type = ?`;
      params.push(type);
    }
    
    query += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);
    
    const alerts = getAll(db, query, params);
    const total = getRow(db, 'SELECT COUNT(*) as count FROM sos_alerts', []);
    
    res.json({
      alerts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get SOS alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch SOS alerts' });
  }
});

// Get active alerts count
router.get('/active/count', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    
    const active = getRow(db, "SELECT COUNT(*) as count FROM sos_alerts WHERE status = 'active'", []);
    const responding = getRow(db, "SELECT COUNT(*) as count FROM sos_alerts WHERE status = 'responding'", []);
    const acknowledged = getRow(db, "SELECT COUNT(*) as count FROM sos_alerts WHERE status = 'acknowledged'", []);
    
    res.json({
      active: active?.count || 0,
      responding: responding?.count || 0,
      acknowledged: acknowledged?.count || 0,
      total: (active?.count || 0) + (responding?.count || 0) + (acknowledged?.count || 0)
    });
  } catch (error) {
    console.error('Get active count error:', error);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

// Get my SOS alerts (for tourists)
router.get('/my', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    const alerts = getAll(db, `
      SELECT * FROM sos_alerts WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    `, [req.user!.id]);
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get my alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create SOS alert (for tourists)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, alertType = 'emergency', description, placeName } = req.body;
    
    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Location is required' });
      return;
    }
    
    const db = getDatabase();
    const alertId = uuidv4();
    
    db.run(`
      INSERT INTO sos_alerts (id, user_id, latitude, longitude, alert_type, description, place_name, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `, [alertId, req.user!.id, latitude, longitude, alertType, description || null, placeName || null]);
    
    // Get user details for the alert
    const user = getRow(db, 'SELECT name, phone, email FROM users WHERE id = ?', [req.user!.id]);
    
    saveDatabase();
    
    // Emit to all authorities via WebSocket
    const io = getSocketIO();
    if (io) {
      io.to('authorities').emit('new_sos_alert', {
        alertId,
        userId: req.user!.id,
        userName: user?.name,
        userPhone: user?.phone,
        latitude,
        longitude,
        alertType,
        description,
        placeName,
        status: 'active',
        createdAt: new Date().toISOString()
      });
    }
    
    console.log(`🚨 NEW SOS ALERT: ${alertType} from ${user?.name} at ${placeName || `${latitude},${longitude}`}`);
    
    res.status(201).json({
      message: 'SOS alert sent successfully',
      alertId,
      status: 'active'
    });
  } catch (error) {
    console.error('Create SOS error:', error);
    res.status(500).json({ error: 'Failed to send SOS alert' });
  }
});

// Get single alert
router.get('/:id', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const alert = getRow(db, `
      SELECT s.*, u.name as tourist_name, u.phone as tourist_phone, u.email as tourist_email,
             a.name as assigned_authority_name
      FROM sos_alerts s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN users a ON s.assigned_authority_id = a.id
      WHERE s.id = ?
    `, [id]);
    
    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }
    
    res.json({ alert });
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

// Update alert status (for authorities)
router.patch('/:id/status', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const db = getDatabase();
    
    const validStatuses = ['active', 'acknowledged', 'responding', 'resolved', 'false-alarm'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    
    const alert = getRow(db, 'SELECT * FROM sos_alerts WHERE id = ?', [id]);
    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }
    
    let updateQuery = `UPDATE sos_alerts SET status = ?, updated_at = datetime('now')`;
    const params: any[] = [status];
    
    if (status === 'acknowledged' || status === 'responding') {
      updateQuery += `, assigned_authority_id = ?`;
      params.push(req.user!.id);
    }
    
    if (status === 'resolved') {
      updateQuery += `, resolved_at = datetime('now')`;
    }
    
    if (notes) {
      updateQuery += `, authority_notes = ?`;
      params.push(notes);
    }
    
    updateQuery += ` WHERE id = ?`;
    params.push(id);
    
    db.run(updateQuery, params);
    
    // Notify the tourist about status change
    const notifId = uuidv4();
    db.run(`
      INSERT INTO notifications (id, user_id, title, message, type, reference_id, reference_type)
      VALUES (?, ?, ?, ?, ?, ?, 'sos_alert')
    `, [notifId, alert.user_id, '🆘 SOS Update', `Your SOS alert status has been updated to: ${status}`, 'info', id]);
    
    saveDatabase();
    
    // Emit to relevant parties
    const io = getSocketIO();
    if (io) {
      io.emit('sos_status_update', { alertId: id, status, updatedBy: req.user!.name });
      io.to(`user_${alert.user_id}`).emit('notification', { title: 'SOS Update', message: `Status: ${status}` });
    }
    
    res.json({ message: 'Alert status updated', status });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Cancel SOS alert (by tourist who created it)
router.delete('/:id', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const alert = getRow(db, 'SELECT * FROM sos_alerts WHERE id = ? AND user_id = ?', [id, req.user!.id]);
    
    if (!alert) {
      res.status(404).json({ error: 'Alert not found or you do not have permission' });
      return;
    }
    
    if (alert.status === 'resolved') {
      res.status(400).json({ error: 'Cannot cancel a resolved alert' });
      return;
    }
    
    db.run(`UPDATE sos_alerts SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?`, [id]);
    saveDatabase();
    
    const io = getSocketIO();
    if (io) {
      io.to('authorities').emit('sos_cancelled', { alertId: id, cancelledBy: req.user!.name });
    }
    
    res.json({ message: 'SOS alert cancelled' });
  } catch (error) {
    console.error('Cancel SOS error:', error);
    res.status(500).json({ error: 'Failed to cancel alert' });
  }
});

export default router;
