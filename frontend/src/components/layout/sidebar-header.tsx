import React from 'react';

import Image from 'next/image';

export function SidebarHeader() {
  return (
    <div className="flex items-center px-1 mb-2 scale-110 origin-left">
      <Image 
        src="/navbar/wholelogo.png" 
        alt="VedaAI Logo" 
        width={180} 
        height={56} 
        className="h-auto w-auto"
        priority
      />
    </div>
  );
}
