"use client"

export function MapContainer() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(56,189,248,0.06) 0, rgba(56,189,248,0.06) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(56,189,248,0.06) 0, rgba(56,189,248,0.06) 1px, transparent 1px, transparent 32px)",
        }}
      />
      <div className="relative z-10 h-full flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <img
            src="/images/globe.png"
            alt="Globe visualization"
            className="mx-auto w-40 h-40 object-contain opacity-90"
          />
          <p className="mt-4 text-gray-300">
            Map visualization placeholder. Integrate WebGIS here (e.g., MapLibre/Leaflet).
          </p>
        </div>
      </div>
    </>
  )
}
