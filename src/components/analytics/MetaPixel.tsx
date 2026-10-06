"use client";

import React, { useEffect, Suspense } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { trackPageView } from "@/lib/meta-pixel";

function MetaPixelRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
}

export function MetaPixel() {
  const { cms } = useAdminStore();
  const rawId = cms?.marketing?.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
  const pixelId = rawId.trim();
  const isEnabled = cms?.marketing?.metaPixelEnabled !== false && pixelId.length > 0;

  if (!isEnabled || !pixelId) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>

      <Suspense fallback={null}>
        <MetaPixelRouteTracker />
      </Suspense>
    </>
  );
}
