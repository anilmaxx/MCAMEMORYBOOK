import { Nunito, Caveat } from 'next/font/google';
import './globals.css';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });

export const metadata = {
  title: 'MCA 2024-2026 Memory Book',
  description: 'A shared memory board for our class journey',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${caveat.variable}`}>
        {children}
      </body>
    </html>
  );
}
