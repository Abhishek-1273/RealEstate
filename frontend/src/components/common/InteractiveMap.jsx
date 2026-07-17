import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Leaflet CSS is dynamically imported here — not in index.html — so it only loads
// on pages that actually render this map component (~40KB saved on all other pages)
const leafletCssLoaded = { current: false };
function ensureLeafletCss() {
  if (leafletCssLoaded.current) return;
  leafletCssLoaded.current = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  document.head.appendChild(link);
}

// Custom SVG Icons encoded as Data URIs for absolute reliability in Vite
const PROPERTY_PIN_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="36" height="48">
  <path fill="#D4AF37" stroke="#071A2F" stroke-width="16" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
  <circle cx="192" cy="192" r="75" fill="#071A2F"/>
  <path fill="#D4AF37" d="M192 145l-40 32v45h80v-45z"/>
</svg>
`)}`;

const ACTIVE_PROPERTY_PIN_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="42" height="54">
  <path fill="#EF4444" stroke="#FFFFFF" stroke-width="16" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
  <circle cx="192" cy="192" r="75" fill="#FFFFFF"/>
  <path fill="#EF4444" d="M192 145l-40 32v45h80v-45z"/>
</svg>
`)}`;

const AMENITY_ICONS = {
  education: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="30" height="30">
      <circle cx="320" cy="256" r="250" fill="#10B981" stroke="#FFFFFF" stroke-width="30"/>
      <path fill="#FFFFFF" d="M320 96L128 192v32h384v-32L320 96zM160 256v128h320V256H160zm160 32h64v64h-64v-64z"/>
    </svg>
  `)}`,
  transit: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="30">
      <circle cx="224" cy="256" r="210" fill="#3B82F6" stroke="#FFFFFF" stroke-width="30"/>
      <path fill="#FFFFFF" d="M224 96c-88.4 0-160 71.6-160 160v128c0 17.7 14.3 32 32 32h16c17.7 0 32-14.3 32-32v-16h160v16c0 17.7 14.3 32 32 32h16c17.7 0 32-14.3 32-32V256c0-88.4-71.6-160-160-160zm-64 240c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/>
    </svg>
  `)}`,
  medical: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30" height="30">
      <circle cx="256" cy="256" r="240" fill="#EF4444" stroke="#FFFFFF" stroke-width="30"/>
      <path fill="#FFFFFF" d="M368 224H288v-80c0-17.7-14.3-32-32-32s-32 14.3-32 32v80h-80c-17.7 0-32 14.3-32 32s14.3 32 32 32h80v80c0 17.7 14.3 32 32 32s32-14.3 32-32v-80h80c17.7 0 32-14.3 32-32s-14.3-32-32-32z"/>
    </svg>
  `)}`,
  shopping: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="30" height="30">
      <circle cx="288" cy="256" r="240" fill="#F59E0B" stroke="#FFFFFF" stroke-width="30"/>
      <path fill="#FFFFFF" d="M288 128c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80zm128 96c0-70.7-57.3-128-128-128s-128 57.3-128 128v12c-48.4 8.4-80 50.6-80 98.4 0 55.2 44.8 100 100 100h216c55.2 0 100-44.8 100-100 0-47.8-31.6-90-80-98.4v-12z"/>
    </svg>
  `)}`
};

