

'use client';

import { GoogleAnalytics } from "nextjs-google-analytics";


export default function GoogleAnalytic({ children }) {
  return (
    <GoogleAnalytics trackPageViews >
        {children}
    </GoogleAnalytics>
  )
}


