"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Signup(){
    const usernameRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    return <div className="w-screen h-screen flex justify-center items-center bg-black font-mono">
            <div className="w-[320px] h-[360px] bg-white text-black flex flex-col px-4 py-4 rounded-2xl">
                <div className="text-2xl border-b-2 p-3">
                    Signup
                </div>
                <div className="flex flex-col gap-4 mt-10 px-5">
                    <input ref={usernameRef} className="border-1 px-4 py-1.5 rounded-xl " type="text" placeholder="Username"/>
                    <input ref={passRef} className="border-1 px-4 py-1.5 rounded-xl " type="password" placeholder="Password"/>
                </div>
                <div className="flex justify-center mt-11  text-white">
                    <button onClick={async ()=>{
                        const username = usernameRef.current?.value
                        const password = passRef.current?.value
                        const response = await axios.post("http://localhost:3001/api/v1/login",{
                            username,
                            password
                        })
                        alert(response.data.message);
                        localStorage.setItem('token', response.data.token);
                        router.push('./dashboard')
                    }} className="bg-black h-10 rounded-2xl px-4">Sign up</button>
                </div>
            </div>
        </div>
    
}