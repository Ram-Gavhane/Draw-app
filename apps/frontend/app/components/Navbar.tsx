"use client";
import { useRouter } from "next/navigation";

export function Navbar({ hideLogout = false, title = "Dashboard" }: { hideLogout?: boolean, title?: string }){
    const router = useRouter();
    return <nav className="bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 text-gray-100">
            <div className="text-xl font-semibold tracking-tight">{title}</div>
            <div>
                {!hideLogout && (
                    <button onClick={()=>{
                        localStorage.removeItem('token');
                        router.push('/login');
                    }} className="rounded-md bg-gray-100 text-gray-900 px-3 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">Logout</button>
                )}
            </div>
        </div>
    </nav>
}