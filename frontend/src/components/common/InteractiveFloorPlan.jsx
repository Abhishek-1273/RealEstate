import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Info, CheckCircle2, Bed, ChefHat, Tv, Waves, Sun,
  RotateCw, Lightbulb, LightbulbOff, Sparkles, Navigation
} from 'lucide-react';

const FLOORS_DATA = {
  'Ground Floor': {
    rooms: [
      { id: 'g-living', name: 'Grand Living Room', type: 'living', icon: Tv, dims: "16' × 20'", area: '320 sqft', style: { top: '10%', left: '10%', width: '45%', height: '40%', bg: 'rgba(212,175,55,0.06)' } },
      { id: 'g-dining', name: 'Dining & Gourmet Kitchen', type: 'kitchen', icon: ChefHat, dims: "14' × 18'", area: '252 sqft', style: { top: '10%', left: '58%', width: '32%', height: '40%', bg: 'rgba(30,58,138,0.05)' } },
      { id: 'g-bed', name: 'Premium Guest Suite', type: 'bedroom', icon: Bed, dims: "12' × 14'", area: '168 sqft', style: { top: '55%', left: '10%', width: '35%', height: '35%', bg: 'rgba(16,185,129,0.05)' } },
      { id: 'g-deck', name: 'Alfresco Lounge Deck', type: 'deck', icon: Sun, dims: "10' × 24'", area: '240 sqft', style: { top: '55%', left: '48%', width: '42%', height: '35%', bg: 'rgba(212,175,55,0.1)' } },
    ]
  },
  'First Floor': {
    rooms: [
      { id: 'f-master', name: 'Presidential Master Suite', type: 'bedroom', icon: Bed, dims: "18' × 22'", area: '396 sqft', style: { top: '10%', left: '10%', width: '50%', height: '45%', bg: 'rgba(212,175,55,0.08)' } },
      { id: 'f-cinema', name: 'Private Home Theatre', type: 'theatre', icon: Tv, dims: "14' × 16'", area: '224 sqft', style: { top: '10%', left: '63%', width: '27%', height: '45%', bg: 'rgba(139,92,246,0.05)' } },
      { id: 'f-kids', name: 'Luxury Kids Room', type: 'bedroom', icon: Bed, dims: "12' × 14'", area: '168 sqft', style: { top: '60%', left: '10%', width: '35%', height: '30%', bg: 'rgba(30,58,138,0.05)' } },
      { id: 'f-balcony', name: 'Sunset Vista Balcony', type: 'deck', icon: Sun, dims: "8' × 16'", area: '128 sqft', style: { top: '60%', left: '48%', width: '42%', height: '30%', bg: 'rgba(212,175,55,0.1)' } },
    ]
  },
  'Terrace / Penthouse': {
    rooms: [
      { id: 't-lounge', name: 'Sky Bar & Lounge', type: 'deck', icon: Sun, dims: "14' × 20'", area: '280 sqft', style: { top: '15%', left: '15%', width: '40%', height: '45%', bg: 'rgba(212,175,55,0.08)' } },
      { id: 't-pool', name: 'Infinity Plunge Pool Deck', type: 'pool', icon: Waves, dims: "18' × 24'", area: '432 sqft', style: { top: '15%', left: '58%', width: '30%', height: '70%', bg: 'rgba(56,189,248,0.08)' } },
      { id: 't-garden', name: 'Zen Landscape Garden', type: 'deck', icon: Sun, dims: "10' × 16'", area: '160 sqft', style: { top: '65%', left: '15%', width: '40%', height: '20%', bg: 'rgba(16,185,129,0.06)' } },
    ]
  }
};

