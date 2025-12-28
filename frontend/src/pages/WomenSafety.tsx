import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingSOS } from '@/components/FloatingSOS';
import {
  Shield,
  Phone,
  MapPin,
  Users,
  AlertTriangle,
  Heart,
  Star,
  CheckCircle,
  Navigation,
  MessageCircle,
  Clock,
  Smartphone,
  Eye,
  Lock,
  UserCheck,
  Route,
  Bell,
  PhoneCall
} from 'lucide-react';

const WomenSafety = () => {
  const [safeWalkActive, setSafeWalkActive] = useState(false);
  const [shakeSOSEnabled, setShakeSOSEnabled] = useState(true);

  const safeSpaces = [
    { 
      name: 'Hotel Taj Palace', 
      type: 'Hotel', 
      rating: 4.8, 
      verifiedBy: 'Women Travelers',
      distance: '0.5 km',
      features: ['24/7 Security', 'Female Staff', 'Safe Parking']
    },
    { 
      name: 'Café Coffee Day - MI Road', 
      type: 'Café', 
      rating: 4.5, 
      verifiedBy: 'Local Women',
      distance: '0.8 km',
      features: ['Well-lit', 'Crowded Area', 'Staff Trained']
    },
    { 
      name: 'Metro Station - Sindhi Camp', 
      type: 'Transport', 
      rating: 4.6, 
      verifiedBy: 'Daily Commuters',
      distance: '1.2 km',
      features: ['Women Compartment', 'CCTV', 'Help Desk']
    }
  ];

  const helplines = [
    { name: 'Women Helpline', number: '1091', available: '24/7', type: 'primary' },
    { name: 'Tourist Police', number: '1363', available: '24/7', type: 'secondary' },
    { name: 'Emergency', number: '112', available: '24/7', type: 'danger' },
    { name: 'NCW Helpline', number: '7827-170-170', available: '9AM-5PM', type: 'secondary' }
  ];

  const safetyTips = [
    'Share your live location with trusted contacts before traveling',
    'Avoid isolated areas, especially after dark',
    'Keep emergency numbers saved and easily accessible',
    'Trust your instincts - if something feels wrong, leave immediately',
    'Use verified transport services with tracking features',
    'Inform hotel staff of your daily plans'
  ];

  const communityPosts = [
    {
      user: 'Ananya R.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
      time: '2 hours ago',
      content: 'The area around Hawa Mahal is well-lit and safe for evening walks. Many female tourists around.',
      location: 'Hawa Mahal, Jaipur',
      helpful: 34
    },
    {
      user: 'Meera S.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
      time: '5 hours ago',
      content: 'Recommend using Ola/Uber with share feature. Avoid unmarked auto-rickshaws after 8 PM.',
      location: 'Jaipur City',
      helpful: 56
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />
      <FloatingSOS />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Banner */}
          <Card className="mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0tNC00aC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">Women Safety Center</h1>
                  <p className="text-white/90 max-w-xl">
                    Your safety is our priority. Access emergency features, find safe spaces, and connect with the women travelers community.
                  </p>
                </div>
                <div className="md:ml-auto">
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold shadow-lg"
                    onClick={() => setSafeWalkActive(!safeWalkActive)}
                  >
                    <Route className="w-5 h-5 mr-2" />
                    {safeWalkActive ? 'Stop Safe Walk' : 'Start Safe Walk'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safe Walk Status */}
          {safeWalkActive && (
            <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-green-800">Safe Walk Active</h3>
                    <p className="text-sm text-green-600">Your location is being shared with 2 trusted contacts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">Duration</p>
                    <p className="font-mono font-bold text-green-800">00:15:32</p>
                  </div>
                  <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-100">
                    <Eye className="w-4 h-4 mr-2" /> View Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Safety Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                        <Smartphone className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">Shake to SOS</h3>
                        <p className="text-sm text-gray-500 mb-3">Shake phone 3 times for silent emergency alert</p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setShakeSOSEnabled(!shakeSOSEnabled)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${shakeSOSEnabled ? 'bg-pink-500' : 'bg-gray-300'}`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${shakeSOSEnabled ? 'left-6' : 'left-0.5'}`} />
                          </button>
                          <span className={`text-sm font-medium ${shakeSOSEnabled ? 'text-pink-600' : 'text-gray-400'}`}>
                            {shakeSOSEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                        <PhoneCall className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">Fake Call</h3>
                        <p className="text-sm text-gray-500 mb-3">Schedule a fake incoming call to escape situations</p>
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                          <Phone className="w-4 h-4 mr-2" /> Schedule Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Verified Safe Spaces */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold">Verified Safe Spaces</span>
                      <p className="text-sm text-gray-500 font-normal">Verified by women travelers</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {safeSpaces.map((space, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800">{space.name}</h4>
                          <p className="text-sm text-gray-500">{space.type} • {space.distance}</p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100">
                          <Star className="w-4 h-4 text-green-600 fill-green-600" />
                          <span className="font-bold text-green-700">{space.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {space.features.map((feature, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          <UserCheck className="w-3 h-3 inline mr-1" /> Verified by {space.verifiedBy}
                        </span>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                          <Navigation className="w-3 h-3 mr-1" /> Navigate
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Women's Community */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold">Women's Community</span>
                      <p className="text-sm text-gray-500 font-normal">Tips and experiences from women travelers</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {communityPosts.map((post, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
                      <div className="flex items-start gap-3 mb-3">
                        <img src={post.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-pink-200" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{post.user}</span>
                            <span className="text-xs text-gray-400">{post.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {post.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="text-sm text-pink-600 hover:text-pink-700 flex items-center gap-1">
                          <Heart className="w-4 h-4" /> Helpful ({post.helpful})
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-600 flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Helplines */}
              <Card className="bg-white shadow-lg border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="w-5 h-5 text-red-500" />
                    Emergency Helplines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {helplines.map((line, index) => (
                    <a 
                      key={index}
                      href={`tel:${line.number}`}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                        line.type === 'primary' ? 'bg-pink-50 hover:bg-pink-100 border border-pink-200' :
                        line.type === 'danger' ? 'bg-red-50 hover:bg-red-100 border border-red-200' :
                        'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{line.name}</p>
                        <p className="text-xs text-gray-500">{line.available}</p>
                      </div>
                      <div className={`px-3 py-2 rounded-lg font-mono font-bold ${
                        line.type === 'primary' ? 'bg-pink-500 text-white' :
                        line.type === 'danger' ? 'bg-red-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {line.number}
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Safety Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {safetyTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Travel Buddy Finder */}
              <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <h3 className="font-bold text-xl mb-2">Find Travel Buddy</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Connect with verified women travelers heading to the same destination
                  </p>
                  <Button className="bg-white text-purple-600 hover:bg-white/90 w-full font-semibold">
                    <Users className="w-4 h-4 mr-2" /> Find Companions
                  </Button>
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

export default WomenSafety;
