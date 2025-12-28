import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { getDatabase, saveDatabase } from '../db/connection.js';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to get row from sql.js result
function getRow(db: any, sql: string, params: any[] = []): any {
  const stmt = db.prepare(sql);
  stmt.bind(params);
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

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').optional().isIn(['tourist', 'authority']),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// Register
router.post('/register', registerValidation, async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const { email, password, name, phone, role = 'tourist', emergencyContact, emergencyPhone } = req.body;
    const db = getDatabase();
    
    // Check if user exists
    const existingUser = getRow(db, 'SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists', code: 'EMAIL_EXISTS' });
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userId = uuidv4();
    db.run(`INSERT INTO users (id, email, password, name, phone, role, emergency_contact, emergency_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, hashedPassword, name, phone || null, role, emergencyContact || null, emergencyPhone || null]);
    
    // Create profile based on role
    if (role === 'tourist') {
      db.run(`INSERT INTO tourist_profiles (id, user_id, nationality) VALUES (?, ?, ?)`,
        [uuidv4(), userId, req.body.nationality || null]);
    } else if (role === 'authority') {
      db.run(`INSERT INTO authority_profiles (id, user_id, department, badge_number, station_name) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), userId, req.body.department || 'General', req.body.badgeNumber || null, req.body.stationName || null]);
    }
    
    saveDatabase();
    
    // Generate token
    const token = generateToken({ id: userId, email, role, name });
    
    res.status(201).json({
      message: 'Registration successful',
      user: { id: userId, email, name, role },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', code: 'REGISTRATION_ERROR' });
  }
});

// Login
router.post('/login', loginValidation, async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const { email, password } = req.body;
    const db = getDatabase();
    
    // Find user
    const user = getRow(db, `SELECT id, email, password, name, role, phone, avatar_url, emergency_contact, emergency_phone FROM users WHERE email = ?`, [email]);
    
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
      return;
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
      return;
    }
    
    // Get profile data
    let profile = null;
    if (user.role === 'tourist') {
      profile = getRow(db, 'SELECT * FROM tourist_profiles WHERE user_id = ?', [user.id]);
    } else if (user.role === 'authority') {
      profile = getRow(db, 'SELECT * FROM authority_profiles WHERE user_id = ?', [user.id]);
    }
    
    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: { ...userWithoutPassword, profile },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', code: 'LOGIN_ERROR' });
  }
});

// Get current user
router.get('/me', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const db = getDatabase();
    const user = getRow(db, `SELECT id, email, name, role, phone, avatar_url, emergency_contact, emergency_phone, created_at FROM users WHERE id = ?`, [req.user!.id]);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    let profile = null;
    if (user.role === 'tourist') {
      profile = getRow(db, 'SELECT * FROM tourist_profiles WHERE user_id = ?', [user.id]);
    } else if (user.role === 'authority') {
      profile = getRow(db, 'SELECT * FROM authority_profiles WHERE user_id = ?', [user.id]);
    }
    
    res.json({ user: { ...user, profile } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, emergencyContact, emergencyPhone, bloodGroup } = req.body;
    const userId = req.user!.id;
    const db = getDatabase();
    
    // Update user basic info
    db.run(`UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), emergency_contact = COALESCE(?, emergency_contact), emergency_phone = COALESCE(?, emergency_phone), blood_group = COALESCE(?, blood_group), updated_at = datetime('now') WHERE id = ?`,
      [name || null, phone || null, emergencyContact || null, emergencyPhone || null, bloodGroup || null, userId]);
    
    saveDatabase();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Invalid password data' });
      return;
    }
    
    const db = getDatabase();
    const user = getRow(db, 'SELECT password FROM users WHERE id = ?', [req.user!.id]);
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?', [hashedPassword, req.user!.id]);
    
    saveDatabase();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;
