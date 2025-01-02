'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf } from 'lucide-react';

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(56,79,1,255)] shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <img src="/logo.ico" alt="Logo" className="h-20 w-25" />
                        <span className="text-xl font-bold text-white">Virtual Herbal Garden</span>
                    </Link>
                    <ul className="flex space-x-4">
                        {[
                            { href: '/', label: 'Home' },
                            { href: '/garden', label: 'Garden' },
                            { href: '/recommendation', label: 'Recommendation' },
                        ].map(({ href, label }) => (
                            <li key={href}>
                                <Link 
                                    href={href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
                                        ${pathname === href 
                                            ? 'bg-green-700 text-white' 
                                            : 'text-green-100 hover:bg-green-700 hover:text-white'
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

