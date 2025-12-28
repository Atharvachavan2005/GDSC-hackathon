import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Shield, Building2, Navigation, Locate, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'tourist' | 'alert' | 'police' | 'hospital' | 'safe-zone' | 'danger-zone' | 'no-network';
  label?: string;
  count?: number;
  details?: string;
}

interface InteractiveMapProps {
  markers?: MapMarker[];
  showHeatmap?: boolean;
  showControls?: boolean;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

// Jaipur tourist locations for demo
const jaipurLocations = {
  hawaMahal: { lat: 26.9239, lng: 75.8267 },
  amberFort: { lat: 26.9855, lng: 75.8513 },
  cityPalace: { lat: 26.9258, lng: 75.8237 },
  jaigarhFort: { lat: 26.9862, lng: 75.8460 },
  nahargarh: { lat: 26.9373, lng: 75.8157 },
  jalMahal: { lat: 26.9534, lng: 75.8464 },
  center: { lat: 26.9124, lng: 75.7873 }
};

export function InteractiveMap({
  markers = [],
  showHeatmap = true,
  showControls = true,
  height = '500px',
  onMarkerClick,
  center = jaipurLocations.center,
  zoom = 12,
  className = ''
}: InteractiveMapProps) {
  const [mapZoom, setMapZoom] = useState(zoom);
  const [activeLayer, setActiveLayer] = useState<'all' | 'tourists' | 'alerts' | 'zones'>('all');
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default markers for demo
  const defaultMarkers: MapMarker[] = [
    { id: '1', ...jaipurLocations.hawaMahal, type: 'tourist', label: 'Hawa Mahal', count: 234 },
    { id: '2', ...jaipurLocations.amberFort, type: 'tourist', label: 'Amber Fort', count: 567 },
    { id: '3', ...jaipurLocations.cityPalace, type: 'tourist', label: 'City Palace', count: 412 },
    { id: '4', lat: 26.9373, lng: 75.8157, type: 'danger-zone', label: 'Nahargarh (Restricted)', details: 'High Risk Zone' },
    { id: '5', lat: 26.9534, lng: 75.8464, type: 'alert', label: 'Active SOS', details: 'Tourist in distress' },
    { id: '6', lat: 26.9200, lng: 75.7800, type: 'police', label: 'Police Station' },
    { id: '7', lat: 26.9300, lng: 75.8100, type: 'hospital', label: 'SMS Hospital' },
    { id: '8', lat: 26.9600, lng: 75.8700, type: 'no-network', label: 'No Network Zone' },
  ];

  const allMarkers = markers.length > 0 ? markers : defaultMarkers;

  // Convert lat/lng to pixel positions (simplified for demo)
  const getPosition = (lat: number, lng: number) => {
    const scale = mapZoom / 12;
    const x = ((lng - 75.75) / 0.15) * 100 * scale;
    const y = ((27.02 - lat) / 0.15) * 100 * scale;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const handleLocate = () => {
    setIsLocating(true);
    setTimeout(() => setIsLocating(false), 2000);
  };

  const getMarkerIcon = (type: MapMarker['type']) => {
    switch (type) {
      case 'tourist':
        return (
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-teal-500/30 border-2 border-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="absolute inset-0 rounded-full bg-teal-400/50 animate-ping" />
          </div>
        );
      case 'alert':
        return (
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/50 border-2 border-white animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
          </div>
        );
      case 'police':
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg border-2 border-white">
            <Shield className="w-4 h-4" />
          </div>
        );
      case 'hospital':
        return (
          <div className="w-8 h-8 rounded-full bg-white border-2 border-red-500 flex items-center justify-center text-red-500 shadow-lg font-bold text-sm">
            H
          </div>
        );
      case 'danger-zone':
        return (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg border-2 border-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case 'no-network':
        return (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white shadow-lg border-2 border-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white">
            <MapPin className="w-3 h-3" />
          </div>
        );
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${className}`} style={{ height }}>
      {/* Map Background with Satellite-style appearance */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-800/30 to-blue-900/20">
        {/* Map tile pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: `${30 * (mapZoom / 12)}px ${30 * (mapZoom / 12)}px`
          }}
        />
        
        {/* Main map area */}
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/75.7873,26.9124,11,0/800x600?access_token=pk.placeholder')] bg-cover bg-center opacity-60" />
        
        {/* Fallback gradient overlay for visual appeal */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 30% 25%, rgba(16, 185, 129, 0.15) 0%, transparent 30%),
            radial-gradient(circle at 60% 45%, rgba(249, 115, 22, 0.12) 0%, transparent 25%),
            radial-gradient(circle at 25% 65%, rgba(239, 68, 68, 0.15) 0%, transparent 20%),
            radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 25%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
          `
        }} />
        
        {/* Roads pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
          <defs>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
          {/* Main roads */}
          <path d="M0 50% L100% 50%" stroke="url(#roadGrad)" strokeWidth="2" />
          <path d="M50% 0 L50% 100%" stroke="url(#roadGrad)" strokeWidth="2" />
          <path d="M20% 20% L80% 80%" stroke="url(#roadGrad)" strokeWidth="1" />
          <path d="M80% 20% L20% 80%" stroke="url(#roadGrad)" strokeWidth="1" />
          <path d="M0 30% Q50% 35%, 100% 30%" stroke="url(#roadGrad)" strokeWidth="1.5" fill="none" />
          <path d="M0 70% Q50% 65%, 100% 70%" stroke="url(#roadGrad)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Heat Map Overlay */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Tourist density heat spots */}
          <div className="absolute top-[22%] left-[35%] w-40 h-40 rounded-full bg-gradient-to-r from-green-500/40 to-emerald-500/40 blur-2xl animate-pulse" />
          <div className="absolute top-[40%] left-[55%] w-48 h-48 rounded-full bg-gradient-to-r from-yellow-500/35 to-orange-500/35 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[60%] left-[28%] w-32 h-32 rounded-full bg-gradient-to-r from-red-500/45 to-rose-500/45 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[25%] right-[25%] w-36 h-36 rounded-full bg-gradient-to-r from-teal-500/30 to-cyan-500/30 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[70%] right-[35%] w-28 h-28 rounded-full bg-gradient-to-r from-gray-500/40 to-gray-600/40 blur-xl" />
        </div>
      )}