function FurnitureBlueprint({ type }) {
  if (type === 'bedroom') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
        <div className="w-[55%] h-[50%] border border-dashed border-white/60 rounded relative mt-1.5">
          <div className="absolute top-1 left-[10%] w-[35%] h-[25%] border border-white/50 rounded-sm" />
          <div className="absolute top-1 right-[10%] w-[35%] h-[25%] border border-white/50 rounded-sm" />
          <div className="absolute bottom-0 left-0 right-0 top-[40%] border-t border-white/30" />
        </div>
      </div>
    );
  }
  if (type === 'living') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
        <div className="w-[65%] h-[65%] border border-dashed border-white/50 rounded-xl relative flex flex-col justify-end p-0.5">
          <div className="w-6 h-3 border border-white/40 rounded-full absolute top-1.5 left-1.5" />
          <div className="w-full h-[45%] border-t border-white/30 flex gap-0.5">
            <div className="flex-1 border-r border-white/20" />
            <div className="flex-1" />
          </div>
        </div>
      </div>
    );
  }
  if (type === 'kitchen') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
        <div className="relative w-[65%] h-[65%]">
          <div className="w-8 h-5 border border-dashed border-white/50 rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" />
          <div className="w-2 h-0.5 border border-white/40 absolute top-1 left-1/2 -translate-x-1/2" />
          <div className="w-2 h-0.5 border border-white/40 absolute bottom-1 left-1/2 -translate-x-1/2" />
          <div className="w-0.5 h-2 border border-white/40 absolute left-1 top-1/2 -translate-y-1/2" />
          <div className="w-0.5 h-2 border border-white/40 absolute right-1 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }
  if (type === 'pool') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
        <div className="w-[85%] h-[85%] border border-sky-300/30 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-sky-400/5 flex flex-col justify-around">
            <div className="w-full h-[1px] bg-sky-300/10 border-b border-dashed border-sky-300/10" />
            <div className="w-full h-[1px] bg-sky-300/10 border-b border-dashed border-sky-300/10" />
            <div className="w-full h-[1px] bg-sky-300/10 border-b border-dashed border-sky-300/10" />
          </div>
        </div>
      </div>
    );
  }
  if (type === 'deck') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
        <div className="w-[60%] h-[60%] relative">
          <div className="w-4 h-4 border border-white/40 rounded-full absolute top-1/2 left-2 -translate-y-1/2" />
          <div className="w-1.5 h-4 border border-white/40 rounded-sm absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }
  if (type === 'theatre') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
        <div className="w-[70%] h-[75%] flex flex-col justify-between items-center py-1">
          <div className="flex gap-1">
            <div className="w-2.5 h-1.5 border border-white/40 rounded-sm" />
            <div className="w-2.5 h-1.5 border border-white/40 rounded-sm" />
          </div>
          <div className="flex gap-1">
            <div className="w-2.5 h-1.5 border border-white/40 rounded-sm" />
            <div className="w-2.5 h-1.5 border border-white/40 rounded-sm" />
          </div>
          <div className="w-[85%] h-0.5 bg-white/40" />
        </div>
      </div>
    );
  }
  return null;
}

