'use client'
import { Poppins } from 'next/font/google';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['600'],
    variable: '--font-poppins',
  });
  


function Navbar(){
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoading = status === 'loading';
    const isAuthenticated = !!session;

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/home');
        router.refresh();
    };

    return(
        <div className="fixed flex justify-between px-20 py-2 items-center bg-green-200 w-full shadow-2xl"   >
            <p className={`text-green-900 text-4xl ${poppins.className}`}>Surplus Share</p>
            {!isLoading && (
                <ul className="flex gap-20 text-b-500">
                    <li><Link href="/home">Home</Link></li>
                    {isAuthenticated ? (
                        <>
                            <li><Link href="/dashboard">Dashboard</Link></li>
                            <li>
                                <button onClick={handleLogout} className="cursor-pointer">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link href="/register">Register</Link></li>
                            <li><Link href="/auth/login">Login</Link></li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
}

export default Navbar;