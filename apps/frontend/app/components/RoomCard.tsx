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
        <div className="h-64 w-60 p-4 ml-10 mt-14 text-md rounded-xl shadow shadow-gray-400">
            Room you have joined:
            <div className="mt-2.5">
                {content.map((x:
                {
                    id:number,
                    slug:string
                }
            ) => <Rooms id={x.id}
            slug={x.slug}
            />)}
            </div>
        </div>
    </div>
}