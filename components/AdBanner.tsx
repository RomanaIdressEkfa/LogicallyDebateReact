
import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  style?: React.CSSProperties;
  dataAdFormat?: 'auto' | 'fluid' | 'rectangle';
  dataAdLayoutKey?: string;
  dataAdSlot: string; // This will be provided by AdSense dashboard
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  className, 
  style, 
  dataAdFormat = 'auto', 
  dataAdLayoutKey, 
  dataAdSlot 
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Check if container has width before initializing ad
      // This prevents "No slot size for availableWidth=0" error
      if (adRef.current && adRef.current.clientWidth > 0) {
          // @ts-ignore
          const adsbygoogle = window.adsbygoogle || [];
          if (adRef.current.innerHTML === '') {
              adsbygoogle.push({});
          }
      }
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden my-6 flex justify-center bg-slate-900/30 border border-slate-800/50 rounded-lg p-2 min-h-[100px] ${className}`} style={{ ...style, display: 'block' }}>
      {/* Placeholder for Development - Remove this block in production if you want it empty until ads load */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border border-slate-600 px-2 py-1 rounded">Advertisement Space</span>
      </div>

      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '100px', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your actual Publisher ID later
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive="true"
        data-ad-layout-key={dataAdLayoutKey}
        ref={adRef}
      ></ins>
    </div>
  );
};

export default AdBanner;
