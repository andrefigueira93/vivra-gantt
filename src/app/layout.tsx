import './globals.css'

export const metadata = {
  title: 'Next.js Gantt',
  description: 'Example for VIVRA Teachers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
