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

// Get all alerts
router.get('/', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { type, severity, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const db = getDatabase();
    
    let query = `SELECT * FROM alerts WHERE 1=1`;
    const params: any[] = [];
    
    if (type && type !== 'all') {
      query += ` AND alert_type = ?`;
      params.push(type);
    }
    
    if (severity && severity !== 'all') {
      query += ` AND severity = ?`;
      params.push(severity);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);
    
    const alerts = getAll(db, query, params);
    const total = getRow(db, 'SELECT COUNT(*) as count FROM alerts', []);
    
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
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Get active alerts
router.get('/active', (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    const alerts = getAll(db, `
      SELECT * FROM alerts 
      WHERE active = 1 
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      ORDER BY severity DESC, created_at DESC
    `, []);
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get active alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch active alerts' });
  }
});

// Get alerts for a location
router.get('/location', (req: AuthRequest, res: Response): void => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    const db = getDatabase();
    
    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Location is required' });
      return;
    }
    
    // Get alerts near the location
    const alerts = getAll(db, `
      SELECT * FROM alerts 
      WHERE active = 1 
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      ORDER BY severity DESC, created_at DESC
    `, []);
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get location alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create alert (for authorities)
router.post('/', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { 
      title, description, alertType, severity = 'medium', 
      latitude, longitude, radius, affectedZones, expiresAt 
    } = req.body;
    const db = getDatabase();
    
    if (!title || !alertType) {
      res.status(400).json({ error: 'Title and alert type are required' });
      return;
    }
    
    const alertId = uuidv4();
    
    db.run(`
      INSERT INTO alerts (id, title, description, alert_type, severity, latitude, longitude, radius, affected_zones, expires_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [alertId, title, description || null, alertType, severity, 
        latitude || null, longitude || null, radius || null, 
        affectedZones ? JSON.stringify(affectedZones) : null, 
        expiresAt || null, req.user!.id]);
    
    saveDatabase();
    
    // Broadcast alert to all connected users
    const io = getSocketIO();
    if (io) {
      io.emit('new_alert', {
        alertId,
        title,
        description,
        alertType,
        severity,
        latitude,
        longitude,
        createdAt: new Date().toISOString()
      });
    }
    
    console.log(`⚠️ NEW ALERT: ${severity.toUpperCase()} - ${title}`);
    
    res.status(201).json({ 
      message: 'Alert created successfully',
      alertId 
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Update alert
router.put('/:id', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { title, description, severity, active, expiresAt } = req.body;
    const db = getDatabase();
    
    db.run(`
      UPDATE alerts SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        severity = COALESCE(?, severity),
        active = COALESCE(?, active),
        expires_at = COALESCE(?, expires_at),
        updated_at = datetime('now')
      WHERE id = ?
    `, [title || null, description || null, severity || null, 
        active !== undefined ? (active ? 1 : 0) : null, expiresAt || null, id]);
    
    saveDatabase();
    
    res.json({ message: 'Alert updated successfully' });
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Deactivate alert
router.delete('/:id', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    db.run(`UPDATE alerts SET active = 0, updated_at = datetime('now') WHERE id = ?`, [id]);
    saveDatabase();
    
    const io = getSocketIO();
    if (io) {
      io.emit('alert_deactivated', { alertId: id });
    }
    
    res.json({ message: 'Alert deactivated successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Failed to deactivate alert' });
  }
});

export default router;
