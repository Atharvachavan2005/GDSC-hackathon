import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { 
  User, 
  Building2, 
  Shield as ShieldIcon,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  MapPin,
  UserPlus,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'tourist' | 'authority';
type AuthMode = 'login' | 'register';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<AuthMode>(searchParams.get('register') ? 'register' : 'login');
  const [activeTab, setActiveTab] = useState<UserRole>('tourist');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'tourist', label: 'Tourist', icon: User, color: 'from-teal-500 to-cyan-500' },
    { id: 'authority', label: 'Authority', icon: Building2, color: 'from-blue-500 to-indigo-500' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      // Redirect based on role (handled by AuthContext)
      const token = localStorage.getItem('safeyatra_token');
      if (token) {
        // Navigate after a brief delay to ensure state is updated
        setTimeout(() => {
          navigate(activeTab === 'tourist' ? '/tourist' : '/authority');
        }, 100);
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match.',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: activeTab,
      });
      toast({
        title: 'Registration successful!',
        description: 'Welcome to SafeYatra. Stay safe!',
      });
      navigate(activeTab === 'tourist' ? '/tourist' : '/authority');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials hint
  const demoCredentials = {
    tourist: { email: 'john.smith@gmail.com', password: 'demo123' },
    authority: { email: 'rajesh.kumar@police.gov.in', password: 'demo123' },
  };

  const fillDemoCredentials = () => {
    const creds = demoCredentials[activeTab];
    setFormData({ ...formData, email: creds.email, password: creds.password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="min-h-screen flex pt-20">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="relative z-10 text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl">
              <img src="/logo-icon.svg" alt="SafeYatra" className="w-20 h-20" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">SafeYatra</h2>
            <p className="text-muted-foreground mb-8">
              Your trusted companion for safe travels across India. Register once, travel with confidence everywhere.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: MapPin, label: 'Real-time Tracking' },
                { icon: Phone, label: 'Instant SOS' },
                { icon: ShieldIcon, label: 'AI Protection' }
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200/50 dark:border-gray-700/50">
                  <item.icon className="w-6 h-6 text-teal-500 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {mode === 'login' 
                  ? 'Sign in to access your safety dashboard' 
                  : 'Register to start your safe journey'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Role Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as UserRole)}
                    className={`
                      flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all
                      ${activeTab === tab.id 
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                        : 'text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-600'}
                    `}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Demo Credentials Button */}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="w-full text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 py-2 px-4 rounded-lg bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                >
                  📋 Fill Demo Credentials ({activeTab})
                </button>
              )}

              {/* Form */}
              <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>

              {/* Info */}
              <div className="text-center text-xs text-muted-foreground pt-4 border-t border-gray-200 dark:border-gray-700">
                <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                <p className="mt-2">🔒 Your data is encrypted and secure</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
