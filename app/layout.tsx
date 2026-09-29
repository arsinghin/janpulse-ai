import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'JanPulse AI - Citizen Voice to Government Action',
  description: 'Multilingual citizen-signal intelligence platform for India. Transforming fragmented citizen development requests into structured infrastructure intelligence.',
  openGraph: {
    title: 'JanPulse AI - Citizen Voice to Government Action',
    description: 'Multilingual citizen-signal intelligence platform for India. Transforming fragmented citizen development requests into structured infrastructure intelligence.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JanPulse AI - Citizen Voice to Government Action',
    description: 'Multilingual citizen-signal intelligence platform for India. Transforming fragmented citizen development requests into structured infrastructure intelligence.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
