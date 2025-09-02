"use client";
import { useEffect } from "react";
import { useRooms } from "../hooks/useRooms";
import Rooms from "./Rooms";

export default function RoomCard(){

    const {content, getcontents} = useRooms();
    console.log(content);
    useEffect(() => {
        getcontents();
    }, [])

    return <div>
        <div className="w-64 p-6 ml-10 mt-14 rounded-xl bg-gray-900 border border-gray-800 text-gray-100 shadow-lg shadow-black/20">
            <div className="text-lg font-semibold tracking-tight">Your Rooms</div>
            <div className="mt-3 space-y-2">
                {content.map((x:
                {
                    id:number,
                    slug:string
                }
            ) => <Rooms key={x.id}
            id={x.id}
            slug={x.slug}
            />)}
            </div>
        </div>
    </div>
}