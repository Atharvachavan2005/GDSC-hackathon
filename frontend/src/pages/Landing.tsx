import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  Shield, 
  MapPin, 
  Bell, 
  Brain, 
  Users, 
  Phone,
  ChevronRight,
  Star,
  Download,
  Play,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Heart,
  Globe,
  Wifi,
  WifiOff,
  Zap,
  Lock
} from 'lucide-react';

function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

const Landing = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: MapPin,
      title: 'Real-time Tracking',
      description: 'GPS tracking that works offline too. Your location is stored locally and syncs when back online.',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Bell,
      title: 'Instant SOS Alerts',
      description: 'One-touch emergency alert system that notifies police, family, and tourism department within seconds.',
      color: 'from-red-500 to-rose-500'
    },
    {
      icon: Brain,
      title: 'AI Travel Assistant',
      description: 'Powered by Google Gemini - get smart itineraries, safety tips, and real-time travel guidance.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Heart,
      title: 'Women Safety Features',
      description: 'Shake SOS, fake calls, verified safe spaces, and a dedicated women travelers community.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: WifiOff,
      title: 'Offline Mode',
      description: 'Works in no-network zones. GPS data stored locally and synced automatically when connected.',
      color: 'from-gray-500 to-slate-600'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'End-to-end encryption. Your data is protected. Opt-in tracking with full control.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: 50000, suffix: '+', label: 'Tourists Protected' },
    { value: 500, suffix: '+', label: 'Incidents Prevented' },
    { value: 24, suffix: '/7', label: 'Live Monitoring' },
    { value: 15, suffix: '+', label: 'Languages Supported' }
  ];

  const testimonials = [
    {
      name: 'Priya Mehta',
      location: 'Mumbai, Maharashtra',
      text: 'SafeYatra gave me peace of mind during my solo trip to Ladakh. The SOS feature is a lifesaver!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya'
    },
    {
      name: 'John Smith',
      location: 'London, UK',
      text: 'As a foreign tourist, this app made me feel completely safe exploring India. Highly recommended!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
    },
    {
      name: 'Amit Kumar',
      location: 'Delhi, India',
      text: 'The AI itinerary feature helped plan my family trip perfectly. Great initiative by the government!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
          
          {/* India Map Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.07]">
            <svg viewBox="0 0 800 800" className="w-full h-full">
              <defs>
                <linearGradient id="indiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
              <path 
                d="M400 80 L520 140 L580 240 L620 360 L600 480 L560 580 L500 680 L440 730 L400 750 L360 730 L300 680 L240 580 L200 480 L180 360 L220 240 L280 140 Z" 
                fill="url(#indiaGrad)"
              />
              {/* Tourist spots */}
              <circle cx="340" cy="220" r="12" fill="#f97316" className="animate-pulse" />
              <circle cx="450" cy="280" r="12" fill="#f97316" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <circle cx="400" cy="400" r="14" fill="#f97316" className="animate-pulse" style={{ animationDelay: '1s' }} />
              <circle cx="320" cy="520" r="12" fill="#f97316" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
              <circle cx="480" cy="450" r="12" fill="#f97316" className="animate-pulse" style={{ animationDelay: '2s' }} />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-sm font-semibold text-teal-700">Powered by Google Gemini AI</span>
            </div>
            
            {/* Logo */}
            <div className="flex justify-center mb-6 animate-slide-up">
              <img 
                src="/safeyatra-logo.png" 
                alt="SafeYatra" 
                className="h-32 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-[#1a365d] via-[#2d5a87] to-teal-600 bg-clip-text text-transparent">
                Protecting Every Journey
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              AI-Powered Tourist Safety Monitoring System. Real-time protection, instant SOS alerts, and smart travel assistance for millions exploring India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/auth?register=true">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/30 text-lg px-8 py-6">
                  <Users className="w-5 h-5 mr-2" />
                  Register as Tourist
                </Button>
              </Link>
              <Link to="/authority">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-gray-300 hover:border-teal-500 hover:bg-teal-50 text-lg px-8 py-6">
                  <Shield className="w-5 h-5 mr-2" />
                  Authority Dashboard
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=tourist${i}`}
                    className="w-10 h-10 rounded-full border-3 border-white shadow-md"
                    alt=""
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-700">50,000+ tourists protected</p>
                <p className="text-gray-500 text-xs">Join the SafeYatra community today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-gray-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Comprehensive Safety <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Advanced technology meets traditional hospitality to ensure every tourist's journey is safe and memorable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white border-0 shadow-lg group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-gradient-primary">SafeYatra</span> Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Register', desc: 'Sign up with your ID and emergency contacts' },
              { step: 2, title: 'Plan Trip', desc: 'Get AI-powered itinerary suggestions' },
              { step: 3, title: 'Stay Connected', desc: 'Share location with family in real-time' },
              { step: 4, title: 'Get Help', desc: 'Instant SOS alerts when you need them' }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-3 w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-gradient-primary">Travelers</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card glass className="overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-foreground mb-6 italic">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                  <img 
                    src={testimonials[activeTestimonial].avatar}
                    className="w-16 h-16 rounded-full mb-3"
                    alt=""
                  />
                  <p className="font-bold">{testimonials[activeTestimonial].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[activeTestimonial].location}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-0 gradient-primary">
            <CardContent className="p-8 md:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row items-center gap-8 text-white">
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Travel Safely?
                  </h2>
                  <p className="text-white/80 mb-6 max-w-lg">
                    Join thousands of tourists who travel with confidence. Download the SafeYatra app or register online today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link to="/auth?register=true">
                      <Button variant="glass" size="lg" className="w-full sm:w-auto border-white/20 hover:bg-white/20">
                        <Smartphone className="w-5 h-5 mr-2" />
                        Get Started Free
                      </Button>
                    </Link>
                    <Button variant="glass" size="lg" className="border-white/20 hover:bg-white/20">
                      <Play className="w-5 h-5 mr-2" />
                      Watch Demo
                    </Button>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
                    <div className="text-center">
                      <Shield className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-sm font-medium">100% Free</p>
                      <p className="text-xs text-white/70">For All Tourists</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
