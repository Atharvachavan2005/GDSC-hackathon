import { Router, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { getDatabase } from '../db/connection.js';

const router = Router();

// Initialize Gemini AI
const genAI = process.env.GOOGLE_AI_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY) : null;

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

// Safety advice chatbot
router.post('/chat', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    
    if (!genAI) {
      // Fallback responses when AI is not configured
      const fallbackResponses: Record<string, string> = {
        emergency: "In case of emergency, please use the SOS button immediately. Keep calm, note your surroundings, and wait for help. Emergency services in India: Police - 100, Ambulance - 102, Women Helpline - 1091",
        safety: "Stay alert in crowded areas, keep your valuables secure, avoid isolated areas after dark, and always share your live location with trusted contacts. Our app can help track your safety zones.",
        scam: "Be cautious of overpriced services, always negotiate before agreeing to prices, use official transport services, and never share personal or financial information with strangers.",
        health: "Carry basic medications, stay hydrated, eat at reputable places, and be aware of local health advisories. Keep your travel insurance details handy.",
        default: "I'm here to help with your safety queries. You can ask about emergency procedures, safety tips, local advisories, or general travel safety advice."
      };
      
      const lowerMessage = message.toLowerCase();
      let response = fallbackResponses.default;
      
      if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('sos')) {
        response = fallbackResponses.emergency;
      } else if (lowerMessage.includes('safe') || lowerMessage.includes('tip')) {
        response = fallbackResponses.safety;
      } else if (lowerMessage.includes('scam') || lowerMessage.includes('fraud')) {
        response = fallbackResponses.scam;
      } else if (lowerMessage.includes('health') || lowerMessage.includes('medical')) {
        response = fallbackResponses.health;
      }
      
      res.json({ response, source: 'fallback' });
      return;
    }
    
    // Use Gemini AI for response
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const systemPrompt = `You are SafeYatra AI, a helpful tourism safety assistant for travelers in India. 
Your role is to provide accurate, helpful safety information and travel advice. 
Keep responses concise but informative. Focus on:
- Personal safety tips
- Emergency procedures
- Local customs and advisories
- Scam prevention
- Health and medical advice
- Navigation and transport safety

Current context: ${context ? JSON.stringify(context) : 'General query'}

User question: ${message}

Provide a helpful, safety-focused response:`;
    
    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();
    
    res.json({ response, source: 'ai' });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Safety score for a location
router.post('/safety-score', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, placeName } = req.body;
    const db = getDatabase();
    
    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Location is required' });
      return;
    }
    
    // Get nearby zone data
    const zones = getAll(db, `
      SELECT * FROM safety_zones 
      WHERE active = 1
      ORDER BY ((latitude - ?) * (latitude - ?) + (longitude - ?) * (longitude - ?)) ASC
      LIMIT 3
    `, [latitude, latitude, longitude, longitude]);
    
    // Get recent incidents in area
    const incidents = getAll(db, `
      SELECT COUNT(*) as count, alert_type FROM sos_alerts 
      WHERE created_at > datetime('now', '-30 days')
      GROUP BY alert_type
    `, []);
    
    // Calculate base safety score (0-100)
    let score = 75; // Base score
    
    if (zones.length > 0) {
      const nearestZone = zones[0];
      if (nearestZone.zone_type === 'high-risk') score -= 25;
      else if (nearestZone.zone_type === 'moderate') score -= 10;
      else if (nearestZone.zone_type === 'safe') score += 10;
      
      if (nearestZone.risk_score) {
        score -= (nearestZone.risk_score * 5);
      }
    }
    
    // Adjust for incidents
    incidents.forEach((inc: any) => {
      if (inc.alert_type === 'emergency') score -= (inc.count * 2);
      else if (inc.alert_type === 'harassment') score -= (inc.count * 3);
      else if (inc.alert_type === 'theft') score -= (inc.count * 2);
    });
    
    // Clamp score
    score = Math.max(0, Math.min(100, score));
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (score < 50) {
      recommendations.push('Consider traveling with a companion');
      recommendations.push('Keep emergency contacts readily available');
      recommendations.push('Stay in well-lit, populated areas');
    } else if (score < 75) {
      recommendations.push('Stay aware of your surroundings');
      recommendations.push('Keep valuables secure');
    }
    recommendations.push('Share your live location with trusted contacts');
    
    res.json({
      score,
      rating: score >= 80 ? 'safe' : score >= 60 ? 'moderate' : score >= 40 ? 'caution' : 'high-risk',
      nearbyZones: zones,
      recommendations,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Safety score error:', error);
    res.status(500).json({ error: 'Failed to calculate safety score' });
  }
});

// Get travel tips for a destination
router.get('/tips/:destination', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination } = req.params;
    
    // Predefined tips for popular destinations
    const tipDatabase: Record<string, any> = {
      default: {
        general: [
          'Always carry a copy of your ID and travel documents',
          'Register with your embassy for travel advisories',
          'Keep emergency numbers saved offline',
          'Download offline maps for your destination'
        ],
        safety: [
          'Avoid displaying expensive items openly',
          'Use official transportation services',
          'Stay in well-reviewed accommodations',
          'Trust your instincts - if something feels wrong, leave'
        ],
        health: [
          'Stay hydrated and eat at reputable establishments',
          'Carry basic first-aid supplies',
          'Know the location of nearest hospital',
          'Get travel insurance'
        ],
        emergency: [
          'Police: 100',
          'Ambulance: 102',
          'Women Helpline: 1091',
          'Tourist Helpline: 1363'
        ]
      }
    };
    
    const tips = tipDatabase[destination.toLowerCase()] || tipDatabase.default;
    
    res.json({ destination, tips });
  } catch (error) {
    console.error('Get tips error:', error);
    res.status(500).json({ error: 'Failed to get tips' });
  }
});

// Route planning with safety considerations
router.post('/plan-route', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { origin, destination, departureTime } = req.body;
    const db = getDatabase();
    
    if (!origin || !destination) {
      res.status(400).json({ error: 'Origin and destination are required' });
      return;
    }
    
    // Get safety zones along potential route
    const zones = getAll(db, `SELECT * FROM safety_zones WHERE active = 1`, []);
    
    // Analyze time-based risk
    const hour = departureTime ? new Date(departureTime).getHours() : new Date().getHours();
    const isNightTime = hour < 6 || hour > 21;
    
    const recommendations = [];
    if (isNightTime) {
      recommendations.push('Night travel detected - consider daytime alternatives');
      recommendations.push('Use well-lit main roads');
      recommendations.push('Share your live location with trusted contacts');
    }
    
    // Check for high-risk zones
    const highRiskZones = zones.filter((z: any) => z.zone_type === 'high-risk');
    if (highRiskZones.length > 0) {
      recommendations.push('Route may pass through high-risk areas');
      recommendations.push('Stay alert and avoid stopping in isolated areas');
    }
    
    res.json({
      origin,
      destination,
      departureTime,
      isNightTravel: isNightTime,
      riskLevel: isNightTime && highRiskZones.length > 0 ? 'high' : 
                 isNightTime || highRiskZones.length > 0 ? 'moderate' : 'low',
      recommendations,
      highRiskZones: highRiskZones.map((z: any) => ({ name: z.name, latitude: z.latitude, longitude: z.longitude }))
    });
  } catch (error) {
    console.error('Plan route error:', error);
    res.status(500).json({ error: 'Failed to plan route' });
  }
});

export default router;
