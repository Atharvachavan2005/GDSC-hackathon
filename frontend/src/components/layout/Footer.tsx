import { Link } from 'react-router-dom';
import { Shield, MapPin, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPinned } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img 
                src="/safeyatra-logo.png" 
                alt="SafeYatra" 
                className="h-14 w-auto brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              AI-Powered Tourist Safety Monitoring System. Protecting every journey, every tourist across India.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Youtube} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-teal-400">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/auth">Register as Tourist</FooterLink>
              <FooterLink href="/women-safety">Women Safety</FooterLink>
              <FooterLink href="/help">Emergency Help</FooterLink>
            </ul>
          </div>

          {/* For Authorities */}
          <div>
            <h4 className="font-semibold mb-4 text-teal-400">For Authorities</h4>
            <ul className="space-y-2">
              <FooterLink href="/auth">Department Login</FooterLink>
              <FooterLink href="/authority">Authority Dashboard</FooterLink>
              <FooterLink href="/analytics">Analytics Portal</FooterLink>
              <FooterLink href="/zones">Zone Management</FooterLink>
              <FooterLink href="/docs">Documentation</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-teal-400">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPinned className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-400" />
                <span>Ministry of Tourism, Govt. of India, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0 text-teal-400" />
                <span>1800-111-363 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0 text-teal-400" />
                <span>help@safeyatra.gov.in</span>
              </li>
            </ul>
            
            {/* Google Badge */}
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400">Powered by</p>
              <p className="text-sm font-semibold text-white">Google Gemini AI</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Govt of India" className="h-12 opacity-70" />
              <div className="text-xs text-gray-500 text-center lg:text-left">
                <p>An Initiative of Ministry of Tourism</p>
                <p>Government of India</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
              <Link to="/accessibility" className="hover:text-teal-400 transition-colors">Accessibility</Link>
              <span>© 2024 SafeYatra. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <a 
      href="#" 
      className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-all duration-300 hover:scale-110"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        to={href} 
        className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
