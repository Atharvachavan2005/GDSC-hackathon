import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { InteractiveMap } from '@/components/InteractiveMap';
import {
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Bell,
  Phone,
  Navigation,
  User,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Map as MapIcon,
  Layers,
  Eye,
  FileText,
  Download,
  RefreshCw,
  Volume2,
  VolumeX,
  ChevronRight,
  XCircle,
  CircleDot,
  UserCheck,
  ShieldAlert,
  Radio
} from 'lucide-react';

const AuthorityDashboard = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { 
      label: 'Active Tourists', 
      value: '12,847', 
      change: '+156', 
      trend: 'up',
      icon: Users,
      color: 'bg-gradient-to-r from-teal-500 to-cyan-500',
      textColor: 'text-teal-600'
    },
    { 
      label: 'Active Alerts', 
      value: '3', 
      change: '-2', 
      trend: 'down',
      icon: ShieldAlert,
      color: 'bg-gradient-to-r from-red-500 to-rose-500',
      textColor: 'text-red-600'
    },
    { 
      label: 'Resolved Today', 
      value: '28', 
      change: '+12', 
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      textColor: 'text-green-600'
    },
    { 
      label: 'Avg Response', 
      value: '4.2 min', 
      change: '-0.3', 
      trend: 'down',
      icon: Clock,
      color: 'bg-gradient-to-r from-orange-500 to-amber-500',
      textColor: 'text-orange-600'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'SOS',
      tourist: 'Priya Sharma',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      location: 'Near Hawa Mahal, Jaipur',
      time: '2 min ago',
      priority: 'critical',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Geo-fence Breach',
      tourist: 'John Smith',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      location: 'Restricted Zone - Nahargarh',
      time: '8 min ago',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 3,
      type: 'Anomaly Detected',
      tourist: 'Maria Garcia',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      location: 'City Palace Area',
      time: '15 min ago',
      priority: 'medium',
      status: 'assigned'
    }
  ];

  const zones = [
    { name: 'Hawa Mahal Zone', status: 'safe', tourists: 234, risk: 'low' },
    { name: 'Amber Fort Zone', status: 'moderate', tourists: 567, risk: 'medium' },
    { name: 'Nahargarh Zone', status: 'alert', tourists: 89, risk: 'high' },
    { name: 'City Palace Zone', status: 'safe', tourists: 412, risk: 'low' },
    { name: 'Johari Bazaar', status: 'moderate', tourists: 789, risk: 'medium' }
  ];

  const recentSearches = [
    { name: 'Rahul Kumar', id: 'SY-087654', lastSeen: '5 min ago' },
    { name: 'Emma Wilson', id: 'SY-091234', lastSeen: '12 min ago' }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Top Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1 font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                      <p className={`text-sm flex items-center gap-1 mt-2 font-medium ${
                        stat.trend === 'up' && stat.label !== 'Active Alerts' ? 'text-green-600' : 
                        stat.trend === 'down' && stat.label === 'Active Alerts' ? 'text-green-600' :
                        stat.trend === 'down' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {stat.change} from yesterday
                      </p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Heat Map - Main Feature */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                <CardHeader className="pb-2 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                        <MapIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-lg font-bold">Tourist Heat Map</span>
                        <p className="text-sm text-gray-500 font-normal">Jaipur, Rajasthan</p>
                      </div>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                        <Layers className="w-4 h-4 mr-2" /> Layers
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {/* New Interactive Map Component */}
                  <InteractiveMap 
                    height="480px"
                    showHeatmap={true}
                    showControls={true}
                    onMarkerClick={(marker) => {
                      if (marker.type === 'alert') {
                        // Handle alert click
                        console.log('Alert clicked:', marker);
                      }
                    }}
                  />

                  {/* Zone Stats Below Map */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                    {zones.map((zone, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedZone(zone.name)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ${
                          selectedZone === zone.name 
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30' 
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            zone.status === 'safe' ? 'bg-green-500' : 
                            zone.status === 'moderate' ? 'bg-orange-500' : 'bg-red-500'
                          } ${selectedZone !== zone.name ? '' : 'bg-white'}`} />
                          <span className={`text-xs font-semibold truncate ${selectedZone === zone.name ? 'text-white' : 'text-gray-700'}`}>
                            {zone.name}
                          </span>
                        </div>
                        <p className={`text-2xl font-bold ${selectedZone === zone.name ? 'text-white' : 'text-gray-800'}`}>
                          {zone.tourists}
                        </p>
                        <p className={`text-xs ${selectedZone === zone.name ? 'text-white/80' : 'text-gray-500'}`}>
                          tourists active
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Alert Panel */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-bold">Live Alerts</span>
                        <span className="ml-3 px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                          {alerts.filter(a => a.status === 'pending').length} Active
                        </span>
                      </div>
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={soundEnabled ? 'text-green-600' : 'text-gray-400'}
                    >
                      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
                        alert.priority === 'critical' 
                          ? 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200' 
                          : alert.priority === 'high'
                            ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200'
                            : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <img src={alert.photo} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                          {alert.priority === 'critical' && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-gray-800">{alert.tourist}</span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                              alert.type === 'SOS' ? 'bg-red-100 text-red-700' :
                              alert.type === 'Geo-fence Breach' ? 'bg-orange-100 text-orange-700' :
                              'bg-teal-100 text-teal-700'
                            }`}>
                              {alert.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {alert.location}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {alert.time}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md" size="sm">
                          <Phone className="w-4 h-4 mr-2" /> Respond Now
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                          <Navigation className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-gray-100">
                          <User className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" className="w-full text-gray-600 hover:text-teal-600 hover:bg-teal-50">
                    View All Alerts <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Tourist Search */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold">Tourist Lookup</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, ID, or phone..."
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-teal-500 transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Recent Searches</p>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-teal-50 hover:border-teal-200 border border-transparent transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate group-hover:text-teal-700">{search.name}</p>
                          <p className="text-xs text-gray-500">{search.id}</p>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{search.lastSeen}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-5 flex-col gap-2 hover:bg-teal-50 hover:border-teal-300 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">Generate E-FIR</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-5 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">Manage Zones</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-5 flex-col gap-2 hover:bg-green-50 hover:border-green-300 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-5 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">Export Report</span>
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

export default AuthorityDashboard;