      {/* Markers */}
      <div className="absolute inset-0">
        {allMarkers.map((marker) => {
          const pos = getPosition(marker.lat, marker.lng);
          const isHovered = hoveredMarker === marker.id;
          
          return (
            <div
              key={marker.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                marker.type === 'alert' ? 'z-30' : 'z-20'
              } ${isHovered ? 'scale-125 z-40' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() => setHoveredMarker(marker.id)}
              onMouseLeave={() => setHoveredMarker(null)}
              onClick={() => onMarkerClick?.(marker)}
            >
              {getMarkerIcon(marker.type)}
              
              {/* Count badge for tourist markers */}
              {marker.count && (
                <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-white text-xs font-bold flex items-center justify-center text-gray-800 shadow-md">
                  {marker.count}
                </div>
              )}
              
              {/* Tooltip */}
              {isHovered && marker.label && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-gray-900/95 backdrop-blur-sm text-white text-sm whitespace-nowrap shadow-xl border border-white/10 animate-fade-in">
                  <div className="font-semibold">{marker.label}</div>
                  {marker.count && <div className="text-xs text-gray-300">{marker.count} tourists</div>}
                  {marker.details && <div className="text-xs text-gray-300">{marker.details}</div>}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      {showControls && (
        <>
          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => setMapZoom(z => Math.min(z + 1, 18))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => setMapZoom(z => Math.max(z - 1, 8))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className={`bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg ${isLocating ? 'animate-pulse' : ''}`}
              onClick={handleLocate}
            >
              <Locate className={`w-4 h-4 ${isLocating ? 'text-blue-500' : ''}`} />
            </Button>
          </div>

          {/* Layer Control */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-2 flex gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'tourists', label: '👥' },
                { id: 'alerts', label: '🚨' },
                { id: 'zones', label: '🗺️' },
              ].map((layer) => (
                <button
                  key={layer.id}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeLayer === layer.id 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setActiveLayer(layer.id as any)}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="text-xs font-semibold text-gray-700 mb-2">Legend</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
            <span className="text-gray-600">Safe Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" />
            <span className="text-gray-600">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500" />
            <span className="text-gray-600">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-gray-500 to-gray-600" />
            <span className="text-gray-600">No Network</span>
          </div>
        </div>
      </div>

      {/* Live Badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-red-500/30">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        LIVE • {allMarkers.filter(m => m.type === 'tourist').reduce((acc, m) => acc + (m.count || 0), 0)} tourists
      </div>

      {/* Jaipur Label */}
      <div className="absolute bottom-4 right-4 text-right">
        <div className="text-white/80 text-lg font-bold drop-shadow-lg">Jaipur, Rajasthan</div>
        <div className="text-white/60 text-xs">Tourist Safety Monitoring</div>
      </div>
    </div>
  );
}
