import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Sun, 
  Moon, 
  Bell, 
  Menu, 
  X,
  MapPin,
  LogOut,
  User,
  Globe
} from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-card/90 backdrop-blur-xl shadow-lg border-b border-border/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.svg" 
              alt="SafeYatra" 
              className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <NavLink href="/" active={isActive('/')}>Home</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/features">Features</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </>
            ) : user?.role === 'tourist' ? (
              <>
                <NavLink href="/tourist" active={isActive('/tourist')}>Dashboard</NavLink>
                <NavLink href="/community" active={isActive('/community')}>Community</NavLink>
                <NavLink href="/women-safety" active={isActive('/women-safety')}>Women Safety</NavLink>
                <NavLink href="/help" active={isActive('/help')}>Help</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/authority" active={isActive('/authority')}>Dashboard</NavLink>
                <NavLink href="/alerts" active={isActive('/alerts')}>Alerts</NavLink>
                <NavLink href="/analytics" active={isActive('/analytics')}>Analytics</NavLink>
                <NavLink href="/zones" active={isActive('/zones')}>Zones</NavLink>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <Button variant="ghost" size="icon-sm" className="hidden sm:flex">
              <Globe className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon-sm"
              onClick={toggleTheme}
              className="relative"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

            {/* Notifications */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon-sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              </Button>
            )}

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/auth?register=true">
                  <Button variant="gradient" size="sm">Register</Button>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50">
                  <img 
                    src={user?.avatar} 
                    alt={user?.name} 
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 animate-slide-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</MobileNavLink>
                <MobileNavLink href="/features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
                <MobileNavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</MobileNavLink>
                <div className="flex gap-2 pt-4 border-t border-border mt-2">
                  <Link to="/auth" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/auth?register=true" className="flex-1">
                    <Button variant="gradient" className="w-full">Register</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-2">
                  <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.role}</p>
                  </div>
                </div>
                {user?.role === 'tourist' ? (
                  <>
                    <MobileNavLink href="/tourist" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                    <MobileNavLink href="/community" onClick={() => setIsMobileMenuOpen(false)}>Community</MobileNavLink>
                    <MobileNavLink href="/women-safety" onClick={() => setIsMobileMenuOpen(false)}>Women Safety</MobileNavLink>
                    <MobileNavLink href="/help" onClick={() => setIsMobileMenuOpen(false)}>Help</MobileNavLink>
                  </>
                ) : (
                  <>
                    <MobileNavLink href="/authority" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                    <MobileNavLink href="/alerts" onClick={() => setIsMobileMenuOpen(false)}>Alerts</MobileNavLink>
                    <MobileNavLink href="/analytics" onClick={() => setIsMobileMenuOpen(false)}>Analytics</MobileNavLink>
                    <MobileNavLink href="/zones" onClick={() => setIsMobileMenuOpen(false)}>Zones</MobileNavLink>
                  </>
                )}
                <Button variant="ghost" className="justify-start mt-2" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link 
      to={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary/10 text-primary' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      to={href}
      onClick={onClick}
      className="px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
    >
      {children}
    </Link>
  );
}
