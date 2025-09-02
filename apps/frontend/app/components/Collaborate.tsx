"use client";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export function Collaborate(){

    const canvasNameRef = useRef<HTMLInputElement>(null);
    const joinRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    return <div className="w-[500px] p-6 ml-10 mt-14 rounded-xl bg-gray-900 border border-gray-800 text-gray-100 shadow-lg shadow-black/20">
        <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold tracking-tight">Collaborate</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="border-r border-gray-800 pr-6 flex flex-col justify-center items-center">
                <input type="text" ref={canvasNameRef} placeholder="Canvas name" className="w-48 px-3 py-2 rounded-md bg-gray-800/60 text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"/>
                <button 
                onClick={()=>{
                    axios.post(`${BACKEND_URL}/create-room`,{slug:canvasNameRef.current?.value},{
                        headers:{
                            'Authorization':localStorage.getItem('token')
                        },
                        
                    })
                }}
                className="mt-4 rounded-md bg-gray-100 text-gray-900 px-3 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
                    Create Canvas
                </button>
            </div>
            <div className="flex flex-col justify-center items-center pl-2">
                <input type="text" ref={joinRef} placeholder="Canvas name" className="w-48 px-3 py-2 rounded-md bg-gray-800/60 text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"/>
                <button 
                className="mt-4 rounded-md bg-gray-100 text-gray-900 px-3 py-2 text-sm font-medium hover:bg-gray-200 transition-colors"
                onClick={()=>{
                    axios.post(`${BACKEND_URL}/join-room`,{slug:joinRef.current?.value},{
                        headers:{
                            'Authorization':localStorage.getItem('token')
                        }
                    }).then((response)=>{
                        if(!response.data.roomId){
                            alert("canvas doesn't exist");
                        }else{
                            router.push(`/canvas/${response.data.roomId}`);
                        }
                    })
                }}
                >Join Canvas</button>
            </div>
        </div>
        
    </div>
}