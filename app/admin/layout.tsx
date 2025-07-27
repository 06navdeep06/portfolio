import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/src/lib/auth';
import AdminNav from '@/components/AdminNav';

const inter = Inter({ subsets: ['latin'] });

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?from=/admin');
  }
  
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <div className="min-h-screen">
          <AdminNav />
          <main className="p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
