import { getDatabase, saveDatabase } from './connection.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Helper to check if data exists
function hasData(db: any, table: string): boolean {
  const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${table}`);
  if (stmt.step()) {
    const count = stmt.get()[0];
    stmt.free();
    return count > 0;
  }
  stmt.free();
  return false;
}

export function seedDatabase() {
  console.log('🌱 Checking if seeding is needed...');
  
  const db = getDatabase();
  
  // Check if users table has data
  if (hasData(db, 'users')) {
    console.log('✅ Database already has data, skipping seed');
    return;
  }
  
  console.log('🌱 Seeding database...');
  
  // Hash password synchronously for seeding
  const passwordHash = bcrypt.hashSync('demo123', 10);
  
  // Admin user
  const adminId = uuidv4();
  db.run(`INSERT INTO users (id, email, password, name, phone, role) VALUES (?, ?, ?, ?, ?, ?)`,
    [adminId, 'admin@safeyatra.gov.in', passwordHash, 'System Admin', '1800111363', 'admin']);
  
  // Authority users
  const authorities = [
    { name: 'Inspector Rajesh Kumar', email: 'rajesh.kumar@police.gov.in', phone: '9876543210', department: 'Delhi Police', badge: 'DL-2024-001', station: 'Connaught Place PS' },
    { name: 'Dr. Priya Sharma', email: 'priya.sharma@tourism.gov.in', phone: '9876543211', department: 'Tourism Department', badge: 'TD-2024-045', station: 'India Gate Tourism Office' },
    { name: 'Officer Amit Singh', email: 'amit.singh@police.gov.in', phone: '9876543212', department: 'Tourist Police', badge: 'TP-2024-012', station: 'Red Fort Tourist Help Desk' },
  ];
  
  for (const auth of authorities) {
    const authId = uuidv4();
    db.run(`INSERT INTO users (id, email, password, name, phone, role) VALUES (?, ?, ?, ?, ?, 'authority')`,
      [authId, auth.email, passwordHash, auth.name, auth.phone]);
    
    db.run(`INSERT INTO authority_profiles (id, user_id, department, badge_number, station_name, verified) VALUES (?, ?, ?, ?, ?, 1)`,
      [uuidv4(), authId, auth.department, auth.badge, auth.station]);
  }
  
  // Tourist users
  const tourists = [
    { name: 'John Smith', email: 'john.smith@gmail.com', phone: '+1-555-0123', nationality: 'USA', emergency: 'Jane Smith', emergencyPhone: '+1-555-0124' },
    { name: 'Emma Wilson', email: 'emma.wilson@gmail.com', phone: '+44-7700-900123', nationality: 'UK', emergency: 'Mark Wilson', emergencyPhone: '+44-7700-900124' },
    { name: 'Akira Tanaka', email: 'akira.tanaka@yahoo.jp', phone: '+81-90-1234-5678', nationality: 'Japan', emergency: 'Yuki Tanaka', emergencyPhone: '+81-90-1234-5679' },
    { name: 'Maria Garcia', email: 'maria.garcia@gmail.com', phone: '+34-612-345-678', nationality: 'Spain', emergency: 'Carlos Garcia', emergencyPhone: '+34-612-345-679' },
    { name: 'Priyanka Patel', email: 'priyanka.patel@gmail.com', phone: '9898765432', nationality: 'India', emergency: 'Rahul Patel', emergencyPhone: '9898765433' },
  ];
  
  const touristIds: string[] = [];
  for (const tourist of tourists) {
    const touristId = uuidv4();
    touristIds.push(touristId);
    
    db.run(`INSERT INTO users (id, email, password, name, phone, role, emergency_contact, emergency_phone) VALUES (?, ?, ?, ?, ?, 'tourist', ?, ?)`,
      [touristId, tourist.email, passwordHash, tourist.name, tourist.phone, tourist.emergency, tourist.emergencyPhone]);
    
    const isWoman = tourist.name.includes('Emma') || tourist.name.includes('Maria') || tourist.name.includes('Priyanka');
    db.run(`INSERT INTO tourist_profiles (id, user_id, nationality, is_solo_traveler, is_woman_safety_enabled) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), touristId, tourist.nationality, Math.random() > 0.5 ? 1 : 0, isWoman ? 1 : 0]);
  }
  
  // Safety Zones (Delhi tourist spots)
  const zones = [
    { name: 'India Gate', type: 'tourist-spot', lat: 28.6129, lng: 77.2295, radius: 300, crowd: 'high', capacity: 5000, count: 2847 },
    { name: 'Red Fort', type: 'tourist-spot', lat: 28.6562, lng: 77.2410, radius: 500, crowd: 'moderate', capacity: 8000, count: 3421 },
    { name: 'Qutub Minar', type: 'tourist-spot', lat: 28.5245, lng: 77.1855, radius: 400, crowd: 'moderate', capacity: 3000, count: 1823 },
    { name: 'Lotus Temple', type: 'tourist-spot', lat: 28.5535, lng: 77.2588, radius: 350, crowd: 'normal', capacity: 2500, count: 967 },
    { name: 'Humayun Tomb', type: 'tourist-spot', lat: 28.5933, lng: 77.2507, radius: 400, crowd: 'low', capacity: 2000, count: 456 },
    { name: 'Connaught Place', type: 'tourist-spot', lat: 28.6315, lng: 77.2167, radius: 600, crowd: 'high', capacity: 10000, count: 4532 },
    { name: 'Chandni Chowk', type: 'moderate', lat: 28.6506, lng: 77.2334, radius: 800, crowd: 'overcrowded', capacity: 15000, count: 12847 },
    { name: 'Paharganj Area', type: 'high-risk', lat: 28.6448, lng: 77.2107, radius: 500, crowd: 'high', capacity: 5000, count: 3200, risk: 65 },
    { name: 'AIIMS Hospital', type: 'hospital', lat: 28.5672, lng: 77.2100, radius: 200, crowd: 'normal', capacity: 1000, count: 234 },
    { name: 'Parliament Street PS', type: 'police-station', lat: 28.6200, lng: 77.2150, radius: 100, crowd: 'low', capacity: 100, count: 12 },
  ];
  
  for (const zone of zones) {
    db.run(`INSERT INTO safety_zones (id, name, zone_type, latitude, longitude, radius, crowd_level, max_capacity, current_tourist_count, risk_score, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [uuidv4(), zone.name, zone.type, zone.lat, zone.lng, zone.radius, zone.crowd, zone.capacity, zone.count, (zone as any).risk || 0]);
  }
  
  // Safe Spaces
  const safeSpaces = [
    { name: 'Women Helpdesk - India Gate', type: 'women_helpdesk', lat: 28.6135, lng: 77.2290, phone: '100', is24x7: 1 },
    { name: 'Safdarjung Hospital', type: 'hospital', lat: 28.5680, lng: 77.2070, phone: '011-26165060', is24x7: 1 },
    { name: 'Parliament Street Police Station', type: 'police_station', lat: 28.6200, lng: 77.2150, phone: '011-23362430', is24x7: 1 },
    { name: 'Metro Station - Rajiv Chowk', type: 'metro_station', lat: 28.6328, lng: 77.2197, phone: '155370', is24x7: 1 },
    { name: 'Taj Palace Hotel', type: 'hotel', lat: 28.5978, lng: 77.1740, phone: '011-26110202', is24x7: 1 },
    { name: 'Women Police Post - CP', type: 'women_helpdesk', lat: 28.6320, lng: 77.2180, phone: '1091', is24x7: 1 },
  ];
  
  for (const space of safeSpaces) {
    db.run(`INSERT INTO safe_spaces (id, name, type, latitude, longitude, phone, is_24x7, verified) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [uuidv4(), space.name, space.type, space.lat, space.lng, space.phone, space.is24x7]);
  }
  
  // Sample locations for tourists
  const now = new Date();
  for (let i = 0; i < touristIds.length; i++) {
    const baseLocation = zones[i % zones.length];
    for (let j = 0; j < 5; j++) {
      const time = new Date(now.getTime() - j * 30 * 60000);
      const lat = baseLocation.lat + (Math.random() - 0.5) * 0.01;
      const lng = baseLocation.lng + (Math.random() - 0.5) * 0.01;
      
      db.run(`INSERT INTO locations (id, user_id, latitude, longitude, accuracy, place_name, zone_type, battery_level, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), touristIds[i], lat, lng, Math.random() * 20 + 5, baseLocation.name, baseLocation.type.includes('risk') ? 'high-risk' : 'safe', Math.floor(Math.random() * 50 + 50), time.toISOString()]);
    }
  }
  
  // Sample SOS Alerts
  const sosAlerts = [
    { userId: touristIds[0], lat: 28.6135, lng: 77.2290, type: 'emergency', status: 'active', desc: 'Lost in crowd, need assistance' },
    { userId: touristIds[1], lat: 28.6448, lng: 77.2107, type: 'police', status: 'responding', desc: 'Suspicious person following me' },
    { userId: touristIds[3], lat: 28.6506, lng: 77.2334, type: 'medical', status: 'resolved', desc: 'Feeling dizzy, need medical help' },
  ];
  
  for (const sos of sosAlerts) {
    db.run(`INSERT INTO sos_alerts (id, user_id, latitude, longitude, alert_type, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), sos.userId, sos.lat, sos.lng, sos.type, sos.status, sos.desc]);
  }
  
  // Safety Alerts
  db.run(`INSERT INTO safety_alerts (id, title, message, alert_level, latitude, longitude, radius, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [uuidv4(), 'High Crowd Alert - Chandni Chowk', 'Extremely crowded conditions expected due to festival. Avoid if possible.', 'warning', 28.6506, 77.2334, 1000]);
  
  db.run(`INSERT INTO safety_alerts (id, title, message, alert_level, latitude, longitude, radius, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [uuidv4(), 'Weather Advisory', 'Heavy fog expected tonight. Limited visibility. Take precautions.', 'info', 28.6129, 77.2295, 5000]);
  
  saveDatabase();
  
  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('   Tourist: john.smith@gmail.com / demo123');
  console.log('   Authority: rajesh.kumar@police.gov.in / demo123');
  console.log('   Admin: admin@safeyatra.gov.in / demo123');
}

// Run as script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('./connection.js').then(({ initDatabase }) => {
    initDatabase().then(() => {
      import('./migrate.js').then(({ runMigrations }) => {
        runMigrations();
        seedDatabase();
      });
    });
  });
}
