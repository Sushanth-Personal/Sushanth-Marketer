import "./globals.css";
import Script from "next/script";

export const metadataBase = new URL("https://sushanthp.com");

export const metadata = {
  metadataBase: new URL("https://sushanthp.com"),
  title: {
    default: "Sushanth P — Marketing Strategist for Founders",
    template: "%s — Sushanth P",
  },
  description:
    "Sushanth P is a marketing strategist for D2C and B2B founders. SEO, brand messaging, and ad copy built as one system — not separate deliverables.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  keywords:
    "Sushanth P, marketing strategist for founders, D2C marketing, brand messaging, SEO copywriter, ad copywriting, Bangalore marketing strategist",
  alternates: {
    canonical: "https://sushanthp.com",
  },
  openGraph: {
    title: "Sushanth P — Marketing Strategist for Founders",
    description:
      "SEO, brand messaging, and ad copy built as one system. For founders who are done guessing.",
    url: "https://sushanthp.com",
    siteName: "Sushanth P",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sushanth P — Marketing Strategist for Founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushanth P — Marketing Strategist for Founders",
    description:
      "SEO, brand messaging, and ad copy built as one system. For founders who are done guessing.",
    images: ["/og-image.png"],
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
    "Marketing strategist for D2C and B2B founders. SEO, brand messaging, and ad copy built as one system.",
  knowsAbout: [
    "Brand Messaging",
    "Copywriting",
    "SEO",
    "Paid Advertising",
    "Marketing Strategy",
    "Consumer Psychology",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
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
    "Marketing strategist for founders. SEO, copywriting, and brand messaging as one system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
