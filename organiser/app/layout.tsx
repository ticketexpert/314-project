import './globals.css';
import { rethinkSans } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rethinkSans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}