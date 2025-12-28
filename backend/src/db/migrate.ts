import { getDatabase, saveDatabase } from './connection.js';

const migrations = `
-- Users table (tourists and authorities)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'tourist',
  avatar_url TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  blood_group TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tourist profiles with additional info
CREATE TABLE IF NOT EXISTS tourist_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  nationality TEXT,
  passport_number TEXT,
  hotel_name TEXT,
  hotel_address TEXT,
  trip_start_date TEXT,
  trip_end_date TEXT,
  visited_places TEXT,
  planned_places TEXT,
  is_solo_traveler INTEGER DEFAULT 0,
  is_woman_safety_enabled INTEGER DEFAULT 0,
  shake_sos_enabled INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Authority profiles
CREATE TABLE IF NOT EXISTS authority_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  badge_number TEXT,
  jurisdiction TEXT,
  station_name TEXT,
  station_address TEXT,
  verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Locations (real-time tracking)
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  accuracy REAL,
  altitude REAL,
  speed REAL,
  heading REAL,
  place_name TEXT,
  zone_type TEXT DEFAULT 'safe',
  battery_level INTEGER,
  network_type TEXT,
  is_offline INTEGER DEFAULT 0,
  recorded_at TEXT DEFAULT (datetime('now'))
);

-- SOS Alerts
CREATE TABLE IF NOT EXISTS sos_alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  place_name TEXT,
  alert_type TEXT NOT NULL DEFAULT 'emergency',
  status TEXT NOT NULL DEFAULT 'active',
  description TEXT,
  audio_url TEXT,
  image_urls TEXT,
  assigned_authority_id TEXT,
  response_time INTEGER,
  resolution_notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  acknowledged_at TEXT,
  resolved_at TEXT
);

-- Safety Zones
CREATE TABLE IF NOT EXISTS safety_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  zone_type TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius REAL NOT NULL DEFAULT 500,
  polygon_coords TEXT,
  crowd_level TEXT DEFAULT 'normal',
  current_tourist_count INTEGER DEFAULT 0,
  max_capacity INTEGER,
  risk_score REAL DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Safety Alerts (broadcast alerts)
CREATE TABLE IF NOT EXISTS safety_alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_level TEXT NOT NULL,
  zone_id TEXT,
  latitude REAL,
  longitude REAL,
  radius REAL,
  affected_zones TEXT,
  expires_at TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  active INTEGER DEFAULT 1
);

-- Safe Spaces (for women safety)
CREATE TABLE IF NOT EXISTS safe_spaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  phone TEXT,
  is_24x7 INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  rating REAL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Chat messages (AI assistant)
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  message_type TEXT DEFAULT 'text',
  context TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read INTEGER DEFAULT 0,
  action_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_zones_type ON safety_zones(zone_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
`;

export function runMigrations(): void {
  console.log('🔄 Running database migrations...');
  
  try {
    const db = getDatabase();
    
    // Split and run each statement
    const statements = migrations
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const stmt of statements) {
      db.run(stmt + ';');
    }
    
    saveDatabase();
    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}
