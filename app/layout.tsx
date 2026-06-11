import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from './components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'PMシミュレーター',
  description: '日本のIT現場のPM業務を体感する教育用ブラウザゲーム',
  icons: {
    icon: [{ url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SIer道場',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
