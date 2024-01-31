import {usePathname} from 'next/navigation';
import Script from 'next/script';
import {useEffect} from 'react';

type WindowWithDataLayer = Window & {
  dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

export default function Analytics() {
  const pathname = usePathname();

  const GTM_ID = 'G-B0R3W3Z827';

  const pageview = (url: string) => {
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'pageview',
        page: url,
      });
    } else {
      console.log({
        event: 'pageview',
        page: url,
      });
    }
  };

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{display: 'none', visibility: 'hidden'}}
        />
      </noscript>
      <Script
        async={true}
        src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
      />
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', '${GTM_ID}');
  `,
        }}
      />
    </>
  );
}
