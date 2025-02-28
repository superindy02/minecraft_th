import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children, title = 'Minecraft Server' }) {
    const { user, loading, logout, isAdmin } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ปิดเมนูเมื่อเปลี่ยนหน้า
    useEffect(() => {
        setIsMenuOpen(false);
    }, [router.pathname]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Minecraft Server</title>
                <meta name="description" content="Minecraft Server Thailand" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/" className="flex items-center">
                                หน้าแรก
                            </Link>
                            <Link href="/shop" className="flex items-center ml-8">
                                ร้านค้า
                            </Link>
                            <Link href="/forum" className="flex items-center ml-8">
                                กระดานสนทนา
                            </Link>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center">
                                    <span className="mr-4">สวัสดี, {user.username}</span>
                                    <button 
                                        onClick={() => logout()}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        ออกจากระบบ
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    เข้าสู่ระบบ
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center">© 2023 Minecraft Server. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}