export default function InteractiveFloorPlan() {
  const [activeFloor, setActiveFloor] = useState('Ground Floor');
  const [hoveredRoom, setHoveredRoom] = useState(null);
  
  // 3D rotation states controlled by mouse drag
  const [rotateZ, setRotateZ] = useState(-42);
  const [rotateX, setRotateX] = useState(52);

  // Drag state trackers
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [pointerStart, setPointerStart] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState({ x: 52, z: -42 });
  const [hasDragged, setHasDragged] = useState(false);

  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // Only trigger for left click
    e.currentTarget.setPointerCapture(e.pointerId);
    
    setIsPointerDown(true);
    setPointerStart({ x: e.clientX, y: e.clientY });
    setRotationStart({ x: rotateX, z: rotateZ });
    setHasDragged(false);
  };

  const handlePointerMove = (e) => {
    if (!isPointerDown) return;
    
    const deltaX = e.clientX - pointerStart.x;
    const deltaY = e.clientY - pointerStart.y;
    
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      setHasDragged(true);
    }
    
    // Rotate Z via horizontal drag; Rotate X via vertical drag
    setRotateZ(rotationStart.z + deltaX * 0.5);
    setRotateX(Math.max(20, Math.min(80, rotationStart.x - deltaY * 0.4)));
  };

  const handlePointerUp = (e) => {
    if (!isPointerDown) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsPointerDown(false);
  };

  // Dynamic light toggles
  const [roomLights, setRoomLights] = useState({
    'g-living': true, 'g-dining': true, 'g-bed': false, 'g-deck': false,
    'f-master': true, 'f-cinema': false, 'f-kids': false, 'f-balcony': false,
    't-lounge': true, 't-pool': true, 't-garden': false
  });

  const toggleLight = (roomId) => {
    setRoomLights(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }));
  };

  const resetRotation = () => {
    setRotateZ(-42);
    setRotateX(52);
  };

  const floorRooms = FLOORS_DATA[activeFloor].rooms;

  return (
    <div className="rounded-3xl p-6 lg:p-8 bg-mesh-dark border border-white/10" style={{ boxShadow: '0 20px 50px rgba(7,26,47,0.25)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-display font-black text-white text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold animate-pulse" />
            Interactive 3D Floor Plan
          </h3>
          <p className="text-white/50 text-xs mt-0.5">Drag mouse/touch anywhere inside the 3D window to rotate and tilt the layout blueprint.</p>
        </div>

        {/* Floor Switcher Tabs */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 shrink-0">
          {Object.keys(FLOORS_DATA).map(floor => (
            <button
              key={floor}
              onClick={() => { setActiveFloor(floor); setHoveredRoom(null); }}
              className="px-4 py-2 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-300 whitespace-nowrap"
              style={{
                background: activeFloor === floor ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : 'transparent',
                color: activeFloor === floor ? '#071A2F' : 'rgba(255,255,255,0.6)',
              }}
            >
              {floor.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Isometric 3D Display Container */}
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`lg:col-span-8 flex items-center justify-center bg-navy-dark/40 rounded-2xl border border-white/5 relative overflow-hidden touch-none select-none transition-shadow ${isPointerDown ? 'cursor-grabbing shadow-inner' : 'cursor-grab hover:shadow-lg'}`}
          style={{ height: '400px', perspective: '1100px' }}
        >
          
          {/* Glassmorphic 3D Controls HUD */}
          <div className="absolute top-4 left-4 z-10 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 text-xs text-white/70 select-none">
            <span className="flex items-center gap-1.5 font-semibold text-[10px] tracking-wider uppercase text-gold">
              <Navigation className="w-3.5 h-3.5" /> 3D Orbit View
            </span>
            <button 
              onPointerDown={e => e.stopPropagation()} // Prevent drag trigger when resetting
              onClick={(e) => { e.stopPropagation(); resetRotation(); }} 
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors text-[9px] font-bold"
              title="Reset View"
            >
              Reset View
            </button>
          </div>

          {/* Isometric Blueprint Grid */}
          <motion.div
            key={activeFloor}
            style={{
              transformStyle: 'preserve-3d',
              background: 'radial-gradient(circle, rgba(212,175,55,0.03) 1px, transparent 1px) 0 0 / 16px 16px',
              border: '2px dashed rgba(255,255,255,0.06)',
              rotateX: rotateX,
              rotateZ: rotateZ,
            }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute w-[80%] h-[80%] pointer-events-auto"
          >
            {/* Rooms blocks inside Blueprint */}
            {floorRooms.map(room => {
              const isLit = roomLights[room.id];
              const isSelected = hoveredRoom?.id === room.id;
              const RoomIcon = room.icon;

              return (
                <motion.div
                  key={room.id}
                  onPointerDown={e => e.stopPropagation()} // Stop propagation so we can click room directly without drag initiation
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasDragged) {
                      setHoveredRoom(room);
                    }
                  }}
                  className="absolute border rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer"
                  style={{
                    ...room.style,
                    transformStyle: 'preserve-3d',
                    backgroundColor: isSelected 
                      ? 'rgba(212,175,55,0.22)' 
                      : (isLit ? 'rgba(252,211,77,0.18)' : room.style.bg),
                    borderColor: isSelected 
                      ? '#D4AF37' 
                      : (isLit ? 'rgba(252,211,77,0.4)' : 'rgba(255,255,255,0.12)'),
                    boxShadow: isSelected 
                      ? '0 12px 28px rgba(212,175,55,0.22)' 
                      : (isLit ? '0 8px 20px rgba(252,211,77,0.15)' : 'none'),
                  }}
                  whileHover={{
                    translateZ: 16,
                  }}
                >
                  {/* 3D shadow under levitated room */}
                  <div className="absolute inset-0 bg-black/25 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: 'translateZ(-16px)' }} />

                  {/* Structural Furniture Layer */}
                  <FurnitureBlueprint type={room.type} />

                  {/* Room Label Content */}
                  <div className="text-center p-2 z-[2] select-none flex flex-col items-center justify-center gap-1.5" style={{ transform: 'translateZ(10px)' }}>
                    <div className={`p-1 rounded-lg transition-colors ${isLit ? 'bg-amber-400/20 text-gold' : 'bg-white/5 text-white/50'}`}>
                      <RoomIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-white font-display font-bold text-[9px] leading-tight group-hover:text-gold transition-colors">{room.name.split(' ').slice(1).join(' ') || room.name}</p>
                      <p className="text-gold/80 text-[8px] font-accent font-semibold tracking-wider mt-0.5">{room.dims}</p>
                    </div>
                  </div>

                  {/* Mini Lightbulb status indicator */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <button 
                      onPointerDown={e => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); toggleLight(room.id); }}
                      className={`p-1 rounded-full border transition-all ${isLit ? 'bg-gold border-gold text-navy' : 'bg-black/20 border-white/10 text-white/30 hover:text-white/60'}`}
                    >
                      <Lightbulb className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Compass / Orientation Overlay */}
          <div className="absolute bottom-4 left-4 text-white/35 text-[9px] font-accent tracking-widest flex items-center gap-1.5 pointer-events-none select-none">
            <RotateCw className="w-3 h-3 text-white/20 animate-spin" style={{ animationDuration: '8s' }} />
            <span>DRAG MOUSE OR SWIPE TO ROTATE IN 3D</span>
          </div>
        </div>

        {/* Room Info details sidebar */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {hoveredRoom ? (
              <motion.div
                key={hoveredRoom.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-5 bg-white/5 border border-white/10 rounded-2xl p-5 select-none"
              >
                <div className="flex justify-between items-center">
                  <div className="inline-flex items-center gap-1.5 text-gold text-[10px] font-accent font-bold tracking-[0.2em] uppercase">
                    <Info className="w-3.5 h-3.5" /> Room Vitals
                  </div>
                  <button 
                    onClick={() => toggleLight(hoveredRoom.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all ${roomLights[hoveredRoom.id] ? 'bg-gold border-gold text-navy' : 'bg-white/5 border-white/10 text-white/60'}`}
                  >
                    {roomLights[hoveredRoom.id] ? (
                      <>
                        <Lightbulb className="w-3 h-3" /> Lights On
                      </>
                    ) : (
                      <>
                        <LightbulbOff className="w-3 h-3" /> Lights Off
                      </>
                    )}
                  </button>
                </div>
                
                <div>
                  <h4 className="font-display font-black text-white text-xl leading-tight">{hoveredRoom.name}</h4>
                  <p className="text-white/45 text-xs mt-1">Highlighted on isometric layout grid. Interactive blueprints display furniture layout overlay.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-white/40 text-[9px] font-accent tracking-wider uppercase font-semibold">Dimensions</p>
                    <p className="text-gold font-display font-bold text-base mt-1">{hoveredRoom.dims}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-white/40 text-[9px] font-accent tracking-wider uppercase font-semibold">Carpet Area</p>
                    <p className="text-gold font-display font-bold text-base mt-1">{hoveredRoom.area}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-white/70 text-xs bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-white text-[11px] flex items-center gap-1">
                      Vastu Compliant <Sparkles className="w-3 h-3 text-gold" />
                    </p>
                    <p className="text-[10px] text-white/50">Optimal sunlight pathways and layout configuration.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center lg:text-left py-8 text-white/40 space-y-3 p-5 select-none"
              >
                <Layers className="w-8 h-8 text-gold/30 mx-auto lg:mx-0 animate-bounce" />
                <p className="font-display font-bold text-white/60 text-sm">Select a room block</p>
                <p className="text-xs leading-relaxed max-w-xs mx-auto lg:mx-0">Click any room block in the 3D viewport to inspect vitals, toggles, layout dimensions, and furniture blueprints.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
