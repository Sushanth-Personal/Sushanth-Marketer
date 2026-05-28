import "./globals.css";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://sushanthp.com"),
  verification: {
    google: "jGQ9xzNXExzZV2iSZu47Mo4GSOHfFrRcdWWaYV1y21A",
  },
  title: {
    default:
      "Sushanth P · Marketing Strategist for Founders and Small Businesses",
    template: "%s · Sushanth P",
  },
  description:
    "Strategy without psychology is just guessing. I help founders understand their customer first — then build SEO, messaging, and ads that actually work.",
  keywords:
    "Sushanth P, marketing strategist for founders, marketing consultant for small business, D2C marketing, brand messaging, SEO copywriter, ad copywriting",
  alternates: {
    canonical: "https://sushanthp.com",
  },
  openGraph: {
    title:
      "Sushanth P — Your Product Is Better. Your Marketing Shouldn't Lose.",
    description:
      "Strategy without psychology is just guessing. I help founders understand their customer first — then build SEO, messaging, and ads that actually work.",
    url: "https://sushanthp.com",
    siteName: "Sushanth P",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://sushanthp.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sushanth P — Marketing Strategist for Founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Sushanth P — Your Product Is Better. Your Marketing Shouldn't Lose.",
    description:
      "Strategy without psychology is just guessing. I help founders understand their customer first — then build SEO, messaging, and ads that actually work.",
    images: ["https://sushanthp.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sushanth P",
  url: "https://sushanthp.com",
  jobTitle: "Marketing Strategist",
  description:
    "Strategy without psychology is just guessing. I help founders understand their customer first — then build SEO, messaging, and ads that actually work.",
  knowsAbout: [
    "Brand Messaging",
    "Copywriting",
    "SEO",
    "Paid Advertising",
    "Marketing Strategy",
    "Consumer Psychology",
    "Website Optimization",
    "Content Marketing",
    "Blog Writing",
    "Website Building",
  ],
  sameAs: ["https://www.linkedin.com/in/sushanthp"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sushanth P",
  url: "https://sushanthp.com",
  description:
    "Strategy without psychology is just guessing. I help founders understand their customer first — then build SEO, messaging, and ads that actually work.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body>
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
