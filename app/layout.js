import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Sushanth P — Marketing Strategist for Founders",
  description:
    "Sushanth P is a marketing strategist for D2C and B2B founders. Brand messaging, ad copy, and SEO built as one system — not separate deliverables.",
  keywords:
    "Sushanth P, Sushanth marketing strategist, marketing strategist for founders, D2C marketing, brand messaging, ad copywriting",
  alternates: {
    canonical: "https://sushanthp.com",
  },
  openGraph: {
    title: "Sushanth P — Marketing Strategist for Founders",
    description:
      "Brand messaging, ad copy, and SEO built as one system. For founders who are done guessing.",
    url: "https://sushanthp.com",
    siteName: "Sushanth P",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushanth P — Marketing Strategist for Founders",
    description: "Brand messaging, ad copy, and SEO built as one system.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sushanth P",
  url: "https://sushanthp.com",
  jobTitle: "Marketing Strategist",
  description:
    "Marketing strategist for D2C and B2B founders. Brand messaging, ad copy, SEO, and web built as one system.",
  knowsAbout: [
    "Brand Messaging",
    "Copywriting",
    "SEO",
    "Paid Advertising",
    "Marketing Strategy for Founders",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}
