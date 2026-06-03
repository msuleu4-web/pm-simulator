import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PMシミュレーター',
  description: '日本のIT現場のPM業務を体感する教育用ブラウザゲーム',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
