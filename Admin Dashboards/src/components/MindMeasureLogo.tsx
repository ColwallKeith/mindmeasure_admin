export function MindMeasureLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#0BA66D"/>
        <path d="M8 12h3l3 8 3-8h3l3 8v-8h3v12h-4l-3-7-3 7h-4l-3-7v7H8V12z" fill="white"/>
        <circle cx="22" cy="10" r="2" fill="white"/>
      </svg>
    </div>
  );
}

export function MindMeasureWordmark() {
  return (
    <div className="flex items-center space-x-3">
      <MindMeasureLogo size="md" />
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Mind Measure
        </span>
        <span className="text-xs text-muted-foreground tracking-wider uppercase">
          Institutional Dashboard
        </span>
      </div>
    </div>
  );
}