import "./globals.css";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://sushanthp.com"),
  verification: {
    google: "jGQ9xzNXExzZV2iSZu47Mo4GSOHfFrRcdWWaYV1y21A",
  },
  title: {
    default:
      "Sushanth P — Marketing Strategist for Founders | SEO, Brand Messaging & Ad Copy",
    template: "%s — Sushanth P",
  },
  description:
    "Sushanth P is a marketing strategist for D2C and B2B founders. SEO, brand messaging, and ad copy built as one system — not separate deliverables.",
  keywords:
    "Sushanth P, marketing strategist for founders, D2C marketing, brand messaging, SEO copywriter, ad copywriting,  marketing strategist",
  alternates: {
    canonical: "https://sushanthp.com",
  },
  openGraph: {
    title:
      "Sushanth P — Your Product Is Better. Your Marketing Shouldn't Lose.",
    description:
      "SEO, brand messaging, and ad copy built as one system. For founders who are done guessing.",
    url: "https://sushanthp.com",
    siteName: "Sushanth P",
    type: "website",
    locale: "en_IN",
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
      "SEO, brand messaging, and ad copy built as one system. For founders who are done guessing.",
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
    "Your product is better than your marketing suggests. I help founders fix the whole system - SEO, brand messaging, and ad copy working as one.",
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
  address: {
    "@type": "PostalAddress",
    addressLocality: "",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  sameAs: ["https://www.linkedin.com/in/sushanthp"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sushanth P",
  url: "https://sushanthp.com",
  description:
    "Your product is better than your marketing suggests. I help founders fix the whole system — SEO, brand messaging, and ad copy working as one.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
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
