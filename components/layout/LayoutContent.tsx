'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <div className="d-flex">
                <Sidebar />
                <main
                    style={{
                        marginLeft: '250px', 
                        marginTop: '56px', 
                        width: 'calc(100% - 250px)',
                        backgroundColor: '#f8f9fa',
                        minHeight: 'calc(100vh - 56px)',
                        padding: '1.5rem'
                    }}
                >
                    {children}
                </main>
            </div>
        </>
    );
}
