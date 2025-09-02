"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Navbar } from "../components/Navbar";

export default function Login(){
    const usernameRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    return <div className="min-h-screen font-mono bg-gray-800 flex flex-col">
            <Navbar hideLogout title="kanvas" />
            <div className="flex-1 w-screen flex justify-center items-center">
                <div className="w-[360px] bg-gray-900 border border-gray-800 text-gray-100 flex flex-col px-5 py-6 rounded-xl shadow-lg shadow-black/20">
                    <div className="text-xl font-semibold tracking-tight mb-2 px-1">
                        Login
                    </div>
                    <div className="flex flex-col gap-4 mt-4 px-1">
                        <input ref={usernameRef} className="px-3 py-2 rounded-md bg-gray-800/60 text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition" type="text" placeholder="Username"/>
                        <input ref={passRef} className="px-3 py-2 rounded-md bg-gray-800/60 text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition" type="password" placeholder="Password"/>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button onClick={async ()=>{
                            const username = usernameRef.current?.value
                            const password = passRef.current?.value
                            const response = await axios.post("http://localhost:3001/api/v1/login",{
                                username,
                                password
                            })
                            localStorage.setItem('token', response.data.token);
                            router.push('/dashboard')
                        }} className="rounded-md bg-gray-100 text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">Login</button>
                    </div>
                    <p className="text-center text-sm mt-3 text-gray-300">Don't have an account? <a className="text-blue-400 hover:text-blue-300" href="/signup">Create one</a></p>
                </div>
            </div>
        </div>
}