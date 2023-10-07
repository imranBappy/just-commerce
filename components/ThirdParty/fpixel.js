import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

function FPixel({ id }) {
  const router = useRouter();

  const FB_PIXEL_ID = id;

  const pageView = () => {
    window.fbq("track", "PageView");
  };

  // https://developers.facebook.com/docs/facebook-pixel/advanced/
  const event = (name, options = {}) => {
    window.fbq("track", name, options);
  };

  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    pageView();

    const handleRouteChange = () => {
      pageView();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  if (!FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      {/* Global Site Code Pixel - Facebook Pixel */}
      <Script
        id="FacebookPixelScript"
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
            fbq('init', ${FB_PIXEL_ID});
          `,
        }}
      />
    </>
  );
}

export default FPixel;
