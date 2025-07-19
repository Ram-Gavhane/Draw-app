"use client";
import { useRouter } from "next/navigation"

export default function Rooms({slug,id}:{slug:string, id:number}){

    const router = useRouter();
    
    return <div  className="">
        <button onClick={()=>{
            router.push(`./canvas/${id}`)
        }
        } id={id.toString()} className="mt-1.5 bg-white rounded-2xl px-3 py-0.5 text-black">
            {slug}
        </button>
    </div>
    
}