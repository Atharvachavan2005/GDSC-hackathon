import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../db/connection.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
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

// Update location (for tourists)
router.post('/update', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { latitude, longitude, accuracy, altitude, speed, heading, placeName, batteryLevel, networkType, isOffline } = req.body;
    
    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Latitude and longitude are required' });
      return;
    }
    
    const db = getDatabase();
    
    // Determine zone type based on nearby safety zone
    let zoneType = 'safe';
    const nearbyZone = getRow(db, `
      SELECT zone_type FROM safety_zones 
      WHERE active = 1
      ORDER BY ((latitude - ?) * (latitude - ?) + (longitude - ?) * (longitude - ?)) ASC
      LIMIT 1
    `, [latitude, latitude, longitude, longitude]);
    
    if (nearbyZone) {
      zoneType = nearbyZone.zone_type === 'high-risk' ? 'high-risk' : 
                 nearbyZone.zone_type === 'moderate' ? 'moderate' : 'safe';
    }
    
    const locationId = uuidv4();
    
    db.run(`
      INSERT INTO locations (id, user_id, latitude, longitude, accuracy, altitude, speed, heading, place_name, zone_type, battery_level, network_type, is_offline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [locationId, req.user!.id, latitude, longitude, accuracy || null, altitude || null, speed || null, heading || null, placeName || null, zoneType, batteryLevel || null, networkType || null, isOffline ? 1 : 0]);
    
    saveDatabase();
    
    // Emit location update via WebSocket for real-time tracking
    const io = getSocketIO();
    if (io) {
      io.to('authorities').emit('tourist_location_update', {
        touristId: req.user!.id,
        touristName: req.user!.name,
        latitude,
        longitude,
        placeName,
        zoneType,
        batteryLevel,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if tourist entered a high-risk zone
    if (zoneType === 'high-risk') {
      db.run(`
        INSERT INTO notifications (id, user_id, title, message, type)
        VALUES (?, ?, ?, ?, 'warning')
      `, [uuidv4(), req.user!.id, '⚠️ High-Risk Area', 'You have entered a high-risk zone. Please stay alert and keep your belongings safe.']);
      saveDatabase();
    }
    
    res.json({ 
      message: 'Location updated',
      locationId,
      zoneType 
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Get location history for a user
router.get('/history', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;
    const db = getDatabase();
    
    let query = `SELECT * FROM locations WHERE user_id = ?`;
    const params: any[] = [req.user!.id];
    
    if (startDate) {
      query += ` AND recorded_at >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND recorded_at <= ?`;
      params.push(endDate);
    }
    
    query += ` ORDER BY recorded_at DESC LIMIT ?`;
    params.push(Number(limit));
    
    const locations = getAll(db, query, params);
    
    res.json({ locations });
  } catch (error) {
    console.error('Get location history error:', error);
    res.status(500).json({ error: 'Failed to fetch location history' });
  }
});

// Get current location
router.get('/current', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    const location = getRow(db, `
      SELECT * FROM locations WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 1
    `, [req.user!.id]);
    
    res.json({ location });
  } catch (error) {
    console.error('Get current location error:', error);
    res.status(500).json({ error: 'Failed to fetch current location' });
  }
});

// Get nearby tourists (for authorities)
router.get('/nearby', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    const db = getDatabase();
    
    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Latitude and longitude are required' });
      return;
    }
    
    // Get recent locations of tourists (last 30 minutes)
    const tourists = getAll(db, `
      SELECT DISTINCT l.*, u.name as tourist_name, u.phone as tourist_phone
      FROM locations l
      JOIN users u ON l.user_id = u.id
      WHERE u.role = 'tourist'
        AND l.recorded_at > datetime('now', '-30 minutes')
        AND l.id IN (
          SELECT id FROM locations WHERE user_id = l.user_id ORDER BY recorded_at DESC LIMIT 1
        )
      ORDER BY l.recorded_at DESC
    `, []);
    
    res.json({ tourists });
  } catch (error) {
    console.error('Get nearby tourists error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby tourists' });
  }
});

// Get heatmap data
router.get('/heatmap', (req: AuthRequest, res: Response): void => {
  try {
    const { hours = 24 } = req.query;
    const db = getDatabase();
    
    const heatmapData = getAll(db, `
      SELECT 
        ROUND(latitude, 3) as lat,
        ROUND(longitude, 3) as lng,
        COUNT(*) as intensity,
        MAX(zone_type) as zone_type
      FROM locations
      WHERE recorded_at > datetime('now', '-' || ? || ' hours')
      GROUP BY ROUND(latitude, 3), ROUND(longitude, 3)
    `, [String(hours)]);
    
    res.json({ heatmap: heatmapData });
  } catch (error) {
    console.error('Get heatmap error:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

export default router;
