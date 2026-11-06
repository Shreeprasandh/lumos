import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumos',
  description: 'Spatial Analysis to BOM Generator for Lighting Design',
  icons: {
    icon: '/logo.png',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FBF8F4] text-[#202321] antialiased">
        {children}
      </body>
    </html>
  );
}
