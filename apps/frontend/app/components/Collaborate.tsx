"use client";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export function Collaborate(){

    const canvasNameRef = useRef<HTMLInputElement>(null);
    const joinRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    return <div className="h-64 w-[500px] p-4 ml-10 mt-14 text-md rounded-xl shadow shadow-gray-400">
        Collaborate
        <div className="grid grid-cols-2 h-48 px-4">
            <div className="border-r flex flex-col justify-center items-center pr-6">
                <input type="text" ref={canvasNameRef} placeholder="Canvas Name" className="w-40 px-6 bg-white text-black border py-1.5 rounded-xl"/>
                <button 
                onClick={()=>{
                    axios.post(`${BACKEND_URL}/create-room`,{slug:canvasNameRef.current?.value},{
                        headers:{
                            'Authorization':localStorage.getItem('token')
                        },
                        
                    })
                }}
                className="mt-4 text-black font-bold rounded-xl bg-white px-4 py-1.5">
                    Create Canvas
                </button>
            </div>
            <div className="flex flex-col justify-center items-center ml-3">
                <input type="text" ref={joinRef} placeholder="Canvas Name" className="w-40 px-6 bg-white text-black border py-1.5 rounded-xl"/>
                <button 
                className="mt-4 text-black font-bold rounded-xl bg-white px-4 py-1.5"
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