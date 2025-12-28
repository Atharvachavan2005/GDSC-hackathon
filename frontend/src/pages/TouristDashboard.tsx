import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingSOS } from '@/components/FloatingSOS';
import { useAuth } from '@/contexts/AuthContext';
import {
  MapPin,
  Phone,
  Users,
  Share2,
  Cloud,
  Sun,
  Thermometer,
  Wind,
  Send,
  Sparkles,
  Bell,
  Clock,
  AlertTriangle,
  Heart,
  Camera,
  MessageCircle,
  ThumbsUp,
  QrCode,
  Shield,
  Calendar,
  ChevronRight
} from 'lucide-react';

const TouristDashboard = () => {
  const { user } = useAuth();
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'ai'; message: string }[]>([
    { role: 'ai', message: 'Hello! I\'m your AI travel assistant powered by Google Gemini. How can I help you plan your day in Jaipur? 🏰' }
  ]);

  const quickActions = [
    { icon: Phone, label: 'SOS Emergency', color: 'from-red-500 to-rose-500', pulse: true },
    { icon: MapPin, label: 'Share Location', color: 'from-teal-500 to-cyan-500' },
    { icon: Users, label: 'Family Check-in', color: 'from-purple-500 to-indigo-500' },
    { icon: Phone, label: 'Emergency Contacts', color: 'from-orange-500 to-amber-500' }
  ];

  const alerts = [
    { type: 'warning', title: 'High Temperature Alert', desc: 'Stay hydrated, 38°C expected today', time: '10 min ago' },
    { type: 'info', title: 'Crowd Alert', desc: 'High tourist density at Hawa Mahal', time: '30 min ago' },
    { type: 'success', title: 'Safe Zone', desc: 'Your current area is marked safe', time: '1 hr ago' }
  ];

  const communityPosts = [
    { 
      user: 'Priya M.', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      type: 'tip',
      content: 'Best time to visit Amber Fort is early morning. Less crowd and great photos!',
      likes: 24,
      comments: 5,
      location: 'Amber Fort, Jaipur'
    },
    {
      user: 'John S.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      type: 'warning',
      content: 'Be careful of overcharging taxi drivers near City Palace. Use official meters.',
      likes: 45,
      comments: 12,
      location: 'City Palace, Jaipur'
    }
  ];

  const familyMembers = [
    { name: 'Anita Sharma', relation: 'Spouse', status: 'Online', location: 'Hotel Room', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anita' },
    { name: 'Rohan Sharma', relation: 'Son', status: 'Last seen 5m ago', location: 'Pool Area', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan' }
  ];

  const handleSendAiMessage = () => {
    if (!aiMessage.trim()) return;
    
    setAiChat([...aiChat, { role: 'user', message: aiMessage }]);
    
    // Simulated AI response
    setTimeout(() => {
      setAiChat(prev => [...prev, {
        role: 'ai',
        message: `Here's a suggested itinerary for today:\n\n🌅 6:00 AM - Sunrise at Nahargarh Fort\n🏰 9:00 AM - Amber Fort tour\n🍽️ 12:30 PM - Lunch at 1135 AD\n🏛️ 3:00 PM - City Palace & Hawa Mahal\n🛍️ 5:00 PM - Shopping at Johari Bazaar\n🌆 7:00 PM - Dinner at Chokhi Dhani\n\nSafety tip: Carry water and stay in marked tourist areas.`
      }]);
    }, 1000);
    
    setAiMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20">
      <Header />
      <FloatingSOS />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Banner */}
          <Card className="mb-6 overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={user?.avatar} 
                    alt={user?.name} 
                    className="w-18 h-18 rounded-2xl border-4 border-white/30 shadow-lg"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-white/80 flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      Currently in {user?.currentTrip?.destination || 'India'}
                    </p>
                  </div>
                </div>
                
                {/* Safety Score */}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-center">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="#10b981"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 35}
                          strokeDashoffset={2 * Math.PI * 35 * (1 - 0.92)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                        92
                      </span>
                    </div>
                    <p className="text-xs text-white/80 mt-1 font-medium">Safety Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  action.pulse ? 'ring-2 ring-red-200 ring-offset-2' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg ${action.pulse ? 'animate-pulse' : ''}`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Trip Card */}
              <Card glass>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    Current Trip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=200" 
                            alt="Jaipur"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{user?.currentTrip?.destination || 'Jaipur, Rajasthan'}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Jan 15 - Jan 20, 2024
                          </p>
                        </div>
                      </div>
                      
                      {/* Trip Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Trip Progress</span>
                          <span className="font-medium">Day 3 of 5</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-3/5 bg-gradient-to-r from-secondary to-teal-400 rounded-full" />
                        </div>
                      </div>

                      {/* Weather Widget */}
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                        <Sun className="w-10 h-10 text-accent" />
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">32°C</span>
                            <span className="text-muted-foreground text-sm">Sunny</span>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> High: 38°C</span>
                            <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> 12 km/h</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Numbers */}
                    <div className="md:w-48 p-4 rounded-xl bg-danger/5 border border-danger/20">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-danger" />
                        Emergency
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between"><span>Police</span><span className="font-mono font-bold">100</span></p>
                        <p className="flex justify-between"><span>Ambulance</span><span className="font-mono font-bold">108</span></p>
                        <p className="flex justify-between"><span>Tourist Help</span><span className="font-mono font-bold">1363</span></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Itinerary */}
              <Card glass>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI Travel Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 overflow-y-auto mb-4 space-y-3 pr-2">
                    {aiChat.map((msg, index) => (
                      <div 
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-br-sm' 
                            : 'bg-muted rounded-bl-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    {['Plan my day', 'Nearby restaurants', 'Safety tips'].map((prompt) => (
                      <Button 
                        key={prompt}
                        variant="outline" 
                        size="sm"
                        onClick={() => setAiMessage(prompt)}
                        className="text-xs"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      placeholder="Ask anything about your trip..."
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                    />
                    <Button variant="gradient" size="icon" onClick={handleSendAiMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Community Feed */}
              <Card glass>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-secondary" />
                      Community Feed
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {communityPosts.map((post, index) => (
                    <div key={index} className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-start gap-3 mb-3">
                        <img src={post.avatar} alt="" className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.user}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              post.type === 'tip' ? 'bg-secondary/20 text-secondary' : 'bg-accent/20 text-accent'
                            }`}>
                              {post.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {post.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-secondary transition-colors">
                          <ThumbsUp className="w-4 h-4" /> {post.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-secondary transition-colors">
                          <MessageCircle className="w-4 h-4" /> {post.comments}
                        </button>
                        <button className="flex items-center gap-1 hover:text-secondary transition-colors">
                          <Share2 className="w-4 h-4" /> Share
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Safety Alerts */}
              <Card glass>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="w-5 h-5 text-accent" />
                    Safety Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-xl border ${
                        alert.type === 'warning' 
                          ? 'bg-accent/5 border-accent/20' 
                          : alert.type === 'success'
                            ? 'bg-success/5 border-success/20'
                            : 'bg-secondary/5 border-secondary/20'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {alert.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-accent mt-0.5" />
                        ) : alert.type === 'success' ? (
                          <Shield className="w-4 h-4 text-success mt-0.5" />
                        ) : (
                          <Bell className="w-4 h-4 text-secondary mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">{alert.desc}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {alert.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Family Group */}
              <Card glass>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-danger" />
                    Family Group
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {familyMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="relative">
                        <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                          member.status === 'Online' ? 'bg-success' : 'bg-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.location}</p>
                      </div>
                      <Button variant="ghost" size="icon-sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Mini Map */}
                  <div className="h-32 rounded-xl bg-muted/50 flex items-center justify-center mt-4">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">Family Location Map</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Digital ID Card */}
              <Card className="overflow-hidden gradient-primary text-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-white/60">Tourist ID</p>
                      <p className="font-mono text-lg font-bold">SY-2024-087654</p>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-xl p-2">
                      <QrCode className="w-full h-full text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <img src={user?.avatar} alt="" className="w-12 h-12 rounded-xl border-2 border-white/30" />
                    <div>
                      <p className="font-bold">{user?.name}</p>
                      <p className="text-xs text-white/70">Verified Tourist ✓</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/60 flex justify-between">
                    <span>Valid Until: Dec 2024</span>
                    <span>Gov. of India</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TouristDashboard;
