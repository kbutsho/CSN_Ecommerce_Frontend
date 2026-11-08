import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { SettingsProvider } from '@/components/SettingsProvider';
import { ToastProvider } from '@/components/ToastProvider';

export const metadata = {
  title: 'Marketly',
  description: 'Small e-commerce management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SettingsProvider>
          <ToastProvider>{children}</ToastProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
