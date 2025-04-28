import './globals.css';

export const metadata = {
  title: 'Simulador de Consórcio',
  description: 'Simule seu consórcio e veja os resultados detalhados',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
} 