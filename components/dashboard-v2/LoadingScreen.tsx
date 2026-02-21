interface LoadingScreenProps {
  message?: string;
}

const HEX_POINTS = '32,2 58,17 58,47 32,62 6,47 6,17';

export function HexLoader({ size = 64 }: { size?: number }) {
  const id = `hexGrad-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="hex-loader">
      {/* Visible hexagon outline */}
      <polygon
        points={HEX_POINTS}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-300 dark:text-dark-600"
      />
      {/* Neon trace crawling along the hexagon */}
      <polygon
        points={HEX_POINTS}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="40 160"
        className="hex-trace"
      />
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <style>{`
        .hex-trace {
          animation: hex-dash 1.8s linear infinite;
        }
        @keyframes hex-dash {
          to { stroke-dashoffset: -200; }
        }
      `}</style>
    </svg>
  );
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-transparent text-gray-900 dark:text-white">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <HexLoader size={64} />
            <p className="text-sm text-gray-500 dark:text-dark-400 font-medium">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
