import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, AlertTriangle, X } from 'lucide-react';

export function FloatingSOS() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHolding && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      triggerSOS();
    }
    return () => clearTimeout(timer);
  }, [isHolding, countdown]);

  const handleStart = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setIsHolding(true);
    setIsActive(true);
  };

  const handleEnd = () => {
    setIsHolding(false);
    setCountdown(3);
    setIsActive(false);
  };

  const triggerSOS = () => {
    setShowAlert(true);
    handleEnd();
    // Vibration pattern for alert
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  if (user?.role !== 'tourist' && isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* SOS Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-white text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">🚨 SOS Alert Sent!</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-700 font-medium">Alert sent to nearest Police Station</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-700 font-medium">Emergency contacts notified</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-700 font-medium">Location shared with Tourism Dept</span>
                </div>
              </div>
              <p className="text-center text-gray-600 mb-6">Help is on the way. Stay calm and stay where you are.</p>
              <button 
                onClick={() => setShowAlert(false)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 font-semibold text-gray-700 transition-all"
              >
                I'm Safe - Close Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulsing rings when active */}
        {isActive && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-20 h-20 rounded-full bg-red-500/40 animate-ping" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-24 h-24 rounded-full bg-red-500/30 animate-ping" style={{ animationDelay: '0.15s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-28 h-28 rounded-full bg-red-500/20 animate-ping" style={{ animationDelay: '0.3s' }} />
            </div>
          </>
        )}
        
        {/* Main Button */}
        <button
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          className={`relative w-18 h-18 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-2xl shadow-red-500/50 flex items-center justify-center transition-all duration-300 ${
            isActive ? 'scale-110 from-red-600 to-rose-600' : 'hover:scale-105 hover:shadow-red-500/60'
          }`}
          style={{ width: '72px', height: '72px' }}
        >
          {isHolding ? (
            <span className="text-3xl font-bold animate-pulse">{countdown}</span>
          ) : (
            <div className="flex flex-col items-center">
              <Phone className="w-7 h-7" />
              <span className="text-[10px] font-bold mt-0.5">SOS</span>
            </div>
          )}
        </button>
        
        {/* Tooltip */}
        {!isActive && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm whitespace-nowrap shadow-xl">
            <span className="font-medium">Hold for 3s to send SOS</span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>
    </>
  );
}
