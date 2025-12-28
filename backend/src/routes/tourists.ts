import { Router, Response } from 'express';
import { getDatabase, saveDatabase } from '../db/connection.js';
import { authenticate, AuthRequest, authorizeRoles } from '../middleware/auth.js';

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

// Get all tourists (for authorities)
router.get('/', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const db = getDatabase();
    
    let query = `
      SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.created_at,
             tp.nationality, tp.emergency_contact, tp.emergency_phone
      FROM users u
      LEFT JOIN tourist_profiles tp ON u.id = tp.user_id
      WHERE u.role = 'tourist'
    `;
    const params: any[] = [];
    
    if (search) {
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);
    
    const tourists = getAll(db, query, params);
    const total = getRow(db, "SELECT COUNT(*) as count FROM users WHERE role = 'tourist'", []);
    
    res.json({
      tourists,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get tourists error:', error);
    res.status(500).json({ error: 'Failed to fetch tourists' });
  }
});

// Get tourist by ID
router.get('/:id', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const tourist = getRow(db, `
      SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.emergency_contact, u.emergency_phone, u.created_at,
             tp.nationality, tp.passport_number, tp.medical_conditions, tp.blood_group
      FROM users u
      LEFT JOIN tourist_profiles tp ON u.id = tp.user_id
      WHERE u.id = ? AND u.role = 'tourist'
    `, [id]);
    
    if (!tourist) {
      res.status(404).json({ error: 'Tourist not found' });
      return;
    }
    
    // Get recent locations
    const recentLocations = getAll(db, `
      SELECT * FROM locations WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 10
    `, [id]);
    
    // Get SOS history
    const sosHistory = getAll(db, `
      SELECT * FROM sos_alerts WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    `, [id]);
    
    res.json({ 
      tourist, 
      recentLocations, 
      sosHistory 
    });
  } catch (error) {
    console.error('Get tourist error:', error);
    res.status(500).json({ error: 'Failed to fetch tourist' });
  }
});

// Get active tourists (with recent location updates)
router.get('/active/list', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    
    const activeTourists = getAll(db, `
      SELECT DISTINCT u.id, u.name, u.phone, l.latitude, l.longitude, l.place_name, l.zone_type, l.recorded_at
      FROM users u
      JOIN locations l ON u.id = l.user_id
      WHERE u.role = 'tourist'
        AND l.recorded_at > datetime('now', '-30 minutes')
        AND l.id IN (SELECT id FROM locations WHERE user_id = l.user_id ORDER BY recorded_at DESC LIMIT 1)
      ORDER BY l.recorded_at DESC
    `, []);
    
    res.json({ tourists: activeTourists, count: activeTourists.length });
  } catch (error) {
    console.error('Get active tourists error:', error);
    res.status(500).json({ error: 'Failed to fetch active tourists' });
  }
});

// Get statistics
router.get('/stats/overview', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    
    const totalTourists = getRow(db, "SELECT COUNT(*) as count FROM users WHERE role = 'tourist'", []);
    const activeTourists = getRow(db, `
      SELECT COUNT(DISTINCT user_id) as count FROM locations 
      WHERE recorded_at > datetime('now', '-30 minutes')
    `, []);
    const todayRegistrations = getRow(db, `
      SELECT COUNT(*) as count FROM users 
      WHERE role = 'tourist' AND DATE(created_at) = DATE('now')
    `, []);
    const inHighRiskZones = getRow(db, `
      SELECT COUNT(DISTINCT user_id) as count FROM locations 
      WHERE zone_type = 'high-risk' AND recorded_at > datetime('now', '-30 minutes')
    `, []);
    
    res.json({
      total: totalTourists?.count || 0,
      active: activeTourists?.count || 0,
      todayRegistrations: todayRegistrations?.count || 0,
      inHighRiskZones: inHighRiskZones?.count || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
