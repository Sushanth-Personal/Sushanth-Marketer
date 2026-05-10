import './globals.css'

export const metadata = {
  title: 'Sushanth P — Marketing Strategist',
  description: 'Sharp marketing for founders who are done guessing.',
  openGraph: {
    title: 'Sushanth P — Marketing Strategist',
    description: 'Sharp marketing for founders who are done guessing.',
    url: 'https://sushanthp.com',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
