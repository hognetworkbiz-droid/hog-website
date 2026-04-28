import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WiFi Data Vouchers',
  description: 'Buy WiFi data vouchers online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
