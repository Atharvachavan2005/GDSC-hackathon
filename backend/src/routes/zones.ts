import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
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

// Get all safety zones
router.get('/', (req: AuthRequest, res: Response): void => {
  try {
    const { type, active = 'true' } = req.query;
    const db = getDatabase();
    
    let query = `SELECT * FROM safety_zones WHERE 1=1`;
    const params: any[] = [];
    
    if (active === 'true') {
      query += ` AND active = 1`;
    }
    
    if (type && type !== 'all') {
      query += ` AND zone_type = ?`;
      params.push(type);
    }
    
    query += ` ORDER BY name ASC`;
    
    const zones = getAll(db, query, params);
    
    res.json({ zones });
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({ error: 'Failed to fetch zones' });
  }
});

// Get zone by ID
router.get('/:id', (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const zone = getRow(db, 'SELECT * FROM safety_zones WHERE id = ?', [id]);
    
    if (!zone) {
      res.status(404).json({ error: 'Zone not found' });
      return;
    }
    
    res.json({ zone });
  } catch (error) {
    console.error('Get zone error:', error);
    res.status(500).json({ error: 'Failed to fetch zone' });
  }
});

// Create zone (for authorities)
router.post('/', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { name, description, zoneType, latitude, longitude, radius, maxCapacity, riskScore } = req.body;
    const db = getDatabase();
    
    if (!name || !latitude || !longitude || !zoneType) {
      res.status(400).json({ error: 'Name, location, and zone type are required' });
      return;
    }
    
    const zoneId = uuidv4();
    
    db.run(`
      INSERT INTO safety_zones (id, name, description, zone_type, latitude, longitude, radius, max_capacity, risk_score, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [zoneId, name, description || null, zoneType, latitude, longitude, radius || 500, maxCapacity || null, riskScore || 0, req.user!.id]);
    
    saveDatabase();
    
    res.status(201).json({ 
      message: 'Zone created successfully',
      zoneId 
    });
  } catch (error) {
    console.error('Create zone error:', error);
    res.status(500).json({ error: 'Failed to create zone' });
  }
});

// Update zone
router.put('/:id', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, description, zoneType, latitude, longitude, radius, maxCapacity, crowdLevel, riskScore, active } = req.body;
    const db = getDatabase();
    
    db.run(`
      UPDATE safety_zones SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        zone_type = COALESCE(?, zone_type),
        latitude = COALESCE(?, latitude),
        longitude = COALESCE(?, longitude),
        radius = COALESCE(?, radius),
        max_capacity = COALESCE(?, max_capacity),
        crowd_level = COALESCE(?, crowd_level),
        risk_score = COALESCE(?, risk_score),
        active = COALESCE(?, active),
        updated_at = datetime('now')
      WHERE id = ?
    `, [name || null, description || null, zoneType || null, latitude || null, longitude || null, 
        radius || null, maxCapacity || null, crowdLevel || null, riskScore || null, 
        active !== undefined ? (active ? 1 : 0) : null, id]);
    
    saveDatabase();
    
    res.json({ message: 'Zone updated successfully' });
  } catch (error) {
    console.error('Update zone error:', error);
    res.status(500).json({ error: 'Failed to update zone' });
  }
});

// Delete zone
router.delete('/:id', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    db.run('DELETE FROM safety_zones WHERE id = ?', [id]);
    saveDatabase();
    
    res.json({ message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('Delete zone error:', error);
    res.status(500).json({ error: 'Failed to delete zone' });
  }
});

// Get zones statistics
router.get('/stats/summary', authenticate, authorizeRoles('authority', 'admin'), (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    
    const total = getRow(db, 'SELECT COUNT(*) as count FROM safety_zones', []);
    const byType = getAll(db, `
      SELECT zone_type, COUNT(*) as count FROM safety_zones WHERE active = 1 GROUP BY zone_type
    `, []);
    const highRisk = getRow(db, "SELECT COUNT(*) as count FROM safety_zones WHERE zone_type = 'high-risk' AND active = 1", []);
    
    res.json({
      total: total?.count || 0,
      highRisk: highRisk?.count || 0,
      byType: byType.reduce((acc: any, item: any) => {
        acc[item.zone_type] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
