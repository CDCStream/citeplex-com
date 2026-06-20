import Script from "next/script";

/**
 * Ahrefs Web Analytics. The data-key is a public, client-side site key
 * (visible in page source), so it's safe to ship inline.
 */
export function AhrefsAnalytics() {
  return (
    <Script
      src="https://analytics.ahrefs.com/analytics.js"
      data-key="+trViQ8eqxufx2nBLIS1Zw"
      strategy="lazyOnload"
    />
  );
}