export default function InteractiveMap({
  properties = [],
  center,
  zoom = 12,
  activePropertyId = null,
  showAmenities = [],
  amenityCategory = '',
  onMarkerClick = null
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const amenitiesLayerRef = useRef(null);
  const focusCircleRef = useRef(null);

  // 1. Initialize Map
  useEffect(() => {
    // Dynamically inject Leaflet CSS only when the map is first mounted
    ensureLeafletCss();

    if (!mapContainerRef.current) return;

    // Detect theme class on html element
    const isDark = document.documentElement.classList.contains('dark');
    const tileLayerUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const initialCenter = center || [20.5937, 78.9629]; // Default: center of India
    const initialZoom = center ? zoom : 5;

    // Create Map instance
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      scrollWheelZoom: false, // Prevents page scroll gestures from zooming the map
      attributionControl: false
    });

    // Add elegant custom zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Set up tiles
    L.tileLayer(tileLayerUrl, {
      maxZoom: 19
    }).addTo(map);

    // Feature group layers for clear updates
    const markersLayer = L.featureGroup().addTo(map);
    const amenitiesLayer = L.featureGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;
    amenitiesLayerRef.current = amenitiesLayer;

    // Listen to dark mode changes dynamically!
    const observer = new MutationObserver(() => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const newUrl = isCurrentlyDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      // Find tile layer and update URL
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.setUrl(newUrl);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
      map.remove();
    };
  }, []); // Run once on mount

  // 2. Plot Properties
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    // Clear previous markers
    markersLayer.clearLayers();

    if (properties.length === 0) return;

    // Define icons
    const normalIcon = L.icon({
      iconUrl: PROPERTY_PIN_SVG,
      iconSize: [36, 48],
      iconAnchor: [18, 48],
      popupAnchor: [0, -42]
    });

    const activeIcon = L.icon({
      iconUrl: ACTIVE_PROPERTY_PIN_SVG,
      iconSize: [42, 54],
      iconAnchor: [21, 54],
      popupAnchor: [0, -48]
    });

    const latLngs = [];

    properties.forEach((p) => {
      const coords = p.coordinates;
      if (!coords || !coords.lat || !coords.lng) return;

      const isCurrentActive = String(p.id) === String(activePropertyId) || p._id === activePropertyId;

      // Popup Content Styled for Dark & Light Mode Luxury Aesthetics
      const popupHtml = `
        <div class="luxury-map-popup text-navy dark:text-white p-1 max-w-[200px] font-sans">
          <img src="${p.image}" class="w-full h-24 object-cover rounded-lg mb-2 shadow-sm border border-gray-150 dark:border-white/10" alt="${p.title}" />
          <h4 class="font-bold text-xs line-clamp-1 leading-tight text-navy dark:text-cream-light">${p.title}</h4>
          <p class="text-[10px] text-ink-soft dark:text-white/40 flex items-center gap-0.5 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${p.location}
          </p>
          <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100 dark:border-white/5">
            <span class="font-black text-xs text-gold">${p.priceLabel || 'Luxury'}</span>
            <a href="/properties/${p.id || p._id}" class="text-[9px] font-bold uppercase tracking-wider text-navy dark:text-white hover:text-gold dark:hover:text-gold transition-colors">Details &rarr;</a>
          </div>
        </div>
      `;

      const marker = L.marker([coords.lat, coords.lng], {
        icon: isCurrentActive ? activeIcon : normalIcon
      });

      marker.bindPopup(popupHtml, {
        className: 'luxury-popup-container',
        closeButton: false,
        minWidth: 180
      });

      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(p);
      });

      markersLayer.addLayer(marker);
      latLngs.push([coords.lat, coords.lng]);
    });

    // Auto-fit bounds if we have multiple items and center is NOT explicitly passed
    if (latLngs.length > 1 && !center) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
    }
  }, [properties, activePropertyId, center, onMarkerClick]);

  // 3. Handle Explicit Pan/Center Actions
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center || !center[0] || !center[1]) return;

    map.setView(center, zoom, {
      animate: true,
      duration: 1.2
    });

    // Handle single property details center ring focus
    if (properties.length === 1) {
      // Clear old circle
      if (focusCircleRef.current) {
        map.removeLayer(focusCircleRef.current);
      }

      // Add a luxury pulsing ring / area circle
      const isDark = document.documentElement.classList.contains('dark');
      const focusCircle = L.circle(center, {
        radius: 400,
        color: '#D4AF37',
        fillColor: '#D4AF37',
        fillOpacity: isDark ? 0.08 : 0.05,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(map);

      focusCircleRef.current = focusCircle;
    }
  }, [center, zoom, properties]);

  // 4. Plot Amenities (PropertyDetails page)
  useEffect(() => {
    const map = mapRef.current;
    const amenitiesLayer = amenitiesLayerRef.current;
    if (!map || !amenitiesLayer) return;

    amenitiesLayer.clearLayers();

    if (!showAmenities || showAmenities.length === 0) return;

    const iconUrl = AMENITY_ICONS[amenityCategory] || AMENITY_ICONS.transit;
    const markerIcon = L.icon({
      iconUrl,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -10]
    });

    showAmenities.forEach((item) => {
      if (!item.coordinates || !item.coordinates.lat || !item.coordinates.lng) return;

      const popupHtml = `
        <div class="amenity-popup text-navy dark:text-white p-1 text-[11px] font-sans">
          <span class="font-bold text-xs">${item.name}</span>
          <p class="text-[10px] text-ink-soft dark:text-white/40 mt-0.5">${item.distance} away</p>
        </div>
      `;

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], {
        icon: markerIcon
      });

      marker.bindPopup(popupHtml, {
        closeButton: false,
        offset: [0, -5]
      });

      amenitiesLayer.addLayer(marker);
    });

    // Pan map to fit both property center and all amenities markers
    if (center && showAmenities.length > 0) {
      const bounds = L.latLngBounds([center]);
      showAmenities.forEach(a => {
        if (a.coordinates) bounds.extend([a.coordinates.lat, a.coordinates.lng]);
      });
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [showAmenities, amenityCategory, center]);

  return (
    <div className="relative z-0 w-full h-full overflow-hidden rounded-2xl border border-gray-100 dark:border-white/10 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-900" style={{ minHeight: '300px' }} />
      {/* Dynamic Gold Gradient Border Accent */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent pointer-events-none z-[1000]" />
    </div>
  );
}
